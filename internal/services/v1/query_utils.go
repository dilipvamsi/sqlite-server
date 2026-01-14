package servicesv1

import (
	"context"
	"database/sql"
	"encoding/base64"
	"fmt"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"strings"
	"time"

	"google.golang.org/protobuf/types/known/structpb"
)

// --- Parameter Handling ---

// convertParameters transforms the Proto `Parameters` message into a format
// compatible with the Go `database/sql` driver.
//
// LOGIC:
// 1. Handles `oneof`: Detects if parameters are Positional (Array) or Named (Map).
// 2. Applies Hints: Uses `applyHint` to convert generic types (string) to specific types (bytes).
func convertParameters(params *dbv1.Parameters) ([]interface{}, error) {
	if params == nil {
		return nil, nil
	}
	switch v := params.Values.(type) {
	case *dbv1.Parameters_Positional:
		rawList := v.Positional.AsSlice()
		converted := make([]interface{}, len(rawList))
		hints := params.PositionalHints
		for i, val := range rawList {
			hint, hasHint := hints[int32(i)]
			converted[i] = applyHint(val, hint, hasHint)
		}
		return converted, nil
	case *dbv1.Parameters_Named:
		rawMap := v.Named.AsMap()
		converted := make([]interface{}, 0, len(rawMap))
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
func applyHint(val interface{}, hint dbv1.ColumnType, hasHint bool) interface{} {
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

	// Heuristic to detect READ vs WRITE queries
	isSelect := strings.HasPrefix(strings.TrimSpace(strings.ToUpper(sqlQuery)), "SELECT")

	// --- WRITE PATH (DML) ---
	if !isSelect {
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

	// Pre-allocate scanning destinations to avoid allocation in hot loop
	scanValues := make([]interface{}, len(cols))
	scanArgs := make([]interface{}, len(scanValues))
	for i := range scanValues {
		scanArgs[i] = &scanValues[i]
	}

	var rowsReadCount int64 = 0
	for rows.Next() {
		if err := rows.Scan(scanArgs...); err != nil {
			return err
		}
		rowsReadCount++

		// Convert row to Proto ListValue
		protoRow, err := structpb.NewList(scanValues)
		if err != nil {
			return fmt.Errorf("failed to convert row to proto: %w", err)
		}

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

	isSelect := strings.HasPrefix(strings.TrimSpace(strings.ToUpper(sqlQuery)), "SELECT")

	if isSelect {
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

		scanValues := make([]interface{}, len(columns))
		scanArgs := make([]interface{}, len(scanValues))
		for i := range scanValues {
			scanArgs[i] = &scanValues[i]
		}
		var rowsRead int64
		for rows.Next() {
			if err := rows.Scan(scanArgs...); err != nil {
				return nil, err
			}
			rowsRead++
			protoRow, err := structpb.NewList(scanValues)
			if err != nil {
				return nil, fmt.Errorf("failed to convert row to proto: %w", err)
			}
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
