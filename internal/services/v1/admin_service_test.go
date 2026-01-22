package servicesv1

import (
	"context"
	"path/filepath"
	"testing"
	"time"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func setupAdminTestServer(t *testing.T) (*AdminServer, *auth.MetaStore) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test_admin.db")

	store, err := auth.NewMetaStore(dbPath)
	require.NoError(t, err)
	t.Cleanup(func() { store.Close() })

	return NewAdminServer(store, nil), store
}

func adminContext(role string) context.Context {
	claims := &auth.UserClaims{
		UserID:   1,
		Username: "testadmin",
		Role:     role,
	}
	return auth.NewContext(context.Background(), claims)
}

func TestAdminServer_CreateUser(t *testing.T) {
	server, _ := setupAdminTestServer(t)

	t.Run("creates user as admin", func(t *testing.T) {
		ctx := adminContext(auth.RoleAdmin)
		req := connect.NewRequest(&dbv1.CreateUserRequest{
			Username: "newuser",
			Password: "securepassword123",
			Role:     auth.RoleReadWrite,
		})

		resp, err := server.CreateUser(ctx, req)
		require.NoError(t, err)
		assert.Greater(t, resp.Msg.UserId, int64(0))
		assert.NotEmpty(t, resp.Msg.CreatedAt)
	})

	t.Run("denies non-admin", func(t *testing.T) {
		ctx := adminContext(auth.RoleReadOnly)
		req := connect.NewRequest(&dbv1.CreateUserRequest{
			Username: "anotheruser",
			Password: "password123",
			Role:     auth.RoleReadOnly,
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
			Role:     auth.RoleReadOnly,
		})

		_, err := server.CreateUser(ctx, req)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "unauthenticated")
	})
}

func TestAdminServer_DeleteUser(t *testing.T) {
	server, store := setupAdminTestServer(t)
	ctx := adminContext(auth.RoleAdmin)

	// Create user to delete
	_, err := store.CreateUser(context.Background(), "todelete", "password", auth.RoleReadOnly)
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
	server, store := setupAdminTestServer(t)
	ctx := adminContext(auth.RoleAdmin)

	// Create user
	_, err := store.CreateUser(context.Background(), "pwuser", "oldpass", auth.RoleReadWrite)
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
	server, store := setupAdminTestServer(t)
	ctx := adminContext(auth.RoleAdmin)

	// Create user
	userID, err := store.CreateUser(context.Background(), "keyowner", "password", auth.RoleReadWrite)
	require.NoError(t, err)

	t.Run("creates api key", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.CreateApiKeyRequest{
			UserId: userID,
			Name:   "Test API Key",
		})

		resp, err := server.CreateApiKey(ctx, req)
		require.NoError(t, err)
		assert.Greater(t, resp.Msg.KeyId, int64(0))
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
	server, store := setupAdminTestServer(t)
	ctx := adminContext(auth.RoleAdmin)

	// Create user and keys
	userID, err := store.CreateUser(context.Background(), "listuser", "password", auth.RoleReadWrite)
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
	server, store := setupAdminTestServer(t)
	ctx := adminContext(auth.RoleAdmin)

	// Create user and key
	userID, err := store.CreateUser(context.Background(), "revokeuser", "password", auth.RoleReadWrite)
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
			KeyId: 99999,
		})

		_, err := server.RevokeApiKey(ctx, req)
		require.Error(t, err)
	})
}
