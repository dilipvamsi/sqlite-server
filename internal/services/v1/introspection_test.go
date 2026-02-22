package servicesv1

import (
	"context"
	"fmt"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"testing"
	"time"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/types/known/structpb"
)

// =============================================================================
// Explain Tests
// =============================================================================

func TestExplain_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Simple SELECT", func(t *testing.T) {
		res, err := client.Explain(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM users WHERE id = 1",
		}))
		require.NoError(t, err)
		assert.NotEmpty(t, res.Msg.Nodes)
		// Should have at least one node describing table access
		assert.NotEmpty(t, res.Msg.Nodes[0].Detail)
	})

	t.Run("Complex Query", func(t *testing.T) {
		res, err := client.Explain(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT u.id, u.name FROM users u WHERE u.id > ?",
			Parameters: &sqlrpcv1.Parameters{
				Positional: []*structpb.Value{structpb.NewNumberValue(0)},
			},
		}))
		require.NoError(t, err)
		assert.NotEmpty(t, res.Msg.Nodes)
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.Explain(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "missing_db",
			Sql:      "SELECT 1",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Invalid SQL", func(t *testing.T) {
		_, err := client.Explain(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM non_existent_table",
		}))
		assert.Error(t, err)
	})

	t.Run("Proto Validation Error", func(t *testing.T) {
		_, err := client.Explain(ctx, connect.NewRequest(&sqlrpcv1.QueryRequest{
			Database: "test",
			Sql:      "", // Empty SQL
		}))
		assert.Error(t, err)
	})
}

func TestTypedExplain_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Simple SELECT", func(t *testing.T) {
		res, err := client.TypedExplain(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM users WHERE id = 1",
		}))
		require.NoError(t, err)
		assert.NotEmpty(t, res.Msg.Nodes)
		assert.NotEmpty(t, res.Msg.Nodes[0].Detail)
	})

	t.Run("With Typed Parameters", func(t *testing.T) {
		res, err := client.TypedExplain(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM users WHERE id > ?",
			Parameters: &sqlrpcv1.TypedParameters{
				Positional: []*sqlrpcv1.SqlValue{
					{Value: &sqlrpcv1.SqlValue_IntegerValue{IntegerValue: 0}},
				},
			},
		}))
		require.NoError(t, err)
		assert.NotEmpty(t, res.Msg.Nodes)
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.TypedExplain(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "missing_db",
			Sql:      "SELECT 1",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
	t.Run("Invalid SQL", func(t *testing.T) {
		_, err := client.TypedExplain(ctx, connect.NewRequest(&sqlrpcv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM non_existent_table",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "no such table")
	})
}

// =============================================================================
// ListTables Tests
// =============================================================================

func TestListTables_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Success", func(t *testing.T) {
		res, err := client.ListTables(ctx, connect.NewRequest(&sqlrpcv1.ListTablesRequest{
			Database: "test",
		}))
		require.NoError(t, err)
		assert.Contains(t, res.Msg.TableNames, "users")
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.ListTables(ctx, connect.NewRequest(&sqlrpcv1.ListTablesRequest{
			Database: "missing_db",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Context Cancelled", func(t *testing.T) {
		// Create a separate client/server to avoid race with other tests
		_, srv := setupTestServer(t)
		srv.MountDatabase(&sqlrpcv1.DatabaseConfig{Name: "list_err", DbPath: ":memory:"})

		// Prime connection
		_, _ = srv.dbManager.GetConnection(ctx, "list_err", ModeRO)

		// Cancel context
		cCtx, cancel := context.WithCancel(ctx)
		cancel()

		_, err := srv.ListTables(cCtx, connect.NewRequest(&sqlrpcv1.ListTablesRequest{
			Database: "list_err",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "canceled")
	})
}

// =============================================================================
// GetTableSchema Tests
// =============================================================================

func TestGetTableSchema_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Success", func(t *testing.T) {
		res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "users",
		}))
		require.NoError(t, err)

		// Check table name
		assert.Equal(t, "users", res.Msg.Name)

		// Check columns
		assert.GreaterOrEqual(t, len(res.Msg.Columns), 1)
		// Find the 'id' column
		var foundId bool
		for _, col := range res.Msg.Columns {
			if col.Name == "id" {
				foundId = true
				assert.True(t, col.PrimaryKey)
			}
		}
		assert.True(t, foundId, "Should have 'id' column")
	})

	t.Run("Table Not Found", func(t *testing.T) {
		_, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "non_existent_table",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "missing_db",
			TableName: "users",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
}

// =============================================================================
// GetDatabaseSchema Tests
// =============================================================================

func TestGetDatabaseSchema_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Success", func(t *testing.T) {
		res, err := client.GetDatabaseSchema(ctx, connect.NewRequest(&sqlrpcv1.GetDatabaseSchemaRequest{
			Database: "test",
		}))
		require.NoError(t, err)

		// Should have at least the users table
		assert.GreaterOrEqual(t, len(res.Msg.Tables), 1)

		// Find users table
		var foundUsers bool
		for _, table := range res.Msg.Tables {
			if table.Name == "users" {
				foundUsers = true
				assert.NotEmpty(t, table.Columns)
			}
		}
		assert.True(t, foundUsers, "Should have 'users' table")
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.GetDatabaseSchema(ctx, connect.NewRequest(&sqlrpcv1.GetDatabaseSchemaRequest{
			Database: "missing_db",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
}

// =============================================================================
// Comprehensive Schema Test (Indexes, FKs, Triggers)
// =============================================================================

func TestGetTableSchema_ComplexSchema(t *testing.T) {
	ctx := context.Background()

	// Create a custom test server with a more complex schema
	client, server := setupTestServer(t)

	// Get the test database and add more complex schema
	db, err := server.dbManager.GetConnection(ctx, "test", ModeRW)
	require.NoError(t, err)

	// Create tables with foreign keys, indexes, and triggers
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS categories (
			id INTEGER PRIMARY KEY,
			name TEXT NOT NULL UNIQUE
		);

		CREATE TABLE IF NOT EXISTS products (
			id INTEGER PRIMARY KEY,
			name TEXT NOT NULL,
			category_id INTEGER,
			price REAL DEFAULT 0.0,
			FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE SET NULL
		);

		CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
		CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

		CREATE TRIGGER IF NOT EXISTS trg_products_audit
		AFTER INSERT ON products
		BEGIN
			SELECT 1;
		END;
	`)
	require.NoError(t, err)

	t.Run("Table with Index", func(t *testing.T) {
		res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "products",
		}))
		require.NoError(t, err)

		// Check indexes
		assert.GreaterOrEqual(t, len(res.Msg.Indexes), 1)
		var foundIdx bool
		for _, idx := range res.Msg.Indexes {
			if idx.Name == "idx_products_category" {
				foundIdx = true
				assert.Contains(t, idx.Columns, "category_id")
			}
		}
		assert.True(t, foundIdx, "Should have idx_products_category index")
	})

	t.Run("Table with Foreign Key", func(t *testing.T) {
		res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "products",
		}))
		require.NoError(t, err)

		// Check foreign keys
		assert.GreaterOrEqual(t, len(res.Msg.ForeignKeys), 1)
		fk := res.Msg.ForeignKeys[0]
		assert.Equal(t, "categories", fk.Table)
		assert.Equal(t, "category_id", fk.FromColumn)
		assert.Equal(t, "id", fk.ToColumn)
	})

	t.Run("Table with Trigger", func(t *testing.T) {
		res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "products",
		}))
		require.NoError(t, err)

		// Check triggers
		assert.GreaterOrEqual(t, len(res.Msg.Triggers), 1)
		var foundTrigger bool
		for _, trg := range res.Msg.Triggers {
			if trg.Name == "trg_products_audit" {
				foundTrigger = true
				assert.NotEmpty(t, trg.Sql)
			}
		}
		assert.True(t, foundTrigger, "Should have trg_products_audit trigger")
	})

	t.Run("Full Database Schema with Complex Tables", func(t *testing.T) {
		res, err := client.GetDatabaseSchema(ctx, connect.NewRequest(&sqlrpcv1.GetDatabaseSchemaRequest{
			Database: "test",
		}))
		require.NoError(t, err)

		// Should have users, categories, and products
		assert.GreaterOrEqual(t, len(res.Msg.Tables), 3)

		tableNames := make(map[string]bool)
		for _, table := range res.Msg.Tables {
			tableNames[table.Name] = true
		}
		assert.True(t, tableNames["users"])
		assert.True(t, tableNames["categories"])
		assert.True(t, tableNames["products"])
	})
}

func TestListTables_ContextCancel(t *testing.T) {
	_, dbServer := setupTestServer(t)
	ctx := context.Background()

	// 1. Setup DB with many tables
	config := &sqlrpcv1.DatabaseConfig{Name: "list_cancel", DbPath: ":memory:"}
	err := dbServer.MountDatabase(config)
	require.NoError(t, err)

	db, err := dbServer.dbManager.GetConnection(ctx, "list_cancel", ModeRW)
	require.NoError(t, err)

	// Create 500 tables to make iteration take some time
	for i := 0; i < 500; i++ {
		_, err = db.Exec(fmt.Sprintf("CREATE TABLE t%d (id int)", i))
		require.NoError(t, err)
	}

	// 2. Race: Cancel context during iteration
	ctx, cancel := context.WithCancel(ctx)

	// Start a goroutine to cancel after a tiny delay
	go func() {
		time.Sleep(100 * time.Microsecond)
		cancel()
	}()

	req := connect.NewRequest(&sqlrpcv1.ListTablesRequest{Database: "list_cancel"})
	_, err = dbServer.ListTables(ctx, req)

	if err == nil {
		t.Logf("ListTables finished before context cancel. Coverage might not increase.")
	} else {
		assert.Contains(t, err.Error(), "canceled")
	}
}

func TestGetDatabaseSchema_QueryError(t *testing.T) {
	_, dbServer := setupTestServer(t)
	ctx := context.Background()

	// Setup DB
	dbServer.MountDatabase(&sqlrpcv1.DatabaseConfig{Name: "schema_fail", DbPath: ":memory:"})

	// Prime cache
	_, err := dbServer.dbManager.GetConnection(ctx, "schema_fail", ModeRO)
	require.NoError(t, err)

	// Cancel context to force error
	ctx, cancel := context.WithCancel(ctx)
	cancel()

	req := connect.NewRequest(&sqlrpcv1.GetDatabaseSchemaRequest{Database: "schema_fail"})
	_, err = dbServer.GetDatabaseSchema(ctx, req)
	require.Error(t, err)
}

func TestGetTableSchema_MoreEdgeCases(t *testing.T) {
	ctx := context.Background()
	client, server := setupTestServer(t)

	db, err := server.dbManager.GetConnection(ctx, "test", ModeRW)
	require.NoError(t, err)

	t.Run("Table with No PK and Autoincrement", func(t *testing.T) {
		_, err = db.Exec(`
			CREATE TABLE IF NOT EXISTS nopk (
				val TEXT
			);
			CREATE TABLE IF NOT EXISTS auto (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT
			);
		`)
		require.NoError(t, err)

		// Test No PK
		res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "nopk",
		}))
		require.NoError(t, err)
		assert.Equal(t, "nopk", res.Msg.Name)
		for _, col := range res.Msg.Columns {
			assert.False(t, col.PrimaryKey)
		}

		// Test Autoincrement (not explicitly in proto but check it doesn't break)
		res, err = client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "auto",
		}))
		require.NoError(t, err)
		assert.Equal(t, "auto", res.Msg.Name)
		assert.True(t, res.Msg.Columns[0].PrimaryKey)
	})

	t.Run("Table with Default Values and Not Null", func(t *testing.T) {
		_, err = db.Exec(`
			CREATE TABLE IF NOT EXISTS constraints (
				id INTEGER PRIMARY KEY,
				coded TEXT NOT NULL DEFAULT 'DEFAULT_VAL',
				nullable TEXT
			);
		`)
		require.NoError(t, err)

		res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "constraints",
		}))
		require.NoError(t, err)

		for _, col := range res.Msg.Columns {
			if col.Name == "coded" {
				assert.True(t, col.NotNull)
				assert.Equal(t, "'DEFAULT_VAL'", col.DefaultValue)
			}
			if col.Name == "nullable" {
				assert.False(t, col.NotNull)
				assert.Empty(t, col.DefaultValue)
			}
		}
	})

	t.Run("Table with unique index as constraint", func(t *testing.T) {
		_, err = db.Exec(`
			CREATE TABLE IF NOT EXISTS unique_test (
				id INT,
				email TEXT UNIQUE
			);
		`)
		require.NoError(t, err)

		res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "unique_test",
		}))
		require.NoError(t, err)

		// SQLite implements UNIQUE constraint as a unique index
		assert.NotEmpty(t, res.Msg.Indexes)
		found := false
		for _, idx := range res.Msg.Indexes {
			if idx.Unique {
				found = true
				assert.Contains(t, idx.Columns, "email")
			}
		}
		assert.True(t, found, "Should find unique index for UNIQUE constraint")
	})
}

func TestGetTableSchema_ExpressionIndex(t *testing.T) {
	client, server := setupTestServer(t)
	ctx := context.Background()

	db, _ := server.dbManager.GetConnection(ctx, "test", ModeRW)
	_, err := db.Exec(`
		CREATE TABLE users_expr (id INTEGER PRIMARY KEY, name TEXT);
		CREATE INDEX idx_expr ON users_expr(UPPER(name));
	`)
	require.NoError(t, err)

	res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
		Database:  "test",
		TableName: "users_expr",
	}))
	require.NoError(t, err)
	assert.Equal(t, "users_expr", res.Msg.Name)
	assert.NotEmpty(t, res.Msg.Indexes)
	// Expression index columns might be empty or contains specific detail depending on SQLite version
	// but the function should not crash and should return the index metadata.
}

func TestGetTableSchema_ConstraintEdgeCases(t *testing.T) {
	client, server := setupTestServer(t)
	ctx := context.Background()

	db, _ := server.dbManager.GetConnection(ctx, "test", ModeRW)
	_, err := db.Exec(`
		CREATE TABLE multipk (
id1 INTEGER,
id2 INTEGER,
PRIMARY KEY(id1, id2)
);
		CREATE TABLE stringpk (
uuid TEXT PRIMARY KEY,
data BLOB
);
	`)
	require.NoError(t, err)

	t.Run("Multi-column PK", func(t *testing.T) {
res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "multipk",
		}))
		require.NoError(t, err)
		pkCount := 0
		for _, col := range res.Msg.Columns {
			if col.PrimaryKey {
				pkCount++
			}
		}
		assert.Equal(t, 2, pkCount)
	})

	t.Run("String PK", func(t *testing.T) {
res, err := client.GetTableSchema(ctx, connect.NewRequest(&sqlrpcv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "stringpk",
		}))
		require.NoError(t, err)
		assert.Equal(t, "uuid", res.Msg.Columns[0].Name)
		assert.True(t, res.Msg.Columns[0].PrimaryKey)
	})
}
