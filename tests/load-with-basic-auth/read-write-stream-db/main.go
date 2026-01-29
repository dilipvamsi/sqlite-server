/**
 * @file Mixed read/write load test with Basic Auth using streaming RPCs
 */
package main

import (
	"context"
	"crypto/tls"
	"encoding/base64"
	"errors"
	"flag"
	"io"
	"log"
	"math/rand"
	"net"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"time"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/structpb"

	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"
	"sqlite-server/internal/sqldrivers"
)

const (
	serverAddr      = "http://localhost:50051"
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

// basicAuthInterceptor injects Basic Auth for all request types
type basicAuthInterceptor struct {
	username string
	password string
}

func (i *basicAuthInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		req.Header().Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(i.username+":"+i.password)))
		return next(ctx, req)
	}
}

func (i *basicAuthInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return func(ctx context.Context, spec connect.Spec) connect.StreamingClientConn {
		conn := next(ctx, spec)
		conn.RequestHeader().Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(i.username+":"+i.password)))
		return conn
	}
}

func (i *basicAuthInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return next
}

func main() {
	enableCipher = flag.Bool("cipher", false, "Enable default ciphering")

	if *enableCipher {
		dbPath = "./data-test/loadtest-mixed-cipher.db"
	} else {
		dbPath = "./data-test/loadtest-mixed.db"
	}

	h2cClient := &http.Client{
		Transport: &http2.Transport{
			AllowHTTP: true,
			DialTLS: func(network, addr string, _ *tls.Config) (net.Conn, error) {
				return net.Dial(network, addr)
			},
		},
	}

	client := dbv1connect.NewDatabaseServiceClient(
		h2cClient,
		serverAddr,
		connect.WithGRPCWeb(),
		connect.WithInterceptors(&basicAuthInterceptor{username: username, password: password}),
	)
	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(context.Background())

	log.Printf("Starting mixed stream load test (Basic Auth) for %v...", testDuration)
	log.Printf("Workers: %d Read / %d Write (streaming RPCs)", numReadWorkers, numWriteWorkers)
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

	log.Println("\n--- Stream Load Test Summary (Basic Auth) ---")
	log.Printf("Successful Read Operations: %d (%.2f RPS)", readOps, readRPS)
	log.Printf("Failed Read Operations:     %d", failedReadOps)
	log.Printf("Successful Write Operations: %d (%.2f RPS)", writeOps, writeRPS)
	log.Printf("Failed Write Operations:    %d", failedWriteOps)
	log.Println("----------------------------------------------")

	log.Println("Verifying data integrity...")
	verifyDataIntegrity()
}

func readWorker(ctx context.Context, wg *sync.WaitGroup, client dbv1connect.DatabaseServiceClient) {
	defer wg.Done()
	authHeader := "Basic " + base64.StdEncoding.EncodeToString([]byte(username+":"+password))

	for {
		select {
		case <-ctx.Done():
			return
		default:
			req := connect.NewRequest(&dbv1.QueryRequest{
				Database: dbName,
				Sql:      "SELECT balance FROM accounts WHERE id = ?;",
				Parameters: &dbv1.Parameters{
					Positional: listValue(rand.Intn(numAccounts) + 1),
				},
			})
			req.Header().Set("Authorization", authHeader)

			stream, err := client.QueryStream(ctx, req)
			if err != nil {
				atomic.AddUint64(&failedReadOps, 1)
				continue
			}

			for stream.Receive() {
			}

			if err := stream.Err(); err != nil {
				atomic.AddUint64(&failedReadOps, 1)
			} else {
				atomic.AddUint64(&readOps, 1)
			}
		}
	}
}

func writeWorker(ctx context.Context, wg *sync.WaitGroup, client dbv1connect.DatabaseServiceClient) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			return
		default:
			if err := performOneWriteTransaction(ctx, client); err != nil {
				atomic.AddUint64(&failedWriteOps, 1)
				time.Sleep(time.Duration(10+rand.Intn(20)) * time.Millisecond)
			} else {
				atomic.AddUint64(&writeOps, 1)
			}
		}
	}
}

func performOneWriteTransaction(ctx context.Context, client dbv1connect.DatabaseServiceClient) error {
	fromID := rand.Intn(numAccounts) + 1
	toID := rand.Intn(numAccounts) + 1
	if fromID == toID {
		return errors.New("skipped transfer to self")
	}
	amount := 10.0

	stream := client.Transaction(ctx)
	defer stream.CloseResponse()

	if err := stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{
		Database: dbName,
		Mode:     dbv1.TransactionMode_TRANSACTION_MODE_IMMEDIATE,
	}}}); err != nil {
		return err
	}
	if _, err := stream.Receive(); err != nil {
		return err
	}

	update1 := &dbv1.TransactionRequest{
		Command: &dbv1.TransactionRequest_Query{
			Query: &dbv1.TransactionalQueryRequest{
				Sql:        "UPDATE accounts SET balance = balance - ? WHERE id = ?;",
				Parameters: &dbv1.Parameters{Positional: listValue(amount, fromID)},
			},
		},
	}
	if err := stream.Send(update1); err != nil {
		return err
	}
	if _, err := stream.Receive(); err != nil {
		return err
	}

	update2 := &dbv1.TransactionRequest{
		Command: &dbv1.TransactionRequest_Query{
			Query: &dbv1.TransactionalQueryRequest{
				Sql:        "UPDATE accounts SET balance = balance + ? WHERE id = ?;",
				Parameters: &dbv1.Parameters{Positional: listValue(amount, toID)},
			},
		},
	}
	if err := stream.Send(update2); err != nil {
		return err
	}
	if _, err := stream.Receive(); err != nil {
		return err
	}

	if err := stream.Send(&dbv1.TransactionRequest{Command: &dbv1.TransactionRequest_Commit{Commit: &emptypb.Empty{}}}); err != nil {
		return err
	}
	if _, err := stream.Receive(); err != nil {
		return err
	}

	if err := stream.CloseRequest(); err != nil {
		return err
	}

	for {
		if _, err := stream.Receive(); err != nil {
			if errors.Is(err, io.EOF) {
				return nil
			}
			return err
		}
	}
}

func verifyDataIntegrity() {
	var config *dbv1.DatabaseConfig
	if *enableCipher {
		config = &dbv1.DatabaseConfig{
			Name:        dbName,
			DbPath:      dbPath,
			IsEncrypted: true,
		}
	} else {
		config = &dbv1.DatabaseConfig{
			Name:   dbName,
			DbPath: dbPath,
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

	expectedSum := float64(numAccounts * 1000)

	log.Printf("Initial Expected Sum: %.2f", expectedSum)
	log.Printf("Final Actual Sum:     %.2f", finalSum)

	if finalSum > expectedSum-0.001 && finalSum < expectedSum+0.001 {
		log.Println("✅ Data Integrity Check PASSED.")
	} else {
		log.Println("❌ Data Integrity Check FAILED.")
	}
}

func listValue(vals ...any) *structpb.ListValue {
	l, _ := structpb.NewList(vals)
	return l
}
