package servicesv1

import (
	"context"
	"database/sql"
	"path/filepath"
	"testing"

	"sqlite-server/internal/auth"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupAttachmentTest(t *testing.T) (*DbServer, *auth.MetaStore, *DbManager) {
	tmpDir := t.TempDir()
	metaDbPath := filepath.Join(tmpDir, "meta.db")
	store, err := auth.NewMetaStore(metaDbPath)
	require.NoError(t, err)
	t.Cleanup(func() { store.Close() })

	dbServer := NewDbServer(nil, store, nil)
	mgr := dbServer.dbManager

	// Create a main database
	mainDbPath := filepath.Join(tmpDir, "main.db")
	mainConfig := &sqlrpcv1.DatabaseConfig{
		Name:   "primary",
		DbPath: mainDbPath,
	}
	err = mgr.Mount(mainConfig)
	require.NoError(t, err)

	err = store.UpsertDatabaseConfig(context.Background(), "primary", mainDbPath, false, "{}")
	require.NoError(t, err)

	return dbServer, store, mgr
}

func TestAttachedDatabases(t *testing.T) {
	dbServer, store, mgr := setupAttachmentTest(t)
	ctx := context.Background()
	tmpDir := t.TempDir()

	// Create a second database to be attached
	attachDbPath := filepath.Join(tmpDir, "attached.db")
	attachConfig := &sqlrpcv1.DatabaseConfig{
		Name:   "attached_db",
		DbPath: attachDbPath,
	}
	err := mgr.Mount(attachConfig)
	require.NoError(t, err)

	err = store.UpsertDatabaseConfig(context.Background(), "attached_db", attachDbPath, false, "{}")
	require.NoError(t, err)

	// Initialize the attached db with some data
	adbRaw, err := sql.Open("sqlite3", attachDbPath)
	require.NoError(t, err)
	_, err = adbRaw.Exec("CREATE TABLE shared (id INTEGER PRIMARY KEY, val TEXT); INSERT INTO shared (val) VALUES ('hello');")
	require.NoError(t, err)
	adbRaw.Close()

	ctx = adminContext(sqlrpcv1.Role_ROLE_READ_ONLY) // ReadOnly should be enough

	t.Run("AttachDatabase RPC", func(t *testing.T) {
		req := connect.NewRequest(&sqlrpcv1.AttachDatabaseRequest{
			ParentDatabase: "primary",
			Attachment: &sqlrpcv1.Attachment{
				TargetDatabaseName: "attached_db",
				Alias:              "ext",
			},
		})

		resp, err := dbServer.AttachDatabase(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)

		// Verify it can be queried
		conn, err := mgr.GetConnection(context.Background(), "primary", ModeRW)
		require.NoError(t, err)

		var val string
		err = conn.QueryRow("SELECT val FROM ext.shared").Scan(&val)
		assert.NoError(t, err)
		assert.Equal(t, "hello", val)
	})

	t.Run("DetachDatabase RPC", func(t *testing.T) {
		req := connect.NewRequest(&sqlrpcv1.DetachDatabaseRequest{
			ParentDatabase: "primary",
			Alias:          "ext",
		})

		resp, err := dbServer.DetachDatabase(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)

		// Verify it's gone (should fail to query)
		conn, err := mgr.GetConnection(context.Background(), "primary", ModeRW)
		require.NoError(t, err)

		_, err = conn.Exec("SELECT * FROM ext.shared")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "no such table: ext.shared")
	})

	t.Run("ReadOnly Enforcement", func(t *testing.T) {
		// Re-attach
		_, err := dbServer.AttachDatabase(ctx, connect.NewRequest(&sqlrpcv1.AttachDatabaseRequest{
			ParentDatabase: "primary",
			Attachment: &sqlrpcv1.Attachment{
				TargetDatabaseName: "attached_db",
				Alias:              "ext_ro",
			},
		}))
		require.NoError(t, err)

		// Get RO connection
		conn, err := mgr.GetConnection(context.Background(), "primary", ModeRO)
		require.NoError(t, err)

		// Try to write to attached db - should FAIL
		_, err = conn.Exec("INSERT INTO ext_ro.shared (val) VALUES ('bad')")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not authorized")
	})

	t.Run("Persistence Check", func(t *testing.T) {
		// After a reload/restart of mgr, it should still have the attachment
		// We simulate this by checking the config in mgr
		configs, err := store.ListDatabaseConfigs(context.Background())
		require.NoError(t, err)

		var foundPrimary bool
		for _, c := range configs {
			if c.Name == "primary" {
				foundPrimary = true
				// Load it into mgr2
				// Using the same unmarshal logic as in admin_service
				// but here we just want to verify it was saved.
				assert.Contains(t, c.Settings, "ext_ro")
			}
		}
		assert.True(t, foundPrimary)
	})

	t.Run("DbServer AttachDatabase Failures", func(t *testing.T) {
		// Parent not found
		req := connect.NewRequest(&sqlrpcv1.AttachDatabaseRequest{
			ParentDatabase: "nonexistent",
			Attachment:     &sqlrpcv1.Attachment{TargetDatabaseName: "attached_db", Alias: "fail"},
		})
		_, err := dbServer.AttachDatabase(ctx, req)
		assert.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))

		// Target not found
		req = connect.NewRequest(&sqlrpcv1.AttachDatabaseRequest{
			ParentDatabase: "primary",
			Attachment:     &sqlrpcv1.Attachment{TargetDatabaseName: "ghost", Alias: "fail"},
		})
		_, err = dbServer.AttachDatabase(ctx, req)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "target database 'ghost' not found")

		// Duplicate alias
		req = connect.NewRequest(&sqlrpcv1.AttachDatabaseRequest{
			ParentDatabase: "primary",
			Attachment:     &sqlrpcv1.Attachment{TargetDatabaseName: "primary", Alias: "ext_ro"},
		})
		_, err = dbServer.AttachDatabase(ctx, req)
		assert.Error(t, err)
		assert.Equal(t, connect.CodeAlreadyExists, connect.CodeOf(err))
	})

	t.Run("AttachDatabase Corrupted Settings", func(t *testing.T) {
		dbServer, _, _ := setupAttachmentTest(t)
		store := dbServer.store

		// Insert corrupted JSON settings
		_, err := store.GetDB().Exec("INSERT INTO databases (name, path, is_managed, settings) VALUES (?, ?, ?, ?)",
			"corrupt", "any", 0, "{invalid-json}")
		require.NoError(t, err)

		req := connect.NewRequest(&sqlrpcv1.AttachDatabaseRequest{
			ParentDatabase: "corrupt",
			Attachment:     &sqlrpcv1.Attachment{TargetDatabaseName: "t", Alias: "a"},
		})
		_, err = dbServer.AttachDatabase(ctx, req)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to parse existing config")
	})

	t.Run("DbServer DetachDatabase Failures", func(t *testing.T) {
		// Parent not found
		req := connect.NewRequest(&sqlrpcv1.DetachDatabaseRequest{
			ParentDatabase: "nonexistent",
			Alias:          "ext_ro",
		})
		_, err := dbServer.DetachDatabase(ctx, req)
		assert.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))

		// Alias not found
		req = connect.NewRequest(&sqlrpcv1.DetachDatabaseRequest{
			ParentDatabase: "primary",
			Alias:          "ghost",
		})
		_, err = dbServer.DetachDatabase(ctx, req)
		assert.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))
	})

	t.Run("DbManager Failures", func(t *testing.T) {
		// Attach parent not found
		err := mgr.AttachDatabase("ghost", &sqlrpcv1.Attachment{TargetDatabaseName: "attached_db", Alias: "err"})
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")

		// Attach target not found
		err = mgr.AttachDatabase("primary", &sqlrpcv1.Attachment{TargetDatabaseName: "ghost", Alias: "err"})
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "target database 'ghost' not found")

		// Attach duplicate alias (with different target)
		err = mgr.AttachDatabase("primary", &sqlrpcv1.Attachment{TargetDatabaseName: "primary", Alias: "ext_ro"})
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "already exists")

		// Detach parent not found
		err = mgr.DetachDatabase("ghost", "ext_ro")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")

		// Detach alias not found
		err = mgr.DetachDatabase("primary", "ghost")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("invalidateCache Coverage", func(t *testing.T) {
		// Setup connections in cache
		_, err := mgr.GetConnection(context.Background(), "primary", ModeRW)
		require.NoError(t, err)
		_, err = mgr.GetConnection(context.Background(), "primary", ModeRO)
		require.NoError(t, err)

		// Call invalidateCache
		mgr.invalidateCache("primary")

		// Verify they are gone from cache (GetConnection will create NEW ones if called, but we can check if they're closed by trying to use the old ones if we hold them, but here we just want code coverage of the LoadAndDelete paths)
		// We can check if LoadAndDelete returns false now
		_, ok := mgr.cacheRW.Load("primary")
		assert.False(t, ok)
		_, ok = mgr.cacheRO.Load("primary")
		assert.False(t, ok)
	})

	t.Run("Internal Error Scenarios", func(t *testing.T) {
		dbServer, store, _ := setupAttachmentTest(t)

		// 1. GetDatabaseConfig error (covered elsewhere, but let's be sure)
		store.Close()
		req := connect.NewRequest(&sqlrpcv1.AttachDatabaseRequest{
			ParentDatabase: "primary",
			Attachment:     &sqlrpcv1.Attachment{TargetDatabaseName: "attached_db", Alias: "fail"},
		})
		_, err := dbServer.AttachDatabase(ctx, req)
		assert.Error(t, err)
		assert.Equal(t, connect.CodeInternal, connect.CodeOf(err))
	})
}
