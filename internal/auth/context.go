package auth

import (
	"context"
	dbv1 "sqlite-server/internal/protos/db/v1"
)

type contextKey struct{}

var userContextKey = contextKey{}

// NewContext returns a new context carrying user information.
func NewContext(ctx context.Context, claims *UserClaims) context.Context {
	return context.WithValue(ctx, userContextKey, claims)
}

// FromContext extracts the user information from the context.
func FromContext(ctx context.Context) (*UserClaims, bool) {
	claims, ok := ctx.Value(userContextKey).(*UserClaims)
	return claims, ok
}

// IsReadOnly checks if the user in context has the ReadOnly role.
// Returns true if unauthenticated (fail-safe) or if explicit ReadOnly role.
func IsReadOnly(ctx context.Context) bool {
	claims, ok := FromContext(ctx)
	if !ok {
		return true
	}
	return claims.Role == dbv1.Role_ROLE_READ_ONLY
}
