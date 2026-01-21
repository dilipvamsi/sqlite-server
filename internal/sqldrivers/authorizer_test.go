package sqldrivers

import (
	"testing"

	"github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

func TestReadOnlyAuthorizer(t *testing.T) {
	t.Run("allows SELECT", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_SELECT, "", "", "", "")
		assert.Equal(t, sqlite3.SQLITE_OK, result)
	})

	t.Run("allows READ", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_READ, "table", "column", "", "")
		assert.Equal(t, sqlite3.SQLITE_OK, result)
	})

	t.Run("allows PRAGMA", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_PRAGMA, "table_info", "", "", "")
		assert.Equal(t, sqlite3.SQLITE_OK, result)
	})

	t.Run("denies INSERT", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_INSERT, "users", "", "", "")
		assert.Equal(t, sqlite3.SQLITE_DENY, result)
	})

	t.Run("denies UPDATE", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_UPDATE, "users", "name", "", "")
		assert.Equal(t, sqlite3.SQLITE_DENY, result)
	})

	t.Run("denies DELETE", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_DELETE, "users", "", "", "")
		assert.Equal(t, sqlite3.SQLITE_DENY, result)
	})

	t.Run("denies DROP_TABLE", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_DROP_TABLE, "users", "", "", "")
		assert.Equal(t, sqlite3.SQLITE_DENY, result)
	})

	t.Run("denies CREATE_TABLE", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_CREATE_TABLE, "new_table", "", "", "")
		assert.Equal(t, sqlite3.SQLITE_DENY, result)
	})

	t.Run("denies ALTER_TABLE", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_ALTER_TABLE, "users", "", "", "")
		assert.Equal(t, sqlite3.SQLITE_DENY, result)
	})

	t.Run("denies ATTACH", func(t *testing.T) {
		result := ReadOnlyAuthorizer(sqlite3.SQLITE_ATTACH, "other.db", "", "", "")
		assert.Equal(t, sqlite3.SQLITE_DENY, result)
	})
}

func TestWriteActionsMap(t *testing.T) {
	// Ensure all expected write actions are in the map
	expectedWrites := []int{
		sqlite3.SQLITE_INSERT,
		sqlite3.SQLITE_UPDATE,
		sqlite3.SQLITE_DELETE,
		sqlite3.SQLITE_DROP_TABLE,
		sqlite3.SQLITE_CREATE_TABLE,
		sqlite3.SQLITE_ALTER_TABLE,
	}

	for _, action := range expectedWrites {
		assert.True(t, WriteActions[action], "action %d should be a write action", action)
	}

	// Ensure read actions are not in the map
	readActions := []int{
		sqlite3.SQLITE_SELECT,
		sqlite3.SQLITE_READ,
		sqlite3.SQLITE_PRAGMA,
		sqlite3.SQLITE_FUNCTION,
	}

	for _, action := range readActions {
		assert.False(t, WriteActions[action], "action %d should not be a write action", action)
	}
}
