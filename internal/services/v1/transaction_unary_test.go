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
