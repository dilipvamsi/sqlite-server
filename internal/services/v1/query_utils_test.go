package servicesv1

import (
	"context"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"testing"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestValuesToProto_EdgeCases(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// 1. Test NULLs (GetSelect.Rows[1] in seed data has NULL avatar)
	res, _ := client.Query(ctx, connect.NewRequest(&dbv1.QueryRequest{Database: "test", Sql: "SELECT avatar FROM users WHERE id=2"}))
	val := res.Msg.GetSelect().Rows[0].Values[0]
	assert.Contains(t, val.String(), "null_value") // Protobuf null check

	// 2. Test Expression (Unknown Type) -> 1+1
	res, _ = client.Query(ctx, connect.NewRequest(&dbv1.QueryRequest{Database: "test", Sql: "SELECT 1+1"}))
	// Should default to NumberValue (float) or String
	val = res.Msg.GetSelect().Rows[0].Values[0]
	assert.Equal(t, float64(2), val.GetNumberValue())

	// 3. Test Float Explicit
	res, _ = client.Query(ctx, connect.NewRequest(&dbv1.QueryRequest{Database: "test", Sql: "SELECT 3.14"}))
	val = res.Msg.GetSelect().Rows[0].Values[0]
	assert.Equal(t, 3.14, val.GetNumberValue())
}

func TestSendDMLResult_Stateless(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// Calling QueryStream with an INSERT should trigger SendDMLResult in the stateless writer
	stream, err := client.QueryStream(ctx, connect.NewRequest(&dbv1.QueryRequest{
		Database: "test",
		Sql:      "INSERT INTO users (name) VALUES ('StatelessDML')",
	}))
	require.NoError(t, err)

	assert.True(t, stream.Receive())
	assert.NotNil(t, stream.Msg().GetDml())
	assert.Equal(t, int64(1), stream.Msg().GetDml().RowsAffected)
}
