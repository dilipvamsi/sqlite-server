package servicesv1

import (
	"context"
	"testing"

	dbv1 "sqlite-server/internal/protos/db/v1"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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
		Commit: &dbv1.CommitRequest{},
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
		stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Commit{Commit: &dbv1.CommitRequest{}}})
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
