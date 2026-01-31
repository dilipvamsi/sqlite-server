/**
 * @file introspection.go
 * @package servicesv1
 * @description Developer Experience & Introspection handlers.
 *
 * This file implements RPCs that help developers debug queries and
 * introspect database schemas:
 *
 * - Explain: Returns structured EXPLAIN QUERY PLAN output
 * - ListTables: Light listing of all tables
 * - GetTableSchema: Detailed schema for a single table
 * - GetDatabaseSchema: Full database schema for exports
 */

package servicesv1

import (
	"context"
	"database/sql"
	"fmt"

	dbv1 "sqlite-server/internal/protos/db/v1"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
)

// =============================================================================
// Explain RPC
// =============================================================================

// Explain returns structured EXPLAIN QUERY PLAN output.
//
// The function executes "EXPLAIN QUERY PLAN <sql>" and parses the output
// into a structured tree of QueryPlanNode messages.
func (s *DbServer) Explain(
	ctx context.Context,
	req *connect.Request[dbv1.QueryRequest],
) (*connect.Response[dbv1.ExplainResponse], error) {
	// Validate request
	if err := protovalidate.Validate(req.Msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	// Get database connection
	db, err := s.dbManager.GetConnection(ctx, req.Msg.Database, ModeRO)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	// Execute EXPLAIN QUERY PLAN
	explainSQL := fmt.Sprintf("EXPLAIN QUERY PLAN %s", req.Msg.Sql)

	// Convert parameters if provided
	args, err := convertParameters(req.Msg.Sql, req.Msg.Parameters)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	rows, err := db.QueryContext(ctx, explainSQL, args...)
	if err != nil {
		return nil, makeUnaryError(err, req.Msg.Sql)
	}
	defer rows.Close()

	// Parse results into QueryPlanNode
	var nodes []*dbv1.QueryPlanNode
	for rows.Next() {
		var id, parent, notused int32
		var detail string
		if err := rows.Scan(&id, &parent, &notused, &detail); err != nil {
			return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("scanning explain row: %w", err))
		}
		nodes = append(nodes, &dbv1.QueryPlanNode{
			Id:       id,
			ParentId: parent,
			Detail:   detail,
		})
	}

	if err := rows.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&dbv1.ExplainResponse{
		Nodes: nodes,
	}), nil
}

// TypedExplain is the typed variant of Explain using TypedQueryRequest.
//
// It executes "EXPLAIN QUERY PLAN <sql>" with typed parameters and returns
// the same structured tree of QueryPlanNode messages.
func (s *DbServer) TypedExplain(
	ctx context.Context,
	req *connect.Request[dbv1.TypedQueryRequest],
) (*connect.Response[dbv1.ExplainResponse], error) {
	// Validate request
	if err := protovalidate.Validate(req.Msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	// Get database connection
	db, err := s.dbManager.GetConnection(ctx, req.Msg.Database, ModeRO)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	// Execute EXPLAIN QUERY PLAN
	explainSQL := fmt.Sprintf("EXPLAIN QUERY PLAN %s", req.Msg.Sql)

	// Convert typed parameters
	args, err := convertTypedParameters(req.Msg.Sql, req.Msg.Parameters)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	rows, err := db.QueryContext(ctx, explainSQL, args...)
	if err != nil {
		return nil, makeUnaryError(err, req.Msg.Sql)
	}
	defer rows.Close()

	// Parse results into QueryPlanNode
	var nodes []*dbv1.QueryPlanNode
	for rows.Next() {
		var id, parent, notused int32
		var detail string
		if err := rows.Scan(&id, &parent, &notused, &detail); err != nil {
			return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("scanning explain row: %w", err))
		}
		nodes = append(nodes, &dbv1.QueryPlanNode{
			Id:       id,
			ParentId: parent,
			Detail:   detail,
		})
	}

	if err := rows.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&dbv1.ExplainResponse{
		Nodes: nodes,
	}), nil
}

// =============================================================================
// ListTables RPC
// =============================================================================

// ListTables returns a list of all table names in the database.
func (s *DbServer) ListTables(
	ctx context.Context,
	req *connect.Request[dbv1.ListTablesRequest],
) (*connect.Response[dbv1.ListTablesResponse], error) {
	// Validate request
	if err := protovalidate.Validate(req.Msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	// Get database connection
	db, err := s.dbManager.GetConnection(ctx, req.Msg.Database, ModeRO)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	// Query sqlite_schema for table names
	rows, err := db.QueryContext(ctx,
		"SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer rows.Close()

	var tableNames []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		tableNames = append(tableNames, name)
	}

	if err := rows.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&dbv1.ListTablesResponse{
		TableNames: tableNames,
	}), nil
}

// =============================================================================
// GetTableSchema RPC
// =============================================================================

// GetTableSchema returns detailed schema information for a single table.
func (s *DbServer) GetTableSchema(
	ctx context.Context,
	req *connect.Request[dbv1.GetTableSchemaRequest],
) (*connect.Response[dbv1.TableSchema], error) {
	// Validate request
	if err := protovalidate.Validate(req.Msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	// Get database connection
	db, err := s.dbManager.GetConnection(ctx, req.Msg.Database, ModeRO)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	schema, err := s.buildTableSchema(ctx, db, req.Msg.TableName)
	if err != nil {
		return nil, err
	}

	return connect.NewResponse(schema), nil
}

// =============================================================================
// GetDatabaseSchema RPC
// =============================================================================

// GetDatabaseSchema returns the complete schema for all tables in the database.
func (s *DbServer) GetDatabaseSchema(
	ctx context.Context,
	req *connect.Request[dbv1.GetDatabaseSchemaRequest],
) (*connect.Response[dbv1.DatabaseSchema], error) {
	// Validate request
	if err := protovalidate.Validate(req.Msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	// Get database connection
	db, err := s.dbManager.GetConnection(ctx, req.Msg.Database, ModeRO)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	// Get all table names first
	rows, err := db.QueryContext(ctx,
		"SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	var tableNames []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			rows.Close()
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		tableNames = append(tableNames, name)
	}
	rows.Close()

	if err := rows.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// Build schema for each table
	var tables []*dbv1.TableSchema
	for _, tableName := range tableNames {
		schema, err := s.buildTableSchema(ctx, db, tableName)
		if err != nil {
			return nil, err
		}
		tables = append(tables, schema)
	}

	return connect.NewResponse(&dbv1.DatabaseSchema{
		Tables: tables,
	}), nil
}

// =============================================================================
// Internal Helpers
// =============================================================================

// buildTableSchema builds the complete schema for a single table.
func (s *DbServer) buildTableSchema(ctx context.Context, db *sql.DB, tableName string) (*dbv1.TableSchema, error) {
	schema := &dbv1.TableSchema{
		Name: tableName,
	}

	// Get the CREATE TABLE SQL
	var sqlStmt sql.NullString
	err := db.QueryRowContext(ctx,
		"SELECT sql FROM sqlite_schema WHERE type='table' AND name = ?", tableName).Scan(&sqlStmt)
	if err == sql.ErrNoRows {
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("table %q not found", tableName))
	}
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	schema.Sql = sqlStmt.String

	// Get columns via PRAGMA table_info
	columns, err := s.getTableColumns(ctx, db, tableName)
	if err != nil {
		return nil, err
	}
	schema.Columns = columns

	// Get indexes via PRAGMA index_list and index_info
	indexes, err := s.getTableIndexes(ctx, db, tableName)
	if err != nil {
		return nil, err
	}
	schema.Indexes = indexes

	// Get foreign keys via PRAGMA foreign_key_list
	foreignKeys, err := s.getTableForeignKeys(ctx, db, tableName)
	if err != nil {
		return nil, err
	}
	schema.ForeignKeys = foreignKeys

	// Get triggers from sqlite_schema
	triggers, err := s.getTableTriggers(ctx, db, tableName)
	if err != nil {
		return nil, err
	}
	schema.Triggers = triggers

	return schema, nil
}

// getTableColumns returns column information using PRAGMA table_info.
func (s *DbServer) getTableColumns(ctx context.Context, db *sql.DB, tableName string) ([]*dbv1.ColumnSchema, error) {
	rows, err := db.QueryContext(ctx, fmt.Sprintf("PRAGMA table_info(%q)", tableName))
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer rows.Close()

	var columns []*dbv1.ColumnSchema
	for rows.Next() {
		var cid int
		var name, colType string
		var notNull, pk int
		var dfltValue sql.NullString

		if err := rows.Scan(&cid, &name, &colType, &notNull, &dfltValue, &pk); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}

		columns = append(columns, &dbv1.ColumnSchema{
			Name:         name,
			Type:         colType,
			NotNull:      notNull != 0,
			DefaultValue: dfltValue.String,
			PrimaryKey:   pk != 0,
		})
	}

	return columns, rows.Err()
}

// getTableIndexes returns index information using PRAGMA index_list and index_info.
func (s *DbServer) getTableIndexes(ctx context.Context, db *sql.DB, tableName string) ([]*dbv1.IndexSchema, error) {
	// 1. Get list of indexes first and collect into slice to avoid connection pool exhaustion
	listRows, err := db.QueryContext(ctx, fmt.Sprintf("PRAGMA index_list(%q)", tableName))
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	type indexMeta struct {
		name   string
		unique bool
	}
	var metas []indexMeta
	for listRows.Next() {
		var seq int
		var name, origin string
		var unique int
		var partial int

		if err := listRows.Scan(&seq, &name, &unique, &origin, &partial); err != nil {
			listRows.Close()
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		metas = append(metas, indexMeta{name: name, unique: unique != 0})
	}
	listRows.Close()

	if err := listRows.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// 2. Fetch details for each index
	var indexes []*dbv1.IndexSchema
	for _, meta := range metas {
		// Get columns in this index
		infoRows, err := db.QueryContext(ctx, fmt.Sprintf("PRAGMA index_info(%q)", meta.name))
		if err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}

		var columnNames []string
		for infoRows.Next() {
			var seqno, cid int
			var colName sql.NullString
			if err := infoRows.Scan(&seqno, &cid, &colName); err != nil {
				infoRows.Close()
				return nil, connect.NewError(connect.CodeInternal, err)
			}
			if colName.Valid {
				columnNames = append(columnNames, colName.String)
			}
		}
		infoRows.Close()

		// Get the CREATE INDEX SQL (if available)
		var sqlStmt sql.NullString
		_ = db.QueryRowContext(ctx,
			"SELECT sql FROM sqlite_schema WHERE type='index' AND name = ?", meta.name).Scan(&sqlStmt)

		indexes = append(indexes, &dbv1.IndexSchema{
			Name:    meta.name,
			Unique:  meta.unique,
			Columns: columnNames,
			Sql:     sqlStmt.String,
		})
	}

	return indexes, nil
}

// getTableForeignKeys returns foreign key information using PRAGMA foreign_key_list.
func (s *DbServer) getTableForeignKeys(ctx context.Context, db *sql.DB, tableName string) ([]*dbv1.ForeignKeySchema, error) {
	rows, err := db.QueryContext(ctx, fmt.Sprintf("PRAGMA foreign_key_list(%q)", tableName))
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer rows.Close()

	var foreignKeys []*dbv1.ForeignKeySchema
	for rows.Next() {
		var id, seq int
		var table, from, to, onUpdate, onDelete, match string

		if err := rows.Scan(&id, &seq, &table, &from, &to, &onUpdate, &onDelete, &match); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}

		foreignKeys = append(foreignKeys, &dbv1.ForeignKeySchema{
			Id:         int32(id),
			Table:      table,
			FromColumn: from,
			ToColumn:   to,
			OnUpdate:   onUpdate,
			OnDelete:   onDelete,
		})
	}

	return foreignKeys, rows.Err()
}

// getTableTriggers returns trigger information from sqlite_schema.
func (s *DbServer) getTableTriggers(ctx context.Context, db *sql.DB, tableName string) ([]*dbv1.TriggerSchema, error) {
	rows, err := db.QueryContext(ctx,
		"SELECT name, sql FROM sqlite_schema WHERE type='trigger' AND tbl_name = ?", tableName)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer rows.Close()

	var triggers []*dbv1.TriggerSchema
	for rows.Next() {
		var name string
		var sqlStmt sql.NullString

		if err := rows.Scan(&name, &sqlStmt); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}

		triggers = append(triggers, &dbv1.TriggerSchema{
			Name: name,
			Sql:  sqlStmt.String,
		})
	}

	return triggers, rows.Err()
}
