package servicesv1

import (
	"context"
	"encoding/base64"
	"errors"
	"strings"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"connectrpc.com/connect"
)

// AuthInterceptor implements connect.Interceptor for authentication and authorization
type AuthInterceptor struct {
	store *auth.MetaStore
}

func NewAuthInterceptor(store *auth.MetaStore) *AuthInterceptor {
	return &AuthInterceptor{store: store}
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

		// Set Context
		ctx = auth.NewContext(ctx, user)

		// 3. Authorization (Check Permissions)

		// AdminService Check
		if strings.HasPrefix(req.Spec().Procedure, "/db.v1.AdminService/") {
			if user.Role != dbv1.Role_ROLE_ADMIN {
				return nil, connect.NewError(connect.CodePermissionDenied, errors.New("admin access required"))
			}
			// AdminService calls are allowed if Admin
			return next(ctx, req)
		}

		// DatabaseService Permission Checks
		isWrite := false
		switch req.Spec().Procedure {
		// Explicit Write Methods
		case "/db.v1.DatabaseService/Vacuum",
			"/db.v1.DatabaseService/Checkpoint":
			isWrite = true

		// Dynamic Methods (Parse SQL)
		case "/db.v1.DatabaseService/Query", "/db.v1.DatabaseService/QueryStream":
			if msg, ok := req.Any().(*dbv1.QueryRequest); ok {
				isWrite = IsWriteQuery(msg.Sql)
			}
		case "/db.v1.DatabaseService/TypedQuery", "/db.v1.DatabaseService/TypedQueryStream":
			if msg, ok := req.Any().(*dbv1.TypedQueryRequest); ok {
				isWrite = IsWriteQuery(msg.Sql)
			}
		case "/db.v1.DatabaseService/TransactionQuery", "/db.v1.DatabaseService/TransactionQueryStream":
			if msg, ok := req.Any().(*dbv1.TransactionQueryRequest); ok {
				isWrite = IsWriteQuery(msg.Sql)
			}
		case "/db.v1.DatabaseService/TypedTransactionQuery", "/db.v1.DatabaseService/TypedTransactionQueryStream":
			if msg, ok := req.Any().(*dbv1.TypedTransactionQueryRequest); ok {
				isWrite = IsWriteQuery(msg.Sql)
			}
		case "/db.v1.DatabaseService/ExecuteTransaction":
			if msg, ok := req.Any().(*dbv1.ExecuteTransactionRequest); ok {
				// Iterate all requests to see if ANY is a write
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
						break
					}
				}
			}
		}

		// Enforce Permissions based on intent
		if isWrite {
			if err := AuthorizeWrite(ctx); err != nil {
				return nil, err
			}
		} else {
			// Read-only or Neutral operation -> Requires at least Read permissions
			if err := AuthorizeRead(ctx); err != nil {
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
	switch req := msg.(type) {
	case *dbv1.TransactionRequest:
		// Check inner command
		switch cmd := req.Command.(type) {
		case *dbv1.TransactionRequest_Query:
			isWrite = IsWriteQuery(cmd.Query.Sql)
		case *dbv1.TransactionRequest_QueryStream:
			isWrite = IsWriteQuery(cmd.QueryStream.Sql)
		case *dbv1.TransactionRequest_TypedQuery:
			isWrite = IsWriteQuery(cmd.TypedQuery.Sql)
		case *dbv1.TransactionRequest_TypedQueryStream:
			isWrite = IsWriteQuery(cmd.TypedQueryStream.Sql)
		// Begin, Commit, Rollback, Savepoint don't need strict Write checks
		// as they are transaction management, but usually implied write access?
		// SQLite allows transactions for reading too.
		// For now we treat them as neutral/read unless we want to enforce separate perms.
		default:
			// No sql to check
		}
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
