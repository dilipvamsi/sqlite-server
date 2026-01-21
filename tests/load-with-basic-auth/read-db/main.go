/**
 * @file Load test with Basic Auth for read operations
 */
package main

import (
	"context"
	"encoding/base64"
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

var (
	username = getEnv("LOADTEST_USERNAME", "admin")
	password = getEnv("LOADTEST_PASSWORD", "admin")
)

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
	client := dbv1connect.NewDatabaseServiceClient(http.DefaultClient, serverAddr)

	jobs := make(chan int, numRequests)
	results := make(chan result, numRequests)
	var wg sync.WaitGroup

	log.Printf("Starting load test (Basic Auth) with %d workers, %d requests...\n", numWorkers, numRequests)
	log.Printf("Using: %s:***\n", username)

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

	log.Println("\n--- Load Test Summary (Basic Auth) ---")
	log.Printf("Total Time Elapsed:  %v", totalTime)
	log.Printf("Total Requests Sent: %d", numRequests)
	log.Printf("Successful Requests: %d", successCount)
	log.Printf("Failed Requests:     %d", errorCount)
	log.Printf("Requests Per Second: %.2f", rps)
	log.Println("--------------------------------------")
}

func worker(id int, client dbv1connect.DatabaseServiceClient, wg *sync.WaitGroup, jobs <-chan int, results chan<- result) {
	defer wg.Done()

	// Basic Auth header
	authHeader := "Basic " + base64.StdEncoding.EncodeToString([]byte(username+":"+password))

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
