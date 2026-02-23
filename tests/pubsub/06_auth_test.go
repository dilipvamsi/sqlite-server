package pubsub_test

import (
	"context"
	"testing"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
)

// TestUnauthorizedAccess verifies that access without proper tokens is rejected.
func TestUnauthorizedAccess(t *testing.T) {
	badClient, serverURL := getUnauthenticatedClient(t)

	// We'll just provide a dummy db name.
	db := "public_db"

	t.Log("Attempting unauthorized Publish...")
	_, err := badClient.Publish(context.Background(), connect.NewRequest(&sqlrpcv1.PublishRequest{
		Database: db,
		Channel:  "public",
		Payload:  "hacked?",
	}))

	if err == nil {
		t.Fatal("Unauthorized Publish SHOULD have failed but didn't")
	}
	t.Logf("   [OK] Rejected as expected: %v, Server: %s", err, serverURL)

	t.Log("✅ Unauthorized access test passed.")
}
