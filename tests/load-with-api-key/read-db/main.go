/**
 * @file Load test with API key authentication for read operations
 * @description Simulates high-concurrency read operations with Bearer token (fast SHA256)
 */
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"time"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/structpb"

	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"
)

const (
	serverAddr   = "http://localhost:50051"
	databaseName = "loadtest"
	querySQL     = "SELECT * FROM users WHERE country = ? LIMIT 100;"
	numWorkers   = 50
	numRequests  = 10000
)

// API key from environment (fast SHA256-based auth)
var apiKey = getEnv("LOADTEST_API_KEY", "")

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

type result struct {
	err error
}

func main() {
	if apiKey == "" {
		log.Fatal("LOADTEST_API_KEY environment variable is required.\nRun: go run ./tests/load-with-auth/setup-apikey")
	}

	client := dbv1connect.NewDatabaseServiceClient(http.DefaultClient, serverAddr)

	jobs := make(chan int, numRequests)
	results := make(chan result, numRequests)
	var wg sync.WaitGroup

	log.Printf("Starting load test (API Key Auth) with %d workers, %d requests...\n", numWorkers, numRequests)

	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, client, &wg, jobs, results)
	}

	startTime := time.Now()

	for j := 1; j <= numRequests; j++ {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	close(results)

	totalTime := time.Since(startTime)
	var successCount, errorCount uint64

	for r := range results {
		if r.err != nil {
			atomic.AddUint64(&errorCount, 1)
		} else {
			atomic.AddUint64(&successCount, 1)
		}
	}

	rps := float64(successCount) / totalTime.Seconds()

	log.Println("\n--- Load Test Summary (API Key Auth) ---")
	log.Printf("Total Time Elapsed:  %v", totalTime)
	log.Printf("Total Requests Sent: %d", numRequests)
	log.Printf("Successful Requests: %d", successCount)
	log.Printf("Failed Requests:     %d", errorCount)
	log.Printf("Requests Per Second: %.2f", rps)
	log.Println("----------------------------------------")
}

func worker(id int, client dbv1connect.DatabaseServiceClient, wg *sync.WaitGroup, jobs <-chan int, results chan<- result) {
	defer wg.Done()

	// Use Bearer token (fast SHA256-based validation)
	authHeader := "Bearer " + apiKey

	params, _ := structpb.NewList([]any{"USA"})

	for range jobs {
		req := connect.NewRequest(&dbv1.QueryRequest{
			Database:   databaseName,
			Sql:        querySQL,
			Parameters: &dbv1.Parameters{Positional: params},
		})
		req.Header().Set("Authorization", authHeader)

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		_, err := client.Query(ctx, req)
		if err != nil {
			results <- result{err: err}
			cancel()
			continue
		}

		results <- result{err: nil}
		cancel()
	}
}
