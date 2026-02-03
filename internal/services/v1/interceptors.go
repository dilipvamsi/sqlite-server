package servicesv1

import (
	"context"
	"encoding/base64"
	"errors"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"connectrpc.com/connect"
)

// AuthCacheInvalidator defines methods to clear the authentication cache
type AuthCacheInvalidator interface {
	ClearCache()
}

// AuthInterceptor implements connect.Interceptor for authentication and authorization
type AuthInterceptor struct {
	store *auth.MetaStore
	// authCache maps AuthHeader string -> *authCacheItem
	authCache sync.Map
}

type authCacheItem struct {
	user      *auth.UserClaims
	timestamp int64
}

func NewAuthInterceptor(store *auth.MetaStore) *AuthInterceptor {
	return &AuthInterceptor{store: store}
}

// ClearCache clears all cached authentication entries
func (a *AuthInterceptor) ClearCache() {
	a.authCache.Range(func(key, value any) bool {
		a.authCache.Delete(key)
		return true
	})
	log.Println("[AUTH] Cache invalidated")
}

// LoggingInterceptor creates a connect.UnaryInterceptorFunc that logs request details.
// Logging can be disabled by setting the environment variable SQLITE_SERVER_DISABLE_REQUEST_LOGGING to "true".
func LoggingInterceptor() connect.UnaryInterceptorFunc {
	loggingEnabled := os.Getenv("SQLITE_SERVER_DISABLE_REQUEST_LOGGING") != "true"
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			if !loggingEnabled {
				return next(ctx, req)
			}
			start := time.Now()

			// Execute the handler
			resp, err := next(ctx, req)

			duration := time.Since(start)
			status := "OK"
			if err != nil {
				status = "ERROR"
			}

			// Log: [OK] /db.v1.DatabaseService/Query (12ms)
			log.Printf("[%s] %s (%v)", status, req.Spec().Procedure, duration)

			return resp, err
		}
	}
}

// WrapUnary implements connect.Interceptor
func (authInterceptor *AuthInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		// 1. Allow Login to proceed without auth
		if req.Spec().Procedure == "/db.v1.AdminService/Login" {
			return next(ctx, req)
		}

		// 2. Authentication (Validate Token/Basic Auth)
		authHeader := req.Header().Get("Authorization")
		if authHeader == "" {
			return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("missing authorization header"))
		}

		var user *auth.UserClaims
		var err error

		// CHECK CACHE
		if val, ok := authInterceptor.authCache.Load(authHeader); ok {
			item := val.(*authCacheItem)
			if time.Now().Unix()-item.timestamp < 60 { // 60s TTL
				user = item.user
			} else {
				authInterceptor.authCache.Delete(authHeader)
			}
		}

		if user == nil {
			// CACHE MISS or EXPIRED
			if strings.HasPrefix(authHeader, "Basic ") {
				payload, decodeErr := base64.StdEncoding.DecodeString(strings.TrimPrefix(authHeader, "Basic "))
				if decodeErr != nil {
					return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("invalid basic auth format"))
				}
				parts := strings.SplitN(string(payload), ":", 2)
				if len(parts) != 2 {
					return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("invalid basic auth format"))
				}
				user, err = authInterceptor.store.ValidateUser(ctx, parts[0], parts[1])
			} else if strings.HasPrefix(authHeader, "Bearer ") {
				token := strings.TrimPrefix(authHeader, "Bearer ")
				user, err = authInterceptor.store.ValidateApiKeyImpl(ctx, token)
			} else {
				return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("unsupported auth scheme"))
			}

			if err != nil {
				return nil, connect.NewError(connect.CodeInternal, err)
			}
			if user == nil {
				return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("invalid credentials"))
			}

			// STORE IN CACHE
			authInterceptor.authCache.Store(authHeader, &authCacheItem{
				user:      user,
				timestamp: time.Now().Unix(),
			})
		}

		// Set Context
		ctx = auth.NewContext(ctx, user)

		// 3. Authorization (Check Permissions)
		// Global Read Requirement (All APIs except Login)
		if err := AuthorizeRead(ctx); err != nil {
			return nil, err
		}

		// AdminService Check
		if strings.HasPrefix(req.Spec().Procedure, "/db.v1.AdminService/") {
			if user.Role != dbv1.Role_ROLE_ADMIN && user.Role != dbv1.Role_ROLE_DATABASE_MANAGER {
				// Allow non-admins to access self-management and informational methods
				procedure := req.Spec().Procedure
				allowedForEveryone := map[string]bool{
					"/db.v1.AdminService/ListDatabases":  true,
					"/db.v1.AdminService/CreateApiKey":   true,
					"/db.v1.AdminService/ListApiKeys":    true,
					"/db.v1.AdminService/RevokeApiKey":   true,
					"/db.v1.AdminService/UpdatePassword": true,
					"/db.v1.AdminService/Logout":         true,
				}
				if !allowedForEveryone[procedure] {
					return nil, connect.NewError(connect.CodePermissionDenied, errors.New("admin access required"))
				}
			} else if user.Role == dbv1.Role_ROLE_DATABASE_MANAGER {
				// Database Manager can only access database related methods
				procedure := req.Spec().Procedure
				dbRelated := map[string]bool{
					"/db.v1.AdminService/ListDatabases":   true,
					"/db.v1.AdminService/CreateDatabase":  true,
					"/db.v1.AdminService/DeleteDatabase":  true,
					"/db.v1.AdminService/UpdateDatabase":  true,
					"/db.v1.AdminService/MountDatabase":   true,
					"/db.v1.AdminService/UnMountDatabase": true,
					"/db.v1.AdminService/CreateApiKey":    true,
					"/db.v1.AdminService/ListApiKeys":     true,
					"/db.v1.AdminService/RevokeApiKey":    true,
					"/db.v1.AdminService/UpdatePassword":  true,
					"/db.v1.AdminService/Logout":          true,
				}
				if !dbRelated[procedure] {
					return nil, connect.NewError(connect.CodePermissionDenied, errors.New("admin access required"))
				}
			}
			return next(ctx, req)
		}

		// DatabaseService Permission Checks
		isWrite := false
		isAttachmentRPC := false
		isRestrictedSQL := false
		switch req.Spec().Procedure {
		// Explicit Write Methods
		case "/db.v1.DatabaseService/Vacuum",
			"/db.v1.DatabaseService/Checkpoint":
			isWrite = true
		case "/db.v1.DatabaseService/AttachDatabase",
			"/db.v1.DatabaseService/DetachDatabase":
			isAttachmentRPC = true

		// Dynamic Methods (Parse SQL)
		case "/db.v1.DatabaseService/Query", "/db.v1.DatabaseService/QueryStream":
			if msg, ok := req.Any().(*dbv1.QueryRequest); ok {
				isWrite = IsWriteQuery(msg.Sql)
				isRestrictedSQL = IsRestrictedQuery(msg.Sql)
			}
		case "/db.v1.DatabaseService/TypedQuery", "/db.v1.DatabaseService/TypedQueryStream":
			if msg, ok := req.Any().(*dbv1.TypedQueryRequest); ok {
				isWrite = IsWriteQuery(msg.Sql)
				isRestrictedSQL = IsRestrictedQuery(msg.Sql)
			}
		case "/db.v1.DatabaseService/TransactionQuery", "/db.v1.DatabaseService/TransactionQueryStream":
			if msg, ok := req.Any().(*dbv1.TransactionQueryRequest); ok {
				isWrite = IsWriteQuery(msg.Sql)
				isRestrictedSQL = IsRestrictedQuery(msg.Sql)
			}
		case "/db.v1.DatabaseService/TypedTransactionQuery", "/db.v1.DatabaseService/TypedTransactionQueryStream":
			if msg, ok := req.Any().(*dbv1.TypedTransactionQueryRequest); ok {
				isWrite = IsWriteQuery(msg.Sql)
				isRestrictedSQL = IsRestrictedQuery(msg.Sql)
			}
		case "/db.v1.DatabaseService/ExecuteTransaction":
			if msg, ok := req.Any().(*dbv1.ExecuteTransactionRequest); ok {
				// Iterate all requests to see if ANY is a write or administrative
				for _, r := range msg.Requests {
					var sql string
					if q := r.GetQuery(); q != nil {
						sql = q.Sql
					} else if qs := r.GetQueryStream(); qs != nil {
						sql = qs.Sql
					} else if tq := r.GetTypedQuery(); tq != nil {
						sql = tq.Sql
					} else if tqs := r.GetTypedQueryStream(); tqs != nil {
						sql = tqs.Sql
					}
					if IsWriteQuery(sql) {
						isWrite = true
					}
					if IsRestrictedQuery(sql) {
						isRestrictedSQL = true
					}
				}
			}
		}

		// Enforce Permissions
		if isRestrictedSQL {
			return nil, connect.NewError(connect.CodePermissionDenied, errors.New("ATTACH, DETACH, and VACUUM commands are not allowed in raw SQL for security reasons. Please use the dedicated RPC APIs."))
		}

		if isAttachmentRPC {
			if err := AuthorizeRead(ctx); err != nil {
				return nil, err
			}
		} else if isWrite {
			if err := AuthorizeWrite(ctx); err != nil {
				return nil, err
			}
		}

		return next(ctx, req)
	}
}

// authStreamWrapper intercepts stream messages to enforce authorization
type authStreamWrapper struct {
	connect.StreamingHandlerConn
	ctx context.Context
}

func (w *authStreamWrapper) Receive(msg any) error {
	if err := w.StreamingHandlerConn.Receive(msg); err != nil {
		return err
	}

	// Dynamic Check for Bidi Transaction Stream
	isWrite := false
	isRestrictedSQL := false
	switch req := msg.(type) {
	case *dbv1.TransactionRequest:
		// Check inner command
		var sql string
		switch cmd := req.Command.(type) {
		case *dbv1.TransactionRequest_Query:
			sql = cmd.Query.Sql
		case *dbv1.TransactionRequest_QueryStream:
			sql = cmd.QueryStream.Sql
		case *dbv1.TransactionRequest_TypedQuery:
			sql = cmd.TypedQuery.Sql
		case *dbv1.TransactionRequest_TypedQueryStream:
			sql = cmd.TypedQueryStream.Sql
		}
		if sql != "" {
			isWrite = IsWriteQuery(sql)
			isRestrictedSQL = IsRestrictedQuery(sql)
		}
	}

	if isRestrictedSQL {
		return connect.NewError(connect.CodePermissionDenied, errors.New("ATTACH, DETACH, and VACUUM commands are not allowed in raw SQL for security reasons. Please use the dedicated RPC APIs."))
	}

	if isWrite {
		if err := AuthorizeWrite(w.ctx); err != nil {
			return err
		}
	}
	return nil
}

// WrapStreamingHandler implements connect.Interceptor
func (authInterceptor *AuthInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		authHeader := conn.RequestHeader().Get("Authorization")
		if authHeader == "" {
			return connect.NewError(connect.CodeUnauthenticated, errors.New("missing authorization header"))
		}

		var user *auth.UserClaims
		var err error

		// CHECK CACHE
		if val, ok := authInterceptor.authCache.Load(authHeader); ok {
			item := val.(*authCacheItem)
			if time.Now().Unix()-item.timestamp < 60 { // 60s TTL
				user = item.user
			} else {
				authInterceptor.authCache.Delete(authHeader)
			}
		}

		if user == nil {
			// CACHE MISS or EXPIRED
			if strings.HasPrefix(authHeader, "Basic ") {
				payload, decodeErr := base64.StdEncoding.DecodeString(strings.TrimPrefix(authHeader, "Basic "))
				if decodeErr != nil {
					return connect.NewError(connect.CodeUnauthenticated, errors.New("invalid basic auth format"))
				}
				parts := strings.SplitN(string(payload), ":", 2)
				if len(parts) != 2 {
					return connect.NewError(connect.CodeUnauthenticated, errors.New("invalid basic auth format"))
				}
				user, err = authInterceptor.store.ValidateUser(ctx, parts[0], parts[1])
			} else if strings.HasPrefix(authHeader, "Bearer ") {
				token := strings.TrimPrefix(authHeader, "Bearer ")
				user, err = authInterceptor.store.ValidateApiKeyImpl(ctx, token)
			} else {
				return connect.NewError(connect.CodeUnauthenticated, errors.New("unsupported auth scheme"))
			}

			if err != nil {
				return connect.NewError(connect.CodeInternal, err)
			}
			if user == nil {
				return connect.NewError(connect.CodeUnauthenticated, errors.New("invalid credentials"))
			}

			// STORE IN CACHE
			authInterceptor.authCache.Store(authHeader, &authCacheItem{
				user:      user,
				timestamp: time.Now().Unix(),
			})
		}

		ctx = auth.NewContext(ctx, user)

		// Base Authorization Check (Must be able to Read)
		if err := AuthorizeRead(ctx); err != nil {
			return err
		}

		return next(ctx, &authStreamWrapper{StreamingHandlerConn: conn, ctx: ctx})
	}
}

// WrapStreamingClient implements connect.Interceptor
func (authInterceptor *AuthInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return next
}

// NoAuthInterceptor injects an admin context for every request when auth is disabled.
type NoAuthInterceptor struct{}

func NewNoAuthInterceptor() *NoAuthInterceptor {
	return &NoAuthInterceptor{}
}

func (i *NoAuthInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		// Inject Admin User
		admin := &auth.UserClaims{
			Username: "anonymous-admin",
			Role:     dbv1.Role_ROLE_ADMIN,
		}
		ctx = auth.NewContext(ctx, admin)
		return next(ctx, req)
	}
}

func (i *NoAuthInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return next
}

func (i *NoAuthInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		// Inject Admin User
		admin := &auth.UserClaims{
			Username: "anonymous-admin",
			Role:     dbv1.Role_ROLE_ADMIN,
		}
		ctx = auth.NewContext(ctx, admin)
		return next(ctx, conn)
	}
}
