package sqldrivers

import (
	"path/filepath"
	"testing"
	"time"

	"sqlite-server/internal/pubsub"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestBatchAggregator(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_broker.db")

	broker, err := pubsub.NewBroker(dbPath, 24)
	require.NoError(t, err)
	defer broker.Stop()

	agg := &BatchAggregator{
		broker: broker,
		dbName: "testdb",
	}

	// Step multiple times
	for i := 0; i < 500; i++ {
		agg.Step("ch", "msg")
	}
	assert.Len(t, agg.pendingMessages, 500)

	// Step to reach batch limit (1000)
	for i := 0; i < 500; i++ {
		agg.Step("ch", "msg")
	}
	// The 1000th step triggers a flush (Publish) and resets the slice
	assert.Len(t, agg.pendingMessages, 0)

	// Step 5 more times
	for i := 0; i < 5; i++ {
		agg.Step("ch", "msg2")
	}
	assert.Len(t, agg.pendingMessages, 5)

	// Call Done to flush the remaining 5
	res := agg.Done()
	assert.Equal(t, "OK", res)

	// Verify messages made it to the broker
	time.Sleep(100 * time.Millisecond) // Give broker batcher time to flush
	var count int
	err = broker.GetDB().QueryRow("SELECT count(*) FROM messages").Scan(&count)
	require.NoError(t, err)
	assert.Equal(t, 1005, count)
}
