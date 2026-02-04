package servicesv1

import (
	"context"
	"crypto/tls"
	"net"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"
)

// setupAuthIntegrationServer sets up a server with the REAL AuthInterceptor
func setupAuthIntegrationServer(t *testing.T) (dbv1connect.DatabaseServiceClient, dbv1connect.AdminServiceClient, *auth.MetaStore, string, string, string) {
	// 1. Setup Store
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "auth_test.db")
	store, err := auth.NewMetaStore(dbPath)
	require.NoError(t, err)

	// Default Admin (created by NewMetaStore usually, but let's ensure)
	adminPwd, err := store.EnsureDefaultAdmin("", "")
	require.NoError(t, err)

	// Get Admin Key
	adminKey, _, err := store.CreateApiKey(context.Background(), 1, "admin-key", nil) // User 1 is admin
	require.NoError(t, err)

	// Create ReadOnly User
	roUser, err := store.CreateUser(context.Background(), "ro_user", "pass", dbv1.Role_ROLE_READ_ONLY)
	require.NoError(t, err)
	roKey, _, err := store.CreateApiKey(context.Background(), roUser, "ro-key", nil)
	require.NoError(t, err)

	// 2. Setup DB Server
	config := &dbv1.DatabaseConfig{
		Name:   "test",
		DbPath: ":memory:",
	}
	server := NewDbServer([]*dbv1.DatabaseConfig{config}, store)

	// 3. Setup Handler with REAL AuthInterceptor
	interceptors := connect.WithInterceptors(
		NewAuthInterceptor(store),
	)

	mux := http.NewServeMux()
	path, handler := dbv1connect.NewDatabaseServiceHandler(server, interceptors)
	mux.Handle(path, handler)
	// 1. Setup Admin Server
	// Pass nil for cache invalidator as tests don't check cache side-effects explicitly yet
	adminServer := NewAdminServer(store, server, nil, false, "v0.0.1-integration-test")
	adminPath, adminHandler := dbv1connect.NewAdminServiceHandler(adminServer, interceptors)
	mux.Handle(adminPath, adminHandler)

	// 4. Start HTTP Server
	ts := httptest.NewUnstartedServer(h2c.NewHandler(mux, &http2.Server{}))
	ts.EnableHTTP2 = true
	ts.Start()

	t.Cleanup(func() {
		server.Stop()
		ts.Close()
		store.Close()
	})

	// 5. Clients
	httpClient := &http.Client{
		Transport: &http2.Transport{
			AllowHTTP: true,
			DialTLSContext: func(ctx context.Context, network, addr string, _ *tls.Config) (net.Conn, error) {
				return net.Dial(network, addr)
			},
		},
	}

	dbClient := dbv1connect.NewDatabaseServiceClient(httpClient, ts.URL, connect.WithGRPC())
	adminClient := dbv1connect.NewAdminServiceClient(httpClient, ts.URL, connect.WithGRPC())

	return dbClient, adminClient, store, adminKey, roKey, adminPwd
}

func authHeader(key string) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			req.Header().Set("Authorization", "Bearer "+key)
			return next(ctx, req)
		}
	}
}

func TestAuthIntegration_Permissions(t *testing.T) {
	dbClient, adminClient, _, adminKey, roKey, adminPwd := setupAuthIntegrationServer(t)
	ctx := context.Background()

	// 1. Admin Access with Admin Key -> OK
	t.Run("Admin_CreateUser_Success", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CreateUserRequest{
			Username: "newuser",
			Password: "pass",
			Role:     dbv1.Role_ROLE_READ_WRITE,
		})
		req.Header().Set("Authorization", "Bearer "+adminKey)

		_, err := adminClient.CreateUser(ctx, req)
		assert.NoError(t, err)
	})

	// 2. Admin Access with ReadOnly Key -> PermissionDenied
	t.Run("Admin_CreateUser_Denied", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CreateUserRequest{
			Username: "hacker",
			Password: "pass",
		})
		req.Header().Set("Authorization", "Bearer "+roKey)

		_, err := adminClient.CreateUser(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	// 3. Write Query with ReadOnly Key -> PermissionDenied
	t.Run("DB_Write_Denied", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "CREATE TABLE foo (id INT)",
		})
		req.Header().Set("Authorization", "Bearer "+roKey)

		_, err := dbClient.Query(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	// 4. Read Query with ReadOnly Key -> OK
	t.Run("DB_Read_Success", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT 1",
		})
		req.Header().Set("Authorization", "Bearer "+roKey)

		_, err := dbClient.Query(ctx, req)
		assert.NoError(t, err)
	})

	// 5. Admin can Write -> OK
	t.Run("DB_Write_Admin_Success", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "CREATE TABLE bar (id INT)",
		})
		req.Header().Set("Authorization", "Bearer "+adminKey)

		_, err := dbClient.Query(ctx, req)
		assert.NoError(t, err)
	})

	// 6. Login Endpoint (No Auth Required)
	t.Run("Login_NoAuth", func(t *testing.T) {
		// Login doesn't need header, validation is in body
		req := connect.NewRequest(&dbv1.LoginRequest{
			Username: "admin",
			Password: adminPwd, // Use captured password
		})
		// No auth header needed

		res, err := adminClient.Login(ctx, req)
		require.NoError(t, err)
		assert.NotEmpty(t, res.Msg.ApiKey)
	})
}
