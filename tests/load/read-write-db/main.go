/**
 * @file This file contains a mixed read/write load tester for the sqlite-server.
 * @description It simulates a high-concurrency workload with both read and write
 * operations to test the server's locking behavior, concurrency safety (via WAL and
 * _busy_timeout), and data integrity under pressure.
 */
package main

import (
	"context"
	"flag"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/structpb"

	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"
	"sqlite-server/internal/sqldrivers"
)

// --- Test Configuration ---
const (
	serverAddr  = "http://localhost:50051"
	numAccounts = 100 // Must match the setup script
	// Concurrency settings
	numWriteWorkers = 10 // 10% of workers will be writers
	numReadWorkers  = 90 // 90% of workers will be readers
	testDuration    = 10 * time.Second
)

var (
	readOps        uint64
	writeOps       uint64
	failedReadOps  uint64
	failedWriteOps uint64
)

const dbName = "loadtest-mixed"

var (
	dbPath string
)

var enableCipher *bool

func main() {
	enableCipher = flag.Bool("cipher", false, "Enable default ciphering")

	if *enableCipher {
		dbPath = "./data-test/loadtest-mixed-cipher.db"
	} else {
		dbPath = "./data-test/loadtest-mixed.db"
	}

	httpClient := &http.Client{
		Transport: &http.Transport{
			MaxIdleConns:        100,
			MaxIdleConnsPerHost: 100,
			IdleConnTimeout:     90 * time.Second,
		},
	}

	// --- Setup ---
	client := dbv1connect.NewDatabaseServiceClient(httpClient, serverAddr)
	var wg sync.WaitGroup

	// Use a context to signal workers to stop when the test duration is over.
	ctx, cancel := context.WithCancel(context.Background())

	log.Printf("Starting mixed load test for %v...", testDuration)
	log.Printf("Workers: %d Read / %d Write", numReadWorkers, numWriteWorkers)

	// --- Start Workers ---
	for i := 0; i < numReadWorkers; i++ {
		wg.Add(1)
		go readWorker(ctx, &wg, client)
	}
	for i := 0; i < numWriteWorkers; i++ {
		wg.Add(1)
		go writeWorker(ctx, &wg, client)
	}

	// --- Run Test and Stop Workers ---
	time.Sleep(testDuration)
	cancel()  // Signal all workers to stop.
	wg.Wait() // Wait for all workers to finish their last operation.

	// --- Print Summary Report ---
	readRPS := float64(readOps) / testDuration.Seconds()
	writeRPS := float64(writeOps) / testDuration.Seconds()

	log.Println("\n--- Load Test Summary ---")
	log.Printf("Read Operations:  %d (%.2f RPS)", readOps, readRPS)
	log.Printf("Failed Read Operations:  %d", failedReadOps)
	log.Printf("Write Operations: %d (%.2f RPS)", writeOps, writeRPS)
	log.Printf("Failed Write Operations: %d", failedWriteOps)
	log.Println("-------------------------")

	// --- Data Integrity Verification ---
	log.Println("Verifying data integrity...")
	verifyDataIntegrity()
}

// readWorker continuously performs read operations until the context is canceled.
func readWorker(ctx context.Context, wg *sync.WaitGroup, client dbv1connect.DatabaseServiceClient) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done(): // Stop when the context is canceled.
			return
		default:
			// Use the fast, unary Query RPC for this simple lookup.
			req := connect.NewRequest(&dbv1.QueryRequest{
				Database: dbName,
				Sql:      "SELECT balance FROM accounts WHERE id = ?;",
				Parameters: &dbv1.Parameters{
					Positional: listValue(rand.Intn(numAccounts) + 1),
				},
			})
			_, err := client.Query(ctx, req)
			if err != nil {
				log.Printf("Read worker received gRPC error: %v", err)
				atomic.AddUint64(&failedReadOps, 1)
			} else {
				atomic.AddUint64(&readOps, 1)
			}
		}
	}
}

// writeWorker continuously performs transactional write operations.
func writeWorker(ctx context.Context, wg *sync.WaitGroup, client dbv1connect.DatabaseServiceClient) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			return
		default:
			fromID := rand.Intn(numAccounts) + 1
			toID := rand.Intn(numAccounts) + 1
			if fromID == toID {
				continue
			}
			amount := 10.0

			// Use the unary ExecuteTransaction for this simple, scriptable transaction.
			req := connect.NewRequest(&dbv1.ExecuteTransactionRequest{
				Requests: []*dbv1.TransactionRequest{
					// FIX: Add a valid, unique request_id to every command.
					{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{
						Database: dbName,
						Mode:     dbv1.TransactionMode_TRANSACTION_MODE_IMMEDIATE,
					}}},
					{Command: &dbv1.TransactionRequest_Query{Query: &dbv1.TransactionalQueryRequest{
						Sql: "UPDATE accounts SET balance = balance - ? WHERE id = ?;",
						Parameters: &dbv1.Parameters{
							Positional: listValue(amount, fromID),
						},
					}}},
					{Command: &dbv1.TransactionRequest_Query{Query: &dbv1.TransactionalQueryRequest{
						Sql: "UPDATE accounts SET balance = balance + ? WHERE id = ?;",
						Parameters: &dbv1.Parameters{
							Positional: listValue(amount, toID),
						},
					}}},
					{Command: &dbv1.TransactionRequest_Commit{Commit: &emptypb.Empty{}}},
				},
			})

			res, err := client.ExecuteTransaction(ctx, req)

			// IMPROVEMENT: Log the error if the RPC call fails.
			if err != nil {
				log.Printf("Write worker received gRPC error: %v", err)
				atomic.AddUint64(&failedWriteOps, 1)
				continue // Skip processing and try again
			}

			// A successful transaction has a non-nil response and no top-level error.
			if len(res.Msg.GetResponses()) > 0 {
				hasError := false
				for _, r := range res.Msg.GetResponses() {
					if r.GetError() != nil {
						// IMPROVEMENT: Log application-level errors.
						log.Printf("Write worker received app error: %s", r.GetError().Message)
						hasError = true
						break
					}
				}
				if !hasError {
					atomic.AddUint64(&writeOps, 1)
				} else {
					atomic.AddUint64(&failedWriteOps, 1)
				}
			}
		}
	}
}

// verifyDataIntegrity connects directly to the DB and checks if the total balance is correct.
func verifyDataIntegrity() {
	var config sqldrivers.DBConfig
	if *enableCipher {
		config = sqldrivers.DBConfig{
			Name:        dbName,
			DBPath:      dbPath,
			IsEncrypted: true,
		}
	} else {
		config = sqldrivers.DBConfig{
			Name:   dbName,
			DBPath: dbPath,
		}
	}
	db, err := sqldrivers.NewSqliteDb(config)

	if err != nil {
		log.Fatalf("Verification failed: could not open db: %v", err)
	}
	defer db.Close()

	var finalSum float64
	err = db.QueryRow("SELECT SUM(balance) FROM accounts").Scan(&finalSum)
	if err != nil {
		log.Fatalf("Verification failed: could not query sum: %v", err)
	}

	expectedSum := float64(numAccounts * 1000) // From setup script

	log.Printf("Initial Expected Sum: %.2f", expectedSum)
	log.Printf("Final Actual Sum:     %.2f", finalSum)

	if finalSum == expectedSum {
		log.Println("✅ Data Integrity Check PASSED. Total balance is unchanged.")
	} else {
		log.Println("❌ Data Integrity Check FAILED. Total balance changed.")
	}
}

// listValue is a helper to quickly create a *structpb.ListValue.
func listValue(vals ...any) *structpb.ListValue {
	l, _ := structpb.NewList(vals)
	return l
}
