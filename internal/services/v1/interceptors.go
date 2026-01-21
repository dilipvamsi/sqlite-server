package servicesv1

import (
	"context"
	"encoding/base64"
	"errors"
	"strings"

	"sqlite-server/internal/auth"

	"connectrpc.com/connect"
)

// AuthInterceptor implements connect.Interceptor for authentication
type AuthInterceptor struct {
	store *auth.MetaStore
}

func NewAuthInterceptor(store *auth.MetaStore) *AuthInterceptor {
	return &AuthInterceptor{store: store}
}

// WrapUnary implements connect.Interceptor
func (authInterceptor *AuthInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		// Extract Authorization header
		authHeader := req.Header().Get("Authorization")
		if authHeader == "" {
			return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("missing authorization header"))
		}

		// Handle Basic Auth (slow - uses bcrypt)
		if strings.HasPrefix(authHeader, "Basic ") {
			payload, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(authHeader, "Basic "))
			if err != nil {
				return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("invalid basic auth format"))
			}
			parts := strings.SplitN(string(payload), ":", 2)
			if len(parts) != 2 {
				return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("invalid basic auth format"))
			}

			user, err := authInterceptor.store.ValidateUser(ctx, parts[0], parts[1])
			if err != nil {
				return nil, connect.NewError(connect.CodeInternal, err)
			}
			if user == nil {
				return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("invalid credentials"))
			}

			ctx = auth.NewContext(ctx, user)
			return next(ctx, req)
		}

		// Handle Bearer Token / API Key (fast - uses SHA256)
		if strings.HasPrefix(authHeader, "Bearer ") {
			token := strings.TrimPrefix(authHeader, "Bearer ")
			user, err := authInterceptor.store.ValidateApiKeyImpl(ctx, token)
			if err != nil {
				return nil, connect.NewError(connect.CodeInternal, err)
			}
			if user == nil {
				return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("invalid api key"))
			}

			ctx = auth.NewContext(ctx, user)
			return next(ctx, req)
		}

		return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("unsupported auth scheme"))
	}
}

// WrapStreamingHandler implements connect.Interceptor
func (authInterceptor *AuthInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		// Extract Authorization header
		authHeader := conn.RequestHeader().Get("Authorization")
		if authHeader == "" {
			return connect.NewError(connect.CodeUnauthenticated, errors.New("missing authorization header"))
		}

		// Handle Basic Auth (slow - uses bcrypt)
		if strings.HasPrefix(authHeader, "Basic ") {
			payload, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(authHeader, "Basic "))
			if err != nil {
				return connect.NewError(connect.CodeUnauthenticated, errors.New("invalid basic auth format"))
			}
			parts := strings.SplitN(string(payload), ":", 2)
			if len(parts) != 2 {
				return connect.NewError(connect.CodeUnauthenticated, errors.New("invalid basic auth format"))
			}

			user, err := authInterceptor.store.ValidateUser(ctx, parts[0], parts[1])
			if err != nil {
				return connect.NewError(connect.CodeInternal, err)
			}
			if user == nil {
				return connect.NewError(connect.CodeUnauthenticated, errors.New("invalid credentials"))
			}

			ctx = auth.NewContext(ctx, user)
			return next(ctx, conn)
		}

		// Handle Bearer Token / API Key (fast - uses SHA256)
		if strings.HasPrefix(authHeader, "Bearer ") {
			token := strings.TrimPrefix(authHeader, "Bearer ")
			user, err := authInterceptor.store.ValidateApiKeyImpl(ctx, token)
			if err != nil {
				return connect.NewError(connect.CodeInternal, err)
			}
			if user == nil {
				return connect.NewError(connect.CodeUnauthenticated, errors.New("invalid api key"))
			}

			ctx = auth.NewContext(ctx, user)
			return next(ctx, conn)
		}

		return connect.NewError(connect.CodeUnauthenticated, errors.New("unsupported auth scheme"))
	}
}

// WrapStreamingClient implements connect.Interceptor
func (authInterceptor *AuthInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	// No-op for client side (this is a server)
	return next
}
