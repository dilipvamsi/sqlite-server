package servicesv1

import (
	"context"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"testing"
	"time"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/types/known/durationpb"
)

// TestRollbackTransaction covers the Unary Rollback RPC
func TestRollbackTransaction(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// 1. Start
	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
	txID := res.Msg.TransactionId

	// 2. Rollback
	rbRes, err := client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
	require.NoError(t, err)
	assert.True(t, rbRes.Msg.Success)

	// 3. Verify it's gone
	_, err = client.TransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{TransactionId: txID, Sql: "SELECT 1"}))
	assert.Error(t, err) // Should be Not Found
}

// TestTransactionQueryStream covers the Unary Streaming RPC
func TestTransactionQueryStream(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
	txID := res.Msg.TransactionId
	defer func() {
		_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
	}()

	stream, err := client.TransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{
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
	streamErr, err := client.TransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{
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
	res, err := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{
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
		_, err := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{
			Database: "missing",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Custom Timeout Parsing", func(t *testing.T) {
		// Valid timeout string
		res, err := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{
			Database: "test",
			Timeout:  durationpb.New(50 * time.Millisecond),
		}))
		require.NoError(t, err)
		txID := res.Msg.TransactionId
		defer func() {
			_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
		}()

		// Wait for expiry
		time.Sleep(100 * time.Millisecond)

		// Try to use it -> Should fail
		_, err = client.TransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{
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
	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
	txID := res.Msg.TransactionId
	defer func() {
		_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
	}()

	t.Run("Session Not Found", func(t *testing.T) {
		_, err := client.TransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{
			TransactionId: "invalid_id",
			Sql:           "SELECT 1",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Manual Transaction Control", func(t *testing.T) {
		_, err := client.TransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{
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

	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
	txID := res.Msg.TransactionId
	defer func() {
		_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
	}()

	t.Run("Session Not Found", func(t *testing.T) {
		stream, err := client.TransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{
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
		stream, err := client.TransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{
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
		_, err := client.CommitTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{
			TransactionId: "invalid",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Double Commit", func(t *testing.T) {
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId

		// 1. First Commit
		_, err := client.CommitTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
		require.NoError(t, err)

		// 2. Second Commit -> Should be Not Found (as it's removed)
		_, err = client.CommitTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
}

func TestRollbackTransaction_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Idempotency (Not Found is Success)", func(t *testing.T) {
		// Rollback on non-existent ID should return Success: true
		res, err := client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{
			TransactionId: "already_gone",
		}))
		require.NoError(t, err)
		assert.True(t, res.Msg.Success)
	})
}

func TestTransactionSavepoint_Coverage(t *testing.T) {
	client, server := setupTestServer(t)
	ctx := context.Background()

	t.Run("Session Not Found", func(t *testing.T) {
		_, err := client.TransactionSavepoint(ctx, connect.NewRequest(&sqlrpcv1.TransactionSavepointRequest{
			TransactionId: "invalid",
			Savepoint:     &sqlrpcv1.SavepointRequest{Name: "sp1", Action: sqlrpcv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Timed Out Session", func(t *testing.T) {
		// New valid session
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId
		defer func() {
			_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
		}()

		// Manually expire
		server.txMu.Lock()
		server.txRegistry[txID].Expiry = time.Now().Add(-1 * time.Second)
		server.txMu.Unlock()

		// Call Savepoint -> Should get Aborted
		_, err := client.TransactionSavepoint(ctx, connect.NewRequest(&sqlrpcv1.TransactionSavepointRequest{
			TransactionId: txID,
			Savepoint:     &sqlrpcv1.SavepointRequest{Name: "sp1", Action: sqlrpcv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "timed out")
	})

	t.Run("Heartbeat Check", func(t *testing.T) {
		// New valid session
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId
		defer func() {
			_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
		}()

		// Capture old expiry
		server.txMu.RLock()
		oldExpiry := server.txRegistry[txID].Expiry
		server.txMu.RUnlock()

		time.Sleep(10 * time.Millisecond)

		// Success op
		_, err := client.TransactionSavepoint(ctx, connect.NewRequest(&sqlrpcv1.TransactionSavepointRequest{
			TransactionId: txID,
			Savepoint:     &sqlrpcv1.SavepointRequest{Name: "sp1", Action: sqlrpcv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
		}))
		require.NoError(t, err)

		// Verify expiry extended
		server.txMu.RLock()
		newExpiry := server.txRegistry[txID].Expiry
		server.txMu.RUnlock()
		assert.True(t, newExpiry.After(oldExpiry))
	})

	t.Run("Valid Session", func(t *testing.T) {
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId
		defer func() {
			_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
		}()

		t.Run("Invalid Savepoint Args", func(t *testing.T) {
			_, err := client.TransactionSavepoint(ctx, connect.NewRequest(&sqlrpcv1.TransactionSavepointRequest{
				TransactionId: txID,
				Savepoint:     &sqlrpcv1.SavepointRequest{Name: "", Action: sqlrpcv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
			}))
			assert.Error(t, err)
		})
	})
}

// =============================================================================
// TYPED TRANSACTION QUERY HANDLER TESTS
// =============================================================================

func TestTypedTransactionQuery_Coverage(t *testing.T) {
	client, server := setupTestServer(t)
	ctx := context.Background()

	t.Run("Valid Session", func(t *testing.T) {
		// Start a valid transaction
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId
		defer func() {
			_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
		}()

		t.Run("SELECT Success", func(t *testing.T) {
			result, err := client.TypedTransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
				TransactionId: txID,
				Sql:           "SELECT id, name FROM users WHERE id = 1",
			}))
			require.NoError(t, err)
			assert.NotNil(t, result.Msg)
			assert.Len(t, result.Msg.Rows, 1)
			// Check typed values
			row := result.Msg.Rows[0]
			assert.Equal(t, int64(1), row.Values[0].GetIntegerValue())
			assert.Equal(t, "Alice", row.Values[1].GetTextValue())
		})

		t.Run("DML Success", func(t *testing.T) {
			result, err := client.TypedTransactionExec(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
				TransactionId: txID,
				Sql:           "INSERT INTO users (name) VALUES ('TypedTxUser')",
			}))
			require.NoError(t, err)
			assert.Equal(t, int64(1), result.Msg.Dml.RowsAffected)
		})

		t.Run("Manual Transaction Control", func(t *testing.T) {
			_, err := client.TypedTransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
				TransactionId: txID,
				Sql:           "COMMIT",
			}))
			assert.Error(t, err)
			assert.Contains(t, err.Error(), "manual transaction control")
		})

		t.Run("Invalid SQL", func(t *testing.T) {
			_, err := client.TypedTransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
				TransactionId: txID,
				Sql:           "SELECT * FROM missing_table",
			}))
			assert.Error(t, err)
		})

		t.Run("With Parameters", func(t *testing.T) {
			result, err := client.TypedTransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
				TransactionId: txID,
				Sql:           "SELECT name FROM users WHERE id = ?",
				Parameters: &sqlrpcv1.TypedParameters{
					Positional: []*sqlrpcv1.SqlValue{
						{Value: &sqlrpcv1.SqlValue_IntegerValue{IntegerValue: 1}},
					},
				},
			}))
			require.NoError(t, err)
			assert.Equal(t, "Alice", result.Msg.Rows[0].Values[0].GetTextValue())
		})
	})

	t.Run("Session Not Found", func(t *testing.T) {
		_, err := client.TypedTransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
			TransactionId: "invalid_id",
			Sql:           "SELECT 1",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Timed Out Session", func(t *testing.T) {
		// New session
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		newTxID := res.Msg.TransactionId
		defer func() {
			_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: newTxID}))
		}()

		// Manually expire
		server.txMu.Lock()
		server.txRegistry[newTxID].Expiry = time.Now().Add(-1 * time.Second)
		server.txMu.Unlock()

		// Call TypedTransactionQuery -> Should get Aborted
		_, err := client.TypedTransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
			TransactionId: newTxID,
			Sql:           "SELECT 1",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "timed out")
	})
}

func TestTypedTransactionQueryStream_Coverage(t *testing.T) {
	client, server := setupTestServer(t)
	ctx := context.Background()

	t.Run("Valid Session", func(t *testing.T) {
		// Start a valid transaction
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId
		defer func() {
			_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
		}()

		t.Run("SELECT Success", func(t *testing.T) {
			stream, err := client.TypedTransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
				TransactionId: txID,
				Sql:           "SELECT id, name FROM users",
			}))
			require.NoError(t, err)

			// 1. Header
			assert.True(t, stream.Receive())
			header := stream.Msg().GetHeader()
			assert.NotNil(t, header)
			assert.Equal(t, []string{"id", "name"}, header.Columns)

			// 2. Batch
			assert.True(t, stream.Receive())
			batch := stream.Msg().GetBatch()
			assert.NotNil(t, batch)

			// 3. Complete
			assert.True(t, stream.Receive())
			assert.NotNil(t, stream.Msg().GetComplete())
		})

		t.Run("DML Success", func(t *testing.T) {
			stream, err := client.TypedTransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
				TransactionId: txID,
				Sql:           "INSERT INTO users (name) VALUES ('StreamTypedTx')",
			}))
			require.NoError(t, err)

			assert.True(t, stream.Receive())
			// DML is rejected in typed stream queries; expect an error message.
			assert.NotNil(t, stream.Msg().GetError())
		})

		t.Run("Manual Transaction Control", func(t *testing.T) {
			stream, err := client.TypedTransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
				TransactionId: txID,
				Sql:           "ROLLBACK",
			}))
			if err == nil {
				assert.False(t, stream.Receive())
				assert.Error(t, stream.Err())
				assert.Contains(t, stream.Err().Error(), "manual transaction control")
			} else {
				assert.Contains(t, err.Error(), "manual transaction control")
			}
		})

		t.Run("Invalid SQL - Returns Error in Stream", func(t *testing.T) {
			stream, err := client.TypedTransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
				TransactionId: txID,
				Sql:           "SELECT * FROM missing_table",
			}))
			require.NoError(t, err)

			// Receive error message wrapped in stream
			assert.True(t, stream.Receive())
			errMsg := stream.Msg().GetError()
			assert.NotNil(t, errMsg)
			assert.Contains(t, errMsg.Message, "no such table")
		})
	})

	t.Run("Session Not Found", func(t *testing.T) {
		stream, err := client.TypedTransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
			TransactionId: "invalid_id",
			Sql:           "SELECT 1",
		}))
		if err == nil {
			assert.False(t, stream.Receive())
			assert.Error(t, stream.Err())
			assert.Contains(t, stream.Err().Error(), "not found")
		} else {
			assert.Contains(t, err.Error(), "not found")
		}
	})

	t.Run("Timed Out Session", func(t *testing.T) {
		// New session
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		newTxID := res.Msg.TransactionId
		defer func() {
			_, _ = client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: newTxID}))
		}()

		// Manually expire
		server.txMu.Lock()
		server.txRegistry[newTxID].Expiry = time.Now().Add(-1 * time.Second)
		server.txMu.Unlock()

		stream, err := client.TypedTransactionQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
			TransactionId: newTxID,
			Sql:           "SELECT 1",
		}))
		if err == nil {
			assert.False(t, stream.Receive())
			assert.Error(t, stream.Err())
			assert.Contains(t, stream.Err().Error(), "timed out")
		} else {
			assert.Contains(t, err.Error(), "timed out")
		}
	})
}

func TestCommitTransaction_Failure(t *testing.T) {
	_, dbServer := setupTestServer(t)
	ctx := context.Background()

	// 1. Create DB and Begin Transaction
	err := dbServer.MountDatabase(&sqlrpcv1.DatabaseConfig{
		Name:   "tx_fail_test",
		DbPath: ":memory:",
	})
	require.NoError(t, err)

	beginReq := connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{
		Database: "tx_fail_test",
	})
	beginResp, err := dbServer.BeginTransaction(ctx, beginReq)
	require.NoError(t, err)
	txID := beginResp.Msg.TransactionId

	// 2. Access Registry and Force Rollback to induce Commit failure
	dbServer.txMu.Lock()
	session, exists := dbServer.txRegistry[txID]
	dbServer.txMu.Unlock()
	require.True(t, exists)

	// Manually rollback the underlying Tx
	err = session.Tx.Rollback()
	require.NoError(t, err)

	// 3. Attempt Commit via RPC
	commitReq := connect.NewRequest(&sqlrpcv1.TransactionControlRequest{
		TransactionId: txID,
	})
	_, err = dbServer.CommitTransaction(ctx, commitReq)

	// 4. Assert Error
	require.Error(t, err, "Commit should fail because Tx is already done")
	// The error should be related to sql.ErrTxDone
	assert.Contains(t, err.Error(), "transaction has already been committed or rolled back")
}

// TestTypedTransactionExec_Coverage covers uncovered branches in TypedTransactionExec.
func TestTypedTransactionExec_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Not Found transaction", func(t *testing.T) {
		_, err := client.TypedTransactionExec(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
			TransactionId: "does-not-exist",
			Sql:           "INSERT INTO users (name) VALUES ('x')",
		}))
		require.Error(t, err)
		assert.Contains(t, err.Error(), "not_found")
	})

	t.Run("Manual TX control blocked", func(t *testing.T) {
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId
		defer client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))

		_, err := client.TypedTransactionExec(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
			TransactionId: txID,
			Sql:           "COMMIT",
		}))
		require.Error(t, err)
		assert.Contains(t, err.Error(), "manual transaction control")
	})

	t.Run("Exec failure (bad SQL)", func(t *testing.T) {
		res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{Database: "test"}))
		txID := res.Msg.TransactionId
		defer client.RollbackTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))

		_, err := client.TypedTransactionExec(ctx, connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
			TransactionId: txID,
			Sql:           "INSERT INTO missing_table_xyz (x) VALUES (1)",
		}))
		require.Error(t, err)
	})

	t.Run("Expired transaction", func(t *testing.T) {
		// Access the DbServer directly to inject an expired session
		_, dbServer := setupTestServer(t)

		// Begin a real tx and register it with an expired time
		import_ctx := context.Background()
		db, _ := dbServer.dbManager.GetConnection(import_ctx, "test", ModeRW)
		tx, _ := db.BeginTx(import_ctx, nil)
		txID := "expired-tx-test-id"
		dbServer.txMu.Lock()
		dbServer.txRegistry[txID] = &TxSession{
			Tx:     tx,
			Expiry: time.Now().Add(-1 * time.Hour), // already expired
		}
		dbServer.txMu.Unlock()

		req := connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{
			TransactionId: txID,
			Sql:           "INSERT INTO users (name) VALUES ('expired')",
		})
		_, err := dbServer.TypedTransactionExec(import_ctx, req)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "timed out")
	})
}
