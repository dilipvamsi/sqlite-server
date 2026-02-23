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

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/protos/sqlrpc/v1/sqlrpcv1connect"
	"sqlite-server/internal/pubsub"
)

func TestPubSubService_Timestamp(t *testing.T) {
	// Setup broker
	tmpDir := t.TempDir()
	brokerDbPath := filepath.Join(tmpDir, "broker.db")
	broker, err := pubsub.NewBroker(brokerDbPath, 1)
	require.NoError(t, err)
	defer broker.Stop()

	config := &sqlrpcv1.DatabaseConfig{
		Name:   "test_ts",
		DbPath: filepath.Join(tmpDir, "test.db"),
	}

	server := NewDbServer([]*sqlrpcv1.DatabaseConfig{config}, nil, broker)
	mux := http.NewServeMux()
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

	t.Run("Verify Timestamp Presence", func(t *testing.T) {
		// 1. Publish historical message
		startTime := time.Now().UTC().Truncate(time.Second)
		_, err := client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
			Database: "test_ts",
			Channel:  "ts-chan",
			Payload:  "hist-msg",
		}))
		require.NoError(t, err)

		// 2. Subscribe
		req := connect.NewRequest(&sqlrpcv1.SubscribeRequest{
			Database:         "test_ts",
			Channel:          "ts-chan",
			SubscriptionName: "sub-ts",
		})
		stream, err := client.Subscribe(ctx, req)
		require.NoError(t, err)
		defer stream.Close()

		// 3. Check historical message timestamp
		if !stream.Receive() {
			t.Fatalf("failed to receive historical message: %v", stream.Err())
		}
		msg1 := stream.Msg()
		assert.Equal(t, "hist-msg", msg1.Payload)
		require.NotNil(t, msg1.CreatedAt, "CreatedAt should not be nil for historical message")

		msg1Time := msg1.CreatedAt.AsTime().UTC()
		assert.True(t, msg1Time.After(startTime) || msg1Time.Equal(startTime), "Historical: %v should be after or equal %v", msg1Time, startTime)

		// 4. Publish live message
		liveStartTime := time.Now().UTC().Truncate(time.Second)
		_, err = client.Publish(ctx, connect.NewRequest(&sqlrpcv1.PublishRequest{
			Database: "test_ts",
			Channel:  "ts-chan",
			Payload:  "live-msg",
		}))
		require.NoError(t, err)

		// 5. Check live message timestamp
		if !stream.Receive() {
			t.Fatalf("failed to receive live message: %v", stream.Err())
		}
		msg2 := stream.Msg()
		assert.Equal(t, "live-msg", msg2.Payload)
		require.NotNil(t, msg2.CreatedAt, "CreatedAt should not be nil for live message")

		msg2Time := msg2.CreatedAt.AsTime().UTC()
		assert.True(t, msg2Time.After(liveStartTime) || msg2Time.Equal(liveStartTime), "Live: %v should be after or equal %v", msg2Time, liveStartTime)
	})
}
