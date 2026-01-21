package auth

import "context"

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
