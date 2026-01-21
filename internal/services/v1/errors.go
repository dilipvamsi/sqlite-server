package servicesv1

import (
	"errors"
	"log"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"connectrpc.com/connect"
	"github.com/mattn/go-sqlite3"
)

// --- Error Handling Logic ---

// extractSqliteCode attempts to cast the error to a sqlite3.Error and return its extended code.
// Returns 0 if it's not a sqlite error.
func extractSqliteCode(err error) dbv1.SqliteCode {
	var sqliteErr sqlite3.Error
	if errors.As(err, &sqliteErr) {
		// Use ExtendedCode for more granular detail (e.g. SQLITE_CONSTRAINT_UNIQUE)
		return dbv1.SqliteCode(sqliteErr.ExtendedCode)
	}
	return 0
}

// sqliteToConnectCode maps SQLite error codes to appropriate gRPC/Connect codes.
func sqliteToConnectCode(sqliteCode dbv1.SqliteCode) connect.Code {
	// Mask off extended bits to check primary codes if needed, or check specific extended codes.
	// Reference: https://www.sqlite.org/rescode.html
	primary := sqliteCode & 0xFF

	switch primary {
	case 1: // SQLITE_ERROR (SQL error or missing database)
		return connect.CodeInvalidArgument
	case 19: // SQLITE_CONSTRAINT (Abort due to constraint violation)
		return connect.CodeAlreadyExists // or CodeFailedPrecondition
	case 5, 6: // SQLITE_BUSY, SQLITE_LOCKED
		return connect.CodeResourceExhausted // or CodeAborted
	case 11: // SQLITE_CORRUPT
		return connect.CodeDataLoss
	default:
		return connect.CodeInternal
	}
}

// makeUnaryError wraps the error in a connect.Error and attaches the
// dbv1.ErrorResponse as detailed metadata. This allows the client to see
// the 'sqlite_error_code' even in unary RPCs.
func makeUnaryError(err error, sql string) *connect.Error {
	code := extractSqliteCode(err)
	connectCode := connect.CodeInternal

	// If we successfully extracted a code, try to map it to a better HTTP status
	if code != 0 {
		connectCode = sqliteToConnectCode(code)
	}

	// Create the base Connect error
	connectErr := connect.NewError(connectCode, err)

	// Construct the structured ErrorResponse defined in your proto
	detailVal := &dbv1.ErrorResponse{
		Message:         err.Error(),
		FailedSql:       sql,
		SqliteErrorCode: code,
	}

	// Attach it as a "Detail" (standard gRPC error model)
	if detail, detailErr := connect.NewErrorDetail(detailVal); detailErr == nil {
		connectErr.AddDetail(detail)
	} else {
		log.Printf("Failed to attach error detail: %v", detailErr)
	}

	return connectErr
}

// transactionSender abstracts the stream for testing
type transactionSender interface {
	Send(*dbv1.TransactionResponse) error
}

// sendAppError writes an application-level error message to the stream.
// Used for "Soft Errors" (e.g. SQL Syntax) where the stream protocol should remain intact.
func sendAppError(stream transactionSender, reqID string, err error, sql string) {
	errResp := makeStreamError(err, sql)

	res := &dbv1.TransactionResponse{
		// ResponseID isn't in proto, assuming logic from previous context
		Response: &dbv1.TransactionResponse_Error{Error: errResp},
	}
	if err := stream.Send(res); err != nil {
		log.Printf("Failed to send error to client: %v for reqID: %s", err, reqID)
	}
}

// makeStreamError helper to create the ErrorResponse message for streams
func makeStreamError(err error, sql string) *dbv1.ErrorResponse {
	return &dbv1.ErrorResponse{
		Message:         err.Error(),
		FailedSql:       sql,
		SqliteErrorCode: extractSqliteCode(err),
	}
}
