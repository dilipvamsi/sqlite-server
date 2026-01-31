package auth

import (
	"context"
	"testing"

	dbv1 "sqlite-server/internal/protos/db/v1"

	"github.com/stretchr/testify/assert"
)

func TestIsReadOnly(t *testing.T) {
	t.Run("returns true when unauthenticated", func(t *testing.T) {
		ctx := context.Background()
		assert.True(t, IsReadOnly(ctx))
	})

	t.Run("returns true for ROLE_READ_ONLY", func(t *testing.T) {
		claims := &UserClaims{Role: dbv1.Role_ROLE_READ_ONLY}
		ctx := NewContext(context.Background(), claims)
		assert.True(t, IsReadOnly(ctx))
	})

	t.Run("returns false for ROLE_READ_WRITE", func(t *testing.T) {
		claims := &UserClaims{Role: dbv1.Role_ROLE_READ_WRITE}
		ctx := NewContext(context.Background(), claims)
		assert.False(t, IsReadOnly(ctx))
	})

	t.Run("returns false for ROLE_ADMIN", func(t *testing.T) {
		claims := &UserClaims{Role: dbv1.Role_ROLE_ADMIN}
		ctx := NewContext(context.Background(), claims)
		assert.False(t, IsReadOnly(ctx))
	})
}
