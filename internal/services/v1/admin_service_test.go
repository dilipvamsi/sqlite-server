package servicesv1

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/types/known/durationpb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func setupAdminTestServer(t *testing.T) (*AdminServer, *auth.MetaStore, *DbServer) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_admin.db")

	store, err := auth.NewMetaStore(dbPath)
	require.NoError(t, err)
	t.Cleanup(func() { store.Close() })

	// Init DbServer
	dbServer := NewDbServer(nil)
	t.Cleanup(func() { dbServer.Stop() })

	// Create `databases` directory in temp for dynamic DB tests
	err = os.MkdirAll(filepath.Join("databases"), 0755)
	if err == nil {
		// Cleanup databases dir after test (best effort)
		t.Cleanup(func() { os.RemoveAll("databases") })
	}

	return NewAdminServer(store, dbServer, nil), store, dbServer
}

func adminContext(role dbv1.Role) context.Context {
	claims := &auth.UserClaims{
		UserID:   1,
		Username: "testadmin",
		Role:     role,
	}
	return auth.NewContext(context.Background(), claims)
}

func TestAdminServer_CreateUser(t *testing.T) {
	server, _, _ := setupAdminTestServer(t)

	t.Run("creates user as admin", func(t *testing.T) {
		ctx := adminContext(dbv1.Role_ROLE_ADMIN)
		req := connect.NewRequest(&dbv1.CreateUserRequest{
			Username: "newuser",
			Password: "securepassword123",
			Role:     dbv1.Role_ROLE_READ_WRITE,
		})

		resp, err := server.CreateUser(ctx, req)
		require.NoError(t, err)
		assert.Greater(t, resp.Msg.UserId, int64(0))
		assert.NotEmpty(t, resp.Msg.CreatedAt)
	})

	t.Run("denies non-admin", func(t *testing.T) {
		ctx := adminContext(dbv1.Role_ROLE_READ_ONLY)
		req := connect.NewRequest(&dbv1.CreateUserRequest{
			Username: "anotheruser",
			Password: "password123",
			Role:     dbv1.Role_ROLE_READ_ONLY,
		})

		_, err := server.CreateUser(ctx, req)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "permission_denied")
	})

	t.Run("denies unauthenticated", func(t *testing.T) {
		ctx := context.Background()
		req := connect.NewRequest(&dbv1.CreateUserRequest{
			Username: "anotheruser",
			Password: "password123",
			Role:     dbv1.Role_ROLE_READ_ONLY,
		})

		_, err := server.CreateUser(ctx, req)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "unauthenticated")
	})
}

func TestAdminServer_DeleteUser(t *testing.T) {
	server, store, _ := setupAdminTestServer(t)
	ctx := adminContext(dbv1.Role_ROLE_ADMIN)

	// Create user to delete
	_, err := store.CreateUser(context.Background(), "todelete", "password", dbv1.Role_ROLE_READ_ONLY)
	require.NoError(t, err)

	t.Run("deletes user as admin", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.DeleteUserRequest{
			Username: "todelete",
		})

		resp, err := server.DeleteUser(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)
	})

	t.Run("returns error for non-existent user", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.DeleteUserRequest{
			Username: "nonexistent",
		})

		_, err := server.DeleteUser(ctx, req)
		require.Error(t, err)
	})
}

func TestAdminServer_UpdatePassword(t *testing.T) {
	server, store, _ := setupAdminTestServer(t)
	ctx := adminContext(dbv1.Role_ROLE_ADMIN)

	// Create user
	_, err := store.CreateUser(context.Background(), "pwuser", "oldpass", dbv1.Role_ROLE_READ_WRITE)
	require.NoError(t, err)

	t.Run("updates password as admin", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.UpdatePasswordRequest{
			Username:    "pwuser",
			NewPassword: "newsecurepassword",
		})

		resp, err := server.UpdatePassword(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)
	})
}

func TestAdminServer_CreateApiKey(t *testing.T) {
	server, store, _ := setupAdminTestServer(t)
	ctx := adminContext(dbv1.Role_ROLE_ADMIN)

	// Create user
	userID, err := store.CreateUser(context.Background(), "keyowner", "password", dbv1.Role_ROLE_READ_WRITE)
	require.NoError(t, err)

	t.Run("creates api key", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CreateApiKeyRequest{
			UserId: userID,
			Name:   "Test API Key",
		})

		resp, err := server.CreateApiKey(ctx, req)
		require.NoError(t, err)
		assert.NotEmpty(t, resp.Msg.KeyId) // UUID v7 string
		assert.Contains(t, resp.Msg.ApiKey, "sk_")
	})

	t.Run("creates api key with expiry", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CreateApiKeyRequest{
			UserId:    userID,
			Name:      "Expiring Key",
			ExpiresAt: timestamppb.New(time.Date(2030, 12, 31, 23, 59, 59, 0, time.UTC)),
		})

		resp, err := server.CreateApiKey(ctx, req)
		require.NoError(t, err)
		assert.NotEmpty(t, resp.Msg.ApiKey)
	})
}

func TestAdminServer_ListApiKeys(t *testing.T) {
	server, store, _ := setupAdminTestServer(t)
	ctx := adminContext(dbv1.Role_ROLE_ADMIN)

	// Create user and keys
	userID, err := store.CreateUser(context.Background(), "listuser", "password", dbv1.Role_ROLE_READ_WRITE)
	require.NoError(t, err)
	_, _, err = store.CreateApiKey(context.Background(), userID, "Key 1", nil)
	require.NoError(t, err)
	_, _, err = store.CreateApiKey(context.Background(), userID, "Key 2", nil)
	require.NoError(t, err)

	t.Run("lists all keys", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.ListApiKeysRequest{
			UserId: userID,
		})

		resp, err := server.ListApiKeys(ctx, req)
		require.NoError(t, err)
		assert.Len(t, resp.Msg.Keys, 2)
	})
}

func TestAdminServer_RevokeApiKey(t *testing.T) {
	server, store, _ := setupAdminTestServer(t)
	ctx := adminContext(dbv1.Role_ROLE_ADMIN)

	// Create user and key
	userID, err := store.CreateUser(context.Background(), "revokeuser", "password", dbv1.Role_ROLE_READ_WRITE)
	require.NoError(t, err)
	_, keyID, err := store.CreateApiKey(context.Background(), userID, "To Revoke", nil)
	require.NoError(t, err)

	t.Run("revokes key", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.RevokeApiKeyRequest{
			KeyId: keyID,
		})

		resp, err := server.RevokeApiKey(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)
	})

	t.Run("returns error for non-existent key", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.RevokeApiKeyRequest{
			KeyId: "00000000-0000-0000-0000-000000099999",
		})

		_, err := server.RevokeApiKey(ctx, req)
		require.Error(t, err)
	})
}
func TestAdminServer_DynamicDatabases(t *testing.T) {
	server, store, dbServer := setupAdminTestServer(t)
	ctx := adminContext(dbv1.Role_ROLE_ADMIN)

	// Clean up databases directory
	os.RemoveAll("databases")

	t.Run("CreateDatabase creates managed db", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CreateDatabaseRequest{
			Name: "createdb_test",
		})
		resp, err := server.CreateDatabase(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)

		// Verify it's in store
		cfg, err := store.GetDatabaseConfig(context.Background(), "createdb_test")
		require.NoError(t, err)
		assert.NotNil(t, cfg)
		assert.True(t, cfg.IsManaged)

		// Verify it's mounted
		names := dbServer.GetDatabaseNames()
		assert.Contains(t, names, "createdb_test")
	})

	t.Run("CreateDatabase fails if already exists", func(t *testing.T) {
		server.CreateDatabase(ctx, connect.NewRequest(&dbv1.CreateDatabaseRequest{Name: "duplicate_test"}))

		req := connect.NewRequest(&dbv1.CreateDatabaseRequest{
			Name: "duplicate_test", // Same name
		})
		_, err := server.CreateDatabase(ctx, req)
		require.Error(t, err)
	})

	t.Run("MountDatabase mounts external db", func(t *testing.T) {
		// specific temp dir for mounting to avoid conflict with "databases" dir
		tmpDir := t.TempDir()
		externalPath := filepath.Join(tmpDir, "external.db")
		// Create empty file
		f, err := os.Create(externalPath)
		require.NoError(t, err)
		f.Close()

		req := connect.NewRequest(&dbv1.DatabaseConfig{
			Name:   "mounted_db",
			DbPath: externalPath,
		})
		resp, err := server.MountDatabase(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)

		// Verify store
		cfg, err := store.GetDatabaseConfig(context.Background(), "mounted_db")
		require.NoError(t, err)
		assert.NotNil(t, cfg)
		assert.False(t, cfg.IsManaged)

		// Verify mounted
		names := dbServer.GetDatabaseNames()
		assert.Contains(t, names, "mounted_db")
	})

	t.Run("UnMountDatabase removes from server but keeps file", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.UnMountDatabaseRequest{
			Name: "mounted_db", // Unmount the one we just mounted
		})
		resp, err := server.UnMountDatabase(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)

		// Verify removed from store
		cfg, err := store.GetDatabaseConfig(context.Background(), "mounted_db")
		require.NoError(t, err)
		assert.Nil(t, cfg)

		// Verify removed from server
		names := dbServer.GetDatabaseNames()
		assert.NotContains(t, names, "mounted_db")
	})

	t.Run("DeleteDatabase deletes managed db", func(t *testing.T) {
		// Setup
		server.CreateDatabase(ctx, connect.NewRequest(&dbv1.CreateDatabaseRequest{Name: "delete_test"}))

		req := connect.NewRequest(&dbv1.DeleteDatabaseRequest{
			Name: "delete_test",
		})
		resp, err := server.DeleteDatabase(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)

		// Verify removed from store
		cfg, err := store.GetDatabaseConfig(context.Background(), "delete_test")
		require.NoError(t, err)
		assert.Nil(t, cfg)

		// Verify removed from server
		names := dbServer.GetDatabaseNames()
		assert.NotContains(t, names, "delete_test")

		// Verify file gone
		// expected path is databases/delete_test.db
		_, err = os.Stat("databases/delete_test.db")
		assert.True(t, os.IsNotExist(err), "File should be deleted")
	})

	t.Run("DeleteDatabase fails for mounted db", func(t *testing.T) {
		// Remount one
		tmpDir := t.TempDir()
		externalPath := filepath.Join(tmpDir, "protected.db")
		f, _ := os.Create(externalPath)
		f.Close()

		// Mount it
		mReq := connect.NewRequest(&dbv1.DatabaseConfig{
			Name:   "protected",
			DbPath: externalPath,
		})
		_, err := server.MountDatabase(ctx, mReq)
		require.NoError(t, err)

		// Try delete
		dReq := connect.NewRequest(&dbv1.DeleteDatabaseRequest{
			Name: "protected",
		})
		_, err = server.DeleteDatabase(ctx, dReq)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "cannot delete mounted database")

		// Check file still exists
		_, err = os.Stat(externalPath)
		assert.NoError(t, err)
	})

	t.Run("ListDatabases returns all mounted databases", func(t *testing.T) {
		// Setup: ensure we have at least one db
		server.CreateDatabase(ctx, connect.NewRequest(&dbv1.CreateDatabaseRequest{Name: "list_test"}))

		req := connect.NewRequest(&dbv1.ListDatabasesRequest{})
		resp, err := server.ListDatabases(ctx, req)
		require.NoError(t, err)
		assert.NotEmpty(t, resp.Msg.Databases)

		found := false
		for _, db := range resp.Msg.Databases {
			if db.Name == "list_test" {
				found = true
				assert.Equal(t, filepath.Join("databases", "list_test.db"), db.Path)
				assert.True(t, db.IsManaged)
			}
		}
		assert.True(t, found, "ListDatabases should contain 'list_test'")
	})

	t.Run("MountDatabase fails if file does not exist", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.DatabaseConfig{
			Name:   "missing_db",
			DbPath: "/path/to/nonexistent/file.db",
		})
		_, err := server.MountDatabase(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))
	})

	t.Run("UnMountDatabase fails if db not found", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.UnMountDatabaseRequest{
			Name: "non_existent_db",
		})
		_, err := server.UnMountDatabase(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))
	})

	t.Run("DeleteDatabase fails if config not found", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.DeleteDatabaseRequest{
			Name: "unknown_db",
		})
		_, err := server.DeleteDatabase(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))
	})

	// Test Auth failures (using non-admin context)
	t.Run("Auth failures", func(t *testing.T) {
		nonAdminCtx := context.Background() // No auth

		_, err := server.CreateDatabase(nonAdminCtx, connect.NewRequest(&dbv1.CreateDatabaseRequest{Name: "fail"}))
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))

		_, err = server.MountDatabase(nonAdminCtx, connect.NewRequest(&dbv1.DatabaseConfig{Name: "fail", DbPath: "x"}))
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))

		_, err = server.UnMountDatabase(nonAdminCtx, connect.NewRequest(&dbv1.UnMountDatabaseRequest{Name: "fail"}))
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))

		_, err = server.DeleteDatabase(nonAdminCtx, connect.NewRequest(&dbv1.DeleteDatabaseRequest{Name: "fail"}))
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))

		_, err = server.ListDatabases(nonAdminCtx, connect.NewRequest(&dbv1.ListDatabasesRequest{}))
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})

	t.Run("MountDatabase fails for corrupted file", func(t *testing.T) {
		tmpDir := t.TempDir()
		badPath := filepath.Join(tmpDir, "corrupt.db")
		// Write garbage
		os.WriteFile(badPath, []byte("NOT A SQLITE FILE"), 0644)

		req := connect.NewRequest(&dbv1.DatabaseConfig{
			Name:   "corrupt_db",
			DbPath: badPath,
		})
		_, err := server.MountDatabase(ctx, req)
		require.Error(t, err)
		// It might be an internal error from sql driver
		assert.Equal(t, connect.CodeInternal, connect.CodeOf(err))

		// Ensure config was rolled back
		cfg, err := store.GetDatabaseConfig(context.Background(), "corrupt_db")
		require.NoError(t, err)
		assert.Nil(t, cfg, "Config should be removed on mount failure")
	})

	t.Run("DeleteDatabase handles pre-unmounted DB gracefully (inconsistent state)", func(t *testing.T) {
		// Setup managed db
		server.CreateDatabase(ctx, connect.NewRequest(&dbv1.CreateDatabaseRequest{Name: "resilient_test"}))

		// Manually unmount it from backend to create inconsistency
		// (Config exists, but not in DbServer)
		err := dbServer.UnmountDatabase("resilient_test")
		require.NoError(t, err)

		// Delete should still succeed (cleaning up config and file)
		req := connect.NewRequest(&dbv1.DeleteDatabaseRequest{
			Name: "resilient_test",
		})
		resp, err := server.DeleteDatabase(ctx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)

		// Verify gone
		cfg, err := store.GetDatabaseConfig(context.Background(), "resilient_test")
		require.NoError(t, err)
		assert.Nil(t, cfg)

		_, err = os.Stat("databases/resilient_test.db")
		assert.True(t, os.IsNotExist(err), "File should be deleted even if unmount failed")
	})
}

func TestAdminServer_Login(t *testing.T) {
	server, store, _ := setupAdminTestServer(t)
	ctx := context.Background()

	// Create a user for login
	_, err := store.CreateUser(ctx, "loginuser", "password123", dbv1.Role_ROLE_ADMIN)
	require.NoError(t, err)

	t.Run("login success returns api key", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.LoginRequest{
			Username: "loginuser",
			Password: "password123",
		})

		resp, err := server.Login(ctx, req)
		require.NoError(t, err)
		assert.NotEmpty(t, resp.Msg.ApiKey)
		assert.Contains(t, resp.Msg.ApiKey, "sk_")
		assert.NotNil(t, resp.Msg.ExpiresAt)
		assert.Equal(t, "loginuser", resp.Msg.User.Username)
		assert.Equal(t, dbv1.Role_ROLE_ADMIN, resp.Msg.User.Role)
	})

	t.Run("login failure with wrong password", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.LoginRequest{
			Username: "loginuser",
			Password: "wrongpassword",
		})

		_, err := server.Login(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})

	t.Run("login denies non-admin user", func(t *testing.T) {
		// Create non-admin
		_, err := store.CreateUser(ctx, "regular", "pass", dbv1.Role_ROLE_READ_ONLY)
		require.NoError(t, err)

		req := connect.NewRequest(&dbv1.LoginRequest{
			Username: "regular",
			Password: "pass",
		})
		_, err = server.Login(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})

	t.Run("login supports custom duration", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.LoginRequest{
			Username:        "loginuser",
			Password:        "password123",
			SessionDuration: &durationpb.Duration{Seconds: 3600}, // 1 hour
		})
		resp, err := server.Login(ctx, req)
		require.NoError(t, err)

		// Verify expiry is roughly 1 hour from now
		expiresAt := resp.Msg.ExpiresAt.AsTime()
		expected := time.Now().Add(time.Hour)
		assert.WithinDuration(t, expected, expiresAt, 5*time.Second)
	})
}

func TestAdminServer_Logout(t *testing.T) {
	server, store, _ := setupAdminTestServer(t)
	ctx := context.Background()

	// 1. Login to get a key
	userID, err := store.CreateUser(ctx, "logoutuser", "pass", dbv1.Role_ROLE_ADMIN)
	require.NoError(t, err)

	lResp, err := server.Login(ctx, connect.NewRequest(&dbv1.LoginRequest{
		Username: "logoutuser",
		Password: "pass",
	}))
	require.NoError(t, err)
	keyID := lResp.Msg.KeyId
	assert.NotEmpty(t, keyID) // UUID v7 string

	t.Run("logout succeeds with valid key", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.LogoutRequest{
			KeyId: keyID,
		})
		// Use authentication
		adminCtx := adminContext(dbv1.Role_ROLE_ADMIN)

		resp, err := server.Logout(adminCtx, req)
		require.NoError(t, err)
		assert.True(t, resp.Msg.Success)

		// Verify key is revoked in store
		keys, err := store.ListApiKeys(ctx, userID)
		require.NoError(t, err)

		found := false
		for _, k := range keys {
			if k.ID == keyID {
				found = true
				break
			}
		}
		assert.False(t, found, "Key should be revoked/deleted from list")
	})
}

func TestAdminServer_Logout_Errors(t *testing.T) {
	server, _, _ := setupAdminTestServer(t)
	ctx := context.Background() // No auth

	t.Run("logout fails for unauthenticated user", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.LogoutRequest{
			KeyId: "some-key",
		})
		_, err := server.Logout(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeUnauthenticated, connect.CodeOf(err))
	})

	t.Run("logout fails for non-admin user", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.LogoutRequest{
			KeyId: "some-key",
		})
		nonAdminCtx := adminContext(dbv1.Role_ROLE_READ_WRITE)
		_, err := server.Logout(nonAdminCtx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodePermissionDenied, connect.CodeOf(err))
	})
}

func TestAdminServer_UpdatePassword_Errors(t *testing.T) {
	server, _, _ := setupAdminTestServer(t)
	ctx := adminContext(dbv1.Role_ROLE_ADMIN)

	t.Run("returns not found for non-existent user", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.UpdatePasswordRequest{
			Username:    "ghost",
			NewPassword: "pass",
		})
		_, err := server.UpdatePassword(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))
	})
}

func TestAdminServer_CreateApiKey_Errors(t *testing.T) {
	server, store, _ := setupAdminTestServer(t)
	ctx := adminContext(dbv1.Role_ROLE_ADMIN)

	userID, err := store.CreateUser(context.Background(), "user", "pass", dbv1.Role_ROLE_READ_WRITE)
	require.NoError(t, err)

	t.Run("fails with invalid timestamp", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CreateApiKeyRequest{
			UserId:    userID,
			Name:      "Bad Key",
			ExpiresAt: &timestamppb.Timestamp{Seconds: -1000000000000}, // Invalid
		})
		_, err := server.CreateApiKey(ctx, req)
		require.Error(t, err)
		assert.Equal(t, connect.CodeInvalidArgument, connect.CodeOf(err))
	})
}

func TestAdminServer_CRUD_Errors(t *testing.T) {
	server, store, _ := setupAdminTestServer(t)
	ctx := adminContext(dbv1.Role_ROLE_ADMIN)

	// Close store DB to force failures
	store.GetDB().Close()

	t.Run("CreateUser fails on db error", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CreateUserRequest{
			Username: "failuser",
			Password: "password",
			Role:     dbv1.Role_ROLE_READ_ONLY,
		})
		_, err := server.CreateUser(ctx, req)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "internal")
	})

	t.Run("DeleteUser fails on db error", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.DeleteUserRequest{
			Username: "failuser",
		})
		_, err := server.DeleteUser(ctx, req)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "not_found") // Logic wraps all errors in NotFound currently
	})

	t.Run("UpdatePassword fails on db error", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.UpdatePasswordRequest{
			Username:    "failuser",
			NewPassword: "newpassword",
		})
		_, err := server.UpdatePassword(ctx, req)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "not_found") // Logic wraps all errors in NotFound currently
	})

	t.Run("ListApiKeys fails on db error", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.ListApiKeysRequest{UserId: 1})
		_, err := server.ListApiKeys(ctx, req)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "internal")
	})
}

func TestAdminServer_Auth_Coverage(t *testing.T) {
	server, _, _ := setupAdminTestServer(t)

	// Scenarios
	tests := []struct {
		name string
		ctx  context.Context
		code connect.Code
	}{
		{"Unauthenticated", context.Background(), connect.CodeUnauthenticated},
		{"NonAdmin", adminContext(dbv1.Role_ROLE_READ_WRITE), connect.CodePermissionDenied},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// DeleteUser
			_, err := server.DeleteUser(tt.ctx, connect.NewRequest(&dbv1.DeleteUserRequest{}))
			assert.Equal(t, tt.code, connect.CodeOf(err))

			// UpdatePassword
			_, err = server.UpdatePassword(tt.ctx, connect.NewRequest(&dbv1.UpdatePasswordRequest{}))
			assert.Equal(t, tt.code, connect.CodeOf(err))

			// ListApiKeys
			_, err = server.ListApiKeys(tt.ctx, connect.NewRequest(&dbv1.ListApiKeysRequest{}))
			assert.Equal(t, tt.code, connect.CodeOf(err))

			// RevokeApiKey
			_, err = server.RevokeApiKey(tt.ctx, connect.NewRequest(&dbv1.RevokeApiKeyRequest{}))
			assert.Equal(t, tt.code, connect.CodeOf(err))

			// CreateApiKey
			_, err = server.CreateApiKey(tt.ctx, connect.NewRequest(&dbv1.CreateApiKeyRequest{}))
			assert.Equal(t, tt.code, connect.CodeOf(err))
		})
	}
}
