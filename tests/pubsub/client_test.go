package pubsub_test

import (
	"context"
	"crypto/tls"
	"encoding/base64"
	"net"
	"net/http"
	"os"
	"testing"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/protos/sqlrpc/v1/sqlrpcv1connect"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
)

// authInjector injects the Authorization header into all requests
type authInjector struct {
	token string
}

func (i *authInjector) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		if i.token != "" {
			req.Header().Set("Authorization", i.token)
		}
		return next(ctx, req)
	}
}

func (i *authInjector) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return func(ctx context.Context, spec connect.Spec) connect.StreamingClientConn {
		conn := next(ctx, spec)
		if i.token != "" {
			conn.RequestHeader().Set("Authorization", i.token)
		}
		return conn
	}
}

func (i *authInjector) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return next
}

// setupTestClient initializes the client for a test.
func setupTestClient(t *testing.T) (sqlrpcv1connect.DatabaseServiceClient, string) {
	t.Helper()
	serverURL := os.Getenv("SQLITE_SERVER_URL")
	if serverURL == "" {
		serverURL = "http://localhost:50173"
	}

	password := os.Getenv("SQLITE_SERVER_ADMIN_PASSWORD")
	if password == "" {
		password = "admin" // Default for local testing
	}

	var interceptors []connect.Interceptor
	authHeader := "Basic " + base64.StdEncoding.EncodeToString([]byte("admin:"+password))
	interceptors = append(interceptors, &authInjector{token: authHeader})

	// Use H2C transport to support unlimited concurrent streams over a single connection
	httpClient := &http.Client{
		Transport: &http2.Transport{
			AllowHTTP: true,
			DialTLSContext: func(ctx context.Context, network, addr string, _ *tls.Config) (net.Conn, error) {
				return (&net.Dialer{}).DialContext(ctx, network, addr)
			},
		},
	}

	client := sqlrpcv1connect.NewDatabaseServiceClient(
		httpClient,
		serverURL,
		connect.WithInterceptors(interceptors...),
	)

	// We use the test name for the database name to isolate tests
	dbName := "pubsub_test_" + t.Name()

	// Setup: Create a fresh database
	t.Logf("Setting up database '%s' for test...", dbName)
	adminClient := sqlrpcv1connect.NewAdminServiceClient(httpClient, serverURL, connect.WithInterceptors(interceptors...))
	_, _ = adminClient.DeleteDatabase(context.Background(), connect.NewRequest(&sqlrpcv1.DeleteDatabaseRequest{Name: dbName}))
	_, err := adminClient.CreateDatabase(context.Background(), connect.NewRequest(&sqlrpcv1.CreateDatabaseRequest{Name: dbName}))
	if err != nil {
		t.Fatalf("Failed to create test database: %v", err)
	}

	return client, dbName
}

// getUnauthenticatedClient returns a client with no auth headers.
func getUnauthenticatedClient(t *testing.T) (sqlrpcv1connect.DatabaseServiceClient, string) {
	t.Helper()
	serverURL := os.Getenv("SQLITE_SERVER_URL")
	if serverURL == "" {
		serverURL = "http://localhost:50173"
	}
	client := sqlrpcv1connect.NewDatabaseServiceClient(http.DefaultClient, serverURL)
	return client, serverURL
}

// getSubscriberClient returns a new authenticated client specifically for subscriptions.
// This is used to isolate stream connections from publish requests, preventing multiplexing
// bugs where stream responses leak across the single connection or buffer unexpectedly.
func getSubscriberClient(t *testing.T) sqlrpcv1connect.DatabaseServiceClient {
	t.Helper()
	serverURL := os.Getenv("SQLITE_SERVER_URL")
	if serverURL == "" {
		serverURL = "http://localhost:50173"
	}

	password := os.Getenv("SQLITE_SERVER_ADMIN_PASSWORD")
	if password == "" {
		password = "admin" // Default for local testing
	}

	var interceptors []connect.Interceptor
	authHeader := "Basic " + base64.StdEncoding.EncodeToString([]byte("admin:"+password))
	interceptors = append(interceptors, &authInjector{token: authHeader})

	// Use H2C transport to support unlimited concurrent streams over a single connection
	httpClient := &http.Client{
		Transport: &http2.Transport{
			AllowHTTP: true,
			DialTLSContext: func(ctx context.Context, network, addr string, _ *tls.Config) (net.Conn, error) {
				return (&net.Dialer{}).DialContext(ctx, network, addr)
			},
		},
	}

	return sqlrpcv1connect.NewDatabaseServiceClient(
		httpClient,
		serverURL,
		connect.WithInterceptors(interceptors...),
	)
}
