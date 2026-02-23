package pubsub_test

import (
	"context"
	"fmt"
	"sync"
	"testing"
	"time"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
)

// TestConcurrency runs a stress test with multiple publishers and subscribers.
func TestConcurrency(t *testing.T) {
	client, db := setupTestClient(t)
	channel := "stress-test"
	numPubs := 5
	msgsPerPub := 20
	totalExpected := numPubs * msgsPerPub

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	received := make(chan string, totalExpected+10)
	var subWg sync.WaitGroup
	subWg.Add(1)

	go func() {
		subWg.Done()
		stream, err := client.Subscribe(ctx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{Database: db, Channel: channel}))
		if err != nil {
			t.Errorf("Subscribe failed: %v", err)
			return
		}
		for stream.Receive() {
			received <- stream.Msg().Payload
		}
	}()

	subWg.Wait()
	time.Sleep(500 * time.Millisecond)

	t.Logf("Starting stress test: %d publishers, %d messages each...", numPubs, msgsPerPub)
	var pubWg sync.WaitGroup
	for i := 0; i < numPubs; i++ {
		pubWg.Add(1)
		go func(pid int) {
			defer pubWg.Done()
			for j := 0; j < msgsPerPub; j++ {
				_, _ = client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
					Database: db,
					Channel:  channel,
					Payload:  fmt.Sprintf("P%d-M%d", pid, j),
				}))
			}
		}(i)
	}

	pubWg.Wait()
	t.Log("Publishers finished. Waiting for messages...")

	count := 0
timeout:
	for count < totalExpected {
		select {
		case <-received:
			count++
		case <-time.After(5 * time.Second):
			t.Fatalf("Stress test TIMEOUT: got %d/%d messages", count, totalExpected)
			break timeout
		}
	}

	t.Logf("   [OK] Received all %d messages under load", count)
	t.Log("✅ Concurrency stress test passed.")
}
