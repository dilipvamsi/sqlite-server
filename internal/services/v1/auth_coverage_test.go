package servicesv1

import (
	"context"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// --- Mocks ---

type mockDatabaseService struct {
	dbv1connect.UnimplementedDatabaseServiceHandler
}

// --- Database Service Mocks ---

func (m *mockDatabaseService) Vacuum(context.Context, *connect.Request[dbv1.VacuumRequest]) (*connect.Response[dbv1.VacuumResponse], error) {
	return connect.NewResponse(&dbv1.VacuumResponse{Success: true}), nil
}

func (m *mockDatabaseService) Checkpoint(context.Context, *connect.Request[dbv1.CheckpointRequest]) (*connect.Response[dbv1.CheckpointResponse], error) {
	return connect.NewResponse(&dbv1.CheckpointResponse{Success: true}), nil
}

func (m *mockDatabaseService) IntegrityCheck(context.Context, *connect.Request[dbv1.IntegrityCheckRequest]) (*connect.Response[dbv1.IntegrityCheckResponse], error) {
	return connect.NewResponse(&dbv1.IntegrityCheckResponse{Success: true}), nil
}

func (m *mockDatabaseService) Query(context.Context, *connect.Request[dbv1.QueryRequest]) (*connect.Response[dbv1.QueryResult], error) {
	return connect.NewResponse(&dbv1.QueryResult{}), nil
}

func (m *mockDatabaseService) QueryStream(ctx context.Context, req *connect.Request[dbv1.QueryRequest], stream *connect.ServerStream[dbv1.QueryResponse]) error {
	return nil
}

func (m *mockDatabaseService) TypedQuery(context.Context, *connect.Request[dbv1.TypedQueryRequest]) (*connect.Response[dbv1.TypedQueryResult], error) {
	return connect.NewResponse(&dbv1.TypedQueryResult{}), nil
}

func (m *mockDatabaseService) TypedQueryStream(ctx context.Context, req *connect.Request[dbv1.TypedQueryRequest], stream *connect.ServerStream[dbv1.TypedQueryResponse]) error {
	return nil
}

func (m *mockDatabaseService) ExecuteTransaction(context.Context, *connect.Request[dbv1.ExecuteTransactionRequest]) (*connect.Response[dbv1.ExecuteTransactionResponse], error) {
	return connect.NewResponse(&dbv1.ExecuteTransactionResponse{}), nil
}

func (m *mockDatabaseService) BeginTransaction(context.Context, *connect.Request[dbv1.BeginTransactionRequest]) (*connect.Response[dbv1.BeginTransactionResponse], error) {
	return connect.NewResponse(&dbv1.BeginTransactionResponse{TransactionId: "tx-1"}), nil
}

func (m *mockDatabaseService) CommitTransaction(context.Context, *connect.Request[dbv1.TransactionControlRequest]) (*connect.Response[dbv1.TransactionControlResponse], error) {
	return connect.NewResponse(&dbv1.TransactionControlResponse{Success: true}), nil
}

func (m *mockDatabaseService) RollbackTransaction(context.Context, *connect.Request[dbv1.TransactionControlRequest]) (*connect.Response[dbv1.TransactionControlResponse], error) {
	return connect.NewResponse(&dbv1.TransactionControlResponse{Success: true}), nil
}

func (m *mockDatabaseService) TransactionQuery(context.Context, *connect.Request[dbv1.TransactionQueryRequest]) (*connect.Response[dbv1.QueryResult], error) {
	return connect.NewResponse(&dbv1.QueryResult{}), nil
}

func (m *mockDatabaseService) TransactionQueryStream(ctx context.Context, req *connect.Request[dbv1.TransactionQueryRequest], stream *connect.ServerStream[dbv1.QueryResponse]) error {
	return nil
}

func (m *mockDatabaseService) TransactionSavepoint(context.Context, *connect.Request[dbv1.TransactionSavepointRequest]) (*connect.Response[dbv1.SavepointResponse], error) {
	return connect.NewResponse(&dbv1.SavepointResponse{Success: true}), nil
}

func (m *mockDatabaseService) TypedTransactionQuery(context.Context, *connect.Request[dbv1.TypedTransactionQueryRequest]) (*connect.Response[dbv1.TypedQueryResult], error) {
	return connect.NewResponse(&dbv1.TypedQueryResult{}), nil
}

func (m *mockDatabaseService) TypedTransactionQueryStream(ctx context.Context, req *connect.Request[dbv1.TypedTransactionQueryRequest], stream *connect.ServerStream[dbv1.TypedQueryResponse]) error {
	return nil
}

func (m *mockDatabaseService) Explain(context.Context, *connect.Request[dbv1.QueryRequest]) (*connect.Response[dbv1.ExplainResponse], error) {
	return connect.NewResponse(&dbv1.ExplainResponse{}), nil
}

func (m *mockDatabaseService) TypedExplain(context.Context, *connect.Request[dbv1.TypedQueryRequest]) (*connect.Response[dbv1.ExplainResponse], error) {
	return connect.NewResponse(&dbv1.ExplainResponse{}), nil
}

func (m *mockDatabaseService) ListTables(context.Context, *connect.Request[dbv1.ListTablesRequest]) (*connect.Response[dbv1.ListTablesResponse], error) {
	return connect.NewResponse(&dbv1.ListTablesResponse{}), nil
}

func (m *mockDatabaseService) GetTableSchema(context.Context, *connect.Request[dbv1.GetTableSchemaRequest]) (*connect.Response[dbv1.TableSchema], error) {
	return connect.NewResponse(&dbv1.TableSchema{}), nil
}

func (m *mockDatabaseService) GetDatabaseSchema(context.Context, *connect.Request[dbv1.GetDatabaseSchemaRequest]) (*connect.Response[dbv1.DatabaseSchema], error) {
	return connect.NewResponse(&dbv1.DatabaseSchema{}), nil
}

func (m *mockDatabaseService) Transaction(ctx context.Context, stream *connect.BidiStream[dbv1.TransactionRequest, dbv1.TransactionResponse]) error {
	// Receive one message to trigger the interceptor check
	_, err := stream.Receive()
	return err
}

// --- Admin Service Mocks ---

type mockAdminService struct {
	dbv1connect.UnimplementedAdminServiceHandler
}

func (m *mockAdminService) CreateUser(context.Context, *connect.Request[dbv1.CreateUserRequest]) (*connect.Response[dbv1.CreateUserResponse], error) {
	return connect.NewResponse(&dbv1.CreateUserResponse{}), nil
}

func (m *mockAdminService) DeleteUser(context.Context, *connect.Request[dbv1.DeleteUserRequest]) (*connect.Response[dbv1.DeleteUserResponse], error) {
	return connect.NewResponse(&dbv1.DeleteUserResponse{Success: true}), nil
}

func (m *mockAdminService) UpdatePassword(context.Context, *connect.Request[dbv1.UpdatePasswordRequest]) (*connect.Response[dbv1.UpdatePasswordResponse], error) {
	return connect.NewResponse(&dbv1.UpdatePasswordResponse{Success: true}), nil
}

func (m *mockAdminService) CreateApiKey(context.Context, *connect.Request[dbv1.CreateApiKeyRequest]) (*connect.Response[dbv1.CreateApiKeyResponse], error) {
	return connect.NewResponse(&dbv1.CreateApiKeyResponse{ApiKey: "secret"}), nil
}

func (m *mockAdminService) ListApiKeys(context.Context, *connect.Request[dbv1.ListApiKeysRequest]) (*connect.Response[dbv1.ListApiKeysResponse], error) {
	return connect.NewResponse(&dbv1.ListApiKeysResponse{}), nil
}

func (m *mockAdminService) RevokeApiKey(context.Context, *connect.Request[dbv1.RevokeApiKeyRequest]) (*connect.Response[dbv1.RevokeApiKeyResponse], error) {
	return connect.NewResponse(&dbv1.RevokeApiKeyResponse{Success: true}), nil
}

func (m *mockAdminService) ListDatabases(context.Context, *connect.Request[dbv1.ListDatabasesRequest]) (*connect.Response[dbv1.ListDatabasesResponse], error) {
	return connect.NewResponse(&dbv1.ListDatabasesResponse{}), nil
}

func (m *mockAdminService) Login(context.Context, *connect.Request[dbv1.LoginRequest]) (*connect.Response[dbv1.LoginResponse], error) {
	return connect.NewResponse(&dbv1.LoginResponse{ApiKey: "session"}), nil
}

func (m *mockAdminService) Logout(context.Context, *connect.Request[dbv1.LogoutRequest]) (*connect.Response[dbv1.LogoutResponse], error) {
	return connect.NewResponse(&dbv1.LogoutResponse{Success: true}), nil
}

func (m *mockAdminService) CreateDatabase(context.Context, *connect.Request[dbv1.CreateDatabaseRequest]) (*connect.Response[dbv1.CreateDatabaseResponse], error) {
	return connect.NewResponse(&dbv1.CreateDatabaseResponse{Success: true}), nil
}

func (m *mockAdminService) MountDatabase(context.Context, *connect.Request[dbv1.DatabaseConfig]) (*connect.Response[dbv1.MountDatabaseResponse], error) {
	return connect.NewResponse(&dbv1.MountDatabaseResponse{Success: true}), nil
}

func (m *mockAdminService) UnMountDatabase(context.Context, *connect.Request[dbv1.UnMountDatabaseRequest]) (*connect.Response[dbv1.UnMountDatabaseResponse], error) {
	return connect.NewResponse(&dbv1.UnMountDatabaseResponse{Success: true}), nil
}

func (m *mockAdminService) DeleteDatabase(context.Context, *connect.Request[dbv1.DeleteDatabaseRequest]) (*connect.Response[dbv1.DeleteDatabaseResponse], error) {
	return connect.NewResponse(&dbv1.DeleteDatabaseResponse{Success: true}), nil
}

// --- Setup ---

// setupRBACStore creates a store with 3 users: admin, writer, reader
// Returns the store and a map of role -> api_key
func setupRBACStore(t *testing.T) (*auth.MetaStore, map[string]string) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "rbac_test.db")
	store, err := auth.NewMetaStore(dbPath)
	require.NoError(t, err)

	keys := make(map[string]string)
	ctx := context.Background()

	users := []struct {
		name string
		role dbv1.Role
	}{
		{"admin", dbv1.Role_ROLE_ADMIN},
		{"writer", dbv1.Role_ROLE_READ_WRITE},
		{"reader", dbv1.Role_ROLE_READ_ONLY},
	}

	for _, u := range users {
		uid, err := store.CreateUser(ctx, u.name, "pass", u.role)
		require.NoError(t, err)
		key, _, err := store.CreateApiKey(ctx, uid, "key-"+u.name, nil)
		require.NoError(t, err)
		keys[u.name] = key
	}

	t.Cleanup(func() { store.Close() })
	return store, keys
}

// --- Client Interceptor ---

type authInjector struct {
	token string
}

func (i *authInjector) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		req.Header().Set("Authorization", i.token)
		return next(ctx, req)
	}
}

func (i *authInjector) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return func(ctx context.Context, spec connect.Spec) connect.StreamingClientConn {
		conn := next(ctx, spec)
		conn.RequestHeader().Set("Authorization", i.token)
		return conn
	}
}

func (i *authInjector) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return next
}

// --- Integration Tests ---

func TestAuthInterceptor_RBAC_Integration(t *testing.T) {
	store, keys := setupRBACStore(t)
	interceptor := NewAuthInterceptor(store)

	// Setup Server
	mux := http.NewServeMux()

	// Database Service
	path, handler := dbv1connect.NewDatabaseServiceHandler(&mockDatabaseService{}, connect.WithInterceptors(interceptor))
	mux.Handle(path, handler)

	// Admin Service
	pathAdmin, handlerAdmin := dbv1connect.NewAdminServiceHandler(&mockAdminService{}, connect.WithInterceptors(interceptor))
	mux.Handle(pathAdmin, handlerAdmin)

	// Setup Server with HTTP/2 support (required for streaming)
	server := httptest.NewUnstartedServer(mux)
	server.EnableHTTP2 = true
	server.StartTLS()
	t.Cleanup(server.Close)

	// Client Interceptor for Auth
	clientAuthInterceptor := func(token string) connect.Interceptor {
		return &authInjector{token: token}
	}

	// Helper to create authenticated clients
	adminClientFor := func(user string) dbv1connect.AdminServiceClient {
		return dbv1connect.NewAdminServiceClient(
			server.Client(),
			server.URL,
			connect.WithInterceptors(clientAuthInterceptor("Bearer "+keys[user])),
		)
	}

	dbClientFor := func(user string) dbv1connect.DatabaseServiceClient {
		return dbv1connect.NewDatabaseServiceClient(
			server.Client(),
			server.URL,
			connect.WithInterceptors(clientAuthInterceptor("Bearer "+keys[user])),
		)
	}

	// Test Cases

	// 1. Admin Service
	t.Run("AdminService", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CreateUserRequest{Username: "foo"})

		// Admin -> OK
		_, err := adminClientFor("admin").CreateUser(context.Background(), req)
		assert.NoError(t, err)

		// Writer -> PermissionDenied
		_, err = adminClientFor("writer").CreateUser(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))

		// Reader -> PermissionDenied
		_, err = adminClientFor("reader").CreateUser(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	// 2. Explicit Write (Vacuum)
	t.Run("ExplicitWrite_Vacuum", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.VacuumRequest{Database: "test"})

		// Writer -> OK
		_, err := dbClientFor("writer").Vacuum(context.Background(), req)
		assert.NoError(t, err)

		// Reader -> PermissionDenied
		_, err = dbClientFor("reader").Vacuum(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	// 3. Dynamic Query (Write vs Read)
	t.Run("Query_Insert", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.QueryRequest{Sql: "INSERT INTO foo VALUES(1)"})

		// Writer -> OK
		_, err := dbClientFor("writer").Query(context.Background(), req)
		assert.NoError(t, err)

		// Reader -> PermissionDenied
		_, err = dbClientFor("reader").Query(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	t.Run("Query_Select", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.QueryRequest{Sql: "SELECT * FROM foo"})

		// Writer -> OK
		_, err := dbClientFor("writer").Query(context.Background(), req)
		assert.NoError(t, err)

		// Reader -> OK
		_, err = dbClientFor("reader").Query(context.Background(), req)
		assert.NoError(t, err)
	})

	// 4. Streaming Bidi (Transaction)
	t.Run("TransactionStream_Insert", func(t *testing.T) {
		// Use Reader
		stream := dbClientFor("reader").Transaction(context.Background())

		// Send Write Command
		err := stream.Send(&dbv1.TransactionRequest{
			Command: &dbv1.TransactionRequest_Query{
				Query: &dbv1.TransactionalQueryRequest{Sql: "INSERT INTO foo VALUES(1)"},
			},
		})
		require.NoError(t, err)

		// Receive -> Should trigger interceptor check and fail
		_, err = stream.Receive()
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))

		stream.CloseResponse()
	})

	t.Run("TransactionStream_Select", func(t *testing.T) {
		// Use Reader
		stream := dbClientFor("reader").Transaction(context.Background())

		// Send Read Command
		err := stream.Send(&dbv1.TransactionRequest{
			Command: &dbv1.TransactionRequest_Query{
				Query: &dbv1.TransactionalQueryRequest{Sql: "SELECT count(*) FROM foo"},
			},
		})
		require.NoError(t, err)

		// Receive -> Should be OK (mock returns empty but no permission error)
		if err != nil {
			assert.NotEqual(t, connect.CodePermissionDenied, connect.CodeOf(err))
		}

		stream.CloseResponse()
	})

	// 5. Introspection (Read Only)
	introspecTests := []struct {
		name string
		call func(client dbv1connect.DatabaseServiceClient) error
	}{
		{"ListTables", func(c dbv1connect.DatabaseServiceClient) error {
			_, err := c.ListTables(context.Background(), connect.NewRequest(&dbv1.ListTablesRequest{}))
			return err
		}},
		{"GetTableSchema", func(c dbv1connect.DatabaseServiceClient) error {
			_, err := c.GetTableSchema(context.Background(), connect.NewRequest(&dbv1.GetTableSchemaRequest{}))
			return err
		}},
		{"GetDatabaseSchema", func(c dbv1connect.DatabaseServiceClient) error {
			_, err := c.GetDatabaseSchema(context.Background(), connect.NewRequest(&dbv1.GetDatabaseSchemaRequest{}))
			return err
		}},
		{"Explain", func(c dbv1connect.DatabaseServiceClient) error {
			_, err := c.Explain(context.Background(), connect.NewRequest(&dbv1.QueryRequest{Sql: "SELECT 1"}))
			return err
		}},
	}

	for _, it := range introspecTests {
		t.Run(it.name, func(t *testing.T) {
			// Reader -> OK
			assert.NoError(t, it.call(dbClientFor("reader")))
			// Writer -> OK
			assert.NoError(t, it.call(dbClientFor("writer")))
		})
	}

	// 6. Maintenance (Mixed)
	t.Run("Checkpoint", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CheckpointRequest{})
		// Writer -> OK
		_, err := dbClientFor("writer").Checkpoint(context.Background(), req)
		assert.NoError(t, err)
		// Reader -> Fail
		_, err = dbClientFor("reader").Checkpoint(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	t.Run("IntegrityCheck", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.IntegrityCheckRequest{})
		// Reader -> OK (It's a read op)
		_, err := dbClientFor("reader").IntegrityCheck(context.Background(), req)
		assert.NoError(t, err)
	})

	// 7. Unary Transaction (Read vs Write)
	t.Run("TransactionQuery_Write", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.TransactionQueryRequest{Sql: "UPDATE foo SET a=1"})
		// Writer -> OK
		_, err := dbClientFor("writer").TransactionQuery(context.Background(), req)
		assert.NoError(t, err)
		// Reader -> Fail
		_, err = dbClientFor("reader").TransactionQuery(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	t.Run("TransactionQuery_Read", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.TransactionQueryRequest{Sql: "SELECT 1"})
		// Reader -> OK
		_, err := dbClientFor("reader").TransactionQuery(context.Background(), req)
		assert.NoError(t, err)
	})

	// 8. Admin Service (Full)
	adminTests := []struct {
		name string
		call func(client dbv1connect.AdminServiceClient) error
	}{
		{"ListDatabases", func(c dbv1connect.AdminServiceClient) error {
			_, err := c.ListDatabases(context.Background(), connect.NewRequest(&dbv1.ListDatabasesRequest{}))
			return err
		}},
		{"CreateDatabase", func(c dbv1connect.AdminServiceClient) error {
			_, err := c.CreateDatabase(context.Background(), connect.NewRequest(&dbv1.CreateDatabaseRequest{Name: "newdb"}))
			return err
		}},
		{"DeleteDatabase", func(c dbv1connect.AdminServiceClient) error {
			_, err := c.DeleteDatabase(context.Background(), connect.NewRequest(&dbv1.DeleteDatabaseRequest{Name: "olddb"}))
			return err
		}},
		{"ListApiKeys", func(c dbv1connect.AdminServiceClient) error {
			_, err := c.ListApiKeys(context.Background(), connect.NewRequest(&dbv1.ListApiKeysRequest{UserId: 1}))
			return err
		}},
	}

	for _, at := range adminTests {
		t.Run("Admin_"+at.name, func(t *testing.T) {
			// Admin -> OK
			assert.NoError(t, at.call(adminClientFor("admin")))
			// Writer -> Fail
			err := at.call(adminClientFor("writer"))
			require.Error(t, err)
			assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
		})
	}
}
