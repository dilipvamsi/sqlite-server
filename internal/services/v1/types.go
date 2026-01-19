package servicesv1

import (
	"context"
	"database/sql"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"
	"sync"
	"time"
)

// querier is an interface abstraction for executing SQL commands.
//
// ARCHITECTURE NOTE:
//   Both `*sql.DB` (connection pool) and `*sql.Tx` (single transaction) implement these
//   methods. By defining this interface, our core helper functions (like `streamQueryResults`)
//   become decoupled from the context. They can run queries statelessly or inside a transaction
//   without code duplication.
type querier interface {
	// ExecContext executes a query without returning rows (INSERT, UPDATE, DELETE).
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
	// QueryContext executes a query that returns rows (SELECT).
	QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)
}

// TxSession represents a stateful transaction context held in the server's memory.
//
// ARCHITECTURAL NOTE:
//   Unlike streaming where the connection *is* the session, ID-based transactions
//   require this struct to persist the *sql.Tx handle between HTTP requests.
//
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

// StreamWriter is an interface that abstracts the mechanism of sending query results.
//
// DESIGN PATTERN: Dependency Inversion.
//   By coding `streamQueryResults` against this interface, we can use the same
//   execution logic for:
//     1. `QueryStream` (ServerStream)
//     2. `Transaction` (BidiStream)
//     3. Mocks (Unit Tests)
type StreamWriter interface {
	SendHeader(*dbv1.QueryResultHeader) error
	SendRowBatch(*dbv1.QueryResultRowBatch) error
	SendDMLResult(*dbv1.DMLResult) error
	SendComplete(*dbv1.ExecutionStats) error
}
