package servicesv1

import (
	"context"
	"errors"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"testing"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestExecuteTransaction_EdgeCases(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// 1. Empty Requests
	_, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{Requests: []*dbv1.TransactionRequest{}}))
	assert.Error(t, err)

	// 2. First Command Not Begin
	_, err = client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{Requests: []*dbv1.TransactionRequest{
		{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
	}}))
	assert.Error(t, err)

	// 3. No Commit/Rollback at end (Auto Rollback trigger)
	// Note: The proto validation requires at least 2 items, so we need Begin + Query
	_, err = client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{Requests: []*dbv1.TransactionRequest{
		{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
		{Command: &dbv1.TransactionRequest_Query{Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT 1"}}},
	}}))
	assert.Error(t, err) // "script ended without an explicit COMMIT or ROLLBACK"
}

func TestExecuteTransaction_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("DB Not Found", func(t *testing.T) {
		// Valid structure: Begin -> Commit. Fails at Begin logic.
		_, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "missing"}}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Begin Twice", func(t *testing.T) {
		// Valid structure: Begin -> Begin -> Commit. Fails at second Begin logic.
		_, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "transaction already active")
	})

	t.Run("Query After Commit (No Active Tx)", func(t *testing.T) {
		// Structure: Begin -> Commit -> Query -> Commit.
		// logic: Begin (ok), Commit (ok, tx=nil), Query (fail: no tx), Commit (unreachable).
		_, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
				{Command: &dbv1.TransactionRequest_Query{Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT 1"}}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "no active transaction")
	})

	t.Run("Savepoint Without Begin (Validation)", func(t *testing.T) {
		// Caught by Proto Validation -> first command must be begin
		_, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Savepoint{
					Savepoint: &dbv1.SavepointRequest{Name: "sp1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
				}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "first command") // Proto rule
	})

	t.Run("Savepoint Invalid Name", func(t *testing.T) {
		_, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
				{Command: &dbv1.TransactionRequest_Savepoint{
					Savepoint: &dbv1.SavepointRequest{Name: "", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
				}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		assert.Error(t, err)
		// Should be InvalidArgument from generateSavepointSQL
	})

	t.Run("Manual Transaction Control Security Check", func(t *testing.T) {
		_, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
				{Command: &dbv1.TransactionRequest_Query{Query: &dbv1.TransactionalQueryRequest{Sql: "BEGIN"}}}, // Blocked
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "manual transaction control")
	})

	t.Run("Context Timeout During Execution", func(t *testing.T) {
		// Mock a long running operation isn't easy without sql delays,
		// but we can pass a cancelled context.
		cancelledCtx, cancel := context.WithCancel(ctx)
		cancel() // Cancel immediately

		_, err := client.ExecuteTransaction(cancelledCtx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
				{Command: &dbv1.TransactionRequest_Query{Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT 1"}}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		assert.Error(t, err)
		assert.True(t, errors.Is(err, context.Canceled) || connect.CodeOf(err) == connect.CodeDeadlineExceeded)
	})
}

func TestExecuteTransaction_Extensions(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Isolation Levels", func(t *testing.T) {
		// Test IMMEDIATE mode
		res, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{
					Database: "test",
					Mode:     dbv1.TransactionMode_TRANSACTION_MODE_IMMEDIATE,
				}}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		require.NoError(t, err)
		assert.True(t, res.Msg.Responses[0].GetBegin().Success)
	})

	t.Run("Mid-Script Query Error", func(t *testing.T) {
		// Begin -> Bad Query -> Commit
		// Should succeed gRPC-wise, but contain error in list
		res, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
				{Command: &dbv1.TransactionRequest_Query{Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT * FROM missing"}}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		require.NoError(t, err)

		require.Len(t, res.Msg.Responses, 2) // Begin, Error. (Loop stops after error)
		assert.True(t, res.Msg.Responses[0].GetBegin().Success)
		assert.NotNil(t, res.Msg.Responses[1].GetError())
		assert.Equal(t, dbv1.SqliteCode_SQLITE_CODE_ERROR, res.Msg.Responses[1].GetError().SqliteErrorCode)
	})

	t.Run("Savepoint Execution Error", func(t *testing.T) {
		// Begin -> Release Unknown Savepoint -> Commit
		res, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
				{Command: &dbv1.TransactionRequest_Savepoint{
					Savepoint: &dbv1.SavepointRequest{Name: "missing_sp", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_RELEASE},
				}},
				{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}},
			},
		}))
		require.NoError(t, err)

		require.Len(t, res.Msg.Responses, 2)
		assert.NotNil(t, res.Msg.Responses[1].GetError())
		assert.Contains(t, res.Msg.Responses[1].GetError().Message, "no such savepoint")
	})

	t.Run("Explicit Rollback Command", func(t *testing.T) {
		// Begin -> Rollback
		res, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
			Requests: []*dbv1.TransactionRequest{
				{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
				{Command: &dbv1.TransactionRequest_Rollback{Rollback: &dbv1.RollbackRequest{}}},
			},
		}))
		require.NoError(t, err)

		require.Len(t, res.Msg.Responses, 2)
		assert.True(t, res.Msg.Responses[1].GetRollback().Success)
	})
}
