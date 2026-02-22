/**
 * @file Mixed read/write load test with Basic Auth
 */
package main

import (
	"context"
	"encoding/base64"
	"flag"
	"log"
	"math/rand"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"time"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/structpb"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/protos/sqlrpc/v1/sqlrpcv1connect"
	"sqlite-server/internal/sqldrivers"
)

const (
	serverAddr      = "http://localhost:50173"
	numAccounts     = 100
	numWriteWorkers = 10
	numReadWorkers  = 90
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
	dbPath       string
	enableCipher *bool
	username     = getEnv("LOADTEST_USERNAME", "admin")
	password     = getEnv("LOADTEST_PASSWORD", "admin")
)

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

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

	client := sqlrpcv1connect.NewDatabaseServiceClient(httpClient, serverAddr)
	var wg sync.WaitGroup

	ctx, cancel := context.WithCancel(context.Background())

	log.Printf("Starting mixed load test (Basic Auth) for %v...", testDuration)
	log.Printf("Workers: %d Read / %d Write", numReadWorkers, numWriteWorkers)
	log.Printf("Using: %s:***", username)

	for i := 0; i < numReadWorkers; i++ {
		wg.Add(1)
		go readWorker(ctx, &wg, client)
	}
	for i := 0; i < numWriteWorkers; i++ {
		wg.Add(1)
		go writeWorker(ctx, &wg, client)
	}

	time.Sleep(testDuration)
	cancel()
	wg.Wait()

	readRPS := float64(readOps) / testDuration.Seconds()
	writeRPS := float64(writeOps) / testDuration.Seconds()

	log.Println("\n--- Mixed Load Test Summary (Basic Auth) ---")
	log.Printf("Read Operations:  %d (%.2f RPS)", readOps, readRPS)
	log.Printf("Failed Read Operations:  %d", failedReadOps)
	log.Printf("Write Operations: %d (%.2f RPS)", writeOps, writeRPS)
	log.Printf("Failed Write Operations: %d", failedWriteOps)
	log.Println("--------------------------------------------")

	log.Println("Verifying data integrity...")
	verifyDataIntegrity()
}

func readWorker(ctx context.Context, wg *sync.WaitGroup, client sqlrpcv1connect.DatabaseServiceClient) {
	defer wg.Done()
	authHeader := "Basic " + base64.StdEncoding.EncodeToString([]byte(username+":"+password))

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
			req.Header().Set("Authorization", authHeader)

			_, err := client.Query(ctx, req)
			if err != nil {
				atomic.AddUint64(&failedReadOps, 1)
			} else {
				atomic.AddUint64(&readOps, 1)
			}
		}
	}
}

func writeWorker(ctx context.Context, wg *sync.WaitGroup, client sqlrpcv1connect.DatabaseServiceClient) {
	defer wg.Done()
	authHeader := "Basic " + base64.StdEncoding.EncodeToString([]byte(username+":"+password))

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

			req := connect.NewRequest(&sqlrpcv1.ExecuteTransactionRequest{
				Requests: []*sqlrpcv1.TransactionRequest{
					{Command: &sqlrpcv1.TransactionRequest_Begin{Begin: &sqlrpcv1.BeginRequest{
						Database: dbName,
						Mode:     sqlrpcv1.TransactionLockMode_TRANSACTION_LOCK_MODE_IMMEDIATE,
					}}},
					{Command: &sqlrpcv1.TransactionRequest_Query{Query: &sqlrpcv1.TransactionalQueryRequest{
						Sql:        "UPDATE accounts SET balance = balance - ? WHERE id = ?;",
						Parameters: &sqlrpcv1.Parameters{Positional: listValue(amount, fromID)},
					}}},
					{Command: &sqlrpcv1.TransactionRequest_Query{Query: &sqlrpcv1.TransactionalQueryRequest{
						Sql:        "UPDATE accounts SET balance = balance + ? WHERE id = ?;",
						Parameters: &sqlrpcv1.Parameters{Positional: listValue(amount, toID)},
					}}},
					{Command: &sqlrpcv1.TransactionRequest_Commit{Commit: &emptypb.Empty{}}},
				},
			})
			req.Header().Set("Authorization", authHeader)

			res, err := client.ExecuteTransaction(ctx, req)
			if err != nil {
				atomic.AddUint64(&failedWriteOps, 1)
				continue
			}

			if len(res.Msg.GetResponses()) > 0 {
				hasError := false
				for _, r := range res.Msg.GetResponses() {
					if r.GetError() != nil {
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

	if finalSum == expectedSum {
		log.Println("✅ Data Integrity Check PASSED.")
	} else {
		log.Println("❌ Data Integrity Check FAILED.")
	}
}

func listValue(vals ...any) []*structpb.Value {
	l, _ := structpb.NewList(vals)
	return l.Values
}
