package servicesv1

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"reflect"
	"testing"
	"time"

	"sqlite-server/internal/auth"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Helper to setup store with a user and api key
func setupStore(t *testing.T) (*auth.MetaStore, string, string) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "interceptor_test.db")
	store, err := auth.NewMetaStore(dbPath)
	require.NoError(t, err)

	ctx := context.Background()
	// Create user
	userID, err := store.CreateUser(ctx, "testuser", "password123", sqlrpcv1.Role_ROLE_READ_WRITE)
	require.NoError(t, err)

	// Create API key
	apiKey, _, err := store.CreateApiKey(ctx, userID, "test-key", nil)
	require.NoError(t, err)

	t.Cleanup(func() {
		store.Close()
	})

	return store, "password123", apiKey
}

func TestAuthInterceptor_WrapUnary(t *testing.T) {
	store, password, apiKey := setupStore(t)
	interceptor := NewAuthInterceptor(store)
	middleware := interceptor.WrapUnary(func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		// Verify context was populated
		claims, ok := auth.FromContext(ctx)
		if !ok {
			return nil, errors.New("no claims in context")
		}
		if claims.Username != "testuser" {
			return nil, errors.New("wrong user in context")
		}
		return connect.NewResponse(&struct{}{}), nil
	})

	t.Run("missing auth header", func(t *testing.T) {
		req := connect.NewRequest(&struct{}{})
		_, err := middleware(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})

	t.Run("basic auth valid", func(t *testing.T) {
		req := connect.NewRequest(&struct{}{})
		authStr := base64.StdEncoding.EncodeToString([]byte("testuser:" + password))
		req.Header().Set("Authorization", "Basic "+authStr)

		_, err := middleware(context.Background(), req)
		assert.NoError(t, err)
	})

	t.Run("basic auth invalid credentials", func(t *testing.T) {
		req := connect.NewRequest(&struct{}{})
		authStr := base64.StdEncoding.EncodeToString([]byte("testuser:wrongpassword"))
		req.Header().Set("Authorization", "Basic "+authStr)

		_, err := middleware(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})

	t.Run("basic auth invalid format", func(t *testing.T) {
		req := connect.NewRequest(&struct{}{})
		req.Header().Set("Authorization", "Basic notbase64")

		_, err := middleware(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})

	t.Run("bearer token valid", func(t *testing.T) {
		req := connect.NewRequest(&struct{}{})
		req.Header().Set("Authorization", "Bearer "+apiKey)

		_, err := middleware(context.Background(), req)
		assert.NoError(t, err)
	})

	t.Run("bearer token invalid", func(t *testing.T) {
		req := connect.NewRequest(&struct{}{})
		req.Header().Set("Authorization", "Bearer invalid-key")

		_, err := middleware(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})

	t.Run("unsupported scheme", func(t *testing.T) {
		req := connect.NewRequest(&struct{}{})
		req.Header().Set("Authorization", "Digest something")

		_, err := middleware(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})
}

type mockStreamingConn struct {
	connect.StreamingHandlerConn
	header http.Header
	msg    any // Message to return on Receive
	spec   connect.Spec
}

func (m *mockStreamingConn) Spec() connect.Spec {
	return m.spec
}

func (m *mockStreamingConn) RequestHeader() http.Header {
	return m.header
}

func (m *mockStreamingConn) Receive(dest any) error {
	if m.msg == nil {
		return io.EOF
	}
	// Use reflection to copy m.msg to dest
	// Or simplistic assignment if we know types
	// Since we know we are expecting specific types in tests:
	srcVal := reflect.ValueOf(m.msg)
	destVal := reflect.ValueOf(dest)
	if destVal.Kind() != reflect.Ptr || destVal.IsNil() {
		return errors.New("dest must be a non-nil pointer")
	}
	destElem := destVal.Elem()
	if srcVal.Type().AssignableTo(destElem.Type()) {
		destElem.Set(srcVal)
		return nil
	}
	// Handle pointer to pointer?
	if srcVal.Kind() == reflect.Ptr && srcVal.Elem().Type().AssignableTo(destElem.Type()) {
		destElem.Set(srcVal.Elem())
		return nil
	}

	// Fallback for proto messages (shallow copy usually fine for tests)
	return fmt.Errorf("type mismatch: %T to %T", m.msg, dest)
}

func TestAuthInterceptor_WrapStreamingHandler(t *testing.T) {
	store, password, apiKey := setupStore(t)
	interceptor := NewAuthInterceptor(store)
	middleware := interceptor.WrapStreamingHandler(func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		// Verify context was populated
		claims, ok := auth.FromContext(ctx)
		if !ok {
			return errors.New("no claims in context")
		}
		if claims.Username != "testuser" {
			return errors.New("wrong user in context")
		}
		return nil
	})

	t.Run("valid basic auth", func(t *testing.T) {
		header := make(http.Header)
		authStr := base64.StdEncoding.EncodeToString([]byte("testuser:" + password))
		header.Set("Authorization", "Basic "+authStr)

		err := middleware(context.Background(), &mockStreamingConn{header: header})
		assert.NoError(t, err)
	})

	t.Run("valid bearer token", func(t *testing.T) {
		header := make(http.Header)
		header.Set("Authorization", "Bearer "+apiKey)

		err := middleware(context.Background(), &mockStreamingConn{header: header})
		assert.NoError(t, err)
	})

	t.Run("missing header", func(t *testing.T) {
		header := make(http.Header)
		err := middleware(context.Background(), &mockStreamingConn{header: header})
		require.Error(t, err)
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})

	t.Run("invalid token", func(t *testing.T) {
		header := make(http.Header)
		header.Set("Authorization", "Bearer invalid")
		err := middleware(context.Background(), &mockStreamingConn{header: header})
		require.Error(t, err)
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})
}

func TestAuthInterceptor_WrapStreamingClient(t *testing.T) {
	// Should be no-op for client wrapper in this server interceptor
	interceptor := NewAuthInterceptor(nil)
	called := false
	middleware := interceptor.WrapStreamingClient(func(ctx context.Context, spec connect.Spec) connect.StreamingClientConn {
		called = true
		return nil
	})

	_ = middleware(context.Background(), connect.Spec{})
	assert.True(t, called)
}

// mockRequest mocks connect.AnyRequest to allow setting Spec
type mockRequest struct {
	connect.AnyRequest
	spec connect.Spec
}

func (m *mockRequest) Spec() connect.Spec {
	return m.spec
}

func TestAuthInterceptor_WrapUnary_AuthFormats(t *testing.T) {
	tmpDir := t.TempDir()
	storeS, _ := auth.NewMetaStore(filepath.Join(tmpDir, "interceptor_auth.db"))
	defer storeS.Close()
	interceptor := NewAuthInterceptor(storeS)

	// Create a user in the store for valid auth tests
	ctx := context.Background()
	userID, _ := storeS.CreateUser(ctx, "testuser", "testpass", sqlrpcv1.Role_ROLE_READ_ONLY)
	apiKey, _, _ := storeS.CreateApiKey(ctx, userID, "testkey", nil)

	next := func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		return connect.NewResponse(&sqlrpcv1.QueryResponse{}), nil
	}
	wrap := interceptor.WrapUnary(next)

	tests := []struct {
		name   string
		header string
		code   connect.Code
	}{
		{"Missing Header", "", connect.CodeUnauthenticated},
		{"Unsupported Scheme", "Digest xyz", connect.CodeUnauthenticated},
		{"Invalid Basic Base64", "Basic invalid-base64", connect.CodeUnauthenticated},
		{"Invalid Basic Format", "Basic " + base64.StdEncoding.EncodeToString([]byte("useronly")), connect.CodeUnauthenticated},
		{"Internal Error (Empty Store)", "Bearer valid-token", connect.CodeUnauthenticated}, // This will fail validation
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			realReq := connect.NewRequest(&sqlrpcv1.QueryRequest{})
			if tt.header != "" {
				realReq.Header().Set("Authorization", tt.header)
			}

			// Use mock to set Procedure
			req := &mockRequest{
				AnyRequest: realReq,
				spec: connect.Spec{
					Procedure: "/sqlrpc.v1.DatabaseService/Query",
				},
			}

			_, err := wrap(context.Background(), req)
			require.Error(t, err)
			assert.Equal(t, tt.code, connect.CodeOf(err))
		})
	}

	t.Run("Cache Expiration", func(t *testing.T) {
		authHeader := "Bearer " + apiKey
		realReq := connect.NewRequest(&sqlrpcv1.QueryRequest{})
		realReq.Header().Set("Authorization", authHeader)
		req := &mockRequest{
			AnyRequest: realReq,
			spec:       connect.Spec{Procedure: "/sqlrpc.v1.DatabaseService/Query"},
		}

		// 1. First call to populate cache
		_, err := wrap(context.Background(), req)
		assert.NoError(t, err)

		// 2. Manually expire cache item
		val, ok := interceptor.authCache.Load(authHeader)
		require.True(t, ok)
		item := val.(*authCacheItem)
		item.timestamp = time.Now().Unix() - 100 // Out of 60s window

		// 3. Second call should trigger expiration branch and re-validate
		_, err = wrap(context.Background(), req)
		assert.NoError(t, err)
	})

	t.Run("AdminService_Unauthorized", func(t *testing.T) {
		authHeader := "Bearer " + apiKey // RO user
		// ListApiKeys is now allowed for everyone in interceptor (auth happens in handler)
		{
			realReq := connect.NewRequest(&sqlrpcv1.ListAPIKeysRequest{})
			realReq.Header().Set("Authorization", authHeader)
			req := &mockRequest{
				AnyRequest: realReq,
				spec:       connect.Spec{Procedure: "/sqlrpc.v1.AdminService/ListAPIKeys"},
			}
			_, err := wrap(context.Background(), req)
			assert.NoError(t, err)
		}
		// DeleteUser
		{
			realReq := connect.NewRequest(&sqlrpcv1.DeleteUserRequest{})
			realReq.Header().Set("Authorization", authHeader)
			req := &mockRequest{
				AnyRequest: realReq,
				spec:       connect.Spec{Procedure: "/sqlrpc.v1.AdminService/DeleteUser"},
			}
			_, err := wrap(context.Background(), req)
			assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
		}
	})

	t.Run("Invalid_Message_Type", func(t *testing.T) {
		authHeader := "Bearer " + apiKey
		realReq := connect.NewRequest(&sqlrpcv1.QueryResponse{}) // WRONG message type for Query RPC
		realReq.Header().Set("Authorization", authHeader)
		req := &mockRequest{
			AnyRequest: realReq,
			spec:       connect.Spec{Procedure: "/sqlrpc.v1.DatabaseService/Query"},
		}
		_, err := wrap(context.Background(), req)
		// It might not return error, just default to read-only check or pass.
		// But it hits the `!ok` branch.
		assert.NoError(t, err)
	})

	t.Run("DatabaseService_RO_Write", func(t *testing.T) {
		authHeader := "Bearer " + apiKey // RO user
		realReq := connect.NewRequest(&sqlrpcv1.QueryRequest{Sql: "DELETE FROM users"})
		realReq.Header().Set("Authorization", authHeader)
		req := &mockRequest{
			AnyRequest: realReq,
			spec:       connect.Spec{Procedure: "/sqlrpc.v1.DatabaseService/Query"},
		}
		_, err := wrap(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	t.Run("AdminService RBAC", func(t *testing.T) {
		authHeader := "Bearer " + apiKey // This user is ROLE_READ_ONLY
		realReq := connect.NewRequest(&sqlrpcv1.CreateUserRequest{})
		realReq.Header().Set("Authorization", authHeader)
		req := &mockRequest{
			AnyRequest: realReq,
			spec:       connect.Spec{Procedure: "/sqlrpc.v1.AdminService/CreateUser"},
		}

		_, err := wrap(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	t.Run("Transaction_Procedures", func(t *testing.T) {
		authHeader := "Bearer " + apiKey
		// TransactionQuery (Write)
		{
			realReq := connect.NewRequest(&sqlrpcv1.TransactionQueryRequest{Sql: "DELETE FROM x"})
			realReq.Header().Set("Authorization", authHeader)
			req := &mockRequest{
				AnyRequest: realReq,
				spec:       connect.Spec{Procedure: "/sqlrpc.v1.DatabaseService/TransactionQuery"},
			}
			_, err := wrap(context.Background(), req)
			require.Error(t, err)
			assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
		}
		// TypedTransactionQuery (Read)
		{
			realReq := connect.NewRequest(&sqlrpcv1.TypedTransactionQueryRequest{Sql: "SELECT 1"})
			realReq.Header().Set("Authorization", authHeader)
			req := &mockRequest{
				AnyRequest: realReq,
				spec:       connect.Spec{Procedure: "/sqlrpc.v1.DatabaseService/TypedTransactionQuery"},
			}
			_, err := wrap(context.Background(), req)
			assert.NoError(t, err)
		}
	})

	t.Run("ExecuteTransaction_Coverage", func(t *testing.T) {
		authHeader := "Bearer " + apiKey
		reqContent := &sqlrpcv1.ExecuteTransactionRequest{
			Requests: []*sqlrpcv1.TransactionRequest{
				{Command: &sqlrpcv1.TransactionRequest_Begin{Begin: &sqlrpcv1.BeginRequest{}}},
				{Command: &sqlrpcv1.TransactionRequest_Query{Query: &sqlrpcv1.TransactionalQueryRequest{Sql: "DELETE FROM x"}}},
				{Command: &sqlrpcv1.TransactionRequest_Commit{}},
			},
		}
		realReq := connect.NewRequest(reqContent)
		realReq.Header().Set("Authorization", authHeader)
		req := &mockRequest{
			AnyRequest: realReq,
			spec:       connect.Spec{Procedure: "/sqlrpc.v1.DatabaseService/ExecuteTransaction"},
		}
		_, err := wrap(context.Background(), req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})
}

func TestAuthInterceptor_Stream_Receive_RBAC(t *testing.T) {
	// Setup with RO user
	tmpDir := t.TempDir()
	store, _ := auth.NewMetaStore(filepath.Join(tmpDir, "stream_rbac.db"))
	defer store.Close()
	_, _ = store.CreateUser(context.Background(), "rouser", "pass", sqlrpcv1.Role_ROLE_READ_ONLY)
	apiKey, _, _ := store.CreateApiKey(context.Background(), 1, "streamkey", nil)

	interceptor := NewAuthInterceptor(store)
	authHeader := "Bearer " + apiKey

	// Use WrapStreamingHandler to get the wrapper
	wrapperFunc := interceptor.WrapStreamingHandler(func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		// Try to receive. This should trigger the auth check in Receive().
		var msg sqlrpcv1.TransactionRequest
		return conn.Receive(&msg)
	})

	// Now we call wrapperFunc with our mock connection
	mockConn := &mockStreamingConn{
		header: http.Header{"Authorization": {authHeader}},
		msg: &sqlrpcv1.TransactionRequest{
			Command: &sqlrpcv1.TransactionRequest_Query{
				Query: &sqlrpcv1.TransactionalQueryRequest{
					Sql: "DELETE FROM users", // WRITE query
				},
			},
		},
	}

	// EXECUTE
	err := wrapperFunc(context.Background(), mockConn)

	// Expect PermissionDenied because User is RO and Query is DELETE
	require.Error(t, err)
	assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
}

func TestAuthInterceptor_ClearCache(t *testing.T) {
	store, password, _ := setupStore(t)
	interceptor := NewAuthInterceptor(store)
	middleware := interceptor.WrapUnary(func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		return connect.NewResponse(&struct{}{}), nil
	})

	// 1. Populate cache with a request
	req := connect.NewRequest(&struct{}{})
	authStr := base64.StdEncoding.EncodeToString([]byte("testuser:" + password))
	req.Header().Set("Authorization", "Basic "+authStr)
	_, err := middleware(context.Background(), req)
	require.NoError(t, err)

	// Verify it's cached (implementation detail access)
	var cached bool
	interceptor.authCache.Range(func(key, value any) bool {
		cached = true
		return false
	})
	require.True(t, cached, "Should be cached after successful request")

	// 2. Clear cache
	interceptor.ClearCache()

	// 3. Verify empty
	cached = false
	interceptor.authCache.Range(func(key, value any) bool {
		cached = true
		return false
	})
	assert.False(t, cached, "Cache should be empty after ClearCache")
}

func TestAuthInterceptor_WrapUnary_Procedures_Coverage(t *testing.T) {
	tmpDir := t.TempDir()
	store, _ := auth.NewMetaStore(filepath.Join(tmpDir, "interceptor_cov.db"))
	defer store.Close()
	_, _ = store.CreateUser(context.Background(), "admin", "adminpass", sqlrpcv1.Role_ROLE_ADMIN)
	apiKey, _, _ := store.CreateApiKey(context.Background(), 1, "adminkey", nil)
	authHeader := "Bearer " + apiKey

	interceptor := NewAuthInterceptor(store)
	next := func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		return connect.NewResponse(&sqlrpcv1.QueryResponse{}), nil
	}
	wrap := interceptor.WrapUnary(next)

	tests := []struct {
		name      string
		procedure string
		req       any
	}{
		{"Login", "/sqlrpc.v1.AdminService/Login", &sqlrpcv1.LoginRequest{}},
		{"Vacuum", "/sqlrpc.v1.DatabaseService/Vacuum", &sqlrpcv1.VacuumRequest{}},
		{"Checkpoint", "/sqlrpc.v1.DatabaseService/Checkpoint", &sqlrpcv1.CheckpointRequest{}},
		{"TypedQuery_Read", "/sqlrpc.v1.DatabaseService/TypedQuery", &sqlrpcv1.TypedQueryRequest{Sql: "SELECT 1"}},
		{"TypedQuery_Write", "/sqlrpc.v1.DatabaseService/TypedQuery", &sqlrpcv1.TypedQueryRequest{Sql: "DELETE FROM x"}},
		{"QueryStream_Write", "/sqlrpc.v1.DatabaseService/QueryStream", &sqlrpcv1.QueryRequest{Sql: "DELETE FROM x"}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Using reflect to call connect.NewRequest or just pass AnyRequest
			// Simplest is to just use connect.NewAnyRequest if it existed, but it doesn't.
			// However, connect.NewRequest is just a wrapper. We can use it with tt.req.
			// But Go generics need type at call site.
			// Let's use a switch or just accept the limitation.

			var realReq connect.AnyRequest
			switch v := tt.req.(type) {
			case *sqlrpcv1.LoginRequest:
				realReq = connect.NewRequest(v)
			case *sqlrpcv1.VacuumRequest:
				realReq = connect.NewRequest(v)
			case *sqlrpcv1.CheckpointRequest:
				realReq = connect.NewRequest(v)
			case *sqlrpcv1.TypedQueryRequest:
				realReq = connect.NewRequest(v)
			case *sqlrpcv1.QueryRequest:
				realReq = connect.NewRequest(v)
			}
			if tt.procedure != "/sqlrpc.v1.AdminService/Login" {
				realReq.Header().Set("Authorization", authHeader)
			}

			req := &mockRequest{
				AnyRequest: realReq,
				spec: connect.Spec{
					Procedure: tt.procedure,
				},
			}

			_, err := wrap(context.Background(), req)
			assert.NoError(t, err)
		})
	}
}

func TestAuthInterceptor_Receive_Types_Coverage(t *testing.T) {
	tmpDir := t.TempDir()
	store, _ := auth.NewMetaStore(filepath.Join(tmpDir, "receive_cov.db"))
	defer store.Close()
	_, _ = store.CreateUser(context.Background(), "admin", "adminpass", sqlrpcv1.Role_ROLE_ADMIN)
	apiKey, _, _ := store.CreateApiKey(context.Background(), 1, "receivekey", nil)
	authHeader := "Bearer " + apiKey

	interceptor := NewAuthInterceptor(store)

	wrapperFunc := interceptor.WrapStreamingHandler(func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		var msg sqlrpcv1.TransactionRequest
		return conn.Receive(&msg)
	})

	tests := []struct {
		name string
		msg  *sqlrpcv1.TransactionRequest
	}{
		{"QueryStream", &sqlrpcv1.TransactionRequest{
			Command: &sqlrpcv1.TransactionRequest_QueryStream{
				QueryStream: &sqlrpcv1.TransactionalQueryRequest{Sql: "SELECT 1"},
			},
		}},
		{"TypedQuery", &sqlrpcv1.TransactionRequest{
			Command: &sqlrpcv1.TransactionRequest_TypedQuery{
				TypedQuery: &sqlrpcv1.TypedTransactionalQueryRequest{Sql: "SELECT 1"},
			},
		}},
		{"TypedQueryStream", &sqlrpcv1.TransactionRequest{
			Command: &sqlrpcv1.TransactionRequest_TypedQueryStream{
				TypedQueryStream: &sqlrpcv1.TypedTransactionalQueryRequest{Sql: "SELECT 1"},
			},
		}},
		{"Default/Other", &sqlrpcv1.TransactionRequest{
			Command: &sqlrpcv1.TransactionRequest_Commit{},
		}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockConn := &mockStreamingConn{
				header: http.Header{"Authorization": {authHeader}},
				msg:    tt.msg,
			}
			err := wrapperFunc(context.Background(), mockConn)
			assert.NoError(t, err)
		})
	}
}

func TestNoAuthInterceptor(t *testing.T) {
	interceptor := NewNoAuthInterceptor()

	// 1. WrapUnary
	t.Run("WrapUnary injects admin", func(t *testing.T) {
		handler := interceptor.WrapUnary(func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			claims, ok := auth.FromContext(ctx)
			require.True(t, ok)
			assert.Equal(t, "anonymous-admin", claims.Username)
			assert.Equal(t, sqlrpcv1.Role_ROLE_ADMIN, claims.Role)
			return connect.NewResponse(&struct{}{}), nil
		})

		_, err := handler(context.Background(), connect.NewRequest(&struct{}{}))
		assert.NoError(t, err)
	})

	// 2. WrapStreamingHandler
	t.Run("WrapStreamingHandler injects admin", func(t *testing.T) {
		handler := interceptor.WrapStreamingHandler(func(ctx context.Context, conn connect.StreamingHandlerConn) error {
			claims, ok := auth.FromContext(ctx)
			require.True(t, ok)
			assert.Equal(t, "anonymous-admin", claims.Username)
			return nil
		})
		err := handler(context.Background(), &mockStreamingConn{})
		assert.NoError(t, err)
	})

	// 3. WrapStreamingClient (noop)
	t.Run("WrapStreamingClient is passthrough", func(t *testing.T) {
		called := false
		client := interceptor.WrapStreamingClient(func(ctx context.Context, spec connect.Spec) connect.StreamingClientConn {
			called = true
			return nil
		})
		client(context.Background(), connect.Spec{})
		assert.True(t, called)
	})
}

func TestLoggingInterceptor(t *testing.T) {
	interceptor := LoggingInterceptor()
	next := func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		return connect.NewResponse(&struct{}{}), nil
	}

	t.Run("Logs request", func(t *testing.T) {
		middleware := interceptor(next)
		req := connect.NewRequest(&struct{}{})
		_, err := middleware(context.Background(), req)
		assert.NoError(t, err)
	})

	t.Run("Disabled logging", func(t *testing.T) {
		t.Setenv("SQLITE_SERVER_DISABLE_REQUEST_LOGGING", "true")
		interceptorDisabled := LoggingInterceptor()
		middleware := interceptorDisabled(next)
		req := connect.NewRequest(&struct{}{})
		_, err := middleware(context.Background(), req)
		assert.NoError(t, err)
	})
}

func TestAuthInterceptor_WrapStreamingHandler_EdgeCases(t *testing.T) {
	store, _, _ := setupStore(t)
	interceptor := NewAuthInterceptor(store)

	middleware := interceptor.WrapStreamingHandler(func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		return nil
	})

	tests := []struct {
		name   string
		header string
	}{
		{"Unsupported Scheme", "Digest xyz"},
		{"Invalid Basic Format", "Basic bad-format"},
		{"Bearer Invalid Token", "Bearer invalid-token"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			header := make(http.Header)
			header.Set("Authorization", tt.header)
			err := middleware(context.Background(), &mockStreamingConn{header: header})
			assert.Error(t, err)
			assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
		})
	}
}
