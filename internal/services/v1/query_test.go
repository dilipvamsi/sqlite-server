package servicesv1

import (
	"context"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"testing"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestQueryStream_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("DB Not Found", func(t *testing.T) {
		stream, err := client.QueryStream(ctx, connect.NewRequest(&dbv1.QueryRequest{
			Database: "non_existent_db",
			Sql:      "SELECT 1",
		}))
		if err == nil {
			// If no immediate error, the error must be on Receive/Err
			assert.False(t, stream.Receive(), "Should not receive any messages")
			assert.Error(t, stream.Err())
			if stream.Err() != nil {
				assert.Contains(t, stream.Err().Error(), "not found")
			}
		} else {
			assert.Contains(t, err.Error(), "not found")
		}
	})

	t.Run("Invalid SQL - Returns Error Message in Stream", func(t *testing.T) {
		stream, err := client.QueryStream(ctx, connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM non_existent_table",
		}))
		require.NoError(t, err)

		// Receive 1: Should be the error message wrapped in QueryResponse_Error
		assert.True(t, stream.Receive())
		msg := stream.Msg()
		assert.NotNil(t, msg.GetError())
		assert.Contains(t, msg.GetError().Message, "no such table")
	})

	t.Run("Transaction Control Not Allowed", func(t *testing.T) {
		// "BEGIN" should be caught by ValidateStatelessQuery
		stream, err := client.QueryStream(ctx, connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "BEGIN",
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

	t.Run("Proto Validation Error", func(t *testing.T) {
		// Empty SQL is invalid per proto rules (likely) or at least internal logic
		stream, err := client.QueryStream(ctx, connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "", // Empty SQL
		}))
		if err == nil {
			assert.False(t, stream.Receive())
			assert.Error(t, stream.Err())
		} else {
			assert.Error(t, err)
		}
	})
}

func TestQuery_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Proto Validation Error", func(t *testing.T) {
		_, err := client.Query(ctx, connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "", // Empty SQL
		}))
		assert.Error(t, err)
	})
}
