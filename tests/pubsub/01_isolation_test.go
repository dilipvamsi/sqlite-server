package pubsub_test

import (
	"context"
	"fmt"
	"testing"
	"time"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
)

// TestIsolation verifies that messages in one channel don't leak into another.
func TestIsolation(t *testing.T) {
	client, db := setupTestClient(t)

	uniqueSuffix := time.Now().UnixNano()
	chanA := fmt.Sprintf("channel-A-%d", uniqueSuffix)
	chanB := fmt.Sprintf("channel-B-%d", uniqueSuffix)
	receivedA, receivedB := make(chan string, 10), make(chan string, 10)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	startSubscriber := func(ch string, out chan string) {
		subClient := getSubscriberClient(t)
		go func() {
			stream, err := subClient.Subscribe(ctx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{
				Database: db,
				Channel:  ch,
			}))
			if err != nil {
				t.Errorf("Subscribe to %s failed: %v", ch, err)
				return
			}
			for stream.Receive() {
				msg := stream.Msg()
				t.Logf("Subscriber %s received: ID=%d Payload='%s'", ch, msg.MessageId, msg.Payload)
				out <- msg.Payload
			}
			if err := stream.Err(); err != nil && ctx.Err() == nil {
				t.Logf("Stream %s error: %v", ch, err)
			}
		}()
	}

	startSubscriber(chanA, receivedA)
	startSubscriber(chanB, receivedB)

	// Wait for subscriptions to be active (signal hub registration)
	time.Sleep(500 * time.Millisecond)

	t.Log("Publishing to Channel A...")
	_, err := client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
		Database: db,
		Channel:  chanA,
		Payload:  "Message for A",
	}))
	if err != nil {
		t.Fatalf("Publish to A failed: %v", err)
	}

	t.Log("Publishing to Channel B...")
	_, err = client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
		Database: db,
		Channel:  chanB,
		Payload:  "Message for B",
	}))
	if err != nil {
		t.Fatalf("Publish to B failed: %v", err)
	}

	// Verify Isolation
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

	// Ensure no cross-talk
	select {
	case msg := <-receivedA:
		t.Fatalf("Chan A received unexpected cross-talk: %s", msg)
	case <-time.After(500 * time.Millisecond):
		t.Log("   [OK] No cross-talk detected in Chan A")
	}

	t.Log("✅ Isolation test passed.")
}
