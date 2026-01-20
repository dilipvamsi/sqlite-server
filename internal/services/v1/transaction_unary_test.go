package servicesv1

import (
	"context"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"testing"
	"time"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// TestRollbackTransaction covers the Unary Rollback RPC
func TestRollbackTransaction(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// 1. Start
	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{Database: "test"}))
	txID := res.Msg.TransactionId

	// 2. Rollback
	rbRes, err := client.RollbackTransaction(ctx, connect.NewRequest(&dbv1.TransactionControlRequest{TransactionId: txID}))
	require.NoError(t, err)
	assert.True(t, rbRes.Msg.Success)

	// 3. Verify it's gone
	_, err = client.TransactionQuery(ctx, connect.NewRequest(&dbv1.TransactionQueryRequest{TransactionId: txID, Sql: "SELECT 1"}))
	assert.Error(t, err) // Should be Not Found
}

// TestTransactionQueryStream covers the Unary Streaming RPC
func TestTransactionQueryStream(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{Database: "test"}))
	txID := res.Msg.TransactionId

	stream, err := client.TransactionQueryStream(ctx, connect.NewRequest(&dbv1.TransactionQueryRequest{
		TransactionId: txID,
		Sql:           "SELECT id FROM users",
	}))
	require.NoError(t, err)

	// Consume stream
	count := 0
	for stream.Receive() {
		if stream.Msg().GetBatch() != nil {
			count += len(stream.Msg().GetBatch().Rows)
		}
	}
	assert.Greater(t, count, 0)

	// Test Error inside Stream (e.g., Bad SQL)
	streamErr, err := client.TransactionQueryStream(ctx, connect.NewRequest(&dbv1.TransactionQueryRequest{
		TransactionId: txID,
		Sql:           "SELECT * FROM missing_table",
	}))
	require.NoError(t, err) // The RPC call succeeds, the stream carries the error

	// First msg is error
	assert.True(t, streamErr.Receive())
	assert.NotNil(t, streamErr.Msg().GetError())
}

// TestReaperLogic covers cleanupExpiredTransactions
func TestReaperLogic(t *testing.T) {
	client, server := setupTestServer(t)
	ctx := context.Background()

	// 1. Start a transaction
	res, err := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{
		Database: "test",
	}))
	require.NoError(t, err)
	txID := res.Msg.TransactionId

	// 2. Manually expire it in the registry (white-box testing)
	server.txMu.Lock()
	session := server.txRegistry[txID]
	session.Expiry = time.Now().Add(-1 * time.Hour) // Expired 1 hour ago
	server.txMu.Unlock()

	// 3. Trigger Cleanup manually
	server.cleanupExpiredTransactions()

	// 4. Verify it's gone
	server.txMu.RLock()
	_, exists := server.txRegistry[txID]
	server.txMu.RUnlock()
	assert.False(t, exists, "Transaction should have been reaped")
}

func TestBeginTransaction_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{
			Database: "missing",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Custom Timeout Parsing", func(t *testing.T) {
		// Valid timeout string
		res, err := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{
			Database: "test",
			Timeout:  "50ms",
		}))
		require.NoError(t, err)

		// Wait for expiry
		time.Sleep(100 * time.Millisecond)

		// Try to use it -> Should fail
		_, err = client.TransactionQuery(ctx, connect.NewRequest(&dbv1.TransactionQueryRequest{
			TransactionId: res.Msg.TransactionId,
			Sql:           "SELECT 1",
		}))
		assert.Error(t, err)
	})
}

func TestTransactionQuery_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// Start a valid tx
	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{Database: "test"}))
	txID := res.Msg.TransactionId

	t.Run("Session Not Found", func(t *testing.T) {
		_, err := client.TransactionQuery(ctx, connect.NewRequest(&dbv1.TransactionQueryRequest{
			TransactionId: "invalid_id",
			Sql:           "SELECT 1",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Manual Transaction Control", func(t *testing.T) {
		_, err := client.TransactionQuery(ctx, connect.NewRequest(&dbv1.TransactionQueryRequest{
			TransactionId: txID,
			Sql:           "COMMIT",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "manual transaction control")
	})
}

func TestTransactionQueryStream_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{Database: "test"}))
	txID := res.Msg.TransactionId

	t.Run("Session Not Found", func(t *testing.T) {
		stream, err := client.TransactionQueryStream(ctx, connect.NewRequest(&dbv1.TransactionQueryRequest{
			TransactionId: "invalid_id",
			Sql:           "SELECT 1",
		}))
		if err == nil {
			assert.False(t, stream.Receive())
			assert.Error(t, stream.Err())
		} else {
			assert.Error(t, err)
		}
	})

	t.Run("Manual Transaction Control", func(t *testing.T) {
		stream, err := client.TransactionQueryStream(ctx, connect.NewRequest(&dbv1.TransactionQueryRequest{
			TransactionId: txID,
			Sql:           "ROLLBACK",
		}))
		if err == nil {
			assert.False(t, stream.Receive())
			assert.Error(t, stream.Err())
			if stream.Err() != nil {
				assert.Contains(t, stream.Err().Error(), "manual transaction control")
			}
		} else {
			assert.Contains(t, err.Error(), "manual transaction control")
		}
	})
}

func TestCommitTransaction_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Session Not Found", func(t *testing.T) {
		_, err := client.CommitTransaction(ctx, connect.NewRequest(&dbv1.TransactionControlRequest{
			TransactionId: "invalid",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Double Commit", func(t *testing.T) {
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId

		// 1. First Commit
		_, err := client.CommitTransaction(ctx, connect.NewRequest(&dbv1.TransactionControlRequest{TransactionId: txID}))
		require.NoError(t, err)

		// 2. Second Commit -> Should be Not Found (as it's removed)
		_, err = client.CommitTransaction(ctx, connect.NewRequest(&dbv1.TransactionControlRequest{TransactionId: txID}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
}

func TestRollbackTransaction_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Idempotency (Not Found is Success)", func(t *testing.T) {
		// Rollback on non-existent ID should return Success: true
		res, err := client.RollbackTransaction(ctx, connect.NewRequest(&dbv1.TransactionControlRequest{
			TransactionId: "already_gone",
		}))
		require.NoError(t, err)
		assert.True(t, res.Msg.Success)
	})
}

func TestTransactionSavepoint_Coverage(t *testing.T) {
	client, server := setupTestServer(t)
	ctx := context.Background()

	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{Database: "test"}))
	txID := res.Msg.TransactionId

	t.Run("Session Not Found", func(t *testing.T) {
		_, err := client.TransactionSavepoint(ctx, connect.NewRequest(&dbv1.TransactionSavepointRequest{
			TransactionId: "invalid",
			Savepoint:     &dbv1.SavepointRequest{Name: "sp1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Invalid Savepoint Args", func(t *testing.T) {
		_, err := client.TransactionSavepoint(ctx, connect.NewRequest(&dbv1.TransactionSavepointRequest{
			TransactionId: txID,
			Savepoint:     &dbv1.SavepointRequest{Name: "", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
		}))
		assert.Error(t, err)
	})

	t.Run("Timed Out Session", func(t *testing.T) {
		// New valid session
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId

		// Manually expire
		server.txMu.Lock()
		server.txRegistry[txID].Expiry = time.Now().Add(-1 * time.Second)
		server.txMu.Unlock()

		// Call Savepoint -> Should get Aborted
		_, err := client.TransactionSavepoint(ctx, connect.NewRequest(&dbv1.TransactionSavepointRequest{
			TransactionId: txID,
			Savepoint:     &dbv1.SavepointRequest{Name: "sp1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "timed out")
	})

	t.Run("Heartbeat Check", func(t *testing.T) {
		// New valid session
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&dbv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId

		// Capture old expiry
		server.txMu.RLock()
		oldExpiry := server.txRegistry[txID].Expiry
		server.txMu.RUnlock()

		time.Sleep(10 * time.Millisecond)

		// Success op
		_, err := client.TransactionSavepoint(ctx, connect.NewRequest(&dbv1.TransactionSavepointRequest{
			TransactionId: txID,
			Savepoint:     &dbv1.SavepointRequest{Name: "sp1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
		}))
		require.NoError(t, err)

		// Verify expiry extended
		server.txMu.RLock()
		newExpiry := server.txRegistry[txID].Expiry
		server.txMu.RUnlock()
		assert.True(t, newExpiry.After(oldExpiry))
	})
}
