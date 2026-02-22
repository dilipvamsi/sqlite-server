package servicesv1

import (
	"errors"
	"testing"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
	"github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestSqliteErrorMapping covers sqliteToConnectCode
func TestSqliteErrorMapping(t *testing.T) {
	// Helper to check mapping
	check := func(code sqlrpcv1.SqliteCode, expectedCode connect.Code) {
		res := sqliteToConnectCode(code)
		assert.Equal(t, expectedCode, res)
	}

	check(sqlrpcv1.SqliteCode_SQLITE_ERROR, connect.CodeInvalidArgument)
	check(sqlrpcv1.SqliteCode_SQLITE_CONSTRAINT, connect.CodeAlreadyExists)
	check(sqlrpcv1.SqliteCode_SQLITE_BUSY, connect.CodeResourceExhausted)
	check(sqlrpcv1.SqliteCode_SQLITE_CORRUPT, connect.CodeDataLoss)
	check(sqlrpcv1.SqliteCode_SQLITE_OK, connect.CodeInternal) // Default fallback

	// Test extractSqliteCode with a real sqlite error
	sqliteErr := sqlite3.Error{Code: sqlite3.ErrConstraint, ExtendedCode: sqlite3.ErrConstraintUnique}
	extracted := extractSqliteCode(sqliteErr)
	assert.Equal(t, sqlrpcv1.SqliteCode(sqlite3.ErrConstraintUnique), extracted)

	// Test non-sqlite error
	assert.Equal(t, sqlrpcv1.SqliteCode(0), extractSqliteCode(errors.New("generic")))
}

// --- Mocks for sendAppError ---

type mockTxSender struct {
	failSend bool
	lastMsg  *sqlrpcv1.TransactionResponse
}

func (m *mockTxSender) Send(msg *sqlrpcv1.TransactionResponse) error {
	if m.failSend {
		return errors.New("mock network error")
	}
	m.lastMsg = msg
	return nil
}

func TestSendAppError_Coverage(t *testing.T) {
	t.Run("Success", func(t *testing.T) {
		mock := &mockTxSender{}
		err := errors.New("syntax error")
		sendAppError(mock, "req1", err, "SELECT *")

		assert.NotNil(t, mock.lastMsg)
		assert.Equal(t, "syntax error", mock.lastMsg.GetError().Message)
	})

	t.Run("Send Failure", func(t *testing.T) {
		mock := &mockTxSender{failSend: true}
		err := errors.New("syntax error")
		// This should log error but not panic
		sendAppError(mock, "req1", err, "SELECT *")
	})
}
