package servicesv1

import (
	"context"
	"testing"

	"sqlite-server/internal/auth"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAuthorizeRead(t *testing.T) {
	t.Run("unauthenticated context returns error", func(t *testing.T) {
		ctx := context.Background()
		err := AuthorizeRead(ctx)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "unauthenticated")
	})

	t.Run("unspecified role is denied", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "guest",
			Role:     sqlrpcv1.Role_ROLE_UNSPECIFIED,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeRead(ctx)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "permission_denied")
	})

	t.Run("read_only user is allowed", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID: 2,
			Role:   sqlrpcv1.Role_ROLE_READ_ONLY,
		}
		ctx := auth.NewContext(context.Background(), claims)
		assert.NoError(t, AuthorizeRead(ctx))
	})

	t.Run("admin user is allowed", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID: 3,
			Role:   sqlrpcv1.Role_ROLE_ADMIN,
		}
		ctx := auth.NewContext(context.Background(), claims)
		assert.NoError(t, AuthorizeRead(ctx))
	})
}

func TestAuthorizeWrite(t *testing.T) {
	t.Run("unauthenticated context returns error", func(t *testing.T) {
		ctx := context.Background()
		err := AuthorizeWrite(ctx)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "unauthenticated")
	})

	t.Run("read_only user is denied", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "readonly_user",
			Role:     sqlrpcv1.Role_ROLE_READ_ONLY,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeWrite(ctx)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "permission_denied")
	})

	t.Run("read_write user is allowed", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   2,
			Username: "rw_user",
			Role:     sqlrpcv1.Role_ROLE_READ_WRITE,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeWrite(ctx)
		assert.NoError(t, err)
	})

	t.Run("admin user is allowed", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   3,
			Username: "admin",
			Role:     sqlrpcv1.Role_ROLE_ADMIN,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeWrite(ctx)
		assert.NoError(t, err)
	})

	t.Run("database_manager user is allowed", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   4,
			Username: "db_manager",
			Role:     sqlrpcv1.Role_ROLE_DATABASE_MANAGER,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeWrite(ctx)
		assert.NoError(t, err)
	})
}

func TestAuthorizeAdmin(t *testing.T) {
	t.Run("unauthenticated context returns error", func(t *testing.T) {
		ctx := context.Background()
		err := AuthorizeAdmin(ctx)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "unauthenticated")
	})

	t.Run("non-admin user is denied", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "normal_user",
			Role:     sqlrpcv1.Role_ROLE_READ_WRITE,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeAdmin(ctx)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "permission_denied")
	})

	t.Run("admin user is allowed", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "admin",
			Role:     sqlrpcv1.Role_ROLE_ADMIN,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeAdmin(ctx)
		assert.NoError(t, err)
	})

	t.Run("database_manager user is denied", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "db_manager",
			Role:     sqlrpcv1.Role_ROLE_DATABASE_MANAGER,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeAdmin(ctx)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "permission_denied")
	})
}

func TestAuthorizeDatabaseManager(t *testing.T) {
	t.Run("unauthenticated context returns error", func(t *testing.T) {
		ctx := context.Background()
		err := AuthorizeDatabaseManager(ctx)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "unauthenticated")
	})

	t.Run("normal user is denied", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "normal_user",
			Role:     sqlrpcv1.Role_ROLE_READ_WRITE,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeDatabaseManager(ctx)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "permission_denied")
	})

	t.Run("database_manager user is allowed", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "db_manager",
			Role:     sqlrpcv1.Role_ROLE_DATABASE_MANAGER,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeDatabaseManager(ctx)
		assert.NoError(t, err)
	})

	t.Run("admin user is allowed", func(t *testing.T) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "admin",
			Role:     sqlrpcv1.Role_ROLE_ADMIN,
		}
		ctx := auth.NewContext(context.Background(), claims)

		err := AuthorizeDatabaseManager(ctx)
		assert.NoError(t, err)
	})
}

func TestIsWriteQuery(t *testing.T) {
	writeQueries := []string{
		"INSERT INTO users VALUES (1, 'test')",
		"insert into users values (1, 'test')",
		"  INSERT INTO users VALUES (1, 'test')",
		"UPDATE users SET name = 'test'",
		"DELETE FROM users WHERE id = 1",
		"DROP TABLE users",
		"CREATE TABLE foo (id INT)",
		"ALTER TABLE users ADD COLUMN age INT",
		"TRUNCATE TABLE users",
		"REPLACE INTO users VALUES (1, 'test')",
		"ATTACH DATABASE 'foo.db' AS foo",
		"DETACH DATABASE foo",
		"VACUUM",
		"UPSERT INTO users VALUES (1, 2)", // Not valid SQL per se but checks keyword
	}

	for _, query := range writeQueries {
		name := query
		if len(name) > 30 {
			name = name[:30]
		}
		t.Run(name, func(t *testing.T) {
			assert.True(t, IsWriteQuery(query), "expected %q to be a write query", query)
		})
	}

	readQueries := []string{
		"SELECT * FROM users",
		"select * from users",
		"  SELECT * FROM users",
		"PRAGMA table_info(users)",
		"EXPLAIN SELECT * FROM users",
		"WITH cte AS (SELECT 1) SELECT * FROM cte",
	}

	for _, query := range readQueries {
		name := query
		if len(name) > 30 {
			name = name[:30]
		}
		t.Run(name, func(t *testing.T) {
			assert.False(t, IsWriteQuery(query), "expected %q to be a read query", query)
		})
	}
}
