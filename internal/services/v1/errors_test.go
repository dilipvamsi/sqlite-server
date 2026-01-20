package servicesv1

import (
	"errors"
	"testing"

	dbv1 "sqlite-server/internal/protos/db/v1"

	"connectrpc.com/connect"
	"github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestSqliteErrorMapping covers sqliteToConnectCode
func TestSqliteErrorMapping(t *testing.T) {
	// Helper to check mapping
	check := func(code dbv1.SqliteCode, expectedCode connect.Code) {
		res := sqliteToConnectCode(code)
		assert.Equal(t, expectedCode, res)
	}

	check(dbv1.SqliteCode_SQLITE_CODE_ERROR, connect.CodeInvalidArgument)
	check(dbv1.SqliteCode_SQLITE_CODE_CONSTRAINT, connect.CodeAlreadyExists)
	check(dbv1.SqliteCode_SQLITE_CODE_BUSY, connect.CodeResourceExhausted)
	check(dbv1.SqliteCode_SQLITE_CODE_CORRUPT, connect.CodeDataLoss)
	check(dbv1.SqliteCode_SQLITE_CODE_OK, connect.CodeInternal) // Default fallback

	// Test extractSqliteCode with a real sqlite error
	sqliteErr := sqlite3.Error{Code: sqlite3.ErrConstraint, ExtendedCode: sqlite3.ErrConstraintUnique}
	extracted := extractSqliteCode(sqliteErr)
	assert.Equal(t, dbv1.SqliteCode(sqlite3.ErrConstraintUnique), extracted)

	// Test non-sqlite error
	assert.Equal(t, dbv1.SqliteCode(0), extractSqliteCode(errors.New("generic")))
}
