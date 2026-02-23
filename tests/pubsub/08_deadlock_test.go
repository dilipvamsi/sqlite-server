package pubsub_test

import (
	"context"
	"fmt"
	"math/rand"
	"sync"
	"testing"
	"time"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
)

// TestDeadlockStress specifically targets deadlocks by creating rapid connections,
// subscriptions, publishes, and random disconnections (context cancellations).
func TestDeadlockStress(t *testing.T) {
	client, db := setupTestClient(t)

	numWorkers := 50
	duration := 5 * time.Second

	t.Logf("Starting deadlock stress test with %d workers for %v...", numWorkers, duration)

	ctx, cancel := context.WithTimeout(context.Background(), duration)
	defer cancel()

	var wg sync.WaitGroup

	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()

			channel := fmt.Sprintf("deadlock-chan-%d", workerID%5) // Shared channels

			for {
				select {
				case <-ctx.Done():
					return
				default:
					// Randomly decide to publish or subscribe
					action := rand.Intn(100)
					if action < 30 {
						// 30% chance to subscribe and disconnect
						subCtx, subCancel := context.WithCancel(ctx)
						stream, err := client.Subscribe(subCtx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{
							Database: db,
							Channel:  channel,
						}))
						if err == nil {
							go func() {
								// Read a few messages then abort abruptly
								count := 0
								for stream.Receive() {
									count++
									if count > 2 {
										break
									}
								}
							}()

							// Sleep briefly to let it connect
							time.Sleep(time.Duration(rand.Intn(10)) * time.Millisecond)
							// Abruptly cancel the subscription to test cleanup locks
							subCancel()
						} else {
							subCancel()
						}
					} else {
						// 70% chance to publish
						pubCtx, pubCancel := context.WithTimeout(ctx, 1*time.Second)
						_, err := client.Publish(pubCtx, connect.NewRequest(&sqlrpcv1.PublishRequest{
							Database: db,
							Channel:  channel,
							Payload:  fmt.Sprintf("Msg from W%d", workerID),
						}))
						pubCancel()
						if err != nil && pubCtx.Err() == nil && ctx.Err() == nil {
							t.Logf("Publish error (expected under load): %v", err)
						}
					}
					time.Sleep(time.Duration(rand.Intn(20)) * time.Millisecond)
				}
			}
		}(i)
	}

	wg.Wait()
	t.Log("✅ Deadlock stress test finished without hanging the server.")
}
