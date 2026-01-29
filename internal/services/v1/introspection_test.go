package servicesv1

import (
	"context"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"testing"

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
		res, err := client.Explain(ctx, connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM users WHERE id = 1",
		}))
		require.NoError(t, err)
		assert.NotEmpty(t, res.Msg.Nodes)
		// Should have at least one node describing table access
		assert.NotEmpty(t, res.Msg.Nodes[0].Detail)
	})

	t.Run("Complex Query", func(t *testing.T) {
		res, err := client.Explain(ctx, connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT u.id, u.name FROM users u WHERE u.id > ?",
			Parameters: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{structpb.NewNumberValue(0)}},
			},
		}))
		require.NoError(t, err)
		assert.NotEmpty(t, res.Msg.Nodes)
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.Explain(ctx, connect.NewRequest(&dbv1.QueryRequest{
			Database: "missing_db",
			Sql:      "SELECT 1",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("Invalid SQL", func(t *testing.T) {
		_, err := client.Explain(ctx, connect.NewRequest(&dbv1.QueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM non_existent_table",
		}))
		assert.Error(t, err)
	})

	t.Run("Proto Validation Error", func(t *testing.T) {
		_, err := client.Explain(ctx, connect.NewRequest(&dbv1.QueryRequest{
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
		res, err := client.TypedExplain(ctx, connect.NewRequest(&dbv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM users WHERE id = 1",
		}))
		require.NoError(t, err)
		assert.NotEmpty(t, res.Msg.Nodes)
		assert.NotEmpty(t, res.Msg.Nodes[0].Detail)
	})

	t.Run("With Typed Parameters", func(t *testing.T) {
		res, err := client.TypedExplain(ctx, connect.NewRequest(&dbv1.TypedQueryRequest{
			Database: "test",
			Sql:      "SELECT * FROM users WHERE id > ?",
			Parameters: &dbv1.TypedParameters{
				Positional: []*dbv1.SqlValue{
					{Value: &dbv1.SqlValue_IntegerValue{IntegerValue: 0}},
				},
			},
		}))
		require.NoError(t, err)
		assert.NotEmpty(t, res.Msg.Nodes)
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.TypedExplain(ctx, connect.NewRequest(&dbv1.TypedQueryRequest{
			Database: "missing_db",
			Sql:      "SELECT 1",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
}

// =============================================================================
// ListTables Tests
// =============================================================================

func TestListTables_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Success", func(t *testing.T) {
		res, err := client.ListTables(ctx, connect.NewRequest(&dbv1.ListTablesRequest{
			Database: "test",
		}))
		require.NoError(t, err)
		assert.Contains(t, res.Msg.TableNames, "users")
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.ListTables(ctx, connect.NewRequest(&dbv1.ListTablesRequest{
			Database: "missing_db",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
}

// =============================================================================
// GetTableSchema Tests
// =============================================================================

func TestGetTableSchema_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	t.Run("Success", func(t *testing.T) {
		res, err := client.GetTableSchema(ctx, connect.NewRequest(&dbv1.GetTableSchemaRequest{
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
		_, err := client.GetTableSchema(ctx, connect.NewRequest(&dbv1.GetTableSchemaRequest{
			Database:  "test",
			TableName: "non_existent_table",
		}))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})

	t.Run("DB Not Found", func(t *testing.T) {
		_, err := client.GetTableSchema(ctx, connect.NewRequest(&dbv1.GetTableSchemaRequest{
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
		res, err := client.GetDatabaseSchema(ctx, connect.NewRequest(&dbv1.GetDatabaseSchemaRequest{
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
		_, err := client.GetDatabaseSchema(ctx, connect.NewRequest(&dbv1.GetDatabaseSchemaRequest{
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
	server.dbMu.RLock()
	db := server.Dbs["test"]
	server.dbMu.RUnlock()

	// Create tables with foreign keys, indexes, and triggers
	_, err := db.Exec(`
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
		res, err := client.GetTableSchema(ctx, connect.NewRequest(&dbv1.GetTableSchemaRequest{
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
		res, err := client.GetTableSchema(ctx, connect.NewRequest(&dbv1.GetTableSchemaRequest{
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
		res, err := client.GetTableSchema(ctx, connect.NewRequest(&dbv1.GetTableSchemaRequest{
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
		res, err := client.GetDatabaseSchema(ctx, connect.NewRequest(&dbv1.GetDatabaseSchemaRequest{
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
