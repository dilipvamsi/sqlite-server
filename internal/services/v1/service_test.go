package servicesv1

import (
	"context"
	"crypto/tls"
	"net"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"
	"time"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"google.golang.org/protobuf/types/known/durationpb"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/structpb"

	"sqlite-server/internal/auth"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/protos/sqlrpc/v1/sqlrpcv1connect"
)

// --- Helper Setup ---

func setupTestServer(t *testing.T) (sqlrpcv1connect.DatabaseServiceClient, *DbServer) {
	// Setup File-Based DB to avoid memory/URI issues in test suite
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_setup.db")
	// No need for 'file:' prefix or params, NewSqliteDb will handle path and defaults.

	config := &sqlrpcv1.DatabaseConfig{
		Name:         "test",
		DbPath:       dbPath,
		MaxOpenConns: 1,
	}

	server := NewDbServer([]*sqlrpcv1.DatabaseConfig{config}, nil)

	// Seed Data via Manager
	// We use ModeRW to seed data.
	db, err := server.dbManager.GetConnection(context.Background(), "test", ModeRW)
	require.NoError(t, err)

	_, err = db.Exec(`
		CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, avatar BLOB, active BOOLEAN);
		INSERT INTO users (id, name, age, avatar, active) VALUES (1, 'Alice', 30, x'DEADBEEF', 1);
		INSERT INTO users (id, name, age, avatar, active) VALUES (2, 'Bob', 40, NULL, 0);
	`)
	require.NoError(t, err)

	mux := http.NewServeMux()
	// Add Mock Auth Interceptor to inject admin user for tests
	path, handler := sqlrpcv1connect.NewDatabaseServiceHandler(server, connect.WithInterceptors(
		LoggingInterceptor(),
		&testAuthInterceptor{},
	))
	mux.Handle(path, handler)

	// HTTP/2 Server with H2C (Cleartext)
	ts := httptest.NewUnstartedServer(h2c.NewHandler(mux, &http2.Server{}))
	ts.EnableHTTP2 = true
	ts.Start()

	t.Cleanup(func() {
		server.Stop()
		ts.Close()
	})

	// FIXED: Configure Client Transport for H2C (HTTP/2 over TCP)
	httpClient := &http.Client{
		Transport: &http2.Transport{
			AllowHTTP: true,
			DialTLSContext: func(ctx context.Context, network, addr string, _ *tls.Config) (net.Conn, error) {
				// Dial the test server directly via TCP, ignoring TLS config
				return net.Dial(network, addr)
			},
		},
	}

	client := sqlrpcv1connect.NewDatabaseServiceClient(httpClient, ts.URL, connect.WithGRPC())
	return client, server
}

// --- Test Cases ---

func TestUnaryQuery(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Select Success", func(t *testing.T) {
		req := connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT id, name, avatar FROM users WHERE id = ?",
			Parameters: &sqlrpcv1.Parameters{
				Positional: []*structpb.Value{structpb.NewNumberValue(1)},
			},
		})
		res, err := client.Query(ctx, req)
		require.NoError(t, err)

		rows := res.Msg.Rows
		assert.Len(t, rows, 1)
		// Check Name
		assert.Equal(t, "Alice", rows[0].Values[1].GetStringValue())
		// Check Blob (Base64)
		assert.Equal(t, "3q2+7w==", rows[0].Values[2].GetStringValue())
		// Check Type Hint Resolution
		assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, res.Msg.ColumnAffinities[0])
	})

	t.Run("DML Success", func(t *testing.T) {
		req := connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "INSERT INTO users (name) VALUES ('Charlie')",
		})
		res, err := client.Exec(ctx, req)
		require.NoError(t, err)
		assert.Equal(t, int64(1), res.Msg.Dml.RowsAffected)
		assert.Equal(t, int64(3), res.Msg.Dml.LastInsertId)
	})

	t.Run("Error DB Not Found", func(t *testing.T) {
		_, err := client.Query(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{Database: "missing", Sql: "SELECT 1"}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Error Invalid SQL", func(t *testing.T) {
		_, err := client.Query(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{Database: "test", Sql: "SELECT * FROM missing_table"}))
		assert.Error(t, err)
	})

	t.Run("Block Manual Transaction", func(t *testing.T) {
		_, err := client.Query(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{Database: "test", Sql: "BEGIN; SELECT 1"}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "manual transaction control")
	})
}

func TestQueryStream(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	stream, err := client.QueryStream(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
		Database: "test",
		Sql:      "SELECT id FROM users",
	}))
	require.NoError(t, err)

	// 1. Header
	assert.True(t, stream.Receive())
	assert.NotNil(t, stream.Msg().GetHeader())

	// 2. Batch
	assert.True(t, stream.Receive())
	assert.NotNil(t, stream.Msg().GetBatch())

	// 3. Complete
	assert.True(t, stream.Receive())
	assert.NotNil(t, stream.Msg().GetComplete())

	assert.False(t, stream.Receive())
}

func TestUnaryTransaction(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// 1. Begin
	beginRes, err := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{
		Database: "test",
		Mode:     sqlrpcv1.TransactionLockMode_TRANSACTION_LOCK_MODE_IMMEDIATE,
		Timeout:  durationpb.New(1 * time.Second),
	}))
	require.NoError(t, err)
	txID := beginRes.Msg.TransactionId
	assert.NotEmpty(t, txID)

	// 2. Query inside Tx
	_, err = client.TransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{
		TransactionId: txID,
		Sql:           "UPDATE users SET age = 99 WHERE id = 1",
	}))
	require.NoError(t, err)

	// 3. Savepoint
	spRes, err := client.TransactionSavepoint(ctx, connect.NewRequest(&sqlrpcv1.TransactionSavepointRequest{
		TransactionId: txID,
		Savepoint:     &sqlrpcv1.SavepointRequest{Name: "sp1", Action: sqlrpcv1.SavepointAction_SAVEPOINT_ACTION_CREATE},
	}))
	require.NoError(t, err)
	assert.True(t, spRes.Msg.Success)

	// 4. Commit
	commitRes, err := client.CommitTransaction(ctx, connect.NewRequest(&sqlrpcv1.TransactionControlRequest{TransactionId: txID}))
	require.NoError(t, err)
	assert.True(t, commitRes.Msg.Success)

	// 5. Verify Persistence
	verifyRes, _ := client.Query(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{Database: "test", Sql: "SELECT age FROM users WHERE id = 1"}))

	// Value Check: structpb uses float64 for numbers
	assert.Equal(t, float64(99), verifyRes.Msg.Rows[0].Values[0].GetNumberValue())

	// Metadata Check: Ensure the column is correctly identified as INTEGER
	assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, verifyRes.Msg.ColumnAffinities[0])
}

func TestTransactionTimeouts(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// Start with short timeout
	res, _ := client.BeginTransaction(ctx, connect.NewRequest(&sqlrpcv1.BeginTransactionRequest{
		Database: "test", Timeout: durationpb.New(10 * time.Millisecond),
	}))
	txID := res.Msg.TransactionId

	// Wait for expiry
	time.Sleep(50 * time.Millisecond)

	// Try to query
	_, err := client.TransactionQuery(ctx, connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{
		TransactionId: txID,
		Sql:           "SELECT 1",
	}))
	assert.Error(t, err) // Should be Not Found or Aborted
}

func TestBiDiTransaction(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()
	stream := client.Transaction(ctx)

	// 1. Send Begin
	err := stream.Send(&sqlrpcv1.TransactionRequest{Command: &sqlrpcv1.TransactionRequest_Begin{
		Begin: &sqlrpcv1.BeginRequest{Database: "test"},
	}})
	require.NoError(t, err)

	// Receive Begin Response
	res, err := stream.Receive()
	require.NoError(t, err)
	assert.True(t, res.GetBegin().Success)

	// 2. Send Query
	err = stream.Send(&sqlrpcv1.TransactionRequest{Command: &sqlrpcv1.TransactionRequest_Query{
		Query: &sqlrpcv1.TransactionalQueryRequest{Sql: "SELECT 1"},
	}})
	require.NoError(t, err)

	// Receive Query Result
	res, err = stream.Receive()
	require.NoError(t, err)
	assert.NotNil(t, res.GetQueryResult())

	// 3. Send Rollback
	err = stream.Send(&sqlrpcv1.TransactionRequest{Command: &sqlrpcv1.TransactionRequest_Rollback{
		Rollback: &emptypb.Empty{},
	}})
	require.NoError(t, err)

	// Receive Rollback Ack
	res, err = stream.Receive()
	require.NoError(t, err)
	assert.True(t, res.GetRollback().Success)

	// Stream should close
	_, err = stream.Receive()
	assert.Error(t, err) // EOF
}

func TestExecuteTransactionAtomic(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Success Path", func(t *testing.T) {
		res, err := client.ExecuteTransaction(ctx, connect.NewRequest(&sqlrpcv1.ExecuteTransactionRequest{
			Requests: []*sqlrpcv1.TransactionRequest{
				{Command: &sqlrpcv1.TransactionRequest_Begin{Begin: &sqlrpcv1.BeginRequest{Database: "test"}}},
				{Command: &sqlrpcv1.TransactionRequest_Query{Query: &sqlrpcv1.TransactionalQueryRequest{Sql: "INSERT INTO users (name) VALUES ('Atomic')"}}},
				{Command: &sqlrpcv1.TransactionRequest_Commit{Commit: &emptypb.Empty{}}},
			},
		}))
		require.NoError(t, err)
		assert.Len(t, res.Msg.Responses, 3)
	})

	t.Run("Rollback on Error", func(t *testing.T) {
		res, err := client.ExecuteTransaction(ctx, connect.NewRequest(&sqlrpcv1.ExecuteTransactionRequest{
			Requests: []*sqlrpcv1.TransactionRequest{
				{Command: &sqlrpcv1.TransactionRequest_Begin{Begin: &sqlrpcv1.BeginRequest{Database: "test"}}},
				{Command: &sqlrpcv1.TransactionRequest_Query{Query: &sqlrpcv1.TransactionalQueryRequest{Sql: "BAD SQL"}}}, // Fails here
				{Command: &sqlrpcv1.TransactionRequest_Commit{Commit: &emptypb.Empty{}}},
			},
		}))
		require.NoError(t, err)
		// It returns the list of responses up to the error
		assert.Equal(t, sqlrpcv1.SqliteCode_SQLITE_ERROR, res.Msg.Responses[1].GetError().SqliteErrorCode)
	})
}

// TestNewDbServer_Constructor covers NewDbServer and loading logic
func TestNewDbServer_Constructor(t *testing.T) {
	// 1. Valid Config
	configs := []*sqlrpcv1.DatabaseConfig{
		{Name: "mem1", DbPath: ":memory:", MaxOpenConns: 1},
	}
	server := NewDbServer(configs, nil)
	assert.NotNil(t, server)
	// Access DbManager via private field for test
	assert.NotNil(t, server.dbManager)

	// Basic check
	conn, err := server.dbManager.GetConnection(context.Background(), "mem1", ModeRW)
	assert.NoError(t, err)
	assert.NotNil(t, conn)

	server.Stop()
}

// --- Test Helpers (Moved from service_test_helper.go) ---

type testAuthInterceptor struct{}

func (i *testAuthInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "admin",
			Role:     sqlrpcv1.Role_ROLE_ADMIN,
		}
		ctx = auth.NewContext(ctx, claims)
		return next(ctx, req)
	}
}

func (i *testAuthInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return next
}

func (i *testAuthInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "admin",
			Role:     sqlrpcv1.Role_ROLE_ADMIN,
		}
		ctx = auth.NewContext(ctx, claims)
		return next(ctx, conn)
	}
}
