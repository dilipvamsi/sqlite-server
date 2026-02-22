/**
 * @file Load test with API key auth for streaming read operations
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

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/protos/sqlrpc/v1/sqlrpcv1connect"
)

const (
	serverAddr   = "http://localhost:50173"
	databaseName = "loadtest"
	querySQL     = "SELECT * FROM users WHERE country = ? LIMIT 100;"
	numWorkers   = 50
	numRequests  = 10000
)

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
		log.Fatal("LOADTEST_API_KEY environment variable is required.")
	}

	client := sqlrpcv1connect.NewDatabaseServiceClient(http.DefaultClient, serverAddr)

	jobs := make(chan int, numRequests)
	results := make(chan result, numRequests)
	var wg sync.WaitGroup

	log.Printf("Starting stream load test (API Key Auth) with %d workers, %d requests...\n", numWorkers, numRequests)

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

	log.Println("\n--- Stream Load Test Summary (API Key Auth) ---")
	log.Printf("Total Time Elapsed:  %v", totalTime)
	log.Printf("Total Requests Sent: %d", numRequests)
	log.Printf("Successful Requests: %d", successCount)
	log.Printf("Failed Requests:     %d", errorCount)
	log.Printf("Requests Per Second: %.2f", rps)
	log.Println("------------------------------------------------")
}

func worker(id int, client sqlrpcv1connect.DatabaseServiceClient, wg *sync.WaitGroup, jobs <-chan int, results chan<- result) {
	defer wg.Done()

	authHeader := "Bearer " + apiKey
	params := []*structpb.Value{structpb.NewStringValue("USA")}

	for range jobs {
		req := connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database:   databaseName,
			Sql:        querySQL,
			Parameters: &sqlrpcv1.Parameters{Positional: params},
		})
		req.Header().Set("Authorization", authHeader)

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		stream, err := client.QueryStream(ctx, req)
		if err != nil {
			results <- result{err: err}
			cancel()
			continue
		}

		for stream.Receive() {
		}

		err = stream.Err()
		results <- result{err: err}
		cancel()
	}
}
