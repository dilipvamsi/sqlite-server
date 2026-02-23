package sqldrivers

import (
	"path/filepath"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/pubsub"
)

func TestSqlite_PublishFunction(t *testing.T) {
	tmpDir := t.TempDir()
	brokerDbPath := filepath.Join(tmpDir, "_system_broker.db")

	broker, err := pubsub.NewBroker(brokerDbPath, 24)
	require.NoError(t, err)
	defer broker.Stop()

	// Intercept the global broker so the sqlite driver connects to it during creation
	originalBroker := GlobalBroker
	GlobalBroker = broker
	defer func() {
		GlobalBroker = originalBroker
	}()

	dbPath := filepath.Join(tmpDir, "test_publish.db")
	config := &sqlrpcv1.DatabaseConfig{
		Name:   "test_publish",
		DbPath: dbPath,
	}

	db, err := NewSqliteDb(config, false)
	require.NoError(t, err)
	defer db.Close()

	// Use the publish() scalar SQL function
	var insertedId int64
	err = db.QueryRow("SELECT publish('test-channel-func', 'hello from scalar func')").Scan(&insertedId)
	require.NoError(t, err)
	assert.Greater(t, insertedId, int64(0))

	// Wait briefly for background flush
	time.Sleep(50 * time.Millisecond)

	// Verify it reached the broker's underlying DB
	var count int
	err = broker.GetDB().QueryRow("SELECT count(*) FROM messages WHERE channel = 'test-channel-func' AND payload = 'hello from scalar func'").Scan(&count)
	require.NoError(t, err)
	assert.Equal(t, 1, count)
}
