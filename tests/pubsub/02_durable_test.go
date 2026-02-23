package pubsub_test

import (
	"context"
	"testing"
	"time"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
)

// TestDurableSubscription verifies that subscribers catch up on missed messages.
func TestDurableSubscription(t *testing.T) {
	client, db := setupTestClient(t)

	channel := "durable-channel"
	subName := "my-durable-worker"

	t.Log("Publishing messages while subscriber is OFFLINE...")
	_, err := client.Publish(context.Background(), connect.NewRequest(&sqlrpcv1.PublishRequest{
		Database: db,
		Channel:  channel,
		Payload:  "Offline-1",
	}))
	if err != nil {
		t.Fatalf("Publish failed: %v", err)
	}
	_, _ = client.Publish(context.Background(), connect.NewRequest(&sqlrpcv1.PublishRequest{
		Database: db,
		Channel:  channel,
		Payload:  "Offline-2",
	}))

	t.Log("Connecting durable subscriber...")
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	stream, err := client.Subscribe(ctx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{
		Database:         db,
		Channel:          channel,
		SubscriptionName: subName,
	}))
	if err != nil {
		t.Fatalf("Durable subscribe failed: %v", err)
	}

	received := []string{}
	timeout := time.After(3 * time.Second)
done:
	for len(received) < 2 {
		select {
		case <-timeout:
			t.Fatalf("Timed out waiting for durable catch-up. Got: %v", received)
			break done
		default:
			if stream.Receive() {
				received = append(received, stream.Msg().Payload)
			} else {
				t.Fatalf("Stream closed unexpectedly: %v", stream.Err())
			}
		}
	}

	if received[0] != "Offline-1" || received[1] != "Offline-2" {
		t.Fatalf("Historical messages received out of order or incorrect: %v", received)
	}
	t.Logf("   Caught up on %d historical messages", len(received))

	t.Log("Publishing more messages while subscriber is ONLINE...")
	_, _ = client.Publish(context.Background(), connect.NewRequest(&sqlrpcv1.PublishRequest{
		Database: db,
		Channel:  channel,
		Payload:  "Online-1",
	}))

	if stream.Receive() && stream.Msg().Payload == "Online-1" {
		t.Log("   [OK] Received live message after catch-up")
	} else {
		t.Fatal("Failed to receive live message in durable stream")
	}

	t.Log("✅ Durable subscription test passed.")
}
