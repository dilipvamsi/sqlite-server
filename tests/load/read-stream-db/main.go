/**
 * @file This file contains the load testing client for the go-sqlite-proxy.
 * @description It simulates high-concurrency read operations against the `QueryStream`
 * RPC to measure its throughput (Requests Per Second) and stability under load.
 * The test is configurable and provides a clear summary of performance.
 */
package main

import (
	"context"
	"log"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/structpb"

	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"
)

// --- Test Configuration ---
const (
	serverAddr   = "http://localhost:50051"
	databaseName = "loadtest"
	// The query we will be running repeatedly.
	querySQL = "SELECT * FROM users WHERE country = ? LIMIT 100;"

	// Concurrency settings
	numWorkers  = 50    // Number of concurrent clients (goroutines)
	numRequests = 10000 // Total number of requests to send
)

// result holds the outcome of a single RPC call.
type result struct {
	err error
}

func main() {
	// --- Setup ---
	client := dbv1connect.NewDatabaseServiceClient(
		http.DefaultClient,
		serverAddr,
	)

	jobs := make(chan int, numRequests)
	results := make(chan result, numRequests)
	var wg sync.WaitGroup

	log.Printf("Starting load test with %d workers, running %d requests...\n", numWorkers, numRequests)

	// --- Start Workers ---
	// Launch `numWorkers` goroutines that will pull jobs from the `jobs` channel.
	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, client, &wg, jobs, results)
	}

	// --- Start Timer and Dispatch Jobs ---
	startTime := time.Now()

	// Add `numRequests` jobs to the channel.
	for j := 1; j <= numRequests; j++ {
		jobs <- j
	}
	close(jobs) // Signal to workers that no more jobs will be sent.

	// --- Wait for all workers to finish ---
	wg.Wait()
	close(results) // Close the results channel after all workers are done.

	// --- Process Results ---
	totalTime := time.Since(startTime)
	var successCount uint64
	var errorCount uint64

	for r := range results {
		if r.err != nil {
			atomic.AddUint64(&errorCount, 1)
		} else {
			atomic.AddUint64(&successCount, 1)
		}
	}

	// --- Print Summary Report ---
	rps := float64(successCount) / totalTime.Seconds()

	log.Println("\n--- Load Test Summary ---")
	log.Printf("Total Time Elapsed:  %v", totalTime)
	log.Printf("Total Requests Sent: %d", numRequests)
	log.Printf("Successful Requests: %d", successCount)
	log.Printf("Failed Requests:     %d", errorCount)
	log.Printf("Requests Per Second (RPS): %.2f", rps)
	log.Println("-------------------------")
}

/**
 * @function worker
 * @description A worker runs in a dedicated goroutine and processes jobs from a channel.
 * Each worker simulates a single client making requests sequentially.
 */
func worker(id int, client dbv1connect.DatabaseServiceClient, wg *sync.WaitGroup, jobs <-chan int, results chan<- result) {
	defer wg.Done()

	// Convert query parameters to ListValue once per worker.
	params, _ := structpb.NewList([]interface{}{"USA"})

	// Process jobs from the channel until it's closed.
	for range jobs {
		req := connect.NewRequest(&dbv1.QueryRequest{
			Database: databaseName,
			Sql:      querySQL,
			Parameters: &dbv1.Parameters{
				Values: &dbv1.Parameters_Positional{
					Positional: params,
				},
			},
		})

		// Create a context with a timeout for the RPC call.
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		stream, err := client.QueryStream(ctx, req)
		if err != nil {
			log.Printf("Worker %d: request failed: %v", id, err)
			results <- result{err: err}
			cancel()
			continue
		}

		// It is CRITICAL to fully drain the stream to measure the complete
		// time it takes for the server to generate and send all data.
		for stream.Receive() {
			// In a real client, we would process the message here.
			// For a load test, we just need to receive it.
		}

		err = stream.Err()
		results <- result{err: err} // Send the final outcome (nil on success).
		cancel()
	}
}
