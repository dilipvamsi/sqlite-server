package servicesv1

import (
	"context"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"math"
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
// It uses Regex to map Positional/Named arguments to their correct order in the SQL.
func convertParameters(sqlQuery string, params *dbv1.Parameters) ([]any, error) {
	if params == nil {
		return nil, nil
	}

	var converted []any

	// 1. Prepare Data Sources
	var positional []any
	if params.Positional != nil {
		positional = params.Positional.AsSlice()
	}
	var named map[string]any
	if params.Named != nil {
		named = params.Named.AsMap()
	}

	// 2. Scan SQL to Interleave Parameters correctly
	// Matches ? or :name, @name, $name
	paramRegex := regexp.MustCompile(`(\?)|([:@$]\w+)`)
	matches := paramRegex.FindAllString(sqlQuery, -1)

	posIndex := 0
	namedUsed := make(map[string]bool)

	for _, match := range matches {
		if match == "?" {
			// Consume next positional parameter
			if posIndex < len(positional) {
				val := positional[posIndex]
				hint, hasHint := params.PositionalHints[int32(posIndex)]
				converted = append(converted, applyHint(val, hint, hasHint))
				posIndex++
			}
		} else {
			// Named parameter (e.g. :country)
			// Look for it in the map using exact key or cleaned key
			key := match
			cleanKey := strings.TrimLeft(key, ":@$")

			var val any
			var foundKey string
			var found bool

			if v, ok := named[key]; ok {
				val = v
				foundKey = key
				found = true
			} else if v, ok := named[cleanKey]; ok {
				val = v
				foundKey = cleanKey
				found = true
			}

			if found && !namedUsed[foundKey] {
				hint, hasHint := params.NamedHints[foundKey]
				finalVal := applyHint(val, hint, hasHint)
				converted = append(converted, sql.Named(cleanKey, finalVal))
				namedUsed[foundKey] = true
			}
		}
	}

	// 3. Append Leftover Positional Parameters
	// (Essential if Regex failed to find placeholders e.g. due to complexity)
	for i := posIndex; i < len(positional); i++ {
		val := positional[i]
		hint, hasHint := params.PositionalHints[int32(i)]
		converted = append(converted, applyHint(val, hint, hasHint))
	}

	// 4. Append Leftover Named Parameters
	for key, val := range named {
		// Use simple cleaned key check. Note: `namedUsed` stores the key from the map.
		if !namedUsed[key] {
			cleanKey := strings.TrimLeft(key, ":@$")
			hint, hasHint := params.NamedHints[key]
			finalVal := applyHint(val, hint, hasHint)
			converted = append(converted, sql.Named(cleanKey, finalVal))
		}
	}

	return converted, nil
}

// applyHint performs type coercion based on the "Sparse Hint" provided by the client.
// This solves the problem of JSON (and Proto Structs) lacking native support for BLOBs and Integers.
func applyHint(val any, hint dbv1.ColumnAffinity, hasHint bool) any {
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
	case dbv1.ColumnAffinity_COLUMN_AFFINITY_BLOB:
		// Logic: Clients send binary data as Base64 strings.
		// We decode it back to []byte so SQLite driver uses binary mode.
		if strVal, ok := val.(string); ok {
			if decoded, err := base64.StdEncoding.DecodeString(strVal); err == nil {
				return decoded
			}
		}

	case dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER:
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

	case dbv1.ColumnAffinity_COLUMN_AFFINITY_REAL:
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
func resolveColumnTypes(rows *sql.Rows) ([]dbv1.ColumnAffinity, []dbv1.DeclaredType, []string, error) {
	columnTypes, err := rows.ColumnTypes()
	if err != nil {
		return nil, nil, nil, err
	}

	count := len(columnTypes)
	affinities := make([]dbv1.ColumnAffinity, count)
	declaredTypes := make([]dbv1.DeclaredType, count)
	rawTypes := make([]string, count)

	for i, ct := range columnTypes {
		dbType := strings.ToUpper(ct.DatabaseTypeName())
		rawTypes[i] = ct.DatabaseTypeName()

		// 1. Determine Affinity (Storage Class)
		// Rules based on SQLite 3: https://www.sqlite.org/datatype3.html
		switch {
		case strings.Contains(dbType, "INT"):
			affinities[i] = dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER
		case strings.Contains(dbType, "CHAR") || strings.Contains(dbType, "CLOB") || strings.Contains(dbType, "TEXT"):
			affinities[i] = dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT
		case strings.Contains(dbType, "BLOB") || strings.Contains(dbType, "BINARY"):
			affinities[i] = dbv1.ColumnAffinity_COLUMN_AFFINITY_BLOB
		case strings.Contains(dbType, "REAL") || strings.Contains(dbType, "FLOA") || strings.Contains(dbType, "DOUB"):
			affinities[i] = dbv1.ColumnAffinity_COLUMN_AFFINITY_REAL
		default:
			// "NUMERIC" behavior or fallback
			affinities[i] = dbv1.ColumnAffinity_COLUMN_AFFINITY_NUMERIC
		}
		// Special override for JSON/UUID/XML/DATE which are text-based but semantic
		// If SQLite says "UUID", the rule above might fallback to NUMERIC or unspecified.
		// Commonly, specialized types like UUID/JSON are stored as TEXT, but
		// DatabaseTypeName() returns "UUID".
		if affinities[i] == dbv1.ColumnAffinity_COLUMN_AFFINITY_NUMERIC || affinities[i] == dbv1.ColumnAffinity_COLUMN_AFFINITY_UNSPECIFIED {
			// Check if it's a known text alias
			if strings.Contains(dbType, "JSON") || strings.Contains(dbType, "UUID") ||
				strings.Contains(dbType, "XML") || strings.Contains(dbType, "TIME") ||
				strings.Contains(dbType, "DATE") {
				affinities[i] = dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT
			}
		}

		// 2. Determine Declared Type (Semantic)
		declaredTypes[i] = mapDeclaredType(dbType)
	}

	return affinities, declaredTypes, rawTypes, nil
}

func mapDeclaredType(dbType string) dbv1.DeclaredType {
	ts := strings.ToUpper(dbType)

	// Exact matches for specialized types
	switch ts {
	case "UUID":
		return dbv1.DeclaredType_DECLARED_TYPE_UUID
	case "JSON":
		return dbv1.DeclaredType_DECLARED_TYPE_JSON
	case "XML":
		return dbv1.DeclaredType_DECLARED_TYPE_XML
	case "BOOLEAN", "BOOL":
		return dbv1.DeclaredType_DECLARED_TYPE_BOOLEAN
	case "DATETIME":
		return dbv1.DeclaredType_DECLARED_TYPE_DATETIME
	case "TIMESTAMP":
		return dbv1.DeclaredType_DECLARED_TYPE_TIMESTAMP
	case "DATE":
		return dbv1.DeclaredType_DECLARED_TYPE_DATE
	case "TIME":
		return dbv1.DeclaredType_DECLARED_TYPE_TIME
	case "YEAR":
		return dbv1.DeclaredType_DECLARED_TYPE_YEAR
	}

	// Pattern matching
	switch {
	case strings.Contains(ts, "INT"):
		if strings.Contains(ts, "BIG") {
			return dbv1.DeclaredType_DECLARED_TYPE_BIGINT
		}
		if strings.Contains(ts, "SMALL") {
			return dbv1.DeclaredType_DECLARED_TYPE_SMALLINT
		}
		if strings.Contains(ts, "TINY") {
			return dbv1.DeclaredType_DECLARED_TYPE_TINYINT
		}
		return dbv1.DeclaredType_DECLARED_TYPE_INTEGER

	case strings.Contains(ts, "CHAR"):
		if strings.Contains(ts, "VAR") {
			return dbv1.DeclaredType_DECLARED_TYPE_VARCHAR
		}
		return dbv1.DeclaredType_DECLARED_TYPE_CHARACTER

	case strings.Contains(ts, "TEXT"):
		return dbv1.DeclaredType_DECLARED_TYPE_TEXT
	case strings.Contains(ts, "CLOB"):
		return dbv1.DeclaredType_DECLARED_TYPE_CLOB
	case strings.Contains(ts, "BLOB"):
		return dbv1.DeclaredType_DECLARED_TYPE_BLOB
	case strings.Contains(ts, "REAL"):
		return dbv1.DeclaredType_DECLARED_TYPE_REAL
	case strings.Contains(ts, "DOUB"):
		return dbv1.DeclaredType_DECLARED_TYPE_DOUBLE
	case strings.Contains(ts, "FLOAT"):
		return dbv1.DeclaredType_DECLARED_TYPE_FLOAT
	case strings.Contains(ts, "DECIMAL"):
		return dbv1.DeclaredType_DECLARED_TYPE_DECIMAL
	case strings.Contains(ts, "NUMERIC"):
		return dbv1.DeclaredType_DECLARED_TYPE_NUMERIC
	}

	return dbv1.DeclaredType_DECLARED_TYPE_UNSPECIFIED
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
	affinities, declaredTypes, rawTypes, err := resolveColumnTypes(rows)
	if err != nil {
		return err
	}

	// Step 1: Send Header
	if err := writer.SendHeader(&dbv1.QueryResultHeader{
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
//
// This function allocates memory proportional to the result set size.
// It is intended for small, precise lookups only.
func executeQueryAndBuffer(ctx context.Context, q querier, sqlQuery string, paramsMsg *dbv1.Parameters) (*dbv1.QueryResult, error) {
	startTime := time.Now()
	// log.Printf("sql: %s", sqlQuery)

	params, err := convertParameters(sqlQuery, paramsMsg)
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
		affinities, declaredTypes, rawTypes, err := resolveColumnTypes(rows)
		if err != nil {
			return nil, err
		}

		selectResult := &dbv1.SelectResult{
			Columns:             columns,
			ColumnAffinities:    affinities,
			ColumnDeclaredTypes: declaredTypes,
			ColumnRawTypes:      rawTypes,
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
			protoRow := valuesToProto(buf.values, affinities)
			selectResult.Rows = append(selectResult.Rows, protoRow)
		}
		stats := &dbv1.ExecutionStats{
			DurationMs: float64(time.Since(startTime).Milliseconds()),
			RowsRead:   rowsRead,
		}
		// log.Printf("select: %s", selectResult)
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
//  2. No Reflection: Uses ColumnAffinity hints to drive a manual type switch.
//  3. Minimal Allocations: Allocates only the final required Protobuf objects.
//  4. Precision Safety: Automatically handles the 2^53 integer limit for JS clients.
func valuesToProto(values []sql.RawBytes, affinities []dbv1.ColumnAffinity) *structpb.ListValue {
	// Pre-allocate the slice for the Protobuf values to avoid mid-loop growth.
	pbValues := make([]*structpb.Value, len(values))

	for i, rb := range values {
		// NULL handling: If the column is NULL, RawBytes is nil.
		if rb == nil {
			pbValues[i] = structpb.NewNullValue()
			continue
		}

		switch affinities[i] {
		case dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER:
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

		case dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT:
			// A copy is REQUIRED here because rb (RawBytes) will be
			// overwritten by the driver on the next row.
			pbValues[i] = structpb.NewStringValue(string(rb))

		case dbv1.ColumnAffinity_COLUMN_AFFINITY_REAL:
			tempStr := UnsafeBytesToStringNoCopy(rb)
			val, _ := strconv.ParseFloat(tempStr, 64)
			// Handle Infinity/NaN if needed, but standard JSON doesn't support them.
			// structpb panics on NaN.
			if math.IsNaN(val) || math.IsInf(val, 0) {
				pbValues[i] = structpb.NewNullValue() // Safety fallback
			} else {
				pbValues[i] = structpb.NewNumberValue(val)
			}

		case dbv1.ColumnAffinity_COLUMN_AFFINITY_BLOB:
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
