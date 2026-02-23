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
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/protos/sqlrpc/v1/sqlrpcv1connect"
	"sqlite-server/internal/pubsub"
)

// authInterceptor implements both UnaryInterceptor and StreamInterceptor
type authInterceptor struct {
	isAdmin *bool
}

func (i *authInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		if *i.isAdmin {
			ctx = auth.NewContext(ctx, &auth.UserClaims{Role: sqlrpcv1.Role_ROLE_ADMIN})
		} else {
			ctx = auth.NewContext(ctx, &auth.UserClaims{Role: sqlrpcv1.Role_ROLE_READ_ONLY})
		}
		return next(ctx, req)
	}
}

func (i *authInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		if *i.isAdmin {
			ctx = auth.NewContext(ctx, &auth.UserClaims{Role: sqlrpcv1.Role_ROLE_ADMIN})
		} else {
			ctx = auth.NewContext(ctx, &auth.UserClaims{Role: sqlrpcv1.Role_ROLE_READ_ONLY})
		}
		return next(ctx, conn)
	}
}

func (i *authInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return next
}

func TestPubSubService_Integration(t *testing.T) {
	// Setup broker
	tmpDir := t.TempDir()
	brokerDbPath := filepath.Join(tmpDir, "broker.db")
	broker, err := pubsub.NewBroker(brokerDbPath, 1)
	require.NoError(t, err)
	defer broker.Stop()

	// Initial configs
	config := &sqlrpcv1.DatabaseConfig{
		Name:   "test_pubsub",
		DbPath: filepath.Join(tmpDir, "test.db"),
	}

	// Create server directly to inject broker
	server := NewDbServer([]*sqlrpcv1.DatabaseConfig{config}, nil, broker)

	mux := http.NewServeMux()
	// Use a wrapper that allows toggling auth for tests
	isAdmin := true
	interceptor := &authInterceptor{isAdmin: &isAdmin}
	path, handler := sqlrpcv1connect.NewDatabaseServiceHandler(server, connect.WithInterceptors(interceptor))
	mux.Handle(path, handler)

	ts := httptest.NewUnstartedServer(h2c.NewHandler(mux, &http2.Server{}))
	ts.EnableHTTP2 = true
	ts.Start()
	t.Cleanup(func() {
		server.Stop()
		ts.Close()
	})

	httpClient := &http.Client{
		Transport: &http2.Transport{
			AllowHTTP: true,
			DialTLSContext: func(ctx context.Context, network, addr string, _ *tls.Config) (net.Conn, error) {
				return net.Dial(network, addr)
			},
		},
	}
	client := sqlrpcv1connect.NewDatabaseServiceClient(httpClient, ts.URL, connect.WithGRPC())

	ctx := context.Background()

	t.Run("Publish Unary Success", func(t *testing.T) {
		isAdmin = true
		req := connect.NewRequest(&sqlrpcv1.PublishRequest{
			Database: "test_pubsub",
			Channel:  "chan1",
			Payload:  "hello",
		})
		res, err := client.Publish(ctx, req)
		require.NoError(t, err)
		assert.Greater(t, res.Msg.MessageId, int64(0))
	})

	t.Run("Publish Unary Unauthorized", func(t *testing.T) {
		isAdmin = false
		req := connect.NewRequest(&sqlrpcv1.PublishRequest{
			Database: "test_pubsub",
			Channel:  "chan1",
			Payload:  "hello",
		})
		_, err := client.Publish(ctx, req)
		assert.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	t.Run("Publish Batch Success", func(t *testing.T) {
		isAdmin = true
		req := connect.NewRequest(&sqlrpcv1.PublishBatchRequest{
			Database: "test_pubsub",
			Items: []*sqlrpcv1.PublishItem{
				{Channel: "chan1", Payload: "batch1"},
				{Channel: "chan2", Payload: "batch2"},
			},
		})
		res, err := client.PublishBatch(ctx, req)
		require.NoError(t, err)
		assert.Len(t, res.Msg.MessageIds, 2)
	})

	t.Run("Publish Batch Empty", func(t *testing.T) {
		isAdmin = true
		req := connect.NewRequest(&sqlrpcv1.PublishBatchRequest{
			Database: "test_pubsub",
			Items:    []*sqlrpcv1.PublishItem{},
		})
		res, err := client.PublishBatch(ctx, req)
		require.NoError(t, err)
		assert.Empty(t, res.Msg.MessageIds)
	})

	t.Run("Subscribe and Catchup Success", func(t *testing.T) {
		isAdmin = true
		// Publish some historical messages
		_, err := client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
			Database: "test_pubsub",
			Channel:  "chan-sub",
			Payload:  "hist1",
		}))
		require.NoError(t, err)

		// Create subscription
		req := connect.NewRequest(&sqlrpcv1.SubscribeRequest{
			Database:         "test_pubsub",
			Channel:          "chan-sub",
			SubscriptionName: "sub1",
		})
		stream, err := client.Subscribe(ctx, req)
		require.NoError(t, err)
		defer stream.Close()

		// Receive historical message
		if !stream.Receive() {
			t.Fatalf("failed to receive historical message: %v", stream.Err())
		}
		assert.Equal(t, "hist1", stream.Msg().Payload)

		// Publish live message
		_, err = client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
			Database: "test_pubsub",
			Channel:  "chan-sub",
			Payload:  "live1",
		}))
		require.NoError(t, err)

		// Receive live message
		if !stream.Receive() {
			t.Fatalf("failed to receive live message: %v", stream.Err())
		}
		assert.Equal(t, "live1", stream.Msg().Payload)
	})

	t.Run("Database Not Found Errors", func(t *testing.T) {
		isAdmin = true
		// Publish
		_, err := client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
			Database: "non_existent",
			Channel:  "ch",
			Payload:  "p",
		}))
		assert.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))

		// Subscribe
		stream, err := client.Subscribe(ctx, connect.NewRequest(&sqlrpcv1.SubscribeRequest{
			Database: "non_existent",
			Channel:  "ch",
		}))
		assert.NoError(t, err) // Initial call should technically succeed in gRPC/Connect for streams
		assert.False(t, stream.Receive(), "stream should not receive any messages")
		err = stream.Err()
		assert.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))
	})

	t.Run("Publish Batch Error (no items)", func(t *testing.T) {
		isAdmin = true
		res, err := client.PublishBatch(ctx, connect.NewRequest(&sqlrpcv1.PublishBatchRequest{
			Database: "test_pubsub",
			Items:    nil,
		}))
		require.NoError(t, err)
		assert.Empty(t, res.Msg.MessageIds)
	})
}
