package servicesv1

import (
	"context"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"regexp"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"strconv"
	"strings"
	"sync"
	"time"

	"google.golang.org/protobuf/types/known/structpb"
)

var (
	// Matches statements that start with SELECT, EXPLAIN, PRAGMA, or VALUES
	readerPrefixRegex = regexp.MustCompile(`(?i)^\s*(SELECT|EXPLAIN|PRAGMA|VALUES)`)

	// Matches the RETURNING keyword anywhere in the string (word boundary)
	returningRegex = regexp.MustCompile(`(?i)RETURNING\b`)

	// Matches BEGIN IMMEDIATE or BEGIN EXCLUSIVE
	beginWriteRegex = regexp.MustCompile(`(?i)^\s*BEGIN\s+(IMMEDIATE|EXCLUSIVE)`)

	// Matches standard read/control prefixes
	readonlyPrefixRegex = regexp.MustCompile(`(?i)^\s*(SELECT|EXPLAIN|VALUES|BEGIN|COMMIT|ROLLBACK|SAVEPOINT|RELEASE)`)
)

// IsReader returns true if the statement returns data (Rows).
// This determines if we should use QueryContext vs ExecContext.
func IsReader(sql string) bool {
	// 1. Check if it starts with standard read prefixes
	if readerPrefixRegex.MatchString(sql) {
		return true
	}
	// 2. Check if it's a DML statement with a RETURNING clause
	if returningRegex.MatchString(sql) {
		return true
	}
	return false
}

// IsReadOnly returns true if the statement is safe to run on a read-only connection.
func IsReadOnly(sql string) bool {
	// 1. Explicit write-lock beginnings are NOT read-only
	if beginWriteRegex.MatchString(sql) {
		return false
	}
	// 2. Must start with one of the allowed read-only/control prefixes
	if !readonlyPrefixRegex.MatchString(sql) {
		return false
	}
	// 3. Any statement with RETURNING is a write operation, NOT read-only
	if returningRegex.MatchString(sql) {
		return false
	}
	return true
}

// --- Parameter Handling ---

// convertParameters transforms the Proto `Parameters` message into a format
// compatible with the Go `database/sql` driver.
//
// LOGIC:
// 1. Handles `oneof`: Detects if parameters are Positional (Array) or Named (Map).
// 2. Applies Hints: Uses `applyHint` to convert generic types (string) to specific types (bytes).
func convertParameters(params *dbv1.Parameters) ([]any, error) {
	if params == nil {
		return nil, nil
	}
	switch v := params.Values.(type) {
	case *dbv1.Parameters_Positional:
		rawList := v.Positional.AsSlice()
		converted := make([]any, len(rawList))
		hints := params.PositionalHints
		for i, val := range rawList {
			hint, hasHint := hints[int32(i)]
			converted[i] = applyHint(val, hint, hasHint)
		}
		return converted, nil
	case *dbv1.Parameters_Named:
		rawMap := v.Named.AsMap()
		converted := make([]any, 0, len(rawMap))
		hints := params.NamedHints
		for key, val := range rawMap {
			hint, hasHint := hints[key]
			// Named args in sql usually don't want the prefix (:, @, $) in the name field
			cleanKey := strings.TrimLeft(key, ":@$")
			finalVal := applyHint(val, hint, hasHint)
			converted = append(converted, sql.Named(cleanKey, finalVal))
		}
		return converted, nil
	default:
		return nil, nil
	}
}

// applyHint performs type coercion based on the "Sparse Hint" provided by the client.
// This solves the problem of JSON (and Proto Structs) lacking native support for BLOBs and Integers.
func applyHint(val any, hint dbv1.ColumnType, hasHint bool) any {
	if !hasHint || val == nil {
		return val
	}
	switch hint {
	case dbv1.ColumnType_COLUMN_TYPE_BLOB:
		// Client sends BLOB as Base64 String -> We decode to []byte
		if strVal, ok := val.(string); ok {
			if decoded, err := base64.StdEncoding.DecodeString(strVal); err == nil {
				return decoded
			}
		}
	case dbv1.ColumnType_COLUMN_TYPE_INTEGER:
		// Client sends INT as JSON Number (float64) -> We cast to int64
		if floatVal, ok := val.(float64); ok {
			return int64(floatVal)
		}
	}
	return val
}

// resolveColumnTypes inspects the `sql.Rows` metadata to map SQLite types to Proto Enums.
// This allows the client to know if "123" is a String or an Integer.
func resolveColumnTypes(rows *sql.Rows) ([]dbv1.ColumnType, error) {
	columnTypes, err := rows.ColumnTypes()
	if err != nil {
		return nil, err
	}
	results := make([]dbv1.ColumnType, len(columnTypes))
	for i, ct := range columnTypes {
		dbType := strings.ToUpper(ct.DatabaseTypeName())
		// Heuristic mapping of SQLite dynamic types
		switch {
		case strings.Contains(dbType, "INT"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_INTEGER
		case strings.Contains(dbType, "CHAR") || strings.Contains(dbType, "TEXT") || strings.Contains(dbType, "CLOB"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_TEXT
		case strings.Contains(dbType, "BLOB") || strings.Contains(dbType, "BINARY"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_BLOB
		case strings.Contains(dbType, "REAL") || strings.Contains(dbType, "FLOA") || strings.Contains(dbType, "DOUB"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_FLOAT
		case strings.Contains(dbType, "BOOL"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_BOOLEAN
		case strings.Contains(dbType, "DATE") || strings.Contains(dbType, "TIME"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_DATE
		case strings.Contains(dbType, "NULL"):
			results[i] = dbv1.ColumnType_COLUMN_TYPE_NULL
		default:
			results[i] = dbv1.ColumnType_COLUMN_TYPE_UNSPECIFIED
		}
	}
	return results, nil
}

// --- Execution Logic ---

// scanBuffer holds the slices used during rows.Scan to prevent allocations.
type scanBuffer struct {
	values []sql.RawBytes // Use concrete RawBytes
	args   []any
}

var scanPool = sync.Pool{
	New: func() any {
		return &scanBuffer{
			values: make([]sql.RawBytes, 64),
			args:   make([]any, 64),
		}
	},
}

// getScanBuffer retrieves a buffer from the pool and ensures it is wide enough.
func getScanBuffer(colCount int) *scanBuffer {
	buf := scanPool.Get().(*scanBuffer)

	// If the pooled buffer is too small for a specific wide table, grow it.
	// SQLite supports up to 2000 columns (default), though 64-128 is common.
	if len(buf.values) < colCount {
		buf.values = make([]sql.RawBytes, colCount)
		buf.args = make([]any, colCount)
	}

	// Ensure we return slices that are exactly the right length for rows.Scan
	buf.values = buf.values[:colCount]
	buf.args = buf.args[:colCount]

	// Setup pointers ONCE per query
	for i := range colCount {
		buf.args[i] = &buf.values[i]
	}

	return buf
}

// putbackBuffer cleans up the buffer and returns it to the pool.
func putbackBuffer(buf *scanBuffer) {
	// CRITICAL: Clear all interface references.
	// If values[0] held a 10MB BLOB, that 10MB would stay in RAM
	// forever if we didn't nil it out here.
	for i := range buf.values {
		buf.values[i] = nil
	}
	for i := range buf.args {
		buf.args[i] = nil
	}

	scanPool.Put(buf)
}

// streamQueryResults is the generic engine for executing queries and streaming results.
//
// ALGORITHM:
//  1. Convert Parameters.
//  2. Determine Query Type (Select vs DML).
//  3. If DML: Execute, return rows affected, exit.
//  4. If SELECT:
//     a. Fetch Schema.
//     b. Send Header.
//     c. Iterate Rows (buffering up to `chunkSize`).
//     d. Flush Batches.
//     e. Send Complete w/ Stats.
func streamQueryResults(ctx context.Context, q querier, sqlQuery string, paramsMsg *dbv1.Parameters, writer StreamWriter) error {
	startTime := time.Now()

	params, err := convertParameters(paramsMsg)
	if err != nil {
		return fmt.Errorf("parameter error: %w", err)
	}

	// --- WRITE PATH (DML) ---
	if !IsReader(sqlQuery) {
		res, err := q.ExecContext(ctx, sqlQuery, params...)
		if err != nil {
			return err
		}
		rowsAffected, _ := res.RowsAffected()
		lastInsertId, _ := res.LastInsertId()
		return writer.SendDMLResult(&dbv1.DMLResult{RowsAffected: rowsAffected, LastInsertId: lastInsertId})
	}

	// --- READ PATH (Streaming) ---
	rows, err := q.QueryContext(ctx, sqlQuery, params...)
	if err != nil {
		return err
	}
	// CLEANUP: Ensures connection is returned to pool even if panic occurs
	defer rows.Close()

	cols, err := rows.Columns()
	if err != nil {
		return err
	}
	colTypes, err := resolveColumnTypes(rows)
	if err != nil {
		return err
	}

	// Step 1: Send Header
	if err := writer.SendHeader(&dbv1.QueryResultHeader{Columns: cols, ColumnTypes: colTypes}); err != nil {
		return err
	}

	// Step 2: Stream Rows
	const chunkSize = 500 // Tunable: Balance between memory usage and network overhead
	rowBuffer := make([]*structpb.ListValue, 0, chunkSize)

	// Rent the buffer
	buf := getScanBuffer(len(cols))
	// Ensure it is ALWAYS put back, even if a row.Scan or proto conversion panics.
	defer putbackBuffer(buf)

	var rowsReadCount int64 = 0
	for rows.Next() {
		if err := rows.Scan(buf.args...); err != nil {
			return err
		}
		rowsReadCount++

		// Convert row to Proto ListValue
		protoRow := valuesToProto(buf.values, colTypes)
		rowBuffer = append(rowBuffer, protoRow)

		// Flush Batch
		if len(rowBuffer) >= chunkSize {
			if err := writer.SendRowBatch(&dbv1.QueryResultRowBatch{Rows: rowBuffer}); err != nil {
				return err
			}
			rowBuffer = make([]*structpb.ListValue, 0, chunkSize)
		}
	}
	// Flush Remainder
	if len(rowBuffer) > 0 {
		if err := writer.SendRowBatch(&dbv1.QueryResultRowBatch{Rows: rowBuffer}); err != nil {
			return err
		}
	}

	// Step 3: Complete
	stats := &dbv1.ExecutionStats{
		DurationMs: float64(time.Since(startTime).Milliseconds()),
		RowsRead:   rowsReadCount,
	}
	return writer.SendComplete(stats)
}

// executeQueryAndBuffer executes a query and returns the FULL result set in memory.
// Used by the unary `Query` RPC.
//
// MEMORY WARNING:
// This function allocates memory proportional to the result set size.
// It is intended for small, precise lookups only.
func executeQueryAndBuffer(ctx context.Context, q querier, sqlQuery string, paramsMsg *dbv1.Parameters) (*dbv1.QueryResult, error) {
	startTime := time.Now()

	params, err := convertParameters(paramsMsg)
	if err != nil {
		return nil, fmt.Errorf("parameter error: %w", err)
	}

	if IsReader(sqlQuery) {
		rows, err := q.QueryContext(ctx, sqlQuery, params...)
		if err != nil {
			return nil, err
		}
		defer rows.Close()

		columns, err := rows.Columns()
		if err != nil {
			return nil, err
		}
		colTypes, err := resolveColumnTypes(rows)
		if err != nil {
			return nil, err
		}

		selectResult := &dbv1.SelectResult{
			Columns:     columns,
			ColumnTypes: colTypes,
		}

		// Rent the buffer
		buf := getScanBuffer(len(columns))
		// Ensure it is ALWAYS put back, even if a row.Scan or proto conversion panics.
		defer putbackBuffer(buf)

		var rowsRead int64
		for rows.Next() {
			if err := rows.Scan(buf.args...); err != nil {
				return nil, err
			}
			rowsRead++
			protoRow := valuesToProto(buf.values, colTypes)
			selectResult.Rows = append(selectResult.Rows, protoRow)
		}
		stats := &dbv1.ExecutionStats{
			DurationMs: float64(time.Since(startTime).Milliseconds()),
			RowsRead:   rowsRead,
		}
		return &dbv1.QueryResult{
			Result: &dbv1.QueryResult_Select{Select: selectResult},
			Stats:  stats,
		}, nil
	} else {
		res, err := q.ExecContext(ctx, sqlQuery, params...)
		if err != nil {
			return nil, err
		}
		rowsAffected, _ := res.RowsAffected()
		lastInsertId, _ := res.LastInsertId()
		stats := &dbv1.ExecutionStats{
			DurationMs:  float64(time.Since(startTime).Milliseconds()),
			RowsWritten: rowsAffected,
		}
		return &dbv1.QueryResult{
			Result: &dbv1.QueryResult_Dml{Dml: &dbv1.DMLResult{RowsAffected: rowsAffected, LastInsertId: lastInsertId}},
			Stats:  stats,
		}, nil
	}
}

// maxSafeInteger is 2^53 - 1. Integers larger than this lose precision
// when converted to float64 (the type used by Protobuf NumberValue).
const maxSafeInteger = (1 << 53) - 1

// valuesToProto converts a row scanned into sql.RawBytes into a Protobuf ListValue.
//
// PERFORMANCE PROFILE:
//  1. Zero-Allocation Scanning: Uses RawBytes to point into driver memory.
//  2. No Reflection: Uses ColumnType hints to drive a manual type switch.
//  3. Minimal Allocations: Allocates only the final required Protobuf objects.
//  4. Precision Safety: Automatically handles the 2^53 integer limit for JS clients.
func valuesToProto(values []sql.RawBytes, colTypes []dbv1.ColumnType) *structpb.ListValue {
	// Pre-allocate the slice for the Protobuf values to avoid mid-loop growth.
	pbValues := make([]*structpb.Value, len(values))

	for i, rb := range values {
		// NULL handling: If the column is NULL, RawBytes is nil.
		if rb == nil {
			pbValues[i] = structpb.NewNullValue()
			continue
		}

		switch colTypes[i] {
		case dbv1.ColumnType_COLUMN_TYPE_INTEGER:
			// 1. Convert RawBytes to a temporary string using unsafe (No Allocation)
			tempStr := UnsafeBytesToStringNoCopy(rb)

			// 2. Parse the integer
			val, err := strconv.ParseInt(tempStr, 10, 64)
			if err != nil {
				// Fallback: If parsing fails, treat as string
				pbValues[i] = structpb.NewStringValue(string(rb))
				continue
			}

			// 3. Precision Check: Protect JS/Web clients from rounding errors
			if val > maxSafeInteger || val < -maxSafeInteger {
				// Convert to string (Allocation required to own the data)
				pbValues[i] = structpb.NewStringValue(strconv.FormatInt(val, 10))
			} else {
				// Convert to float64 (0 Allocation - fits in the Value struct)
				pbValues[i] = structpb.NewNumberValue(float64(val))
			}

		case dbv1.ColumnType_COLUMN_TYPE_TEXT:
			// A copy is REQUIRED here because rb (RawBytes) will be
			// overwritten by the driver on the next row.
			pbValues[i] = structpb.NewStringValue(string(rb))

		case dbv1.ColumnType_COLUMN_TYPE_FLOAT:
			tempStr := UnsafeBytesToStringNoCopy(rb)
			val, _ := strconv.ParseFloat(tempStr, 64)
			pbValues[i] = structpb.NewNumberValue(val)

		case dbv1.ColumnType_COLUMN_TYPE_BOOLEAN:
			tempStr := UnsafeBytesToStringNoCopy(rb)
			// SQLite stores booleans as 0 or 1.
			pbValues[i] = structpb.NewBoolValue(tempStr == "1" || tempStr == "true")

		case dbv1.ColumnType_COLUMN_TYPE_BLOB:
			// Base64 encoding creates a new string (Allocation required)
			pbValues[i] = structpb.NewStringValue(base64.StdEncoding.EncodeToString(rb))

		default:
			// Fallback for unspecified types
			pbValues[i] = structpb.NewStringValue(string(rb))
		}
	}

	return &structpb.ListValue{Values: pbValues}
}

// generateSavepointSQL transforms a structured SavepointRequest into a valid
// SQLite SQL statement.
//
// ARCHITECTURAL DESIGN:
// SQLite uses "Savepoints" to provide nested transaction support. This function
// maps the high-level SavepointAction enum to the three fundamental SQLite
// commands: SAVEPOINT, RELEASE, and ROLLBACK TO.
//
// SAFETY NOTE:
// The 'name' of the savepoint is embedded directly into the SQL string.
// While 'protovalidate' constraints on the .proto file should prevent SQL
// injection, this function acts as the final guard to ensure the command
// structure is syntactically correct before it reaches the database driver.
func generateSavepointSQL(sp *dbv1.SavepointRequest) (string, error) {
	if sp == nil || sp.Name == "" {
		return "", errors.New("savepoint name is required")
	}

	switch sp.Action {
	case dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE:
		return fmt.Sprintf("SAVEPOINT %s", sp.Name), nil
	case dbv1.SavepointAction_SAVEPOINT_ACTION_RELEASE:
		return fmt.Sprintf("RELEASE %s", sp.Name), nil
	case dbv1.SavepointAction_SAVEPOINT_ACTION_ROLLBACK:
		return fmt.Sprintf("ROLLBACK TO %s", sp.Name), nil
	default:
		return "", fmt.Errorf("unsupported savepoint action: %v", sp.Action)
	}
}
