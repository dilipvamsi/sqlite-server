package servicesv1

import (
	"context"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"math"
	"regexp"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
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
// It uses Regex to map Positional/Named arguments to their correct order in the SQL.
func convertParameters(sqlQuery string, params *sqlrpcv1.Parameters) ([]any, error) {
	if params == nil {
		return nil, nil
	}

	var converted []any

	// 1. Prepare Data Sources
	positional := params.Positional
	named := params.Named // This is a map[string]*structpb.Value

	// 2. Scan SQL to Interleave Parameters correctly
	paramRegex := regexp.MustCompile(`(\?)|([:@$]\w+)`)
	matches := paramRegex.FindAllString(sqlQuery, -1)

	posIndex := 0
	namedUsed := make(map[string]bool)

	for _, match := range matches {
		if match == "?" {
			// Consume next positional parameter
			if posIndex < len(positional) {
				val := positional[posIndex].AsInterface()
				hintKey := fmt.Sprintf("%d", posIndex)
				if params.Hints != nil {
					if hint, ok := params.Hints[hintKey]; ok {
						val = applyHint(val, hint, true)
					}
				}
				converted = append(converted, val)
				posIndex++
			}
		} else {
			// Named parameter (e.g. :country)
			key := match
			cleanKey := strings.TrimLeft(key, ":@$")

			var val any
			var foundKey string
			var found bool

			if named != nil {
				if v, ok := named[key]; ok {
					val = v.AsInterface()
					foundKey = key
					found = true
				} else if v, ok := named[cleanKey]; ok {
					val = v.AsInterface()
					foundKey = cleanKey
					found = true
				}
			}

			if found && !namedUsed[foundKey] {
				if params.Hints != nil {
					if hint, ok := params.Hints[foundKey]; ok {
						val = applyHint(val, hint, true)
					}
				}
				converted = append(converted, sql.Named(cleanKey, val))
				namedUsed[foundKey] = true
			}
		}
	}

	// 3. Append Leftover Positional Parameters
	for i := posIndex; i < len(positional); i++ {
		val := positional[i].AsInterface()
		hintKey := fmt.Sprintf("%d", i)
		if params.Hints != nil {
			if hint, ok := params.Hints[hintKey]; ok {
				val = applyHint(val, hint, true)
			}
		}
		converted = append(converted, val)
	}

	// 4. Append Leftover Named Parameters
	for key, pbVal := range named {
		if !namedUsed[key] {
			cleanKey := strings.TrimLeft(key, ":@$")
			val := pbVal.AsInterface()
			if params.Hints != nil {
				if hint, ok := params.Hints[key]; ok {
					val = applyHint(val, hint, true)
				}
			}
			converted = append(converted, sql.Named(cleanKey, val))
		}
	}

	return converted, nil
}

// applyHint performs type coercion based on the "Sparse Hint" provided by the client.
// This solves the problem of JSON (and Proto Structs) lacking native support for BLOBs and Integers.
func applyHint(val any, hint sqlrpcv1.ColumnAffinity, hasHint bool) any {
	if !hasHint || val == nil {
		// Basic boolean to integer coercion for SQLite even without hints,
		// because SQLite doesn't support native booleans.
		if b, ok := val.(bool); ok {
			if b {
				return 1
			}
			return 0
		}
		return val
	}

	switch hint {
	case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_BLOB:
		// Logic: Clients send binary data as Base64 strings.
		// We decode it back to []byte so SQLite driver uses binary mode.
		if strVal, ok := val.(string); ok {
			if decoded, err := base64.StdEncoding.DecodeString(strVal); err == nil {
				// log.Printf("[DEBUG] applyHint BLOB success, inLen: %d, outLen: %d, inVal: %s", len(strVal), len(decoded), strVal)
				return decoded
			} else {
				// log.Printf("[DEBUG] applyHint BLOB FAILED: %v (input: %q)", err, strVal)
			}
		}
		return val // Fallback

	case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER:
		// Logic: Handle precision safety and boolean coercion.
		switch v := val.(type) {
		case string:
			if i, err := strconv.ParseInt(v, 10, 64); err == nil {
				return i
			}
		case float64:
			return int64(v)
		case bool:
			if v {
				return 1
			}
			return 0
		}

	case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_REAL:
		if s, ok := val.(string); ok {
			if f, err := strconv.ParseFloat(s, 64); err == nil {
				return f
			}
		}
	}

	return val
}

// resolveColumnTypes inspects the `sql.Rows` metadata to map SQLite types to Proto Enums.
// Returns: Affinities (Storage), DeclaredTypes (Semantic), and Raw Types (Strings).
func resolveColumnTypes(rows *sql.Rows) ([]sqlrpcv1.ColumnAffinity, []sqlrpcv1.DeclaredType, []string, error) {
	columnTypes, err := rows.ColumnTypes()
	if err != nil {
		return nil, nil, nil, err
	}

	count := len(columnTypes)
	affinities := make([]sqlrpcv1.ColumnAffinity, count)
	declaredTypes := make([]sqlrpcv1.DeclaredType, count)
	rawTypes := make([]string, count)

	for i, ct := range columnTypes {
		dbType := strings.ToUpper(ct.DatabaseTypeName())
		rawTypes[i] = ct.DatabaseTypeName()

		// 1. Determine Affinity (Storage Class)
		// Rules based on SQLite 3: https://www.sqlite.org/datatype3.html
		switch {
		case strings.Contains(dbType, "INT"):
			affinities[i] = sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER
		case strings.Contains(dbType, "CHAR") || strings.Contains(dbType, "CLOB") || strings.Contains(dbType, "TEXT"):
			affinities[i] = sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_TEXT
		case strings.Contains(dbType, "BLOB") || strings.Contains(dbType, "BINARY"):
			affinities[i] = sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_BLOB
		case strings.Contains(dbType, "REAL") || strings.Contains(dbType, "FLOA") || strings.Contains(dbType, "DOUB"):
			affinities[i] = sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_REAL
		default:
			// "NUMERIC" behavior or fallback
			affinities[i] = sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_NUMERIC
		}
		// Special override for JSON/UUID/XML/DATE which are text-based but semantic
		// If SQLite says "UUID", the rule above might fallback to NUMERIC or unspecified.
		// Commonly, specialized types like UUID/JSON are stored as TEXT, but
		// DatabaseTypeName() returns "UUID".
		if affinities[i] == sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_NUMERIC || affinities[i] == sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_UNSPECIFIED {
			// Check if it's a known text alias
			if strings.Contains(dbType, "JSON") || strings.Contains(dbType, "UUID") ||
				strings.Contains(dbType, "XML") || strings.Contains(dbType, "TIME") ||
				strings.Contains(dbType, "DATE") {
				affinities[i] = sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_TEXT
			}
		}

		// 2. Determine Declared Type (Semantic)
		declaredTypes[i] = mapDeclaredType(dbType)
	}

	return affinities, declaredTypes, rawTypes, nil
}

func mapDeclaredType(dbType string) sqlrpcv1.DeclaredType {
	ts := strings.ToUpper(dbType)

	// Exact matches for specialized types
	switch ts {
	case "INT":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_INT
	case "INTEGER":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_INTEGER
	case "TINYINT":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_TINYINT
	case "SMALLINT":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_SMALLINT
	case "MEDIUMINT":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_MEDIUMINT
	case "BIGINT":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_BIGINT
	case "UNSIGNED BIG INT":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_BIGINT
	case "INT2":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_INT2
	case "INT8":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_INT8
	case "CHARACTER":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_CHARACTER
	case "VARCHAR":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_VARCHAR
	case "VARYING CHARACTER":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_VARYING_CHARACTER
	case "NCHAR":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_NCHAR
	case "NATIVE CHARACTER":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_NATIVE_CHARACTER
	case "NVARCHAR":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_NVARCHAR
	case "TEXT":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_TEXT
	case "CLOB":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_CLOB
	case "BLOB":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_BLOB
	case "REAL":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_REAL
	case "DOUBLE":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_DOUBLE
	case "FLOAT":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_FLOAT
	case "NUMERIC":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_NUMERIC
	case "BOOLEAN", "BOOL":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_BOOLEAN
	case "DATE":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_DATE
	case "DATETIME":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_DATETIME
	case "TIMESTAMP":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_TIMESTAMP
	case "TIME":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_TIME
	case "JSON":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_JSON
	case "UUID":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_UUID
	case "XML":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_XML
	case "YEAR":
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_YEAR
	}

	// Pattern matching for types with sizes like VARCHAR(255)
	switch {
	case strings.Contains(ts, "INT"):
		if strings.Contains(ts, "BIG") {
			return sqlrpcv1.DeclaredType_DECLARED_TYPE_BIGINT
		}
		if strings.Contains(ts, "SMALL") {
			return sqlrpcv1.DeclaredType_DECLARED_TYPE_SMALLINT
		}
		if strings.Contains(ts, "TINY") {
			return sqlrpcv1.DeclaredType_DECLARED_TYPE_TINYINT
		}
		if strings.Contains(ts, "MEDIUM") {
			return sqlrpcv1.DeclaredType_DECLARED_TYPE_MEDIUMINT
		}
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_INTEGER

	case strings.Contains(ts, "CHAR"):
		if strings.Contains(ts, "NVARCHAR") {
			return sqlrpcv1.DeclaredType_DECLARED_TYPE_NVARCHAR
		}
		if strings.Contains(ts, "VARYING CHARACTER") {
			return sqlrpcv1.DeclaredType_DECLARED_TYPE_VARYING_CHARACTER
		}
		if strings.Contains(ts, "VARCHAR") {
			return sqlrpcv1.DeclaredType_DECLARED_TYPE_VARCHAR
		}
		if strings.Contains(ts, "NATIVE CHARACTER") {
			return sqlrpcv1.DeclaredType_DECLARED_TYPE_NATIVE_CHARACTER
		}
		if strings.Contains(ts, "NCHAR") {
			return sqlrpcv1.DeclaredType_DECLARED_TYPE_NCHAR
		}
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_CHARACTER

	case strings.Contains(ts, "TEXT"):
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_TEXT
	case strings.Contains(ts, "CLOB"):
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_CLOB
	case strings.Contains(ts, "BLOB"):
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_BLOB
	case strings.Contains(ts, "REAL"):
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_REAL
	case strings.Contains(ts, "DOUB"):
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_DOUBLE
	case strings.Contains(ts, "FLOAT"):
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_FLOAT
	case strings.Contains(ts, "DECIMAL"):
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_DECIMAL
	case strings.Contains(ts, "NUMERIC"):
		return sqlrpcv1.DeclaredType_DECLARED_TYPE_NUMERIC
	}

	return sqlrpcv1.DeclaredType_DECLARED_TYPE_UNSPECIFIED
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
func streamQueryResults(ctx context.Context, q querier, sqlQuery string, paramsMsg *sqlrpcv1.Parameters, writer StreamWriter) error {
	startTime := time.Now()

	params, err := convertParameters(sqlQuery, paramsMsg)
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
		return writer.SendDMLResult(&sqlrpcv1.ExecResponse{
			Dml: &sqlrpcv1.DMLResult{
				RowsAffected: rowsAffected,
				LastInsertId: lastInsertId,
			},
		})
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
	affinities, declaredTypes, rawTypes, err := resolveColumnTypes(rows)
	if err != nil {
		return err
	}

	// Step 1: Send Header
	if err := writer.SendHeader(&sqlrpcv1.QueryResultHeader{
		Columns:             cols,
		ColumnAffinities:    affinities,
		ColumnDeclaredTypes: declaredTypes,
		ColumnRawTypes:      rawTypes,
	}); err != nil {
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
		protoRow := valuesToProto(buf.values, affinities)
		rowBuffer = append(rowBuffer, protoRow)

		// Flush Batch
		if len(rowBuffer) >= chunkSize {
			if err := writer.SendRowBatch(&sqlrpcv1.QueryResultRowBatch{Rows: rowBuffer}); err != nil {
				return err
			}
			rowBuffer = make([]*structpb.ListValue, 0, chunkSize)
		}
	}
	// Flush Remainder
	if len(rowBuffer) > 0 {
		if err := writer.SendRowBatch(&sqlrpcv1.QueryResultRowBatch{Rows: rowBuffer}); err != nil {
			return err
		}
	}

	if err := rows.Err(); err != nil {
		return err
	}

	// Step 3: Complete
	stats := &sqlrpcv1.ExecutionStats{
		DurationMs: float64(time.Since(startTime).Milliseconds()),
		RowsRead:   rowsReadCount,
	}
	return writer.SendComplete(stats)
}

// executeQueryAndBuffer executes a query and returns the FULL result set in memory.
// Used by the unary `Query` RPC.
//
// MEMORY WARNING:
//
// This function allocates memory proportional to the result set size.
// It is intended for small, precise lookups only.
func executeQueryAndBuffer(ctx context.Context, q querier, sqlQuery string, paramsMsg *sqlrpcv1.Parameters) (*sqlrpcv1.QueryResult, error) {
	startTime := time.Now()
	params, err := convertParameters(sqlQuery, paramsMsg)
	if err != nil {
		return nil, fmt.Errorf("parameter error: %w", err)
	}

	rows, err := q.QueryContext(ctx, sqlQuery, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	affinities, declaredTypes, rawTypes, err := resolveColumnTypes(rows)
	if err != nil {
		return nil, err
	}

	result := &sqlrpcv1.QueryResult{
		Columns:             columns,
		ColumnAffinities:    affinities,
		ColumnDeclaredTypes: declaredTypes,
		ColumnRawTypes:      rawTypes,
	}

	buf := getScanBuffer(len(columns))
	defer putbackBuffer(buf)

	var rowsRead int64
	for rows.Next() {
		if err := rows.Scan(buf.args...); err != nil {
			return nil, err
		}
		rowsRead++
		protoRow := valuesToProto(buf.values, affinities)
		result.Rows = append(result.Rows, protoRow)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	result.Stats = &sqlrpcv1.ExecutionStats{
		DurationMs: float64(time.Since(startTime).Milliseconds()),
		RowsRead:   rowsRead,
	}
	return result, nil
}

func executeExecAndBuffer(ctx context.Context, q querier, sqlQuery string, paramsMsg *sqlrpcv1.Parameters) (*sqlrpcv1.ExecResponse, error) {
	startTime := time.Now()
	params, err := convertParameters(sqlQuery, paramsMsg)
	if err != nil {
		return nil, fmt.Errorf("parameter error: %w", err)
	}

	res, err := q.ExecContext(ctx, sqlQuery, params...)
	if err != nil {
		return nil, err
	}
	rowsAffected, _ := res.RowsAffected()
	lastInsertId, _ := res.LastInsertId()
	stats := &sqlrpcv1.ExecutionStats{
		DurationMs:  float64(time.Since(startTime).Milliseconds()),
		RowsWritten: rowsAffected,
	}
	return &sqlrpcv1.ExecResponse{
		Dml: &sqlrpcv1.DMLResult{
			RowsAffected: rowsAffected,
			LastInsertId: lastInsertId,
		},
		Stats: stats,
	}, nil
}

// maxSafeInteger is 2^53 - 1. Integers larger than this lose precision
// when converted to float64 (the type used by Protobuf NumberValue).
const maxSafeInteger = (1 << 53) - 1

// valuesToProto converts a row scanned into sql.RawBytes into a Protobuf ListValue.
//
// PERFORMANCE PROFILE:
//  1. Zero-Allocation Scanning: Uses RawBytes to point into driver memory.
//  2. No Reflection: Uses ColumnAffinity hints to drive a manual type switch.
//  3. Minimal Allocations: Allocates only the final required Protobuf objects.
//  4. Precision Safety: Automatically handles the 2^53 integer limit for JS clients.
func valuesToProto(values []sql.RawBytes, affinities []sqlrpcv1.ColumnAffinity) *structpb.ListValue {
	// Pre-allocate the slice for the Protobuf values to avoid mid-loop growth.
	pbValues := make([]*structpb.Value, len(values))

	for i, rb := range values {
		// NULL handling: If the column is NULL, RawBytes is nil.
		if rb == nil {
			pbValues[i] = structpb.NewNullValue()
			continue
		}

		switch affinities[i] {
		case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER:
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

		case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_TEXT:
			// A copy is REQUIRED here because rb (RawBytes) will be
			// overwritten by the driver on the next row.
			pbValues[i] = structpb.NewStringValue(string(rb))

		case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_REAL:
			tempStr := UnsafeBytesToStringNoCopy(rb)
			val, _ := strconv.ParseFloat(tempStr, 64)
			// Handle Infinity/NaN if needed, but standard JSON doesn't support them.
			// structpb panics on NaN.
			if math.IsNaN(val) || math.IsInf(val, 0) {
				pbValues[i] = structpb.NewNullValue() // Safety fallback
			} else {
				pbValues[i] = structpb.NewNumberValue(val)
			}

		case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_BLOB:
			// Base64 encoding creates a new string (Allocation required)
			pbValues[i] = structpb.NewStringValue(base64.StdEncoding.EncodeToString(rb))

		default:
			// Fallback (NUMERIC or UNSPECIFIED): Try to guess
			tempStr := UnsafeBytesToStringNoCopy(rb)

			// 1. Try Integer
			if val, err := strconv.ParseInt(tempStr, 10, 64); err == nil {
				// We don't update the affinity array in-place anymore effectively
				// because it's passed by value/slice ref, but the damage scope is limited.
				// In reality, this dynamic behavior is rare if schema is well-defined.

				if val > maxSafeInteger || val < -maxSafeInteger {
					pbValues[i] = structpb.NewStringValue(tempStr)
				} else {
					pbValues[i] = structpb.NewNumberValue(float64(val))
				}
				continue
			}

			// 2. Try Float
			if val, err := strconv.ParseFloat(tempStr, 64); err == nil {
				pbValues[i] = structpb.NewNumberValue(val)
				continue
			}

			// 3. Fallback to Text
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
func generateSavepointSQL(sp *sqlrpcv1.SavepointRequest) (string, error) {
	if sp == nil || sp.Name == "" {
		return "", errors.New("savepoint name is required")
	}

	switch sp.Action {
	case sqlrpcv1.SavepointAction_SAVEPOINT_ACTION_CREATE:
		return fmt.Sprintf("SAVEPOINT %s", sp.Name), nil
	case sqlrpcv1.SavepointAction_SAVEPOINT_ACTION_RELEASE:
		return fmt.Sprintf("RELEASE %s", sp.Name), nil
	case sqlrpcv1.SavepointAction_SAVEPOINT_ACTION_ROLLBACK:
		return fmt.Sprintf("ROLLBACK TO %s", sp.Name), nil
	default:
		return "", fmt.Errorf("unsupported savepoint action: %v", sp.Action)
	}
}

// =============================================================================
// TYPED API UTILITY FUNCTIONS
// =============================================================================
// These functions support the strongly-typed RPCs (TypedQuery, TypedQueryStream, etc.)
// that use SqlValue/SqlRow instead of ListValue.

// convertTypedParameters transforms TypedParameters into database/sql compatible args.
// Unlike convertParameters, this uses the explicit SqlValue types directly (no hints needed).
func convertTypedParameters(sqlQuery string, params *sqlrpcv1.TypedParameters) ([]any, error) {
	if params == nil {
		return nil, nil
	}

	var converted []any

	// 1. Prepare Positional Parameters
	positional := params.Positional

	// 2. Scan SQL to Interleave Parameters correctly
	paramRegex := regexp.MustCompile(`(\?)|([:@$]\w+)`)
	matches := paramRegex.FindAllString(sqlQuery, -1)

	posIndex := 0
	namedUsed := make(map[string]bool)

	for _, match := range matches {
		if match == "?" {
			// Consume next positional parameter
			if posIndex < len(positional) {
				converted = append(converted, sqlValueToAny(positional[posIndex]))
				posIndex++
			}
		} else {
			// Named parameter (e.g. :country)
			key := match
			cleanKey := strings.TrimLeft(key, ":@$")

			var val *sqlrpcv1.SqlValue
			var foundKey string
			var found bool

			if v, ok := params.Named[key]; ok {
				val = v
				foundKey = key
				found = true
			} else if v, ok := params.Named[cleanKey]; ok {
				val = v
				foundKey = cleanKey
				found = true
			}

			if found && !namedUsed[foundKey] {
				converted = append(converted, sql.Named(cleanKey, sqlValueToAny(val)))
				namedUsed[foundKey] = true
			}
		}
	}

	// 3. Append Leftover Positional Parameters
	for i := posIndex; i < len(positional); i++ {
		converted = append(converted, sqlValueToAny(positional[i]))
	}

	// 4. Append Leftover Named Parameters
	for key, val := range params.Named {
		if !namedUsed[key] {
			cleanKey := strings.TrimLeft(key, ":@$")
			converted = append(converted, sql.Named(cleanKey, sqlValueToAny(val)))
		}
	}

	return converted, nil
}

// sqlValueToAny converts a typed SqlValue proto to a Go value for database/sql.
func sqlValueToAny(v *sqlrpcv1.SqlValue) any {
	if v == nil {
		return nil
	}

	switch val := v.Value.(type) {
	case *sqlrpcv1.SqlValue_IntegerValue:
		return val.IntegerValue
	case *sqlrpcv1.SqlValue_RealValue:
		return val.RealValue
	case *sqlrpcv1.SqlValue_TextValue:
		return val.TextValue
	case *sqlrpcv1.SqlValue_BlobValue:
		return val.BlobValue // []byte directly, no base64
	case *sqlrpcv1.SqlValue_NullValue:
		return nil
	default:
		return nil
	}
}

// valuesToTypedProto converts a row scanned into sql.RawBytes into a typed SqlRow.
// This is more efficient than valuesToProto because:
//  1. BLOBs are sent as raw bytes (no base64 encoding overhead)
//  2. Integers are always int64 (no precision loss or string fallback)
func valuesToTypedProto(values []sql.RawBytes, affinities []sqlrpcv1.ColumnAffinity) *sqlrpcv1.SqlRow {
	sqlValues := make([]*sqlrpcv1.SqlValue, len(values))

	for i, rb := range values {
		// NULL handling
		if rb == nil {
			sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_NullValue{NullValue: true}}
			continue
		}

		switch affinities[i] {
		case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER:
			tempStr := UnsafeBytesToStringNoCopy(rb)
			val, err := strconv.ParseInt(tempStr, 10, 64)
			if err != nil {
				// Fallback to text
				sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_TextValue{TextValue: string(rb)}}
				continue
			}
			sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_IntegerValue{IntegerValue: val}}

		case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_TEXT:
			sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_TextValue{TextValue: string(rb)}}

		case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_REAL:
			tempStr := UnsafeBytesToStringNoCopy(rb)
			val, _ := strconv.ParseFloat(tempStr, 64)
			if math.IsNaN(val) || math.IsInf(val, 0) {
				sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_NullValue{NullValue: true}}
			} else {
				sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_RealValue{RealValue: val}}
			}

		case sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_BLOB:
			// Copy the bytes since RawBytes will be overwritten on next row
			blobCopy := make([]byte, len(rb))
			copy(blobCopy, rb)
			sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_BlobValue{BlobValue: blobCopy}}

		default:
			// Fallback (NUMERIC or UNSPECIFIED): Try to guess
			tempStr := UnsafeBytesToStringNoCopy(rb)

			// Try Integer
			if val, err := strconv.ParseInt(tempStr, 10, 64); err == nil {
				sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_IntegerValue{IntegerValue: val}}
				continue
			}

			// Try Float
			if val, err := strconv.ParseFloat(tempStr, 64); err == nil {
				sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_RealValue{RealValue: val}}
				continue
			}

			// Fallback to Text
			sqlValues[i] = &sqlrpcv1.SqlValue{Value: &sqlrpcv1.SqlValue_TextValue{TextValue: string(rb)}}
		}
	}

	return &sqlrpcv1.SqlRow{Values: sqlValues}
}

// typedStreamQueryResults is the typed variant of streamQueryResults.
// It uses TypedStreamWriter to send SqlRow instead of ListValue.
func typedStreamQueryResults(ctx context.Context, q querier, sqlQuery string, paramsMsg *sqlrpcv1.TypedParameters, writer TypedStreamWriter) error {
	startTime := time.Now()

	params, err := convertTypedParameters(sqlQuery, paramsMsg)
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
		return writer.SendDMLResult(&sqlrpcv1.ExecResponse{
			Dml: &sqlrpcv1.DMLResult{
				RowsAffected: rowsAffected,
				LastInsertId: lastInsertId,
			},
		})
	}

	// --- READ PATH (Streaming) ---
	rows, err := q.QueryContext(ctx, sqlQuery, params...)
	if err != nil {
		return err
	}
	defer rows.Close()

	cols, err := rows.Columns()
	if err != nil {
		return err
	}
	affinities, declaredTypes, rawTypes, err := resolveColumnTypes(rows)
	if err != nil {
		return err
	}

	// Step 1: Send Typed Header
	if err := writer.SendHeader(&sqlrpcv1.TypedQueryResultHeader{
		Columns:             cols,
		ColumnAffinities:    affinities,
		ColumnDeclaredTypes: declaredTypes,
		ColumnRawTypes:      rawTypes,
	}); err != nil {
		return err
	}

	// Step 2: Stream Rows
	const chunkSize = 500
	rowBuffer := make([]*sqlrpcv1.SqlRow, 0, chunkSize)

	buf := getScanBuffer(len(cols))
	defer putbackBuffer(buf)

	var rowsReadCount int64 = 0
	for rows.Next() {
		if err := rows.Scan(buf.args...); err != nil {
			return err
		}
		rowsReadCount++

		// Convert row to typed SqlRow
		typedRow := valuesToTypedProto(buf.values, affinities)
		rowBuffer = append(rowBuffer, typedRow)

		// Flush Batch
		if len(rowBuffer) >= chunkSize {
			if err := writer.SendRowBatch(&sqlrpcv1.TypedQueryResultRowBatch{Rows: rowBuffer}); err != nil {
				return err
			}
			rowBuffer = make([]*sqlrpcv1.SqlRow, 0, chunkSize)
		}
	}

	// Flush Remainder
	if len(rowBuffer) > 0 {
		if err := writer.SendRowBatch(&sqlrpcv1.TypedQueryResultRowBatch{Rows: rowBuffer}); err != nil {
			return err
		}
	}

	if err := rows.Err(); err != nil {
		return err
	}

	// Step 3: Complete
	stats := &sqlrpcv1.ExecutionStats{
		DurationMs: float64(time.Since(startTime).Milliseconds()),
		RowsRead:   rowsReadCount,
	}
	return writer.SendComplete(stats)
}

// typedExecuteQueryAndBuffer executes a query and returns a TypedQueryResult.
// This is the typed variant of executeQueryAndBuffer.
func typedExecuteQueryAndBuffer(ctx context.Context, q querier, sqlQuery string, paramsMsg *sqlrpcv1.TypedParameters) (*sqlrpcv1.TypedQueryResult, error) {
	startTime := time.Now()
	params, err := convertTypedParameters(sqlQuery, paramsMsg)
	if err != nil {
		return nil, fmt.Errorf("parameter error: %w", err)
	}

	rows, err := q.QueryContext(ctx, sqlQuery, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	affinities, declaredTypes, rawTypes, err := resolveColumnTypes(rows)
	if err != nil {
		return nil, err
	}

	result := &sqlrpcv1.TypedQueryResult{
		Columns:             columns,
		ColumnAffinities:    affinities,
		ColumnDeclaredTypes: declaredTypes,
		ColumnRawTypes:      rawTypes,
	}

	buf := getScanBuffer(len(columns))
	defer putbackBuffer(buf)

	var rowsRead int64
	for rows.Next() {
		if err := rows.Scan(buf.args...); err != nil {
			return nil, err
		}
		rowsRead++
		protoRow := valuesToTypedProto(buf.values, affinities)
		result.Rows = append(result.Rows, protoRow)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	result.Stats = &sqlrpcv1.ExecutionStats{
		DurationMs: float64(time.Since(startTime).Milliseconds()),
		RowsRead:   rowsRead,
	}
	return result, nil
}

func typedExecuteExecAndBuffer(ctx context.Context, q querier, sqlQuery string, paramsMsg *sqlrpcv1.TypedParameters) (*sqlrpcv1.ExecResponse, error) {
	startTime := time.Now()
	params, err := convertTypedParameters(sqlQuery, paramsMsg)
	if err != nil {
		return nil, fmt.Errorf("parameter error: %w", err)
	}

	res, err := q.ExecContext(ctx, sqlQuery, params...)
	if err != nil {
		return nil, err
	}
	rowsAffected, _ := res.RowsAffected()
	lastInsertId, _ := res.LastInsertId()
	stats := &sqlrpcv1.ExecutionStats{
		DurationMs:  float64(time.Since(startTime).Milliseconds()),
		RowsWritten: rowsAffected,
	}
	return &sqlrpcv1.ExecResponse{
		Dml: &sqlrpcv1.DMLResult{
			RowsAffected: rowsAffected,
			LastInsertId: lastInsertId,
		},
		Stats: stats,
	}, nil
}
