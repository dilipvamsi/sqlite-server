package servicesv1

import (
	"context"
	"strings"

	"sqlite-server/internal/auth"

	"connectrpc.com/connect"
)

// AuthorizeWrite checks if the current user has permission to perform write operations.
// Returns an error if the user is read_only.
func AuthorizeWrite(ctx context.Context) error {
	claims, ok := auth.FromContext(ctx)
	if !ok {
		// No auth context means auth is disabled or anonymous access
		// This should be handled by the AuthInterceptor first
		return connect.NewError(connect.CodeUnauthenticated, nil)
	}

	if claims.Role == auth.RoleReadOnly {
		return connect.NewError(connect.CodePermissionDenied, nil)
	}

	return nil
}

// AuthorizeAdmin checks if the current user has admin role.
// Returns an error if the user is not an admin.
func AuthorizeAdmin(ctx context.Context) error {
	claims, ok := auth.FromContext(ctx)
	if !ok {
		return connect.NewError(connect.CodeUnauthenticated, nil)
	}

	if claims.Role != auth.RoleAdmin {
		return connect.NewError(connect.CodePermissionDenied, nil)
	}

	return nil
}

// IsWriteQuery checks if the SQL statement is a write operation.
// This is a simple heuristic check for common write statements.
func IsWriteQuery(sql string) bool {
	trimmed := strings.TrimSpace(strings.ToUpper(sql))
	writeKeywords := []string{
		"INSERT", "UPDATE", "DELETE", "DROP", "CREATE", "ALTER",
		"TRUNCATE", "REPLACE", "UPSERT", "ATTACH", "DETACH",
	}
	for _, keyword := range writeKeywords {
		if strings.HasPrefix(trimmed, keyword) {
			return true
		}
	}
	return false
}
