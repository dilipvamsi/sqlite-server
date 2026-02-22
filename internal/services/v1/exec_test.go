package servicesv1

import (
	"context"
	"testing"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
)

func TestExec_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("DML Success", func(t *testing.T) {
		res, err := client.Exec(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "INSERT INTO users (name) VALUES ('ExecUser')",
		}))
		require.NoError(t, err)
		assert.NotNil(t, res.Msg)
		assert.Equal(t, int64(1), res.Msg.Dml.RowsAffected)
	})

	t.Run("Proto Validation Error", func(t *testing.T) {
		_, err := client.Exec(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "", // Empty SQL
		}))
		assert.Error(t, err)
	})

	t.Run("Transaction Control Blocked", func(t *testing.T) {
		_, err := client.Exec(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "BEGIN",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "manual transaction control")
	})
}

func TestTypedExec_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("DML Success", func(t *testing.T) {
		res, err := client.TypedExec(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "INSERT INTO users (name) VALUES ('TypedExecUser')",
		}))
		require.NoError(t, err)
		assert.NotNil(t, res.Msg)
		assert.Equal(t, int64(1), res.Msg.Dml.RowsAffected)
	})

	t.Run("Proto Validation Error", func(t *testing.T) {
		_, err := client.TypedExec(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "", // Empty SQL
		}))
		assert.Error(t, err)
	})
}
