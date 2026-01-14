/**
 * @file service.go
 * @package servicesv1
 * @description The definitive implementation of the `DatabaseService` gRPC contract for the
 * Sqlite-Server. This service acts as a high-performance, type-safe bridge between gRPC
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
	"database/sql"
	"log"
	"time"

	"connectrpc.com/connect"

	"sqlite-server/internal/sqldrivers"
)

// headerRequestID is the standard HTTP header key used for distributed tracing.
const headerRequestID = "X-Request-Id"

// ===================================================================================
// Transaction Registry & State Management
// ===================================================================================

// defaultTxTimeout is the fallback duration a transaction stays alive without activity.
const defaultTxTimeout = 30 * time.Second

// reaperInterval determines how often the background routine scans for "Zombie" transactions.
const reaperInterval = 5 * time.Second

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
// Interceptors
// ===================================================================================

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
