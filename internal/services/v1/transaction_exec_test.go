package servicesv1

import (
	"context"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"testing"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
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
