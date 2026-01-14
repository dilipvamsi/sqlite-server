/**
 * @file service.go
 * @package servicesv1
 * @description The definitive implementation of the `DatabaseService` gRPC contract for the
 * Go-SQLite-Proxy. This service acts as a high-performance, type-safe bridge between gRPC
 * clients and underlying SQLite database files.
 *
 * ARCHITECTURAL DESIGN PHILOSOPHY:
 *
 * 1. STATELESS & STATEFUL HYBRID:
 *    The service supports both stateless operations (Unary Query, Server-Streaming Query)
 *    and stateful operations (Bidirectional Transaction Streaming). This allows clients
 *    to choose the right tool for the job: simple lookups vs. complex interactive workflows.
 *
 * 2. MEMORY SAFETY & PERFORMANCE:
 *    - "Chunked Streaming": Large result sets are never fully loaded into RAM. Instead,
 *      they are streamed in fixed-size batches (e.g., 500 rows). This ensures constant
 *      memory usage regardless of database size (O(1) memory per request).
 *    - "Zero-Copy Optimizations": Where possible (e.g., string to byte conversion),
 *      unsafe pointers are used to avoid unnecessary allocations.
 *
 * 3. TYPE SAFETY BRIDGE:
 *    SQLite is dynamically typed; gRPC is statically typed. This service implements a
 *    "Sparse Hint" system. It inspects SQLite column metadata at runtime and strictly
 *    maps dynamic types (e.g., "VARCHAR(255)") to proto Enums (e.g., COLUMN_TYPE_TEXT),
 *    ensuring clients receive strongly-typed data.
 *
 * 4. TRACEABILITY & OBSERVABILITY:
 *    - "Request IDs": Every stateless request is assigned a unique UUID (from client or server).
 *    - "Session IDs": Every stateful transaction stream is assigned a unique Session ID
 *      upon connection. This ID is returned to the client in the `Begin` response, allowing
 *      distributed tracing across client and server logs.
 *
 * 5. SAFETY & ERROR HANDLING:
 *    - "Fail-Fast Validation": Requests are validated against .proto constraints before
 *      touching the DB.
 *    - "Automatic Rollbacks": Heavy use of `defer` ensures that if a client disconnects,
 *      networks fail, or the server panics, any open transaction is strictly rolled back
 *      to prevent SQLite "Database Locked" errors.
 */

package servicesv1

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
	"unsafe"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"

	sqlite3 "github.com/mattn/go-sqlite3"

	"google.golang.org/protobuf/types/known/structpb"

	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"
	"sqlite-server/internal/sqldrivers"
)

// headerRequestID is the standard HTTP header key used for distributed tracing.
const headerRequestID = "X-Request-Id"

// querier is an interface abstraction for executing SQL commands.
//
// ARCHITECTURE NOTE:
// Both `*sql.DB` (connection pool) and `*sql.Tx` (single transaction) implement these
// methods. By defining this interface, our core helper functions (like `streamQueryResults`)
// become decoupled from the context. They can run queries statelessly or inside a transaction
// without code duplication.
type querier interface {
	// ExecContext executes a query without returning rows (INSERT, UPDATE, DELETE).
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
	// QueryContext executes a query that returns rows (SELECT).
	QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)
}

// ===================================================================================
// Transaction Registry & State Management
// ===================================================================================

// defaultTxTimeout is the fallback duration a transaction stays alive without activity.
const defaultTxTimeout = 30 * time.Second

// reaperInterval determines how often the background routine scans for "Zombie" transactions.
const reaperInterval = 5 * time.Second

/**
 * TxSession represents a stateful transaction context held in the server's memory.
 *
 * ARCHITECTURAL NOTE:
 * Unlike streaming where the connection *is* the session, ID-based transactions
 * require this struct to persist the *sql.Tx handle between HTTP requests.
 */
type TxSession struct {
	// The underlying SQLite transaction handle.
	Tx *sql.Tx

	// The absolute time when this session will be killed if no further activity occurs.
	// Updated on every TransactionQuery (Heartbeat).
	Expiry time.Time

	// Metadata for debugging and logging.
	DBName    string
	CreatedAt time.Time
}

// DbServer is the concrete implementation of the DatabaseServiceHandler interface.
// It acts as the singleton receiver for all incoming gRPC/Connect requests.
type DbServer struct {
	// UnimplementedDatabaseServiceHandler is embedded for forward compatibility.
	// If the .proto definition changes (e.g., a new method is added), this struct
	// ensures the server code still compiles, returning "Unimplemented" by default.
	dbv1connect.UnimplementedDatabaseServiceHandler

	// Dbs is a map registry of managed database connection pools.
	// Key: Logical database name (e.g., "users", "analytics").
	// Value: Thread-safe connection pool (*sql.DB).
	//
	// CONCURRENCY SAFETY:
	// This map is populated ONLY during initialization (`NewDbServer`) and is treated
	// as read-only during runtime. Therefore, it is safe for concurrent reads by
	// multiple goroutines without a RWMutex.
	Dbs map[string]*sql.DB

	// txRegistry maps a client-provided UUID to an active TxSession.
	// CONCURRENCY: Protected by txMu (RWMutex) to allow parallel reads (queries)
	// while ensuring atomic writes (begin/commit/cleanup).
	txRegistry map[string]*TxSession
	txMu       sync.RWMutex

	// shutdownCh signals the background reaper to stop during graceful shutdown.
	shutdownCh chan struct{}
}

// NewDbServer initializes the database server.
//
// FLOW:
//  1. Iterates over the provided configuration list.
//  2. Opens each SQLite database file (handling WAL mode, pragmas, etc.).
//  3. Pings the database to verify file permissions and validity.
//  4. "Fail-Fast": If ANY database fails to load, the application crashes intentionally (`log.Fatalf`).
//     It is better to crash at startup than to run in a partially broken state.
func NewDbServer(configs []sqldrivers.DBConfig) *DbServer {
	dbPools := make(map[string]*sql.DB)

	for _, config := range configs {
		db, err := sqldrivers.NewSqliteDb(config)
		if err != nil {
			log.Fatalf("Fatal: failed to open db '%s': %v", config.Name, err)
		}

		// Ping verifies the connection is actually usable.
		if err := db.Ping(); err != nil {
			log.Fatalf("Fatal: failed to connect to db '%s': %v", config.Name, err)
		}

		log.Printf("Successfully opened and connected to database '%s'", config.Name)
		dbPools[config.Name] = db
	}

	log.Printf("sqlite-server ready. Managing %d database(s).", len(dbPools))
	db := &DbServer{
		Dbs:        dbPools,
		txRegistry: make(map[string]*TxSession),
		shutdownCh: make(chan struct{}),
	}

	// Start the Background Reaper to clean up zombie transactions.
	// This runs entirely in the background for the lifecycle of the server.
	go db.runReaper()

	return db
}

// Stop signals the background reaper to exit, preventing goroutine leaks during shutdown.
func (s *DbServer) Stop() {
	close(s.shutdownCh)
}

/**
 * runReaper is the main loop for the background cleanup process.
 *
 * BEHAVIOR:
 * It wakes up every `reaperInterval` (5s) to scan the registry.
 * It is robust against panics (though none should occur here) and respects shutdown signals.
 */
func (s *DbServer) runReaper() {
	ticker := time.NewTicker(reaperInterval)
	defer ticker.Stop()

	for {
		select {
		case <-s.shutdownCh:
			return
		case <-ticker.C:
			s.cleanupExpiredTransactions()
		}
	}
}

/**
 * cleanupExpiredTransactions iterates over the registry and rolls back dead sessions.
 *
 * LOGIC:
 * 1. Acquires a Lock to safely iterate the map.
 * 2. Checks `Now > Session.Expiry`.
 * 3. If expired:
 *    a. Calls `Tx.Rollback()` to release SQLite locks immediately.
 *    b. Deletes the entry from the map to free Go memory.
 */
func (s *DbServer) cleanupExpiredTransactions() {
	s.txMu.Lock()
	defer s.txMu.Unlock()

	now := time.Now()
	for id, session := range s.txRegistry {
		if now.After(session.Expiry) {
			log.Printf("[Reaper] Rolling back expired transaction %s (DB: %s)", id, session.DBName)
			// We ignore the error here because the most likely error is "Tx already closed",
			// which is a success state for us.
			_ = session.Tx.Rollback()
			delete(s.txRegistry, id)
		}
	}
}

// ===================================================================================
// RPC Implementations
// ===================================================================================

// Query handles the unary `Query` RPC.
//
// USE CASE:
// Ideal for "Point Lookups" (e.g., GetUserByID) where the result is known to be small.
//
// BEHAVIOR:
// 1. Traceability: Ensures an X-Request-Id exists (generating one if missing).
// 2. Validation: Checks input constraints (SQL length, DB name format).
// 3. Execution: Buffers ALL results into memory.
// 4. Response: Returns the complete result set and echoes the Request ID in headers.
//
// WARNING:
// Do not use for "SELECT * FROM LargeTable". It will cause high memory pressure.
func (s *DbServer) Query(ctx context.Context, req *connect.Request[dbv1.QueryRequest]) (*connect.Response[dbv1.QueryResult], error) {
	// 1. Traceability: Extract or Generate Request ID
	reqID := ensureRequestID(req.Header())

	// 2. Validation: Strict Proto constraints
	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed for Query: %v", reqID, err)
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	msg := req.Msg

	// 3. Routing: Find the correct DB pool
	db, ok := s.Dbs[msg.Database]
	if !ok {
		// CodeNotFound (404) indicates client error (wrong DB name).
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", msg.Database))
	}

	// 4. Execution (Buffered)
	result, err := executeQueryAndBuffer(ctx, db, msg.Sql, msg.Parameters)
	if err != nil {
		log.Printf("[%s] Query execution failed: %v", reqID, err)
		return nil, makeUnaryError(err, msg.Sql)
	}

	// 5. Response Construction
	res := connect.NewResponse(result)
	// Crucial: Return the ID so the client can correlate logs.
	res.Header().Set(headerRequestID, reqID)

	return res, nil
}

// QueryStream handles the server-streaming `QueryStream` RPC.
//
// USE CASE:
// The default, safe choice for general queries, reports, and exports.
//
// BEHAVIOR:
//  1. Traceability: Ensures Request ID exists.
//  2. Execution: Delegates to `streamQueryResults`, which uses a `StreamWriter` to
//     send data in chunks (Header -> Batch... -> Complete).
//
// MEMORY SAFETY:
// This handler operates in O(1) memory space relative to the result size.
func (s *DbServer) QueryStream(ctx context.Context, req *connect.Request[dbv1.QueryRequest], stream *connect.ServerStream[dbv1.QueryResponse]) error {
	// 1. Traceability
	reqID := ensureRequestID(req.Header())
	// Send the ID in headers immediately. Even if the stream fails later,
	// the client has the ID to debug.
	stream.ResponseHeader().Set(headerRequestID, reqID)

	// 2. Validation
	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed for QueryStream: %v", reqID, err)
		return connect.NewError(connect.CodeInvalidArgument, err)
	}

	msg := req.Msg
	db, ok := s.Dbs[msg.Database]
	if !ok {
		return connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", msg.Database))
	}

	// 3. Setup Adapter: Wrap the specific ServerStream in our generic interface.
	writer := &statelessStreamWriter{stream: stream}

	// 4. Execution (Streaming)
	// This blocks until the query finishes or the client disconnects.
	err := streamQueryResults(ctx, db, msg.Sql, msg.Parameters, writer)
	if err != nil {
		log.Printf("[%s] Stream failed: %v", reqID, err)

		// Instead of returning a gRPC error (which kills the stream with headers),

		// 1. Create the proto error message
		errResp := makeStreamError(err, msg.Sql)

		// 2. Send it
		sendErr := stream.Send(&dbv1.QueryResponse{
			Response: &dbv1.QueryResponse_Error{Error: errResp},
		})

		if sendErr != nil {
			// If we can't send the error message, fallback to connection error
			return connect.NewError(connect.CodeInternal, sendErr)
		}

		// 3. Return nil to close the stream gracefully.
		return nil
	}

	return nil
}

// Transaction handles the bidirectional `Transaction` stream.
//
// USE CASE:
// Interactive workflows needing ACID guarantees (e.g., "Read balance, Calculate, Update balance").
//
// ARCHITECTURE - SESSION MANAGEMENT:
// Unlike unary calls, a stream is a long-lived session.
// 1. Connection: We generate a specific `traceID` (Session ID) immediately.
// 2. Logging: All server logs use this ID.
// 3. Handshake: When the client sends `Begin`, we return this ID in `BeginResponse.transaction_id`.
//
// ARCHITECTURE - STATE MACHINE:
// The handler implements a strict loop:
// - State: `tx` (active transaction).
// - Transitions: `Begin` (nil -> tx), `Commit`/`Rollback` (tx -> nil).
//
// SAFETY - AUTOMATIC ROLLBACK:
// A `defer` block guarantees that `tx.Rollback()` is called when the function exits.
// This handles:
// - Client disconnects (io.EOF).
// - Network errors.
// - Application Panics.
// - Logic Errors.
// This prevents "Zombie Transactions" from locking the SQLite file indefinitely.
func (s *DbServer) Transaction(ctx context.Context, stream *connect.BidiStream[dbv1.TransactionRequest, dbv1.TransactionResponse]) error {
	// 1. Generate Session Trace ID
	// We favor a server-generated ID here to uniquely identify this specific socket connection.
	traceID := genRequestID()

	log.Printf("[%s] Transaction stream connected", traceID)

	var tx *sql.Tx
	var transactionDB string

	// CRITICAL SAFETY NET:
	// Ensures the DB lock is released no matter how the function exits.
	defer func() {
		if tx != nil {
			log.Printf("[%s] Stream closing with active transaction, performing emergency rollback.", traceID)
			_ = tx.Rollback() // SQLite handles "already closed" errors gracefully.
		}
	}()

	// Event Loop
	for {
		// Read next message from client
		req, err := stream.Receive()
		if err != nil {
			if errors.Is(err, io.EOF) {
				// Client closed connection cleanly.
				return nil
			}
			log.Printf("[%s] Stream receive error: %v", traceID, err)
			return err
		}

		// Validate payload
		if err := protovalidate.Validate(req); err != nil {
			log.Printf("[%s] Validation failed: %v", traceID, err)
			return connect.NewError(connect.CodeInvalidArgument, err)
		}

		// Dispatch Command
		switch cmd := req.Command.(type) {

		// --- BEGIN COMMAND ---
		case *dbv1.TransactionRequest_Begin:
			if tx != nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: transaction already active"))
			}
			transactionDB = cmd.Begin.Database
			db, ok := s.Dbs[transactionDB]
			if !ok {
				return connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", transactionDB))
			}

			// Configure Locking Mode
			// SQLite "IMMEDIATE" and "EXCLUSIVE" help avoid busy loops in write-heavy scenarios.
			txOpts := &sql.TxOptions{ReadOnly: false}
			if cmd.Begin.Mode == dbv1.TransactionMode_TRANSACTION_MODE_EXCLUSIVE {
				// LevelSerializable is the closest Go SQL driver mapping to EXCLUSIVE.
				txOpts.Isolation = sql.LevelSerializable
			}

			tx, err = db.BeginTx(ctx, txOpts)
			if err != nil {
				log.Printf("[%s] Failed to begin transaction: %v", traceID, err)
				return connect.NewError(connect.CodeInternal, err)
			}

			// Send Success + Session ID
			// The client can now use `traceID` to debug server-side logs.
			_ = stream.Send(&dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_Begin{
					Begin: &dbv1.BeginResponse{
						Success:       true,
						TransactionId: traceID,
					},
				},
			})

		// --- QUERY COMMAND ---
		case *dbv1.TransactionRequest_Query:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: no active transaction"))
			}

			// Use the transactional writer adapter
			writer := &transactionalStreamWriter{stream: stream}

			// Execute Query
			// Note: We do NOT return the error here. If a query fails (e.g., syntax error),
			// we send an application-level error message and keep the stream/transaction alive.
			// The client decides whether to fix the query or Rollback.
			err := streamQueryResults(ctx, tx, cmd.Query.Sql, cmd.Query.Parameters, writer)
			if err != nil {
				log.Printf("[%s] Query error: %v", traceID, err)
				sendAppError(stream, traceID, err, cmd.Query.Sql)
			}

		// --- COMMIT COMMAND ---
		case *dbv1.TransactionRequest_Commit:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: no active transaction"))
			}

			// Attempt to persist changes to disk
			if err := tx.Commit(); err != nil {
				tx = nil // Mark nil so defer doesn't try to rollback
				log.Printf("[%s] Commit failed (disk I/O or constraint): %v", traceID, err)
				return connect.NewError(connect.CodeInternal, err)
			}

			tx = nil // Successfully committed
			log.Printf("[%s] Transaction committed successfully", traceID)

			_ = stream.Send(&dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_Commit{Commit: &dbv1.CommitResponse{Success: true}},
			})
			return nil // End of workflow

		// --- ROLLBACK COMMAND ---
		case *dbv1.TransactionRequest_Rollback:
			if tx != nil {
				_ = tx.Rollback()
				tx = nil
			}
			log.Printf("[%s] Client requested rollback", traceID)
			_ = stream.Send(&dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_Rollback{Rollback: &dbv1.RollbackResponse{Success: true}},
			})
			return nil // End of workflow
		}
	}
}

// ExecuteTransaction handles the unary `ExecuteTransaction` RPC.
//
// USE CASE:
// Atomic scripts (e.g., "Migration V1", "Seeding Data").
//
// BEHAVIOR:
// 1. Opens a Transaction.
// 2. Executes a list of commands sequentially.
// 3. Atomicity: If ANY command fails, the ENTIRE transaction is rolled back.
// 4. Returns a list of results, one for each command.
//
// TRACING:
// Uses Request ID from headers or generates one.
func (s *DbServer) ExecuteTransaction(ctx context.Context, req *connect.Request[dbv1.ExecuteTransactionRequest]) (*connect.Response[dbv1.ExecuteTransactionResponse], error) {
	reqID := ensureRequestID(req.Header())

	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed: %v", reqID, err)
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	requests := req.Msg.Requests
	if len(requests) == 0 {
		return connect.NewResponse(&dbv1.ExecuteTransactionResponse{}), nil
	}

	var tx *sql.Tx
	var allResponses []*dbv1.TransactionResponse

	// Safety: Ensure rollback on failure
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	// Sequential Execution Loop
	for _, request := range requests {

		// 1. Handle BEGIN (Must be first)
		if beginCmd := request.GetBegin(); beginCmd != nil {
			if tx != nil {
				return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("transaction already begun"))
			}
			db, ok := s.Dbs[beginCmd.Database]
			if !ok {
				return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", beginCmd.Database))
			}

			var err error
			tx, err = db.Begin()
			if err != nil {
				return nil, connect.NewError(connect.CodeInternal, err)
			}

			// For scripts, we return the RequestID as the TransactionID for consistency
			allResponses = append(allResponses, &dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_Begin{
					Begin: &dbv1.BeginResponse{
						Success:       true,
						TransactionId: reqID,
					},
				},
			})
			continue
		}

		if tx == nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("first command must be 'begin'"))
		}

		// 2. Handle QUERY
		if queryCmd := request.GetQuery(); queryCmd != nil {
			// Helper executes query and buffers result into a simulation of the streaming response
			queryResponses, err := executeBufferedQueryInTransaction(ctx, tx, queryCmd)
			if err != nil {
				log.Printf("[%s] Script Query failed: %v", reqID, err)
				// Append Error and return immediately. Defer will rollback.
				allResponses = append(allResponses, &dbv1.TransactionResponse{
					Response: &dbv1.TransactionResponse_Error{Error: &dbv1.ErrorResponse{Message: err.Error(), FailedSql: queryCmd.Sql}},
				})
				return connect.NewResponse(&dbv1.ExecuteTransactionResponse{Responses: allResponses}), nil
			}
			allResponses = append(allResponses, queryResponses...)
			continue
		}

		// 3. Handle COMMIT
		if request.GetCommit() != nil {
			if err := tx.Commit(); err != nil {
				return nil, connect.NewError(connect.CodeInternal, err)
			}
			tx = nil // Prevent defer rollback
			allResponses = append(allResponses, &dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_Commit{Commit: &dbv1.CommitResponse{Success: true}},
			})
			continue
		}

		// 4. Handle ROLLBACK
		if request.GetRollback() != nil {
			_ = tx.Rollback()
			tx = nil // Prevent defer rollback
			allResponses = append(allResponses, &dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_Rollback{Rollback: &dbv1.RollbackResponse{Success: true}},
			})
			continue
		}
	}

	res := connect.NewResponse(&dbv1.ExecuteTransactionResponse{Responses: allResponses})
	res.Header().Set(headerRequestID, reqID)
	return res, nil
}

// ===================================================================================
// Unary (ID-Based) Transaction RPCs
// ===================================================================================

/**
 * BeginTransaction starts a stateful transaction session.
 *
 * RPC FLOW:
 * 1. Validates the request and ensures the DB exists.
 * 2. Opens a `sql.Tx` with the requested Isolation Level (Deferred/Immediate/Exclusive).
 * 3. Generates a secure random Session ID (UUIDv7).
 * 4. Stores the Tx in `txRegistry` with a Timeout.
 * 5. Returns the ID to the client.
 */
func (s *DbServer) BeginTransaction(ctx context.Context, req *connect.Request[dbv1.BeginTransactionRequest]) (*connect.Response[dbv1.BeginTransactionResponse], error) {
	reqID := ensureRequestID(req.Header())
	msg := req.Msg

	if err := protovalidate.Validate(msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	db, ok := s.Dbs[msg.Database]
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", msg.Database))
	}

	// 1. Parse Timeout (Defaults to 30s if invalid/empty)
	timeout := defaultTxTimeout
	if msg.Timeout != "" {
		if d, err := time.ParseDuration(msg.Timeout); err == nil {
			timeout = d
		}
	}

	// 2. Map Proto Mode to Go SQL Isolation
	txOpts := &sql.TxOptions{ReadOnly: false}
	if msg.Mode == dbv1.TransactionMode_TRANSACTION_MODE_EXCLUSIVE {
		txOpts.Isolation = sql.LevelSerializable
	}

	// 3. Begin Database Transaction
	tx, err := db.BeginTx(ctx, txOpts)
	if err != nil {
		log.Printf("[%s] BeginTransaction failed: %v", reqID, err)
		return nil, makeUnaryError(err, "BEGIN")
	}

	// 4. Register Session in Memory
	txID := genRequestID()
	expiry := time.Now().Add(timeout)

	s.txMu.Lock()
	s.txRegistry[txID] = &TxSession{
		Tx:        tx,
		Expiry:    expiry,
		DBName:    msg.Database,
		CreatedAt: time.Now(),
	}
	s.txMu.Unlock()

	log.Printf("[%s] Started transaction session %s (timeout: %s)", reqID, txID, timeout)

	return connect.NewResponse(&dbv1.BeginTransactionResponse{
		TransactionId:   txID,
		ExpiresAtUnixMs: expiry.UnixMilli(),
	}), nil
}

/**
 * TransactionQuery executes a SQL statement within an existing transaction context.
 *
 * HEARTBEAT MECHANISM:
 * Every successful call to this RPC extends the transaction's TTL by `defaultTxTimeout`.
 * This allows long-running workflows to stay alive as long as they are active.
 *
 * ERROR HANDLING:
 * If a SQL error occurs (e.g., Syntax Error), we return the error details but
 * **DO NOT** automatically rollback the transaction. This gives the client the choice
 * to retry or manually rollback, mirroring standard SQL behavior.
 */
func (s *DbServer) TransactionQuery(ctx context.Context, req *connect.Request[dbv1.TransactionQueryRequest]) (*connect.Response[dbv1.QueryResult], error) {
	reqID := ensureRequestID(req.Header())
	msg := req.Msg

	if err := protovalidate.Validate(msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	// 1. Registry Lookup
	s.txMu.Lock()
	session, exists := s.txRegistry[msg.TransactionId]
	if !exists {
		s.txMu.Unlock()
		return nil, connect.NewError(connect.CodeNotFound, errors.New("transaction id not found or expired"))
	}

	// 2. Lazy Expiry Check
	// Even if the reaper hasn't run yet, we enforce timeout strictly here.
	if time.Now().After(session.Expiry) {
		delete(s.txRegistry, msg.TransactionId)
		s.txMu.Unlock()
		_ = session.Tx.Rollback()
		return nil, connect.NewError(connect.CodeAborted, errors.New("transaction timed out"))
	}

	// 3. Heartbeat: Extend the session life
	session.Expiry = time.Now().Add(defaultTxTimeout)
	tx := session.Tx
	s.txMu.Unlock()

	// 4. Execution
	result, err := executeQueryAndBuffer(ctx, tx, msg.Sql, msg.Parameters)
	if err != nil {
		log.Printf("[%s] TransactionQuery failed: %v", reqID, err)
		// Return error logic (mapped to SqliteCode Enum)
		return nil, makeUnaryError(err, msg.Sql)
	}

	res := connect.NewResponse(result)
	res.Header().Set(headerRequestID, reqID)
	return res, nil
}

/**
 * CommitTransaction finalizes the transaction and releases resources.
 *
 * MEMORY SAFETY:
 * Regardless of whether the DB Commit succeeds or fails, the session is
 * removed from `txRegistry`. A failed commit means the transaction is broken
 * and cannot be reused.
 */
func (s *DbServer) CommitTransaction(ctx context.Context, req *connect.Request[dbv1.TransactionControlRequest]) (*connect.Response[dbv1.TransactionControlResponse], error) {
	msg := req.Msg
	if err := protovalidate.Validate(msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	s.txMu.Lock()
	session, exists := s.txRegistry[msg.TransactionId]
	if !exists {
		s.txMu.Unlock()
		return nil, connect.NewError(connect.CodeNotFound, errors.New("transaction id not found or expired"))
	}

	// CRITICAL: Always remove from registry to prevent memory leaks.
	// Once we attempt to commit, this session ID is consumed.
	delete(s.txRegistry, msg.TransactionId)
	s.txMu.Unlock()

	// Perform DB Commit
	if err := session.Tx.Commit(); err != nil {
		log.Printf("Commit failed for session %s: %v", msg.TransactionId, err)
		return nil, makeUnaryError(err, "COMMIT")
	}

	return connect.NewResponse(&dbv1.TransactionControlResponse{Success: true}), nil
}

/**
 * RollbackTransaction aborts the transaction.
 *
 * IDEMPOTENCY:
 * If the transaction ID is already gone (e.g., reaped by timeout or already rolled back),
 * this function returns `Success: true`. This prevents client errors when racing against timeouts.
 */
func (s *DbServer) RollbackTransaction(ctx context.Context, req *connect.Request[dbv1.TransactionControlRequest]) (*connect.Response[dbv1.TransactionControlResponse], error) {
	msg := req.Msg
	if err := protovalidate.Validate(msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	s.txMu.Lock()
	session, exists := s.txRegistry[msg.TransactionId]
	if exists {
		// Clean up memory and DB connection
		delete(s.txRegistry, msg.TransactionId)
		_ = session.Tx.Rollback()
	}
	s.txMu.Unlock()

	return connect.NewResponse(&dbv1.TransactionControlResponse{Success: true}), nil
}

// ===================================================================================
// Internal Helpers
// ===================================================================================

// genRequestID creates a Version 7 UUID (time-ordered) as defined in RFC 9562.
//
// WHY UUIDv7?
// Unlike random UUIDv4, v7 is time-ordered (Unix Timestamp Milliseconds).
// This makes logs easier to sort chronologically and significantly improves
// database indexing performance if these IDs are ever stored as primary keys.
//
// IMPLEMENTATION:
// We strictly follow the bit-layout defined in the RFC without importing
// external libraries like 'google/uuid' to keep the service lightweight.
func genRequestID() string {
	var b [16]byte

	// 1. Fill with cryptographically secure random bytes
	// We read 16 bytes first to cover the "rand_a" and "rand_b" fields.
	if _, err := rand.Read(b[:]); err != nil {
		// Fallback for extreme theoretical edge cases (e.g. OS entropy failure),
		// ensuring we never crash just because we couldn't make an ID.
		return fmt.Sprintf("fallback-%d", time.Now().UnixNano())
	}

	// 2. Encode Unix Timestamp (48 bits) into the first 6 bytes (Big Endian)
	// UUIDv7 uses milliseconds since Unix Epoch.
	ts := uint64(time.Now().UnixMilli())
	b[0] = byte(ts >> 40)
	b[1] = byte(ts >> 32)
	b[2] = byte(ts >> 24)
	b[3] = byte(ts >> 16)
	b[4] = byte(ts >> 8)
	b[5] = byte(ts)

	// 3. Set Version (0111 = 7) in the high 4 bits of octet 6
	// We preserve the lower 4 random bits (part of rand_a).
	b[6] = (b[6] & 0x0F) | 0x70

	// 4. Set Variant (10xx) in the high 2 bits of octet 8
	// We preserve the lower 6 random bits (part of rand_b).
	b[8] = (b[8] & 0x3F) | 0x80

	// 5. Return canonical string representation (8-4-4-4-12)
	// Example: 018c6b1a-2b30-7980-9c23-456789abcdef
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}

// ensureRequestID retrieves the X-Request-Id from headers or generates a new one.
// Returns the final ID to be used for logging and response headers.
func ensureRequestID(headers http.Header) string {
	id := headers.Get(headerRequestID)
	if id == "" {
		return genRequestID()
	}
	return id
}

// UnsafeStringToBytesNoCopy converts a string to a byte slice without allocation.
//
// PERFORMANCE:
// Standard `[]byte(str)` allocates new memory and copies the data.
// This function relies on `unsafe` to reuse the string's underlying data array.
//
// SAFETY WARNING:
// The returned byte slice is immutable. Attempting to modify it will panic or corrupt memory.
func UnsafeStringToBytesNoCopy(s string) []byte {
	return unsafe.Slice(unsafe.StringData(s), len(s))
}

// StreamWriter is an interface that abstracts the mechanism of sending query results.
//
// DESIGN PATTERN: Dependency Inversion.
// By coding `streamQueryResults` against this interface, we can use the same
// execution logic for:
// 1. `QueryStream` (ServerStream)
// 2. `Transaction` (BidiStream)
// 3. Mocks (Unit Tests)
type StreamWriter interface {
	SendHeader(*dbv1.QueryResultHeader) error
	SendRowBatch(*dbv1.QueryResultRowBatch) error
	SendDMLResult(*dbv1.DMLResult) error
	SendComplete(*dbv1.ExecutionStats) error
}

// --- StreamWriter Concrete Implementations ---

// statelessStreamWriter adapts a `QueryStream` (ServerStream).
type statelessStreamWriter struct {
	stream *connect.ServerStream[dbv1.QueryResponse]
}

func (w *statelessStreamWriter) SendHeader(h *dbv1.QueryResultHeader) error {
	return w.stream.Send(&dbv1.QueryResponse{Response: &dbv1.QueryResponse_Header{Header: h}})
}
func (w *statelessStreamWriter) SendRowBatch(b *dbv1.QueryResultRowBatch) error {
	return w.stream.Send(&dbv1.QueryResponse{Response: &dbv1.QueryResponse_Batch{Batch: b}})
}
func (w *statelessStreamWriter) SendDMLResult(r *dbv1.DMLResult) error {
	return w.stream.Send(&dbv1.QueryResponse{Response: &dbv1.QueryResponse_Dml{Dml: r}})
}
func (w *statelessStreamWriter) SendComplete(s *dbv1.ExecutionStats) error {
	return w.stream.Send(&dbv1.QueryResponse{Response: &dbv1.QueryResponse_Complete{Complete: &dbv1.QueryComplete{Stats: s}}})
}

// transactionalStreamWriter adapts a `Transaction` (BidiStream).
type transactionalStreamWriter struct {
	stream *connect.BidiStream[dbv1.TransactionRequest, dbv1.TransactionResponse]
}

func (w *transactionalStreamWriter) SendHeader(h *dbv1.QueryResultHeader) error {
	return w.stream.Send(&dbv1.TransactionResponse{Response: &dbv1.TransactionResponse_Header{Header: h}})
}
func (w *transactionalStreamWriter) SendRowBatch(b *dbv1.QueryResultRowBatch) error {
	return w.stream.Send(&dbv1.TransactionResponse{Response: &dbv1.TransactionResponse_Batch{Batch: b}})
}
func (w *transactionalStreamWriter) SendDMLResult(r *dbv1.DMLResult) error {
	return w.stream.Send(&dbv1.TransactionResponse{Response: &dbv1.TransactionResponse_Dml{Dml: r}})
}
func (w *transactionalStreamWriter) SendComplete(s *dbv1.ExecutionStats) error {
	return w.stream.Send(&dbv1.TransactionResponse{Response: &dbv1.TransactionResponse_Complete{Complete: &dbv1.QueryComplete{Stats: s}}})
}

// --- Parameter Handling ---

// convertParameters transforms the Proto `Parameters` message into a format
// compatible with the Go `database/sql` driver.
//
// LOGIC:
// 1. Handles `oneof`: Detects if parameters are Positional (Array) or Named (Map).
// 2. Applies Hints: Uses `applyHint` to convert generic types (string) to specific types (bytes).
func convertParameters(params *dbv1.Parameters) ([]interface{}, error) {
	if params == nil {
		return nil, nil
	}
	switch v := params.Values.(type) {
	case *dbv1.Parameters_Positional:
		rawList := v.Positional.AsSlice()
		converted := make([]interface{}, len(rawList))
		hints := params.PositionalHints
		for i, val := range rawList {
			hint, hasHint := hints[int32(i)]
			converted[i] = applyHint(val, hint, hasHint)
		}
		return converted, nil
	case *dbv1.Parameters_Named:
		rawMap := v.Named.AsMap()
		converted := make([]interface{}, 0, len(rawMap))
		hints := params.NamedHints
		for key, val := range rawMap {
			hint, hasHint := hints[key]
			// Named args in sql usually don't want the prefix (:, @, $) in the name field
			cleanKey := strings.TrimLeft(key, ":@$")
			finalVal := applyHint(val, hint, hasHint)
			converted = append(converted, sql.Named(cleanKey, finalVal))
		}
		return converted, nil
	default:
		return nil, nil
	}
}

// applyHint performs type coercion based on the "Sparse Hint" provided by the client.
// This solves the problem of JSON (and Proto Structs) lacking native support for BLOBs and Integers.
func applyHint(val interface{}, hint dbv1.ColumnType, hasHint bool) interface{} {
	if !hasHint || val == nil {
		return val
	}
	switch hint {
	case dbv1.ColumnType_COLUMN_TYPE_BLOB:
		// Client sends BLOB as Base64 String -> We decode to []byte
		if strVal, ok := val.(string); ok {
			if decoded, err := base64.StdEncoding.DecodeString(strVal); err == nil {
				return decoded
			}
		}
	case dbv1.ColumnType_COLUMN_TYPE_INTEGER:
		// Client sends INT as JSON Number (float64) -> We cast to int64
		if floatVal, ok := val.(float64); ok {
			return int64(floatVal)
		}
	}
	return val
}

// resolveColumnTypes inspects the `sql.Rows` metadata to map SQLite types to Proto Enums.
// This allows the client to know if "123" is a String or an Integer.
func resolveColumnTypes(rows *sql.Rows) ([]dbv1.ColumnType, error) {
	columnTypes, err := rows.ColumnTypes()
	if err != nil {
		return nil, err
	}
	results := make([]dbv1.ColumnType, len(columnTypes))
	for i, ct := range columnTypes {
		dbType := strings.ToUpper(ct.DatabaseTypeName())
		// Heuristic mapping of SQLite dynamic types
		switch {
		case strings.Contains(dbType, "INT"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_INTEGER
		case strings.Contains(dbType, "CHAR") || strings.Contains(dbType, "TEXT") || strings.Contains(dbType, "CLOB"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_TEXT
		case strings.Contains(dbType, "BLOB") || strings.Contains(dbType, "BINARY"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_BLOB
		case strings.Contains(dbType, "REAL") || strings.Contains(dbType, "FLOA") || strings.Contains(dbType, "DOUB"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_FLOAT
		case strings.Contains(dbType, "BOOL"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_BOOLEAN
		case strings.Contains(dbType, "DATE") || strings.Contains(dbType, "TIME"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_DATE
		case strings.Contains(dbType, "NULL"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_NULL
		default:
			results[i] = dbv1.ColumnType_COLUMN_TYPE_UNSPECIFIED
		}
	}
	return results, nil
}

// --- Execution Logic ---

// streamQueryResults is the generic engine for executing queries and streaming results.
//
// ALGORITHM:
//  1. Convert Parameters.
//  2. Determine Query Type (Select vs DML).
//  3. If DML: Execute, return rows affected, exit.
//  4. If SELECT:
//     a. Fetch Schema.
//     b. Send Header.
//     c. Iterate Rows (buffering up to `chunkSize`).
//     d. Flush Batches.
//     e. Send Complete w/ Stats.
func streamQueryResults(ctx context.Context, q querier, sqlQuery string, paramsMsg *dbv1.Parameters, writer StreamWriter) error {
	startTime := time.Now()

	params, err := convertParameters(paramsMsg)
	if err != nil {
		return fmt.Errorf("parameter error: %w", err)
	}

	// Heuristic to detect READ vs WRITE queries
	isSelect := strings.HasPrefix(strings.TrimSpace(strings.ToUpper(sqlQuery)), "SELECT")

	// --- WRITE PATH (DML) ---
	if !isSelect {
		res, err := q.ExecContext(ctx, sqlQuery, params...)
		if err != nil {
			return err
		}
		rowsAffected, _ := res.RowsAffected()
		lastInsertId, _ := res.LastInsertId()
		return writer.SendDMLResult(&dbv1.DMLResult{RowsAffected: rowsAffected, LastInsertId: lastInsertId})
	}

	// --- READ PATH (Streaming) ---
	rows, err := q.QueryContext(ctx, sqlQuery, params...)
	if err != nil {
		return err
	}
	// CLEANUP: Ensures connection is returned to pool even if panic occurs
	defer rows.Close()

	cols, err := rows.Columns()
	if err != nil {
		return err
	}
	colTypes, err := resolveColumnTypes(rows)
	if err != nil {
		return err
	}

	// Step 1: Send Header
	if err := writer.SendHeader(&dbv1.QueryResultHeader{Columns: cols, ColumnTypes: colTypes}); err != nil {
		return err
	}

	// Step 2: Stream Rows
	const chunkSize = 500 // Tunable: Balance between memory usage and network overhead
	rowBuffer := make([]*structpb.ListValue, 0, chunkSize)

	// Pre-allocate scanning destinations to avoid allocation in hot loop
	scanValues := make([]interface{}, len(cols))
	scanArgs := make([]interface{}, len(scanValues))
	for i := range scanValues {
		scanArgs[i] = &scanValues[i]
	}

	var rowsReadCount int64 = 0
	for rows.Next() {
		if err := rows.Scan(scanArgs...); err != nil {
			return err
		}
		rowsReadCount++

		// Convert row to Proto ListValue
		protoRow, err := structpb.NewList(scanValues)
		if err != nil {
			return fmt.Errorf("failed to convert row to proto: %w", err)
		}

		rowBuffer = append(rowBuffer, protoRow)

		// Flush Batch
		if len(rowBuffer) >= chunkSize {
			if err := writer.SendRowBatch(&dbv1.QueryResultRowBatch{Rows: rowBuffer}); err != nil {
				return err
			}
			rowBuffer = make([]*structpb.ListValue, 0, chunkSize)
		}
	}
	// Flush Remainder
	if len(rowBuffer) > 0 {
		if err := writer.SendRowBatch(&dbv1.QueryResultRowBatch{Rows: rowBuffer}); err != nil {
			return err
		}
	}

	// Step 3: Complete
	stats := &dbv1.ExecutionStats{
		DurationMs: float64(time.Since(startTime).Milliseconds()),
		RowsRead:   rowsReadCount,
	}
	return writer.SendComplete(stats)
}

// executeQueryAndBuffer executes a query and returns the FULL result set in memory.
// Used by the unary `Query` RPC.
//
// MEMORY WARNING:
// This function allocates memory proportional to the result set size.
// It is intended for small, precise lookups only.
func executeQueryAndBuffer(ctx context.Context, q querier, sqlQuery string, paramsMsg *dbv1.Parameters) (*dbv1.QueryResult, error) {
	startTime := time.Now()

	params, err := convertParameters(paramsMsg)
	if err != nil {
		return nil, fmt.Errorf("parameter error: %w", err)
	}

	isSelect := strings.HasPrefix(strings.TrimSpace(strings.ToUpper(sqlQuery)), "SELECT")

	if isSelect {
		rows, err := q.QueryContext(ctx, sqlQuery, params...)
		if err != nil {
			return nil, err
		}
		defer rows.Close()

		columns, err := rows.Columns()
		if err != nil {
			return nil, err
		}
		colTypes, err := resolveColumnTypes(rows)
		if err != nil {
			return nil, err
		}

		selectResult := &dbv1.SelectResult{
			Columns:     columns,
			ColumnTypes: colTypes,
		}

		scanValues := make([]interface{}, len(columns))
		scanArgs := make([]interface{}, len(scanValues))
		for i := range scanValues {
			scanArgs[i] = &scanValues[i]
		}
		var rowsRead int64
		for rows.Next() {
			if err := rows.Scan(scanArgs...); err != nil {
				return nil, err
			}
			rowsRead++
			protoRow, err := structpb.NewList(scanValues)
			if err != nil {
				return nil, fmt.Errorf("failed to convert row to proto: %w", err)
			}
			selectResult.Rows = append(selectResult.Rows, protoRow)
		}
		stats := &dbv1.ExecutionStats{
			DurationMs: float64(time.Since(startTime).Milliseconds()),
			RowsRead:   rowsRead,
		}
		return &dbv1.QueryResult{
			Result: &dbv1.QueryResult_Select{Select: selectResult},
			Stats:  stats,
		}, nil
	} else {
		res, err := q.ExecContext(ctx, sqlQuery, params...)
		if err != nil {
			return nil, err
		}
		rowsAffected, _ := res.RowsAffected()
		lastInsertId, _ := res.LastInsertId()
		stats := &dbv1.ExecutionStats{
			DurationMs:  float64(time.Since(startTime).Milliseconds()),
			RowsWritten: rowsAffected,
		}
		return &dbv1.QueryResult{
			Result: &dbv1.QueryResult_Dml{Dml: &dbv1.DMLResult{RowsAffected: rowsAffected, LastInsertId: lastInsertId}},
			Stats:  stats,
		}, nil
	}
}

// executeBufferedQueryInTransaction executes a query using a `tx` but formats the result
// to mimic the `Transaction` streaming response (Header, Batch, Complete).
// This allows `ExecuteTransaction` to share the same response Proto structures.
func executeBufferedQueryInTransaction(ctx context.Context, tx *sql.Tx, query *dbv1.TransactionalQueryRequest) ([]*dbv1.TransactionResponse, error) {
	startTime := time.Now()
	params, err := convertParameters(query.Parameters)
	if err != nil {
		return nil, fmt.Errorf("parameter error: %w", err)
	}

	isSelect := strings.HasPrefix(strings.TrimSpace(strings.ToUpper(query.Sql)), "SELECT")

	if !isSelect {
		res, err := tx.ExecContext(ctx, query.Sql, params...)
		if err != nil {
			return nil, err
		}
		rowsAffected, _ := res.RowsAffected()
		lastInsertId, _ := res.LastInsertId()
		response := &dbv1.TransactionResponse{Response: &dbv1.TransactionResponse_Dml{Dml: &dbv1.DMLResult{RowsAffected: rowsAffected, LastInsertId: lastInsertId}}}
		return []*dbv1.TransactionResponse{response}, nil
	}

	rows, err := tx.QueryContext(ctx, query.Sql, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	colTypes, err := resolveColumnTypes(rows)
	if err != nil {
		return nil, err
	}

	var responses []*dbv1.TransactionResponse
	// 1. Header
	header := &dbv1.QueryResultHeader{Columns: columns, ColumnTypes: colTypes}
	responses = append(responses, &dbv1.TransactionResponse{Response: &dbv1.TransactionResponse_Header{Header: header}})

	// 2. Buffer Rows
	var allRows []*structpb.ListValue
	scanValues := make([]interface{}, len(columns))
	scanArgs := make([]interface{}, len(scanValues))
	for i := range scanValues {
		scanArgs[i] = &scanValues[i]
	}
	var rowsRead int64
	for rows.Next() {
		if err := rows.Scan(scanArgs...); err != nil {
			return nil, err
		}
		rowsRead++
		protoRow, err := structpb.NewList(scanValues)
		if err != nil {
			return nil, err
		}
		allRows = append(allRows, protoRow)
	}
	// 3. Batch
	if len(allRows) > 0 {
		batch := &dbv1.QueryResultRowBatch{Rows: allRows}
		responses = append(responses, &dbv1.TransactionResponse{Response: &dbv1.TransactionResponse_Batch{Batch: batch}})
	}
	// 4. Complete
	stats := &dbv1.ExecutionStats{
		DurationMs: float64(time.Since(startTime).Milliseconds()),
		RowsRead:   rowsRead,
	}
	responses = append(responses, &dbv1.TransactionResponse{Response: &dbv1.TransactionResponse_Complete{Complete: &dbv1.QueryComplete{Stats: stats}}})
	return responses, nil
}

// sendAppError writes an application-level error message to the stream.
// Used for "Soft Errors" (e.g. SQL Syntax) where the stream protocol should remain intact.
func sendAppError(stream *connect.BidiStream[dbv1.TransactionRequest, dbv1.TransactionResponse], reqID string, err error, sql string) {
	errResp := makeStreamError(err, sql)

	res := &dbv1.TransactionResponse{
		// ResponseID isn't in proto, assuming logic from previous context
		Response: &dbv1.TransactionResponse_Error{Error: errResp},
	}
	if err := stream.Send(res); err != nil {
		log.Printf("Failed to send error to client: %v", err)
	}
}

// --- Error Handling Logic ---

// extractSqliteCode attempts to cast the error to a sqlite3.Error and return its extended code.
// Returns 0 if it's not a sqlite error.
func extractSqliteCode(err error) dbv1.SqliteCode {
	var sqliteErr sqlite3.Error
	if errors.As(err, &sqliteErr) {
		// Use ExtendedCode for more granular detail (e.g. SQLITE_CONSTRAINT_UNIQUE)
		return dbv1.SqliteCode(sqliteErr.ExtendedCode)
	}
	return 0
}

// sqliteToConnectCode maps SQLite error codes to appropriate gRPC/Connect codes.
func sqliteToConnectCode(sqliteCode dbv1.SqliteCode) connect.Code {
	// Mask off extended bits to check primary codes if needed, or check specific extended codes.
	// Reference: https://www.sqlite.org/rescode.html
	primary := sqliteCode & 0xFF

	switch primary {
	case 1: // SQLITE_ERROR (SQL error or missing database)
		return connect.CodeInvalidArgument
	case 19: // SQLITE_CONSTRAINT (Abort due to constraint violation)
		return connect.CodeAlreadyExists // or CodeFailedPrecondition
	case 5, 6: // SQLITE_BUSY, SQLITE_LOCKED
		return connect.CodeResourceExhausted // or CodeAborted
	case 11: // SQLITE_CORRUPT
		return connect.CodeDataLoss
	default:
		return connect.CodeInternal
	}
}

// makeUnaryError wraps the error in a connect.Error and attaches the
// dbv1.ErrorResponse as detailed metadata. This allows the client to see
// the 'sqlite_error_code' even in unary RPCs.
func makeUnaryError(err error, sql string) *connect.Error {
	code := extractSqliteCode(err)
	connectCode := connect.CodeInternal

	// If we successfully extracted a code, try to map it to a better HTTP status
	if code != 0 {
		connectCode = sqliteToConnectCode(code)
	}

	// Create the base Connect error
	connectErr := connect.NewError(connectCode, err)

	// Construct the structured ErrorResponse defined in your proto
	detailVal := &dbv1.ErrorResponse{
		Message:         err.Error(),
		FailedSql:       sql,
		SqliteErrorCode: code,
	}

	// Attach it as a "Detail" (standard gRPC error model)
	if detail, detailErr := connect.NewErrorDetail(detailVal); detailErr == nil {
		connectErr.AddDetail(detail)
	} else {
		log.Printf("Failed to attach error detail: %v", detailErr)
	}

	return connectErr
}

// makeStreamError helper to create the ErrorResponse message for streams
func makeStreamError(err error, sql string) *dbv1.ErrorResponse {
	return &dbv1.ErrorResponse{
		Message:         err.Error(),
		FailedSql:       sql,
		SqliteErrorCode: extractSqliteCode(err),
	}
}

func LoggingInterceptor() connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			start := time.Now()

			// Execute the handler
			resp, err := next(ctx, req)

			duration := time.Since(start)
			status := "OK"
			if err != nil {
				status = "ERROR"
			}

			// Log: [OK] /db.v1.DatabaseService/Query (12ms)
			log.Printf("[%s] %s (%v)", status, req.Spec().Procedure, duration)

			return resp, err
		}
	}
}
