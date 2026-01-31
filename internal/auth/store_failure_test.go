package auth

import (
	"context"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewMetaStore_MigrateError(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "bad_migration.db")

	// Create a file that is NOT a sqlite database but contains garbage
	// causing migration to fail if it tries to exec SQL?
	// Actually, sqlite might just complain "file is not a database".
	// Store.migrate() runs `Exec(schemaSQL)`.
	// If file is garbage, Open might succeed (sqlite is lenient), but Exec might fail.
	err := os.WriteFile(dbPath, []byte("NOT A SQLITE DB"), 0644)
	require.NoError(t, err)

	store, err := NewMetaStore(dbPath)
	// Expect failure during migration or open
	require.Error(t, err)
	assert.Nil(t, store)
}

func TestMetaStore_UpsertDatabaseConfig_Error(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "upsert_error.db")
	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)

	// Close DB to force error
	store.Close()

	err = store.UpsertDatabaseConfig(context.Background(), "fail", filepath.Join(tmpDir, "path"), true, "{}")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "failed to upsert")
}

func TestMetaStore_ListDatabaseConfigs_Error(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "list_error.db")
	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)

	store.Close()

	_, err = store.ListDatabaseConfigs(context.Background())
	require.Error(t, err)
}

func TestMetaStore_GetDatabaseConfig_Error(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "get_error.db")
	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)

	store.Close()

	_, err = store.GetDatabaseConfig(context.Background(), "fail")
	require.Error(t, err)
}
