//go:build sqlite_vtable
// +build sqlite_vtable

package sqldrivers

import (
	"database/sql"
	"path/filepath"
	"testing"
	"time"

	"sqlite-server/internal/pubsub"

	"github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestVPubSub_Timestamp(t *testing.T) {
	tmpDir := t.TempDir()
	brokerDbPath := filepath.Join(tmpDir, "broker.db")

	// Ensure parseTime=true is used in Broker
	broker, err := pubsub.NewBroker(brokerDbPath, 1)
	require.NoError(t, err)
	defer broker.Stop()
	GlobalBroker = broker

	sql.Register("sqlite3_vpubsub_ts", &sqlite3.SQLiteDriver{
		ConnectHook: func(conn *sqlite3.SQLiteConn) error {
			registerVPubSub(conn, "test_ts")
			return nil
		},
	})

	db, err := sql.Open("sqlite3_vpubsub_ts", ":memory:")
	require.NoError(t, err)
	defer db.Close()

	_, err = db.Exec("CREATE VIRTUAL TABLE pubsub USING vpubsub")
	require.NoError(t, err)

	t.Run("Insert with Default Timestamp", func(t *testing.T) {
		startTime := time.Now().UTC().Truncate(time.Second)
		_, err = db.Exec("INSERT INTO pubsub (channel, payload) VALUES (?, ?)", "chan1", "default-ts")
		require.NoError(t, err)

		var id int64
		var channel, payload, createdAt string
		err = db.QueryRow("SELECT id, channel, payload, created_at FROM pubsub WHERE channel = 'chan1'").Scan(&id, &channel, &payload, &createdAt)
		require.NoError(t, err)

		assert.Equal(t, "chan1", channel)
		assert.Equal(t, "default-ts", payload)
		assert.NotEmpty(t, createdAt)

		ts, err := time.Parse("2006-01-02 15:04:05", createdAt)
		require.NoError(t, err)
		tsUTC := ts.UTC()
		assert.True(t, tsUTC.After(startTime) || tsUTC.Equal(startTime), "Timestamp %v should be after or equal %v", tsUTC, startTime)
	})

	t.Run("Insert with Explicit Timestamp", func(t *testing.T) {
		explicitTime := time.Date(2025, 1, 1, 12, 0, 0, 0, time.UTC)
		explicitTimeStr := explicitTime.Format("2006-01-02 15:04:05")

		_, err = db.Exec("INSERT INTO pubsub (channel, payload, created_at) VALUES (?, ?, ?)", "chan2", "explicit-ts", explicitTimeStr)
		require.NoError(t, err)

		var createdAt string
		err = db.QueryRow("SELECT created_at FROM pubsub WHERE channel = 'chan2'").Scan(&createdAt)
		require.NoError(t, err)

		assert.Equal(t, explicitTimeStr, createdAt)
	})
}
