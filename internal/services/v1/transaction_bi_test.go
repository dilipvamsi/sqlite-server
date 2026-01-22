package servicesv1

import (
	"context"
	"testing"
	"time"

	dbv1 "sqlite-server/internal/protos/db/v1"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/types/known/emptypb"
)

func TestBiDiTransaction_Extended(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()
	stream := client.Transaction(ctx)

	// 1. Begin
	require.NoError(t, stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{
		Begin: &dbv1.BeginRequest{Database: "test"},
	}}))
	res, _ := stream.Receive()
	assert.True(t, res.GetBegin().Success)

	// 2. Stream Query
	require.NoError(t, stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_QueryStream{
		QueryStream: &dbv1.TransactionalQueryRequest{Sql: "SELECT id FROM users"},
	}}))
	res, _ = stream.Receive() // Header
	assert.NotNil(t, res.GetStreamResult().GetHeader())
	res, _ = stream.Receive() // Batch
	assert.NotNil(t, res.GetStreamResult().GetBatch())
	res, _ = stream.Receive() // Complete
	assert.NotNil(t, res.GetStreamResult().GetComplete())

	// 3. DML via Stream
	require.NoError(t, stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_QueryStream{
		QueryStream: &dbv1.TransactionalQueryRequest{Sql: "INSERT INTO users (name) VALUES ('StreamDML')"},
	}}))
	res, _ = stream.Receive()
	assert.NotNil(t, res.GetStreamResult().GetDml())
	assert.Equal(t, int64(1), res.GetStreamResult().GetDml().RowsAffected)

	// 4. Trigger App Error
	require.NoError(t, stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Query{
		Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT * FROM missing"},
	}}))
	res, _ = stream.Receive()
	assert.NotNil(t, res.GetError())
	assert.Equal(t, dbv1.SqliteCode_SQLITE_CODE_ERROR, res.GetError().SqliteErrorCode)

	// 5. Commit
	require.NoError(t, stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Commit{
		Commit: &emptypb.Empty{},
	}}))
	res, _ = stream.Receive()

	// Check for Commit Response safely
	require.NotNil(t, res, "Stream closed unexpectedly")
	require.NotNil(t, res.GetCommit(), "Expected Commit response, got: %v", res)
	assert.True(t, res.GetCommit().Success)
}

func TestBiDiTransaction_EdgeCases(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Commit without Begin", func(t *testing.T) {
		stream := client.Transaction(ctx)
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Commit{Commit: &emptypb.Empty{}}})
		_, err := stream.Receive()
		assert.Error(t, err)
	})

	t.Run("Double Begin", func(t *testing.T) {
		stream := client.Transaction(ctx)
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}})
		stream.Receive()
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}})
		_, err := stream.Receive()
		assert.Error(t, err)
	})
}

func TestBiDiTransaction_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("DB Not Found", func(t *testing.T) {
		stream := client.Transaction(ctx)
		err := stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{
			Begin: &dbv1.BeginRequest{Database: "missing"},
		}})
		require.NoError(t, err)

		_, err = stream.Receive()
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Security Check (Manual Control)", func(t *testing.T) {
		stream := client.Transaction(ctx)
		// 1. Begin
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}})
		stream.Receive()

		// 2. Send "BEGIN"
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Query{
			Query: &dbv1.TransactionalQueryRequest{Sql: "BEGIN"},
		}})

		// 3. Expect Error
		_, err := stream.Receive()
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "manual transaction control")
	})

	t.Run("Savepoint Flow", func(t *testing.T) {
		stream := client.Transaction(ctx)
		// 1. Begin
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}})
		stream.Receive()

		// 2. Create Savepoint
		err := stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Savepoint{
			Savepoint: &dbv1.SavepointRequest{Name: "sp1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
		}})
		require.NoError(t, err)
		res, err := stream.Receive()
		require.NoError(t, err)
		assert.True(t, res.GetSavepoint().Success)

		// 3. Rollback To Savepoint
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Savepoint{
			Savepoint: &dbv1.SavepointRequest{Name: "sp1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_ROLLBACK},
		}})
		res, err = stream.Receive()
		assert.True(t, res.GetSavepoint().Success)

		// 4. Release Savepoint
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Savepoint{
			Savepoint: &dbv1.SavepointRequest{Name: "sp1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_RELEASE},
		}})
		res, err = stream.Receive()
		assert.True(t, res.GetSavepoint().Success)
	})

	t.Run("Savepoint Errors", func(t *testing.T) {
		stream := client.Transaction(ctx)
		// 1. Savepoint Without Tx
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Savepoint{
			Savepoint: &dbv1.SavepointRequest{Name: "sp1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
		}})
		_, err := stream.Receive() // Expect protocol violation error
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "no active transaction")
	})

	t.Run("Query Error Resilience", func(t *testing.T) {
		stream := client.Transaction(ctx)
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}})
		stream.Receive()

		// Send Bad SQL
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Query{
			Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT * FROM missing"},
		}})

		res, err := stream.Receive()
		require.NoError(t, err)
		assert.NotNil(t, res.GetError()) // Should get App Error, NOT stream close
		assert.Equal(t, dbv1.SqliteCode_SQLITE_CODE_ERROR, res.GetError().SqliteErrorCode)

		// Stream should still be open
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Query{
			Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT 1"},
		}})
		res, err = stream.Receive()
		require.NoError(t, err)
		assert.NotNil(t, res.GetQueryResult())
	})

	t.Run("Nil Tx Checks", func(t *testing.T) {
		// Verify commands that MUST fail without begin
		errorCmds := []*dbv1.TransactionRequest{
			{Command: &dbv1.TransactionRequest_Query{Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT 1"}}},
			{Command: &dbv1.TransactionRequest_QueryStream{QueryStream: &dbv1.TransactionalQueryRequest{Sql: "SELECT 1"}}},
			{Command: &dbv1.TransactionRequest_Commit{Commit: &emptypb.Empty{}}},
		}

		for _, cmd := range errorCmds {
			stream := client.Transaction(ctx)
			stream.Send(cmd)
			_, err := stream.Receive()
			assert.Error(t, err)
		}

		// Verify Rollback is Idempotent (Success even if nil tx)
		stream := client.Transaction(ctx)
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Rollback{Rollback: &emptypb.Empty{}}})
		res, err := stream.Receive()
		require.NoError(t, err)
		assert.True(t, res.GetRollback().Success)
	})
}

func TestBiDiTransaction_Internals(t *testing.T) {
	// 1. Lower timeout for test
	originalTimeout := defaultTxTimeout
	defaultTxTimeout = 100 * time.Millisecond
	defer func() { defaultTxTimeout = originalTimeout }()

	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Heartbeat Timeout", func(t *testing.T) {
		stream := client.Transaction(ctx)
		// 2. Establish connection (Begin)
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}})
		res, err := stream.Receive()
		require.NoError(t, err)
		assert.True(t, res.GetBegin().Success)

		// 3. Wait for timeout > 100ms
		time.Sleep(500 * time.Millisecond)

		// 4. Try to interact - should be closed/cancelled
		// Note we accept if Send fails immediately OR if Receive fails.
		err = stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Query{
			Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT 1"},
		}})

		if err == nil {
			_, err = stream.Receive()
		}
		// If we still didn't get error, it's a flake/race, but we logged 'Closing stream' so logic is covered.
		// We assert strictly, but if it remains flaky we can relax.
		// Given local repro, we expect error.
		assert.Error(t, err, "Stream should be closed due to heartbeat timeout")
	})

	t.Run("Isolation Level - Immediate", func(t *testing.T) {
		stream := client.Transaction(ctx)
		err := stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{
			Begin: &dbv1.BeginRequest{
				Database: "test",
				Mode:     dbv1.TransactionMode_TRANSACTION_MODE_IMMEDIATE,
			},
		}})
		require.NoError(t, err)

		res, err := stream.Receive()
		require.NoError(t, err)
		assert.True(t, res.GetBegin().Success)

		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Rollback{Rollback: &emptypb.Empty{}}})
		stream.Receive()
	})

	t.Run("Validation Failure", func(t *testing.T) {
		stream := client.Transaction(ctx)
		// Send savepoint with empty name (should trigger validation if rules exist)
		err := stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Savepoint{
			Savepoint: &dbv1.SavepointRequest{Name: "", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_RELEASE},
		}})
		require.NoError(t, err)

		_, err = stream.Receive()
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "invalid_argument")
	})
}
