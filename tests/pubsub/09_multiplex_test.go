package pubsub_test

import (
	"context"
	"fmt"
	"testing"
	"time"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
)

// TestMultiplexedSubscriptions verifies that a single client connection
// can handle multiple subscriptions on different channels simultaneously
// without streams crossing over or hanging.
func TestMultiplexedSubscriptions(t *testing.T) {
	// Provide a SINGLE client connection for both subscribers AND publishers
	// to maximize multiplexing pressure on the single HTTP/2 connection.
	client, db := setupTestClient(t)

	uniqueSuffix := time.Now().UnixNano()
	chanA := fmt.Sprintf("multi-A-%d", uniqueSuffix)
	chanB := fmt.Sprintf("multi-B-%d", uniqueSuffix)
	receivedA, receivedB := make(chan string, 10), make(chan string, 10)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	startSubscriber := func(ch string, out chan string) {
		go func() {
			stream, err := client.Subscribe(ctx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{
				Database: db,
				Channel:  ch,
			}))
			if err != nil {
				t.Errorf("Subscribe to %s failed: %v", ch, err)
				return
			}
			for stream.Receive() {
				out <- stream.Msg().Payload
			}
			if err := stream.Err(); err != nil && ctx.Err() == nil {
				t.Logf("Stream %s error: %v", ch, err)
			}
		}()
	}

	// Subscribe to BOTH channels using the SAME client connection
	startSubscriber(chanA, receivedA)
	startSubscriber(chanB, receivedB)

	// Wait for subscriptions to be active
	time.Sleep(500 * time.Millisecond)

	t.Log("Publishing to Channels A and B...")
	_, err := client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
		Database: db,
		Channel:  chanA,
		Payload:  "Message for A",
	}))
	if err != nil {
		t.Fatalf("Publish to A failed: %v", err)
	}

	_, err = client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
		Database: db,
		Channel:  chanB,
		Payload:  "Message for B",
	}))
	if err != nil {
		t.Fatalf("Publish to B failed: %v", err)
	}

	// Verify messages arrived correctly with no multiplexing cross-talk
	select {
	case msg := <-receivedA:
		if msg != "Message for A" {
			t.Fatalf("Chan A received wrong message: %s", msg)
		}
		t.Log("   [OK] Chan A received correctly")
	case <-time.After(2 * time.Second):
		t.Fatal("Timed out waiting for message in Chan A")
	}

	select {
	case msg := <-receivedB:
		if msg != "Message for B" {
			t.Fatalf("Chan B received wrong message: %s", msg)
		}
		t.Log("   [OK] Chan B received correctly")
	case <-time.After(2 * time.Second):
		t.Fatal("Timed out waiting for message in Chan B")
	}

	// Ensure no duplicate messages leaked through the single connection
	select {
	case msg := <-receivedA:
		t.Fatalf("Chan A received duplicate or cross-talk: %s", msg)
	case <-time.After(500 * time.Millisecond):
		t.Log("   [OK] No cross-talk detected in Chan A")
	}

	t.Log("✅ Multiplexed subscriptions test passed.")
}
