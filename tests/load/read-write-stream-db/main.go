/**
 * @file This file contains a mixed read/write load tester for the sqlite-server.
 * @description This definitive version tests the server's primary, production-ready
 * streaming RPCs. Read workers use `QueryStream` and write workers use the full,
 * stateful `Transaction` bidirectional stream to provide the most realistic
 * assessment of the server's performance and data integrity under pressure.
 */
package main

import (
	"context"
	"crypto/tls"
	"errors"
	"flag"
	"io"
	"log"
	"math/rand"
	"net"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/structpb"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/protos/sqlrpc/v1/sqlrpcv1connect"
	"sqlite-server/internal/sqldrivers"
)

// --- Test Configuration ---
const (
	serverAddr  = "http://localhost:50173"
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

	// --- Setup ---
	// CRITICAL FIX: Create a custom http.Client that is configured to speak
	// HTTP/2 over cleartext (h2c). This is required when using connect.WithGRPC()
	// against a server that is not using TLS.
	h2cClient := &http.Client{
		Transport: &http2.Transport{
			// Allow non-TLS HTTP/2
			AllowHTTP: true,
			// A custom dialer that performs a TCP dial and ignores the TLS handshake.
			DialTLS: func(network, addr string, _ *tls.Config) (net.Conn, error) {
				return net.Dial(network, addr)
			},
		},
	}
	client := sqlrpcv1connect.NewDatabaseServiceClient(h2cClient, serverAddr, connect.WithGRPCWeb())
	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(context.Background())

	log.Printf("Starting mixed load test for %v...", testDuration)
	log.Printf("Workers: %d Read / %d Write (using streaming RPCs)", numReadWorkers, numWriteWorkers)

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
	cancel()
	wg.Wait()

	// --- Print Summary Report ---
	readRPS := float64(readOps) / testDuration.Seconds()
	writeRPS := float64(writeOps) / testDuration.Seconds()

	log.Println("\n--- Load Test Summary ---")
	log.Printf("Successful Read Operations: %d (%.2f RPS)", readOps, readRPS)
	log.Printf("Failed Read Operations:     %d", failedReadOps)
	log.Printf("Successful Write Oprations: %d (%.2f RPS)", writeOps, writeRPS)
	log.Printf("Failed Write Operations:    %d", failedWriteOps)
	log.Println("-------------------------")

	// --- Data Integrity Verification ---
	log.Println("Verifying data integrity...")
	verifyDataIntegrity()
}

/**
 * @function readWorker
 * @description UPDATED: This worker now uses the safe `QueryStream` RPC.
 */
func readWorker(ctx context.Context, wg *sync.WaitGroup, client sqlrpcv1connect.DatabaseServiceClient) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			return
		default:
			req := connect.NewRequest(&sqlrpcv1.QueryRequest{
				Database: dbName,
				Sql:      "SELECT balance FROM accounts WHERE id = ?;",
				Parameters: &sqlrpcv1.Parameters{
					Positional: listValue(rand.Intn(numAccounts) + 1),
				},
			})

			stream, err := client.QueryStream(ctx, req)
			if err != nil {
				// This catches errors in establishing the stream itself.
				atomic.AddUint64(&failedReadOps, 1)
				continue
			}

			// It is CRITICAL to fully drain the stream to measure the complete
			// time it takes for the server to generate and send all data.
			for stream.Receive() {
				// In a real client, we would process stream.Msg() here.
			}

			// After draining, check stream.Err() for any protocol or server-side errors.
			if err := stream.Err(); err != nil {
				log.Printf("Read worker received gRPC error: %v", err)
				atomic.AddUint64(&failedReadOps, 1)
			} else {
				atomic.AddUint64(&readOps, 1)
			}
		}
	}
}

/**
 * @function writeWorker
 * @description UPDATED: This worker now includes a short, randomized backoff
 * after any failed transaction attempt. This is critical to prevent a CPU-bound
 * busy-spin loop and ensure the worker can shut down gracefully.
 */
func writeWorker(ctx context.Context, wg *sync.WaitGroup, client sqlrpcv1connect.DatabaseServiceClient) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			return
		default:
			// Each iteration is a new transaction attempt.
			if err := performOneWriteTransaction(ctx, client); err != nil {
				log.Printf("Write worker received gRPC error: %v", err)
				atomic.AddUint64(&failedWriteOps, 1)
				// *** CRITICAL FIX: Back off after a failure ***
				// Wait for a short, random duration before retrying.
				// This prevents a single worker from hogging the CPU in a tight failure loop.
				time.Sleep(time.Duration(10+rand.Intn(20)) * time.Millisecond)
			} else {
				atomic.AddUint64(&writeOps, 1)
			}
		}
	}
}

/**
 * @function performOneWriteTransaction
 * @description Encapsulates the full, conversational logic for a single write transaction.
 * It now returns a more specific error for the "skip" case for clarity.
 */
// performOneWriteTransaction encapsulates the logic for a single, conversational write transaction.
func performOneWriteTransaction(ctx context.Context, client sqlrpcv1connect.DatabaseServiceClient) error {
	// This log line is for debugging. It reads atomic counters, so the output
	// will appear racy and non-sequential, which is expected under high concurrency.
	// log.Printf("Attempting write transaction #%d", atomic.LoadUint64(&writeOps)+atomic.LoadUint64(&failedWriteOps)+1)

	fromID := rand.Intn(numAccounts) + 1
	toID := rand.Intn(numAccounts) + 1
	if fromID == toID {
		return errors.New("skipped transfer to self")
	}
	amount := 10.0

	stream := client.Transaction(ctx)
	defer stream.CloseResponse()

	// --- Step 1: Send BEGIN ---
	if err := stream.Send(&sqlrpcv1.TransactionRequest{Command: &sqlrpcv1.TransactionRequest_Begin{Begin: &sqlrpcv1.BeginRequest{
		Database: dbName,
		Mode:     sqlrpcv1.TransactionLockMode_TRANSACTION_LOCK_MODE_IMMEDIATE,
	}}}); err != nil {
		return err
	}
	if _, err := stream.Receive(); err != nil {
		return err
	}

	// --- Step 2 & 3: Send UPDATEs ---
	update1 := &sqlrpcv1.TransactionRequest{
		Command: &sqlrpcv1.TransactionRequest_Query{
			Query: &sqlrpcv1.TransactionalQueryRequest{
				Sql: "UPDATE accounts SET balance = balance - ? WHERE id = ?;",
				Parameters: &sqlrpcv1.Parameters{
					Positional: listValue(amount, fromID),
				},
			},
		},
	}
	if err := stream.Send(update1); err != nil {
		return err
	}
	if _, err := stream.Receive(); err != nil {
		return err
	}

	update2 := &sqlrpcv1.TransactionRequest{
		Command: &sqlrpcv1.TransactionRequest_Query{
			Query: &sqlrpcv1.TransactionalQueryRequest{
				Sql: "UPDATE accounts SET balance = balance + ? WHERE id = ?;",
				Parameters: &sqlrpcv1.Parameters{
					Positional: listValue(amount, toID),
				},
			},
		},
	}

	if err := stream.Send(update2); err != nil {
		return err
	}
	if _, err := stream.Receive(); err != nil {
		return err
	}

	// --- Step 4: Send COMMIT ---
	if err := stream.Send(&sqlrpcv1.TransactionRequest{Command: &sqlrpcv1.TransactionRequest_Commit{Commit: &emptypb.Empty{}}}); err != nil {
		return err
	}
	if _, err := stream.Receive(); err != nil {
		return err
	}

	if err := stream.CloseRequest(); err != nil {
		return err
	}

	// --- Final: Drain stream ---
	for {
		if _, err := stream.Receive(); err != nil {
			if errors.Is(err, io.EOF) {
				return nil
			} // SUCCESS!
			return err
		}
	}
}

// verifyDataIntegrity connects directly to the DB and checks if the total balance is correct.
func verifyDataIntegrity() {
	var config *sqlrpcv1.DatabaseConfig
	if *enableCipher {
		config = &sqlrpcv1.DatabaseConfig{
			Name:        dbName,
			DbPath:      dbPath,
			IsEncrypted: true,
		}
	} else {
		config = &sqlrpcv1.DatabaseConfig{
			Name:   dbName,
			DbPath: dbPath,
		}
	}
	db, err := sqldrivers.NewSqliteDb(config, false)
	if err != nil {
		log.Fatalf("Verification failed: could not open db: %v", err)
	}
	defer db.Close()

	var finalSum float64
	err = db.QueryRow("SELECT SUM(balance) FROM accounts").Scan(&finalSum)
	if err != nil {
		log.Fatalf("Verification failed: could not query sum: %v", err)
	}

	expectedSum := float64(numAccounts * 1000)

	log.Printf("Initial Expected Sum: %.2f", expectedSum)
	log.Printf("Final Actual Sum:     %.2f", finalSum)

	if finalSum > expectedSum-0.001 && finalSum < expectedSum+0.001 {
		log.Println("✅ Data Integrity Check PASSED. Total balance is unchanged.")
	} else {
		log.Println("❌ Data Integrity Check FAILED. Total balance changed.")
	}
}

// listValue is a helper to quickly create a *structpb.ListValue.
func listValue(vals ...any) []*structpb.Value {
	l, _ := structpb.NewList(vals)
	return l.Values
}
