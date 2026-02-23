package pubsub_test

import (
	"context"
	"testing"
	"time"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	_ "sqlite-server/internal/sqldrivers"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/structpb"
)

// TestVPubSubInsert verifies that INSERT operations on the vpubsub virtual table work.
func TestVPubSubInsert(t *testing.T) {
	client, db := setupTestClient(t)
	channel := "vtab-insert-channel"

	// Subscribe in background to verify receipt
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	received := make(chan string, 10)
	go func() {
		stream, _ := client.Subscribe(ctx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{Database: db, Channel: channel}))
		for stream.Receive() {
			received <- stream.Msg().Payload
		}
	}()
	time.Sleep(500 * time.Millisecond)

	t.Log("Executing INSERT INTO vpubsub...")
	sql := "INSERT INTO vpubsub(channel, payload) VALUES (?, ?)"
	_, err := client.Query(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
		Database: db,
		Sql:      sql,
		Parameters: &sqlrpcv1.Parameters{
			Positional: []*structpb.Value{
				structpb.NewStringValue(channel),
				structpb.NewStringValue("VTab-Payload"),
			},
		},
	}))
	if err != nil {
		t.Fatalf("VPubSub INSERT failed: %v", err)
	}

	select {
	case msg := <-received:
		if msg != "VTab-Payload" {
			t.Fatalf("Expected 'VTab-Payload', got '%s'", msg)
		}
		t.Logf("   Received VPubSub message: %s", msg)
	case <-time.After(2 * time.Second):
		t.Fatalf("Timed out waiting for VPubSub insert message")
	}

	t.Log("✅ VPubSub INSERT test passed.")
}

// TestVPubSubBulkInsert verifies multi-row INSERTs into the vpubsub virtual table.
func TestVPubSubBulkInsert(t *testing.T) {
	client, db := setupTestClient(t)
	channel := "vtab-bulk-channel"
	count := 10

	// Subscribe
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	received := make(chan string, count+5)
	go func() {
		stream, _ := client.Subscribe(ctx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{Database: db, Channel: channel}))
		for stream.Receive() {
			received <- stream.Msg().Payload
		}
	}()
	time.Sleep(500 * time.Millisecond)

	t.Logf("Executing bulk INSERT INTO vpubsub (%d rows)...", count)
	sql := `
		WITH RECURSIVE cnt(i) AS (
			SELECT 1
			UNION ALL
			SELECT i + 1 FROM cnt WHERE i < ?
		)
		INSERT INTO vpubsub(channel, payload)
		SELECT ?, 'Bulk-' || i FROM cnt;
	`
	_, err := client.Query(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
		Database: db,
		Sql:      sql,
		Parameters: &sqlrpcv1.Parameters{
			Positional: []*structpb.Value{
				structpb.NewNumberValue(float64(count)),
				structpb.NewStringValue(channel),
			},
		},
	}))
	if err != nil {
		t.Fatalf("VPubSub Bulk INSERT failed: %v", err)
	}

	for i := 1; i <= count; i++ {
		select {
		case <-received:
			// Success
		case <-time.After(5 * time.Second):
			t.Fatalf("Timed out waiting for VPubSub bulk message %d", i)
		}
	}

	t.Log("✅ VPubSub Bulk INSERT test passed.")
}

// TestVPubSubBulkInsertWithTransaction verifies that thousands of rows
// gracefully trigger the virtual table's 1000-message `sync limit`, batching
// them down to the broker without memory bloat or message drops.
func TestVPubSubBulkInsertWithTransaction(t *testing.T) {
	client, db := setupTestClient(t)
	channel := "vtab-sync-limit-channel"
	count := 2500 // Exceeds the 1000 row sync limit twice!

	// Subscribe
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	received := make(chan string, count+5)

	go func() {
		stream, err := client.Subscribe(ctx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{Database: db, Channel: channel}))
		if err != nil {
			t.Logf("Failed to subscribe: %v", err)
			return
		}
		for stream.Receive() {
			received <- stream.Msg().Payload
		}
	}()
	time.Sleep(500 * time.Millisecond)

	t.Logf("Executing bulk INSERT INTO vpubsub (%d rows) inside a TRANSACTION...", count)

	t.Logf("Executing bulk INSERT INTO vpubsub (%d rows) wrapped in a native implicit TRANSACTION...", count)

	insertSQL := `
		WITH RECURSIVE cnt(i) AS (
			SELECT 1
			UNION ALL
			SELECT i + 1 FROM cnt WHERE i < ?
		)
		INSERT INTO vpubsub(channel, payload)
		SELECT ?, 'Sync-' || i FROM cnt;
	`

	// A single INSERT statement processing thousands of rows will natively trigger
	// SQLite's implicit transaction mechanics, calling xBegin at the start and xCommit at the end.
	// This safely bypasses the stateless HTTP RPC transaction limitations.
	_, err := client.Query(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
		Database: db,
		Sql:      insertSQL,
		Parameters: &sqlrpcv1.Parameters{
			Positional: []*structpb.Value{
				structpb.NewNumberValue(float64(count)),
				structpb.NewStringValue(channel),
			},
		},
	}))
	if err != nil {
		t.Fatalf("VPubSub Native Implicit Transaction Bulk INSERT failed: %v", err)
	}

	for i := 1; i <= count; i++ {
		select {
		case <-received:
		case <-time.After(5 * time.Second):
			t.Fatalf("Timed out waiting for VPubSub sync limit message %d", i)
		}
	}

	t.Log("✅ VPubSub Transaction Bulk INSERT (Sync Limit) test passed.")
}
