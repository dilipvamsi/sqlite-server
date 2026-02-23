package pubsub_test

import (
	"context"
	"testing"
	"time"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/structpb"
)

// TestSQLAggregatePublish verifies the 'publish_batch' aggregate function.
func TestSQLAggregatePublish(t *testing.T) {
	client, db := setupTestClient(t)

	channel := "sql-batch-channel"

	// Subscribe in background to verify receipt
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	received := make(chan string, 100)
	go func() {
		stream, _ := client.Subscribe(ctx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{Database: db, Channel: channel}))
		for stream.Receive() {
			received <- stream.Msg().Payload
		}
	}()
	time.Sleep(500 * time.Millisecond)

	t.Log("Executing SQL bulk publish via aggregate...")
	sql := `
		WITH RECURSIVE cnt(i) AS (
			SELECT 1
			UNION ALL
			SELECT i + 1 FROM cnt WHERE i < 10
		)
		SELECT publish_batch(?, 'Msg-' || i) FROM cnt;
	`
	_, err := client.Query(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
		Database: db,
		Sql:      sql,
		Parameters: &sqlrpcv1.Parameters{
			Positional: []*structpb.Value{structpb.NewStringValue(channel)},
		},
	}))
	if err != nil {
		t.Fatalf("SQL Aggregate Publish failed: %v", err)
	}

	// Verify receipt of all 10 messages
	for i := 1; i <= 10; i++ {
		select {
		case msg := <-received:
			t.Logf("   Received SQL message: %s", msg)
		case <-time.After(2 * time.Second):
			t.Fatalf("Timed out waiting for SQL message %d", i)
		}
	}

	t.Log("✅ SQL Aggregate test passed: publish_batch() works as intended.")
}

// TestSQLAggregateBulkPublish verifies that publish_batch handles large datasets correctly
// by triggering the internal memory synchronization limit (1000 rows).
func TestSQLAggregateBulkPublish(t *testing.T) {
	client, db := setupTestClient(t)

	channel := "sql-bulk-sync-channel"
	count := 2500 // Triggers the 1000 row sync limit twice!

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

	t.Logf("Executing bulk SQL publish (%d rows) via aggregate...", count)
	sql := `
		WITH RECURSIVE cnt(i) AS (
			SELECT 1
			UNION ALL
			SELECT i + 1 FROM cnt WHERE i < ?
		)
		SELECT publish_batch(?, 'Bulk-' || i) FROM cnt;
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
		t.Fatalf("Bulk SQL Aggregate Publish failed: %v", err)
	}

	// Verify receipt of all messages
	for i := 1; i <= count; i++ {
		select {
		case <-received:
			// OK
		case <-time.After(5 * time.Second):
			t.Fatalf("Timed out waiting for bulk SQL message %d", i)
		}
	}

	t.Log("✅ SQL Aggregate Bulk Publish test passed: sync limit handled correctly.")
}
