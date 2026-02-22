package servicesv1

import (
	"database/sql"
	"testing"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

func TestResolveAdvancedColumnTypes(t *testing.T) {
	// 1. Setup in-memory DB
	db, err := sql.Open("sqlite3", ":memory:")
	assert.NoError(t, err)
	defer db.Close()

	// 2. Create Table with Advanced Types
	// Note: SQLite allows any string as a type.
	schema := `
	CREATE TABLE advanced_types (
		id UUID,
		meta JSON,
		config XML,
		is_active BOOLEAN,
		created_at DATETIME,
		description VARCHAR(255),
		flag TINYINT,
		ratio DOUBLE
	);
	`
	_, err = db.Exec(schema)
	assert.NoError(t, err)

	// 3. Insert Dummy Data
	_, err = db.Exec(`INSERT INTO advanced_types VALUES (
		'550e8400-e29b-41d4-a716-446655440000',
		'{"key": "value"}',
		'<root></root>',
		1,
		'2023-01-01 12:00:00',
		'test desc',
		1,
		3.14159
	)`)
	assert.NoError(t, err)

	// 4. Query
	rows, err := db.Query("SELECT * FROM advanced_types")
	assert.NoError(t, err)
	defer rows.Close()

	// 5. Resolve Types
	affinities, declaredTypes, rawTypes, err := resolveColumnTypes(rows)
	assert.NoError(t, err)

	// 6. Assertions

	// Columns: id, meta, config, is_active, created_at, description, flag, ratio

	// ID: UUID
	assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[0]) // Stored as Text
	assert.Equal(t, sqlrpcv1.DeclaredType_DECLARED_TYPE_UUID, declaredTypes[0])
	assert.Equal(t, "UUID", rawTypes[0])

	// Meta: JSON
	assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[1]) // Stored as Text
	assert.Equal(t, sqlrpcv1.DeclaredType_DECLARED_TYPE_JSON, declaredTypes[1])
	assert.Equal(t, "JSON", rawTypes[1])

	// Config: XML
	assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[2])
	assert.Equal(t, sqlrpcv1.DeclaredType_DECLARED_TYPE_XML, declaredTypes[2])
	assert.Equal(t, "XML", rawTypes[2])

	// Is_Active: BOOLEAN
	// SQLite maps BOOLEAN to NUMERIC unless specific rules apply, but usually NUMERIC/INT.
	// Our resolver checks for "BOOL" -> DeclaredType_BOOLEAN
	// Affinity might be NUMERIC or INTEGER depending on exact implementation of resolveColumnTypes
	// In our code:
	// case "BOOL": -> DeclaredType_BOOLEAN
	// Affinity: default -> NUMERIC.
	assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_NUMERIC, affinities[3])
	assert.Equal(t, sqlrpcv1.DeclaredType_DECLARED_TYPE_BOOLEAN, declaredTypes[3])

	// Created_At: DATETIME
	// Affinity: default or NUMERIC?
	// Our code checks "TIME" -> DeclaredType_DATETIME / TIME / TIMESTAMP
	// But Affinity loop:
	// case "DATE", "TIME" -> TEXT (via special override in resolveColumnTypes)
	assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[4])
	assert.Equal(t, sqlrpcv1.DeclaredType_DECLARED_TYPE_DATETIME, declaredTypes[4])

	// Description: VARCHAR(255)
	// Affinity: TEXT
	// Declared: VARCHAR
	assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[5])
	assert.Equal(t, sqlrpcv1.DeclaredType_DECLARED_TYPE_VARCHAR, declaredTypes[5])
	assert.Equal(t, "VARCHAR(255)", rawTypes[5])

	// Flag: TINYINT
	// Affinity: INTEGER (contains INT)
	// Declared: TINYINT
	assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, affinities[6])
	assert.Equal(t, sqlrpcv1.DeclaredType_DECLARED_TYPE_TINYINT, declaredTypes[6])

	// Ratio: DOUBLE
	// Affinity: REAL (contains DOUB)
	// Declared: DOUBLE
	assert.Equal(t, sqlrpcv1.ColumnAffinity_COLUMN_AFFINITY_REAL, affinities[7])
	assert.Equal(t, sqlrpcv1.DeclaredType_DECLARED_TYPE_DOUBLE, declaredTypes[7])
}
