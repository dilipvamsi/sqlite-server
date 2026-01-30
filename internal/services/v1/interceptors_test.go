package servicesv1

import (
	"context"
	"encoding/base64"
	"errors"
	"net/http"
	"path/filepath"
	"testing"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"

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
	userID, err := store.CreateUser(ctx, "testuser", "password123", dbv1.Role_ROLE_READ_WRITE)
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
}

func (m *mockStreamingConn) RequestHeader() http.Header {
	return m.header
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

	conn := middleware(context.Background(), connect.Spec{})
	assert.Nil(t, conn)
	assert.True(t, called)
}
