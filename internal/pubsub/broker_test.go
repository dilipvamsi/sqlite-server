package pubsub

import (
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewBroker(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_broker.db")

	broker, err := NewBroker(dbPath, 24)
	require.NoError(t, err)
	require.NotNil(t, broker)
	defer broker.Stop()

	// Verify schema presence
	db := broker.GetDB()
	var tableName string
	err = db.QueryRow("SELECT name FROM sqlite_master WHERE type='table' AND name='messages'").Scan(&tableName)
	assert.NoError(t, err)
	assert.Equal(t, "messages", tableName)
}

func TestNewBroker_Errors(t *testing.T) {
	t.Run("fails on open error (invalid directory)", func(t *testing.T) {
		tmpDir := t.TempDir()
		dirPath := filepath.Join(tmpDir, "is_a_dir")
		err := os.Mkdir(dirPath, 0755)
		require.NoError(t, err)

		_, err = NewBroker(dirPath, 24)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "unable to open database file")
	})
}

func TestBrokerPublishAndSubscribeSignal(t *testing.T) {
	tmpDir := t.TempDir()
	broker, err := NewBroker(filepath.Join(tmpDir, "test.db"), 24)
	require.NoError(t, err)
	defer broker.Stop()

	dbName := "testdb"
	channel := "test_events"

	// Subscribe
	sigChan, cleanup := broker.SubscribeSignal(dbName, channel)
	defer cleanup()

	// Publish test
	items := []MsgPayload{
		{Channel: channel, Payload: "msg1"},
		{Channel: channel, Payload: "msg2"},
	}

	ids := broker.Publish(dbName, items)
	assert.Len(t, ids, 2)
	assert.True(t, ids[0] > 0)
	assert.True(t, ids[1] > ids[0])

	// Receive signals
	var received []MsgPayload
	timeout := time.After(2 * time.Second)

	for i := 0; i < 2; i++ {
		select {
		case msg := <-sigChan:
			received = append(received, msg)
		case <-timeout:
			t.Fatal("timeout waiting for signal")
		}
	}

	assert.Len(t, received, 2)
	assert.Equal(t, "msg1", received[0].Payload)
	assert.Equal(t, "msg2", received[1].Payload)
	assert.Equal(t, ids[0], received[0].ID)
	assert.Equal(t, ids[1], received[1].ID)
}

func TestBrokerPrune(t *testing.T) {
	tmpDir := t.TempDir()
	broker, err := NewBroker(filepath.Join(tmpDir, "test.db"), 1) // 1 hour TTL
	require.NoError(t, err)
	defer broker.Stop()

	db := broker.GetDB()

	// 1. Test Message Pruning
	// Insert old message directly
	_, err = db.Exec("INSERT INTO messages (db_source, channel, payload, created_at) VALUES ('db', 'ch', 'old', datetime('now', '-2 hours'))")
	require.NoError(t, err)

	// Insert fresh message
	_, err = db.Exec("INSERT INTO messages (db_source, channel, payload, created_at) VALUES ('db', 'ch', 'new', datetime('now'))")
	require.NoError(t, err)

	// 2. Test Subscription Pruning
	// Insert old subscription
	_, err = db.Exec("INSERT INTO subscriptions (name, db_name, channel, last_id, last_active) VALUES ('old-sub', 'db', 'ch', 0, datetime('now', '-31 days'))")
	require.NoError(t, err)

	// Insert fresh subscription
	_, err = db.Exec("INSERT INTO subscriptions (name, db_name, channel, last_id, last_active) VALUES ('new-sub', 'db', 'ch', 0, datetime('now'))")
	require.NoError(t, err)

	// Call prune explicitly
	broker.prune()

	// Verify old message is gone, fresh one remains
	var count int
	err = db.QueryRow("SELECT count(*) FROM messages").Scan(&count)
	require.NoError(t, err)
	assert.Equal(t, 1, count)

	var payload string
	err = db.QueryRow("SELECT payload FROM messages LIMIT 1").Scan(&payload)
	require.NoError(t, err)
	assert.Equal(t, "new", payload)

	// Verify old subscription is gone, fresh one remains
	err = db.QueryRow("SELECT count(*) FROM subscriptions").Scan(&count)
	require.NoError(t, err)
	assert.Equal(t, 1, count)

	var subName string
	err = db.QueryRow("SELECT name FROM subscriptions LIMIT 1").Scan(&subName)
	require.NoError(t, err)
	assert.Equal(t, "new-sub", subName)
}

func TestBrokerUpdateSubscription(t *testing.T) {
	tmpDir := t.TempDir()
	broker, err := NewBroker(filepath.Join(tmpDir, "test.db"), 24)
	require.NoError(t, err)
	defer broker.Stop()

	dbName := "testdb"
	channel := "test_events"
	subName := "worker-1"

	// Update first time
	broker.UpdateSubscription(subName, dbName, channel, 100)

	var lastID int64
	err = broker.GetDB().QueryRow("SELECT last_id FROM subscriptions WHERE name = ?", subName).Scan(&lastID)
	require.NoError(t, err)
	assert.Equal(t, int64(100), lastID)

	// Update again
	broker.UpdateSubscription(subName, dbName, channel, 205)
	err = broker.GetDB().QueryRow("SELECT last_id FROM subscriptions WHERE name = ?", subName).Scan(&lastID)
	require.NoError(t, err)
	assert.Equal(t, int64(205), lastID)
}

func TestBrokerConcurrency(t *testing.T) {
	tmpDir := t.TempDir()
	broker, err := NewBroker(filepath.Join(tmpDir, "test.db"), 24)
	require.NoError(t, err)
	defer broker.Stop()

	dbName := "testdb"
	channel := "test_events"

	var wg sync.WaitGroup
	// multiple publishers
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			broker.Publish(dbName, []MsgPayload{{Channel: channel, Payload: fmt.Sprintf("msg_%d", i)}})
		}(i)
	}

	wg.Wait()

	var count int
	err = broker.GetDB().QueryRow("SELECT count(*) FROM messages").Scan(&count)
	require.NoError(t, err)
	assert.Equal(t, 50, count)
}

func TestBroker_ErrorPaths(t *testing.T) {
	tmpDir := t.TempDir()
	broker, _ := NewBroker(filepath.Join(tmpDir, "errors.db"), 24)

	// 1. prune error
	broker.database.Close() // Force error
	broker.prune()          // Should log but not panic

	// 2. UpdateSubscription error
	broker.UpdateSubscription("sub", "db", "ch", 1) // Should log but not panic

	// 3. flush error (via resolveFailedBatch)
	broker.flush([]*PubRequest{{DbName: "test", Items: []MsgPayload{{Channel: "ch", Payload: "p"}}, Result: &RequestResult{Done: make(chan []int64, 1)}}})
}
