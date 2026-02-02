package servicesv1

import (
	"context"
	"errors"
	"strings"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"connectrpc.com/connect"
)

// AuthorizeRead checks if the current user has permission to perform read operations.
// Returns an error if the user is not authenticated or has an invalid role.
func AuthorizeRead(ctx context.Context) error {
	claims, ok := auth.FromContext(ctx)
	if !ok {
		// No auth context means auth is disabled or anonymous access
		// This should be handled by the AuthInterceptor first
		return connect.NewError(connect.CodeUnauthenticated, nil)
	}

	// All valid roles (Admin, ReadWrite, ReadOnly) can read.
	// We just check if role is unspecified.
	if claims.Role == dbv1.Role_ROLE_UNSPECIFIED {
		return connect.NewError(connect.CodePermissionDenied, nil)
	}

	return nil
}

// AuthorizeWrite checks if the current user has permission to perform write operations.
// Returns an error if the user is read_only.
func AuthorizeWrite(ctx context.Context) error {
	claims, ok := auth.FromContext(ctx)
	if !ok {
		return connect.NewError(connect.CodeUnauthenticated, nil)
	}

	// Only Admin and ReadWrite can write.
	if claims.Role != dbv1.Role_ROLE_ADMIN && claims.Role != dbv1.Role_ROLE_READ_WRITE {
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

	if claims.Role != dbv1.Role_ROLE_ADMIN {
		return connect.NewError(connect.CodePermissionDenied, nil)
	}

	return nil
}

// AuthorizeUser checks if the current user is an admin or is the target user.
func AuthorizeUser(ctx context.Context, targetUsername string) error {
	claims, ok := auth.FromContext(ctx)
	if !ok {
		return connect.NewError(connect.CodeUnauthenticated, nil)
	}

	if claims.Role != dbv1.Role_ROLE_ADMIN && claims.Username != targetUsername {
		return connect.NewError(connect.CodePermissionDenied, errors.New("permission denied"))
	}

	return nil
}

// IsWriteQuery checks if the SQL statement is a write operation.
// This is a simple heuristic check for common write statements.
func IsWriteQuery(sql string) bool {
	trimmed := strings.TrimSpace(strings.ToUpper(sql))
	// Strip comments (simple check)
	// TODO: Use a proper tokenizer?
	writeKeywords := []string{
		"INSERT", "UPDATE", "DELETE", "DROP", "CREATE", "ALTER",
		"TRUNCATE", "REPLACE", "UPSERT", "ATTACH", "DETACH", "VACUUM",
	}
	for _, keyword := range writeKeywords {
		if strings.HasPrefix(trimmed, keyword) {
			return true
		}
	}
	return false
}
