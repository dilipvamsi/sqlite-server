package servicesv1

import (
	"context"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"testing"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestQueryStream_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("DB Not Found", func(t *testing.T) {
		stream, err := client.QueryStream(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
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
		stream, err := client.QueryStream(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM non_existent_table",
		}))
		require.NoError(t, err)

		// Receive 1: Should be the error message wrapped in QueryResponse_Error
		assert.True(t, stream.Receive())
		msg := stream.Msg()
		assert.NotNil(t, msg.GetError())
		assert.Contains(t, msg.GetError().GetMessage(), "no such table")
	})

	t.Run("Transaction Control Not Allowed", func(t *testing.T) {
		// "BEGIN" should be caught by ValidateStatelessQuery
		stream, err := client.QueryStream(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
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
		stream, err := client.QueryStream(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
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
		_, err := client.Query(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "", // Empty SQL
		}))
		assert.Error(t, err)
	})
}

// =============================================================================
// TYPED QUERY HANDLER TESTS
// =============================================================================

func TestTypedQuery_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("SELECT Success", func(t *testing.T) {
		res, err := client.TypedQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT id, name FROM users WHERE id = 1",
		}))
		require.NoError(t, err)
		assert.NotNil(t, res.Msg.Rows)
		assert.Len(t, res.Msg.Rows, 1)
		// Check typed values
		row := res.Msg.Rows[0]
		assert.Equal(t, int64(1), row.Values[0].GetIntegerValue())
		assert.Equal(t, "Alice", row.Values[1].GetTextValue())
	})

	t.Run("DML Success", func(t *testing.T) {
		res, err := client.TypedQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "INSERT INTO users (name) VALUES ('TypedUser')",
		}))
		require.NoError(t, err)
		// TypedQuery handles SELECTs only. DML should fail or not be checked like this.
		assert.Nil(t, res.Msg.Rows)
	})

	t.Run("SELECT with Parameters", func(t *testing.T) {
		res, err := client.TypedQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT name FROM users WHERE id = ?",
			Parameters: &sqlrpcv1.TypedParameters{
				Positional: []*sqlrpcv1.SqlValue{
					{Value: &sqlrpcv1.SqlValue_IntegerValue{IntegerValue: 1}},
				},
			},
		}))
		require.NoError(t, err)
		assert.Equal(t, "Alice", res.Msg.Rows[0].Values[0].GetTextValue())
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.TypedQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "missing",
			Sql:      "SELECT 1",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Transaction Control Blocked", func(t *testing.T) {
		_, err := client.TypedQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "BEGIN",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "manual transaction control")
	})

	t.Run("Invalid SQL", func(t *testing.T) {
		_, err := client.TypedQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM missing_table",
		}))
		assert.Error(t, err)
	})

	t.Run("Proto Validation Error", func(t *testing.T) {
		_, err := client.TypedQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "", // Empty SQL
		}))
		assert.Error(t, err)
	})
}

func TestTypedQueryStream_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("SELECT Success", func(t *testing.T) {
		stream, err := client.TypedQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT id, name FROM users",
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
		assert.GreaterOrEqual(t, len(batch.Rows), 1)

		// 3. Complete
		assert.True(t, stream.Receive())
		assert.NotNil(t, stream.Msg().GetComplete())

		assert.False(t, stream.Receive())
	})

	t.Run("DML Success", func(t *testing.T) {
		stream, err := client.TypedQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "INSERT INTO users (name) VALUES ('StreamTypedUser')",
		}))
		require.NoError(t, err)

		assert.True(t, stream.Receive())
		assert.NotNil(t, stream.Msg().GetError())
		assert.Contains(t, stream.Msg().GetError().Message, "DML operations are not supported in typed stream queries")
	})

	t.Run("DB Not Found", func(t *testing.T) {
		stream, err := client.TypedQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "missing",
			Sql:      "SELECT 1",
		}))
		if err == nil {
			assert.False(t, stream.Receive())
			assert.Error(t, stream.Err())
			assert.Contains(t, stream.Err().Error(), "not found")
		} else {
			assert.Contains(t, err.Error(), "not found")
		}
	})

	t.Run("Transaction Control Blocked", func(t *testing.T) {
		stream, err := client.TypedQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "BEGIN",
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
		stream, err := client.TypedQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM missing_table",
		}))
		require.NoError(t, err)

		// Receive error message wrapped in stream
		assert.True(t, stream.Receive())
		errMsg := stream.Msg().GetError()
		assert.NotNil(t, errMsg)
		assert.Contains(t, errMsg.Message, "no such table")
	})

	t.Run("Proto Validation Error", func(t *testing.T) {
		stream, err := client.TypedQueryStream(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
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
