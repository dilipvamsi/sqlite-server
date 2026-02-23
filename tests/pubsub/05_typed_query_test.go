package pubsub_test

import (
	"context"
	"testing"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
)

// TestTypedQueryIntegration verifies that Pub/Sub works seamlessly with Typed RPCs.
func TestTypedQueryIntegration(t *testing.T) {
	client, db := setupTestClient(t)
	channel := "typed-channel"

	ctx := context.Background()

	t.Log("Publishing message via standard RPC...")
	_, err := client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
		Database: db,
		Channel:  channel,
		Payload:  "Typed-1",
	}))
	if err != nil {
		t.Fatalf("Publish failed: %v", err)
	}

	t.Log("Reading message via TypedQuery from vpubsub...")
	// Reading from virtual table
	res, err := client.TypedQuery(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
		Database: db,
		Sql:      "SELECT payload FROM vpubsub WHERE channel = ? ORDER BY id DESC LIMIT 1",
		Parameters: &sqlrpcv1.TypedParameters{
			Positional: []*sqlrpcv1.SqlValue{
				{Value: &sqlrpcv1.SqlValue_TextValue{TextValue: channel}},
			},
		},
	}))
	if err != nil {
		t.Fatalf("TypedQuery from vpubsub failed: %v", err)
	}

	if len(res.Msg.Rows) == 0 || res.Msg.Rows[0].Values[0].GetTextValue() != "Typed-1" {
		t.Fatalf("TypedQuery returned incorrect data: %v", res.Msg.Rows)
	}
	t.Logf("   [OK] TypedQuery verified: %s", res.Msg.Rows[0].Values[0].GetTextValue())

	t.Log("✅ Typed Query integration test passed.")
}
