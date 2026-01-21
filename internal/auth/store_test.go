package auth

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewMetaStore(t *testing.T) {
	// Create temp dir for test databases
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_meta.db")

	t.Run("creates new database successfully", func(t *testing.T) {
		store, err := NewMetaStore(dbPath)
		require.NoError(t, err)
		require.NotNil(t, store)
		defer store.Close()

		// Verify database file was created
		_, err = os.Stat(dbPath)
		assert.NoError(t, err)

		// Verify tables exist by querying them
		var count int
		err = store.db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)
		assert.NoError(t, err)
		assert.Equal(t, 0, count)

		err = store.db.QueryRow("SELECT COUNT(*) FROM api_keys").Scan(&count)
		assert.NoError(t, err)
		assert.Equal(t, 0, count)
	})

	t.Run("migration is idempotent", func(t *testing.T) {
		dbPath := filepath.Join(tmpDir, "test_meta_idempotent.db")

		// Open and close twice
		store1, err := NewMetaStore(dbPath)
		require.NoError(t, err)
		store1.Close()

		store2, err := NewMetaStore(dbPath)
		require.NoError(t, err)
		defer store2.Close()

		// Should work without errors
		var count int
		err = store2.db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)
		assert.NoError(t, err)
	})
}

func TestMetaStore_EnsureDefaultAdmin(t *testing.T) {
	tmpDir := t.TempDir()

	t.Run("creates admin when no users exist", func(t *testing.T) {
		dbPath := filepath.Join(tmpDir, "test_admin.db")
		store, err := NewMetaStore(dbPath)
		require.NoError(t, err)
		defer store.Close()

		password, err := store.EnsureDefaultAdmin()
		require.NoError(t, err)
		assert.NotEmpty(t, password)

		// Verify admin was created
		var count int
		err = store.db.QueryRow("SELECT COUNT(*) FROM users WHERE username = 'admin'").Scan(&count)
		assert.NoError(t, err)
		assert.Equal(t, 1, count)
	})

	t.Run("does nothing when users already exist", func(t *testing.T) {
		dbPath := filepath.Join(tmpDir, "test_admin_exists.db")
		store, err := NewMetaStore(dbPath)
		require.NoError(t, err)
		defer store.Close()

		// Create admin first time
		_, err = store.EnsureDefaultAdmin()
		require.NoError(t, err)

		// Call again - should return empty password (no action)
		password, err := store.EnsureDefaultAdmin()
		require.NoError(t, err)
		assert.Empty(t, password)
	})

	t.Run("uses env var password when set", func(t *testing.T) {
		dbPath := filepath.Join(tmpDir, "test_admin_env.db")

		// Set env var
		os.Setenv("SQLITE_SERVER_ADMIN_PASSWORD", "env-password-123")
		defer os.Unsetenv("SQLITE_SERVER_ADMIN_PASSWORD")

		store, err := NewMetaStore(dbPath)
		require.NoError(t, err)
		defer store.Close()

		password, err := store.EnsureDefaultAdmin()
		require.NoError(t, err)
		assert.Equal(t, "env-password-123", password)
	})
}

func TestMetaStore_ValidateUser(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_validate.db")

	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	// Create admin with known password
	os.Setenv("SQLITE_SERVER_ADMIN_PASSWORD", "test-password-456")
	defer os.Unsetenv("SQLITE_SERVER_ADMIN_PASSWORD")
	_, err = store.EnsureDefaultAdmin()
	require.NoError(t, err)

	ctx := context.Background()

	t.Run("valid credentials return user claims", func(t *testing.T) {
		claims, err := store.ValidateUser(ctx, "admin", "test-password-456")
		require.NoError(t, err)
		require.NotNil(t, claims)
		assert.Equal(t, "admin", claims.Username)
		assert.Equal(t, RoleAdmin, claims.Role)
		assert.Greater(t, claims.UserID, int64(0))
	})

	t.Run("invalid password returns nil", func(t *testing.T) {
		claims, err := store.ValidateUser(ctx, "admin", "wrong-password")
		require.NoError(t, err)
		assert.Nil(t, claims)
	})

	t.Run("non-existent user returns nil", func(t *testing.T) {
		claims, err := store.ValidateUser(ctx, "nonexistent", "any-password")
		require.NoError(t, err)
		assert.Nil(t, claims)
	})
}

func TestUserContext(t *testing.T) {
	t.Run("round trip context storage", func(t *testing.T) {
		claims := &UserClaims{
			UserID:   42,
			Username: "testuser",
			Role:     RoleReadWrite,
		}

		ctx := context.Background()
		ctx = NewContext(ctx, claims)

		retrieved, ok := FromContext(ctx)
		require.True(t, ok)
		assert.Equal(t, claims.UserID, retrieved.UserID)
		assert.Equal(t, claims.Username, retrieved.Username)
		assert.Equal(t, claims.Role, retrieved.Role)
	})

	t.Run("missing context returns false", func(t *testing.T) {
		ctx := context.Background()
		claims, ok := FromContext(ctx)
		assert.False(t, ok)
		assert.Nil(t, claims)
	})
}

func TestGenerateRandomPassword(t *testing.T) {
	t.Run("generates password of correct length", func(t *testing.T) {
		password := generateRandomPassword(16)
		assert.Len(t, password, 16)
	})

	t.Run("generates unique passwords", func(t *testing.T) {
		p1 := generateRandomPassword(16)
		p2 := generateRandomPassword(16)
		assert.NotEqual(t, p1, p2)
	})
}

// ============================================================================
// User CRUD Tests
// ============================================================================

func TestMetaStore_CreateUser(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_create_user.db")

	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	ctx := context.Background()

	t.Run("creates user successfully", func(t *testing.T) {
		userID, err := store.CreateUser(ctx, "testuser", "password123", RoleReadWrite)
		require.NoError(t, err)
		assert.Greater(t, userID, int64(0))
	})

	t.Run("validates role", func(t *testing.T) {
		_, err := store.CreateUser(ctx, "baduser", "password123", "invalid_role")
		require.Error(t, err)
		assert.Contains(t, err.Error(), "invalid role")
	})

	t.Run("prevents duplicate usernames", func(t *testing.T) {
		_, err := store.CreateUser(ctx, "dupuser", "password123", RoleReadOnly)
		require.NoError(t, err)

		_, err = store.CreateUser(ctx, "dupuser", "password456", RoleReadWrite)
		require.Error(t, err)
	})
}

func TestMetaStore_DeleteUser(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_delete_user.db")

	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	ctx := context.Background()

	t.Run("deletes existing user", func(t *testing.T) {
		_, err := store.CreateUser(ctx, "todelete", "password123", RoleReadOnly)
		require.NoError(t, err)

		err = store.DeleteUser(ctx, "todelete")
		require.NoError(t, err)

		// Verify user is gone
		claims, err := store.ValidateUser(ctx, "todelete", "password123")
		require.NoError(t, err)
		assert.Nil(t, claims)
	})

	t.Run("returns error for non-existent user", func(t *testing.T) {
		err := store.DeleteUser(ctx, "nonexistent")
		require.Error(t, err)
		assert.Contains(t, err.Error(), "user not found")
	})
}

func TestMetaStore_UpdatePassword(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_update_password.db")

	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	ctx := context.Background()

	t.Run("updates password successfully", func(t *testing.T) {
		_, err := store.CreateUser(ctx, "pwuser", "oldpassword", RoleReadWrite)
		require.NoError(t, err)

		err = store.UpdatePassword(ctx, "pwuser", "newpassword")
		require.NoError(t, err)

		// Old password should fail
		claims, err := store.ValidateUser(ctx, "pwuser", "oldpassword")
		require.NoError(t, err)
		assert.Nil(t, claims)

		// New password should work
		claims, err = store.ValidateUser(ctx, "pwuser", "newpassword")
		require.NoError(t, err)
		require.NotNil(t, claims)
	})

	t.Run("returns error for non-existent user", func(t *testing.T) {
		err := store.UpdatePassword(ctx, "nonexistent", "newpassword")
		require.Error(t, err)
		assert.Contains(t, err.Error(), "user not found")
	})
}

func TestMetaStore_GetUserByUsername(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_get_user.db")

	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	ctx := context.Background()

	t.Run("returns user when found", func(t *testing.T) {
		_, err := store.CreateUser(ctx, "getuser", "password123", RoleAdmin)
		require.NoError(t, err)

		user, err := store.GetUserByUsername(ctx, "getuser")
		require.NoError(t, err)
		require.NotNil(t, user)
		assert.Equal(t, "getuser", user.Username)
		assert.Equal(t, RoleAdmin, user.Role)
	})

	t.Run("returns nil for non-existent user", func(t *testing.T) {
		user, err := store.GetUserByUsername(ctx, "nonexistent")
		require.NoError(t, err)
		assert.Nil(t, user)
	})
}

// ============================================================================
// API Key Tests
// ============================================================================

func TestMetaStore_CreateApiKey(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_create_key.db")

	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	ctx := context.Background()

	// Create user first
	userID, err := store.CreateUser(ctx, "keyuser", "password123", RoleReadWrite)
	require.NoError(t, err)

	t.Run("creates key successfully", func(t *testing.T) {
		rawKey, keyID, err := store.CreateApiKey(ctx, userID, "Test Key", nil)
		require.NoError(t, err)
		assert.Greater(t, keyID, int64(0))
		assert.True(t, len(rawKey) > 10)
		assert.Contains(t, rawKey, "sk_") // Prefix check
	})

	t.Run("creates key with expiry", func(t *testing.T) {
		expiry := time.Now().Add(24 * time.Hour)
		rawKey, keyID, err := store.CreateApiKey(ctx, userID, "Expiring Key", &expiry)
		require.NoError(t, err)
		assert.Greater(t, keyID, int64(0))
		assert.NotEmpty(t, rawKey)
	})
}

func TestMetaStore_ListApiKeys(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_list_keys.db")

	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	ctx := context.Background()

	// Create user
	userID, err := store.CreateUser(ctx, "listuser", "password123", RoleReadWrite)
	require.NoError(t, err)

	// Create multiple keys
	_, _, err = store.CreateApiKey(ctx, userID, "Key 1", nil)
	require.NoError(t, err)
	_, _, err = store.CreateApiKey(ctx, userID, "Key 2", nil)
	require.NoError(t, err)

	t.Run("lists all keys for user", func(t *testing.T) {
		keys, err := store.ListApiKeys(ctx, userID)
		require.NoError(t, err)
		assert.Len(t, keys, 2)
	})

	t.Run("returns empty list for user with no keys", func(t *testing.T) {
		otherUserID, err := store.CreateUser(ctx, "nokeysuser", "password123", RoleReadOnly)
		require.NoError(t, err)

		keys, err := store.ListApiKeys(ctx, otherUserID)
		require.NoError(t, err)
		assert.Len(t, keys, 0)
	})
}

func TestMetaStore_RevokeApiKey(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_revoke_key.db")

	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	ctx := context.Background()

	// Create user and key
	userID, err := store.CreateUser(ctx, "revokeuser", "password123", RoleReadWrite)
	require.NoError(t, err)

	_, keyID, err := store.CreateApiKey(ctx, userID, "To Revoke", nil)
	require.NoError(t, err)

	t.Run("revokes existing key", func(t *testing.T) {
		err := store.RevokeApiKey(ctx, keyID)
		require.NoError(t, err)

		// Verify key is gone
		keys, err := store.ListApiKeys(ctx, userID)
		require.NoError(t, err)
		assert.Len(t, keys, 0)
	})

	t.Run("returns error for non-existent key", func(t *testing.T) {
		err := store.RevokeApiKey(ctx, 99999)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "api key not found")
	})
}

func TestMetaStore_ValidateApiKeyImpl(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_validate_key.db")

	store, err := NewMetaStore(dbPath)
	require.NoError(t, err)
	defer store.Close()

	ctx := context.Background()

	// Create user and key
	userID, err := store.CreateUser(ctx, "validatekeyuser", "password123", RoleReadWrite)
	require.NoError(t, err)

	rawKey, _, err := store.CreateApiKey(ctx, userID, "Valid Key", nil)
	require.NoError(t, err)

	t.Run("validates correct key", func(t *testing.T) {
		claims, err := store.ValidateApiKeyImpl(ctx, rawKey)
		require.NoError(t, err)
		require.NotNil(t, claims)
		assert.Equal(t, "validatekeyuser", claims.Username)
		assert.Equal(t, RoleReadWrite, claims.Role)
	})

	t.Run("returns nil for invalid key", func(t *testing.T) {
		claims, err := store.ValidateApiKeyImpl(ctx, "sk_invalid_key_12345")
		require.NoError(t, err)
		assert.Nil(t, claims)
	})

	t.Run("returns nil for expired key", func(t *testing.T) {
		expired := time.Now().Add(-1 * time.Hour)
		expiredKey, _, err := store.CreateApiKey(ctx, userID, "Expired Key", &expired)
		require.NoError(t, err)

		claims, err := store.ValidateApiKeyImpl(ctx, expiredKey)
		require.NoError(t, err)
		assert.Nil(t, claims)
	})
}
