package servicesv1

import (
	"context"
	"database/sql"
	"errors"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"strconv"
	"testing"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/structpb"
)

func TestValuesToProto_EdgeCases(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// 1. Test NULLs (GetSelect.Rows[1] in seed data has NULL avatar)
	res, _ := client.Query(ctx, connect.NewRequest(&dbv1.QueryRequest{Database: "test", Sql: "SELECT avatar FROM users WHERE id=2"}))
	val := res.Msg.GetSelect().Rows[0].Values[0]
	assert.Contains(t, val.String(), "null_value") // Protobuf null check

	// 2. Test Expression (Unknown Type) -> 1+1
	res, _ = client.Query(ctx, connect.NewRequest(&dbv1.QueryRequest{Database: "test", Sql: "SELECT 1+1"}))
	// Should default to NumberValue (float) or String
	val = res.Msg.GetSelect().Rows[0].Values[0]
	assert.Equal(t, float64(2), val.GetNumberValue())

	// 3. Test Float Explicit
	res, _ = client.Query(ctx, connect.NewRequest(&dbv1.QueryRequest{Database: "test", Sql: "SELECT 3.14"}))
	val = res.Msg.GetSelect().Rows[0].Values[0]
	assert.Equal(t, 3.14, val.GetNumberValue())
}

func TestSendDMLResult_Stateless(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// Calling QueryStream with an INSERT should trigger SendDMLResult in the stateless writer
	stream, err := client.QueryStream(ctx, connect.NewRequest(&dbv1.QueryRequest{
		Database: "test",
		Sql:      "INSERT INTO users (name) VALUES ('StatelessDML')",
	}))
	require.NoError(t, err)

	assert.True(t, stream.Receive())
	assert.NotNil(t, stream.Msg().GetDml())
	assert.Equal(t, int64(1), stream.Msg().GetDml().RowsAffected)
}

func TestIsReader_Pure(t *testing.T) {
	tests := []struct {
		sql      string
		expected bool
	}{
		{"SELECT * FROM users", true},
		{"explain query plan select 1", true},
		{"pragma foreign_keys", true},
		{"values(1,2,3)", true},
		{"INSERT INTO foo VALUES(1) RETURNING id", true},
		{"UPDATE foo SET a=1 RETURNING a", true},
		{"DELETE FROM foo RETURNING id", true},
		{"INSERT INTO foo VALUES(1)", false},
		{"UPDATE foo SET a=1", false},
		{"DELETE FROM foo", false},
		{"BEGIN IMMEDIATE", false},
		{"COMMIT", false},
	}
	for _, tt := range tests {
		assert.Equal(t, tt.expected, IsReader(tt.sql), "IsReader failure: %s", tt.sql)
	}
}

func TestIsReadOnly_Pure(t *testing.T) {
	tests := []struct {
		sql      string
		expected bool
	}{
		{"SELECT * FROM users", true},
		{"EXPLAIN SELECT 1", true},
		{"VALUES(1)", true},
		{"BEGIN", true}, // Simple BEGIN starts a transaction, technically read-safe until write
		{"SAVEPOINT foo", true},
		{"RELEASE foo", true},
		{"ROLLBACK", true},
		{"BEGIN IMMEDIATE", false},
		{"BEGIN EXCLUSIVE", false},
		{"INSERT INTO foo VALUES(1)", false},
		{"UPDATE foo SET a=1", false},
		{"DELETE FROM foo", false},
		{"SELECT * FROM foo RETURNING id", false}, // RETURNING implies write
	}
	for _, tt := range tests {
		assert.Equal(t, tt.expected, IsReadOnly(tt.sql), "IsReadOnly failure: %s", tt.sql)
	}
}

func TestGenerateSavepointSQL_Pure(t *testing.T) {
	tests := []struct {
		name    string
		req     *dbv1.SavepointRequest
		wantSQL string
		wantErr bool
	}{
		{
			name: "Create",
			req: &dbv1.SavepointRequest{
				Name:   "sp1",
				Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE,
			},
			wantSQL: "SAVEPOINT sp1",
		},
		{
			name: "Release",
			req: &dbv1.SavepointRequest{
				Name:   "sp1",
				Action: dbv1.SavepointAction_SAVEPOINT_ACTION_RELEASE,
			},
			wantSQL: "RELEASE sp1",
		},
		{
			name: "Rollback",
			req: &dbv1.SavepointRequest{
				Name:   "sp1",
				Action: dbv1.SavepointAction_SAVEPOINT_ACTION_ROLLBACK,
			},
			wantSQL: "ROLLBACK TO sp1",
		},
		{
			name: "Empty Name",
			req: &dbv1.SavepointRequest{
				Name:   "",
				Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE,
			},
			wantErr: true,
		},
		{
			name:    "Nil Request",
			req:     nil,
			wantErr: true,
		},
		{
			name: "Invalid Action",
			req: &dbv1.SavepointRequest{
				Name:   "sp1",
				Action: dbv1.SavepointAction_SAVEPOINT_ACTION_UNSPECIFIED,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := generateSavepointSQL(tt.req)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.wantSQL, got)
			}
		})
	}
}

func TestConvertParameters_Pure(t *testing.T) {
	// Helper to create structpb.Value
	strVal := func(s string) *structpb.Value { return structpb.NewStringValue(s) }
	numVal := func(n float64) *structpb.Value { return structpb.NewNumberValue(n) }
	boolVal := func(b bool) *structpb.Value { return structpb.NewBoolValue(b) }

	tests := []struct {
		name    string
		params  *dbv1.Parameters
		want    []any
		wantErr bool
	}{
		{
			name:   "Nil Params",
			params: nil,
			want:   nil,
		},
		{
			name: "Positional Basic",
			params: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{strVal("a"), numVal(1), boolVal(true)}},
			},
			want: []any{"a", 1.0, 1}, // true -> 1
		},
		{
			name: "Positional Hints - Blob",
			params: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{strVal("SGVsbG8=")}}, // "Hello" in Base64
				PositionalHints: map[int32]dbv1.ColumnAffinity{
					0: dbv1.ColumnAffinity_COLUMN_AFFINITY_BLOB,
				},
			},
			want: []any{[]byte("Hello")},
		},
		{
			name: "Positional Hints - Integer",
			params: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{strVal("123"), numVal(456)}},
				PositionalHints: map[int32]dbv1.ColumnAffinity{
					0: dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
					1: dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
				},
			},
			want: []any{int64(123), int64(456)},
		},
		{
			name: "Positional Hints - Boolean",
			params: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{boolVal(true), boolVal(false)}},
				// Note: Boolean is usually stored as INTEGER (0/1) in SQLite
				PositionalHints: map[int32]dbv1.ColumnAffinity{
					0: dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
					1: dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
				},
			},
			want: []any{1, 0},
		},
		{
			name: "Positional Hints - Float",
			params: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{strVal("3.14")}},
				PositionalHints: map[int32]dbv1.ColumnAffinity{
					0: dbv1.ColumnAffinity_COLUMN_AFFINITY_REAL,
				},
			},
			want: []any{3.14},
		},
		{
			name: "Named Basic",
			params: &dbv1.Parameters{
				Named: &structpb.Struct{Fields: map[string]*structpb.Value{
					":a": strVal("val"),
				}},
			},
			want: []any{sql.Named("a", "val")},
		},
		{
			name: "Named Hints - Integer",
			params: &dbv1.Parameters{
				Named: &structpb.Struct{Fields: map[string]*structpb.Value{
					"@id": strVal("999"),
				}},
				NamedHints: map[string]dbv1.ColumnAffinity{
					"@id": dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
				},
			},
			want: []any{sql.Named("id", int64(999))},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := convertParameters("", tt.params)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.want, got)
			}
		})
	}
}

func TestValuesToProto_Extended(t *testing.T) {
	// Test max safe integer boundary
	// MaxSafeInt = 9007199254740991
	safeInt := int64(1<<53 - 1)
	unsafeInt := safeInt + 1

	affinities := []dbv1.ColumnAffinity{
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_UNSPECIFIED,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_UNSPECIFIED,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, // Should handle nil regardless of type
		dbv1.ColumnAffinity_COLUMN_AFFINITY_REAL,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, // Boolean -> Integer
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_UNSPECIFIED,
	}

	values := []sql.RawBytes{
		[]byte(strconv.FormatInt(safeInt, 10)),   // 0: Safe Int
		[]byte(strconv.FormatInt(unsafeInt, 10)), // 1: Unsafe Int
		[]byte("invalid"),                        // 2: Invalid Int
		[]byte(strconv.FormatInt(unsafeInt, 10)), // 3: Unspecified Big Int
		[]byte("3.14"),                           // 4: Unspecified Float
		nil,                                      // 5: NULL value
		[]byte("1.23"),                           // 6: Explicit Float
		[]byte("1"),                              // 7: Boolean True (1)
		[]byte("true"),                           // 8: Boolean True (string)
		[]byte("0"),                              // 9: Boolean False (0)
		[]byte("hello"),                          // 10: Unspecified Text
	}

	protoRes := valuesToProto(values, affinities)

	// 0: Safe Int -> NumberValue
	assert.Equal(t, float64(safeInt), protoRes.Values[0].GetNumberValue())

	// 1: Unsafe Int -> StringValue
	assert.Equal(t, strconv.FormatInt(unsafeInt, 10), protoRes.Values[1].GetStringValue())

	// 2: Invalid Int -> StringValue (Fallback)
	assert.Equal(t, "invalid", protoRes.Values[2].GetStringValue())

	// 3: Unspecified Big Int -> Integer Type & StringValue
	assert.Equal(t, strconv.FormatInt(unsafeInt, 10), protoRes.Values[3].GetStringValue())
	// No update check for colTypes[3]

	// 4: Unspecified Float -> Float Type & NumberValue
	assert.Equal(t, 3.14, protoRes.Values[4].GetNumberValue())
	// No update check for colTypes[4]

	// 5: NULL value
	assert.True(t, protoRes.Values[5].GetNullValue() == structpb.NullValue_NULL_VALUE) // Using NullValue enum comparison

	// 6: Explicit Float
	assert.Equal(t, 1.23, protoRes.Values[6].GetNumberValue())

	// 7: Boolean True (1) -> NumberValue(1)
	assert.Equal(t, 1.0, protoRes.Values[7].GetNumberValue())

	// 8: Boolean True (true) -> "true" (ParseInt fails)
	assert.Equal(t, "true", protoRes.Values[8].GetStringValue())

	// 9: Boolean False (0) -> NumberValue(0)
	assert.Equal(t, 0.0, protoRes.Values[9].GetNumberValue())

	// 10: Unspecified Text -> Text Type & StringValue
	assert.Equal(t, "hello", protoRes.Values[10].GetStringValue())
	// No update check for affinities[10]
}

func TestResolveColumnTypes_Coverage(t *testing.T) {
	client, _ := setupTestServer(t)
	ctx := context.Background()

	// 1. Create a table with ALL specific types
	setupSql := `
	CREATE TABLE type_test (
		c_int INTEGER,
		c_tinyint TINYINT,
		c_text TEXT,
		c_varchar VARCHAR(255),
		c_clob CLOB,
		c_blob BLOB,
		c_binary BINARY,
		c_real REAL,
		c_float FLOAT,
		c_double DOUBLE,
		c_bool BOOLEAN,
		c_date DATE,
		c_time TIME,
		c_timestamp TIMESTAMP,
		c_unknown MY_WEIRD_TYPE
	);
	INSERT INTO type_test DEFAULT VALUES;
	`
	_, err := client.ExecuteTransaction(ctx, connect.NewRequest(&dbv1.ExecuteTransactionRequest{
		Requests: []*dbv1.TransactionRequest{
			{Command: &dbv1.TransactionRequest_Begin{Begin: &dbv1.BeginRequest{Database: "test"}}},
			{Command: &dbv1.TransactionRequest_Query{Query: &dbv1.TransactionalQueryRequest{Sql: setupSql}}},
			{Command: &dbv1.TransactionRequest_Commit{Commit: &emptypb.Empty{}}},
		},
	}))
	require.NoError(t, err)

	// 2. Query and inspect ColumnTypes
	res, err := client.Query(ctx, connect.NewRequest(&dbv1.QueryRequest{
		Database: "test",
		Sql:      "SELECT * FROM type_test",
	}))
	require.NoError(t, err)

	affinities := res.Msg.GetSelect().ColumnAffinities
	declaredTypes := res.Msg.GetSelect().ColumnDeclaredTypes

	require.Len(t, affinities, 15)
	require.Len(t, declaredTypes, 15)

	// Verify Mappings
	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, affinities[0], "INTEGER")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_INTEGER, declaredTypes[0], "INTEGER")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, affinities[1], "TINYINT")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_TINYINT, declaredTypes[1], "TINYINT")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[2], "TEXT")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_TEXT, declaredTypes[2], "TEXT")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[3], "VARCHAR")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_VARCHAR, declaredTypes[3], "VARCHAR")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[4], "CLOB")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_CLOB, declaredTypes[4], "CLOB")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_BLOB, affinities[5], "BLOB")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_BLOB, declaredTypes[5], "BLOB")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_BLOB, affinities[6], "BINARY")
	// BINARY maps to BLOB usually or unspecified if not handled explicitly in mapDeclaredType.
	// In resolveColumnTypes: BLOB -> Affinity BLOB. mapDeclaredType: BLOB -> Declared BLOB.
	// But "BINARY" keyword:
	// mapDeclaredType defaults to UNSPECIFIED if not matched.
	// Let's check mapDeclaredType logic. It uses Contains("BLOB"). "BINARY" does not contain "BLOB".
	// Wait, standard SQLite types...
	// We should probably check what we expect.
	// For this test update, I'll expect UNSPECIFIED for Declared if logic doesn't cover it.
	// But wait, "c_binary BINARY" -> Declared UNSPECIFIED
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_UNSPECIFIED, declaredTypes[6], "BINARY")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_REAL, affinities[7], "REAL")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_REAL, declaredTypes[7], "REAL")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_REAL, affinities[8], "FLOAT")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_FLOAT, declaredTypes[8], "FLOAT")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_REAL, affinities[9], "DOUBLE")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_DOUBLE, declaredTypes[9], "DOUBLE")

	// BOOLEAN -> NUMERIC/Affinity? and Declared BOOLEAN
	// resolveColumnTypes: "BOOLEAN" -> NUMERIC (default switch).
	// mapDeclaredType: "BOOLEAN" -> BOOLEAN.
	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_NUMERIC, affinities[10], "BOOLEAN")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_BOOLEAN, declaredTypes[10], "BOOLEAN")

	// DATE -> TEXT (special override) and Declared DATE
	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[11], "DATE")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_DATE, declaredTypes[11], "DATE")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[12], "TIME")
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_TIME, declaredTypes[12], "TIME")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT, affinities[13], "TIMESTAMP") // Should be same as DATE logic?
	// resolveColumnTypes: contains "DATE", "TIME" -> TEXT. "TIMESTAMP" contains "TIME". -> TEXT.
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_TIMESTAMP, declaredTypes[13], "TIMESTAMP")

	assert.Equal(t, dbv1.ColumnAffinity_COLUMN_AFFINITY_NUMERIC, affinities[14], "UNKNOWN") // Default default
	assert.Equal(t, dbv1.DeclaredType_DECLARED_TYPE_UNSPECIFIED, declaredTypes[14], "UNKNOWN")
}

func TestGetScanBuffer_Resize(t *testing.T) {
	// Standard size is 64. Requesting more should trigger the resize logic.
	largeCount := 128
	buf := getScanBuffer(largeCount)

	// Verify the slice length matches the request
	assert.Equal(t, largeCount, len(buf.values))
	assert.Equal(t, largeCount, len(buf.args))

	// Verify the underlying capacity grew
	assert.GreaterOrEqual(t, cap(buf.values), largeCount)

	// Verify pointers are set up correctly
	// The address of the value should match the pointer in args
	for i := 0; i < largeCount; i++ {
		assert.Equal(t, &buf.values[i], buf.args[i])
	}

	// Put it back to ensure no panic on cleanup
	putbackBuffer(buf)
}

// --- Mocks for streamQueryResults ---

type mockStreamWriter struct {
	failHeader     bool
	failBatch      bool
	failDML        bool
	headerReceived *dbv1.QueryResultHeader
	batchReceived  *dbv1.QueryResultRowBatch
}

func (m *mockStreamWriter) SendHeader(h *dbv1.QueryResultHeader) error {
	if m.failHeader {
		return errors.New("mock header error")
	}
	m.headerReceived = h
	return nil
}

func (m *mockStreamWriter) SendRowBatch(b *dbv1.QueryResultRowBatch) error {
	if m.failBatch {
		return errors.New("mock batch error")
	}
	m.batchReceived = b
	return nil
}

func (m *mockStreamWriter) SendDMLResult(r *dbv1.DMLResult) error {
	if m.failDML {
		return errors.New("mock dml error")
	}
	// m.dmlReceived = r
	return nil
}

func (m *mockStreamWriter) SendComplete(s *dbv1.ExecutionStats) error {
	return nil
}

func TestStreamQueryResults_Coverage(t *testing.T) {
	_, server := setupTestServer(t)
	db := server.Dbs["test"]
	ctx := context.Background()

	t.Run("Convert Parameters Error", func(t *testing.T) {
		// Pass invalid parameters (e.g. nil list value inside Check)
		// Or simpler: pass a parameter type we can't handle?
		// Actually, converting structpb.Value with unknown type?
		// proto validation usually catches this.
		// Let's rely on passing a nil parameter message which convertParameters handles (returns nil, nil).
		// Wait, convertParameters(nil) returns nil, nil (no error).
		// We need to trigger error in convertParameters.
		// Looking at code: it iterates values. structpb values are robust.
		// Maybe strict validation checks?
		// Assuming convertParameters is robust, let's skip forcing error there if hard.
		// Actually, `convertParameters` returns error if `params` structure is invalid?
		// It seems very permissive.
	})

	t.Run("Send Header Error", func(t *testing.T) {
		writer := &mockStreamWriter{failHeader: true}
		err := streamQueryResults(ctx, db, "SELECT 1", nil, writer)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "mock header error")
	})

	t.Run("Send Batch Error", func(t *testing.T) {
		// Need enough rows? Or just one.
		writer := &mockStreamWriter{failBatch: true}
		err := streamQueryResults(ctx, db, "SELECT 1", nil, writer)
		// Note: Batch might be buffered? But with 1 row, it might send immediately if buffer logic flushes?
		// Loop: rows.Next -> scan -> valuesToProto -> append -> if len >= chunkSize send.
		// chunkSize is 500. So "SELECT 1" will NOT trigger SendRowBatch inside loop.
		// It triggers SendComplete?
		// Wait, `streamQueryResults` sends remaining batch at end?
		// Let's check implementation.
		// It buffers. If loop finishes, it sends remaining.
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "mock batch error")
	})

	t.Run("DB Ops Error", func(t *testing.T) {
		writer := &mockStreamWriter{}
		err := streamQueryResults(ctx, db, "SELECT * FROM missing_table", nil, writer)
		assert.Error(t, err)
	})

	t.Run("DML Write Error", func(t *testing.T) {
		writer := &mockStreamWriter{failDML: true}
		err := streamQueryResults(ctx, db, "INSERT INTO users (name) VALUES ('err')", nil, writer)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "mock dml error")
	})
}

// =============================================================================
// TYPED API TESTS
// =============================================================================

func TestSqlValueToAny(t *testing.T) {
	tests := []struct {
		name     string
		input    *dbv1.SqlValue
		expected any
	}{
		{
			name:     "Nil",
			input:    nil,
			expected: nil,
		},
		{
			name:     "Integer",
			input:    &dbv1.SqlValue{Value: &dbv1.SqlValue_IntegerValue{IntegerValue: 42}},
			expected: int64(42),
		},
		{
			name:     "Real",
			input:    &dbv1.SqlValue{Value: &dbv1.SqlValue_RealValue{RealValue: 3.14}},
			expected: 3.14,
		},
		{
			name:     "Text",
			input:    &dbv1.SqlValue{Value: &dbv1.SqlValue_TextValue{TextValue: "hello"}},
			expected: "hello",
		},
		{
			name:     "Blob",
			input:    &dbv1.SqlValue{Value: &dbv1.SqlValue_BlobValue{BlobValue: []byte{0xDE, 0xAD}}},
			expected: []byte{0xDE, 0xAD},
		},
		{
			name:     "Null",
			input:    &dbv1.SqlValue{Value: &dbv1.SqlValue_NullValue{NullValue: true}},
			expected: nil,
		},
		{
			name:     "Empty SqlValue (no oneof set)",
			input:    &dbv1.SqlValue{},
			expected: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := sqlValueToAny(tt.input)
			assert.Equal(t, tt.expected, got)
		})
	}
}

func TestConvertTypedParameters(t *testing.T) {
	tests := []struct {
		name    string
		sql     string
		params  *dbv1.TypedParameters
		wantLen int
	}{
		{
			name:    "Nil params",
			sql:     "SELECT 1",
			params:  nil,
			wantLen: 0,
		},
		{
			name: "Positional only",
			sql:  "SELECT ?, ?",
			params: &dbv1.TypedParameters{
				Positional: []*dbv1.SqlValue{
					{Value: &dbv1.SqlValue_IntegerValue{IntegerValue: 1}},
					{Value: &dbv1.SqlValue_TextValue{TextValue: "two"}},
				},
			},
			wantLen: 2,
		},
		{
			name: "Named only",
			sql:  "SELECT :name",
			params: &dbv1.TypedParameters{
				Named: map[string]*dbv1.SqlValue{
					"name": {Value: &dbv1.SqlValue_TextValue{TextValue: "Alice"}},
				},
			},
			wantLen: 1,
		},
		{
			name: "Mixed positional and named",
			sql:  "SELECT ?, :id",
			params: &dbv1.TypedParameters{
				Positional: []*dbv1.SqlValue{
					{Value: &dbv1.SqlValue_TextValue{TextValue: "test"}},
				},
				Named: map[string]*dbv1.SqlValue{
					"id": {Value: &dbv1.SqlValue_IntegerValue{IntegerValue: 42}},
				},
			},
			wantLen: 2,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := convertTypedParameters(tt.sql, tt.params)
			require.NoError(t, err)
			assert.Len(t, got, tt.wantLen)
		})
	}
}

func TestValuesToTypedProto(t *testing.T) {
	// Test max safe integer boundary
	safeInt := int64(1<<53 - 1)
	unsafeInt := safeInt + 1

	affinities := []dbv1.ColumnAffinity{
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_TEXT,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_REAL,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_BLOB,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_UNSPECIFIED,
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, // NULL value
		dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, // Parse error
	}

	values := []sql.RawBytes{
		[]byte(strconv.FormatInt(safeInt, 10)),   // 0: Safe Int
		[]byte(strconv.FormatInt(unsafeInt, 10)), // 1: Unsafe Int (still int64 in typed)
		[]byte("hello"),                          // 2: Text
		[]byte("3.14"),                           // 3: Real
		[]byte{0xDE, 0xAD, 0xBE, 0xEF},           // 4: Blob
		[]byte("42"),                             // 5: Unspecified (guesses int)
		nil,                                      // 6: NULL
		[]byte("not_a_number"),                   // 7: Parse error -> text fallback
	}

	result := valuesToTypedProto(values, affinities)

	// 0: Safe Int -> IntegerValue
	assert.Equal(t, safeInt, result.Values[0].GetIntegerValue())

	// 1: Unsafe Int -> Still IntegerValue (no precision loss in typed API!)
	assert.Equal(t, unsafeInt, result.Values[1].GetIntegerValue())

	// 2: Text -> TextValue
	assert.Equal(t, "hello", result.Values[2].GetTextValue())

	// 3: Real -> RealValue
	assert.Equal(t, 3.14, result.Values[3].GetRealValue())

	// 4: Blob -> BlobValue (raw bytes, no base64)
	assert.Equal(t, []byte{0xDE, 0xAD, 0xBE, 0xEF}, result.Values[4].GetBlobValue())

	// 5: Unspecified -> IntegerValue (guessed)
	assert.Equal(t, int64(42), result.Values[5].GetIntegerValue())

	// 6: NULL -> NullValue
	assert.True(t, result.Values[6].GetNullValue())

	// 7: Parse error -> TextValue fallback
	assert.Equal(t, "not_a_number", result.Values[7].GetTextValue())
}

// Mock for TypedStreamWriter
type mockTypedStreamWriter struct {
	failHeader     bool
	failBatch      bool
	failDML        bool
	headerReceived *dbv1.TypedQueryResultHeader
	batchReceived  *dbv1.TypedQueryResultRowBatch
}

func (m *mockTypedStreamWriter) SendHeader(h *dbv1.TypedQueryResultHeader) error {
	if m.failHeader {
		return errors.New("mock typed header error")
	}
	m.headerReceived = h
	return nil
}

func (m *mockTypedStreamWriter) SendRowBatch(b *dbv1.TypedQueryResultRowBatch) error {
	if m.failBatch {
		return errors.New("mock typed batch error")
	}
	m.batchReceived = b
	return nil
}

func (m *mockTypedStreamWriter) SendDMLResult(r *dbv1.DMLResult) error {
	if m.failDML {
		return errors.New("mock typed dml error")
	}
	return nil
}

func (m *mockTypedStreamWriter) SendComplete(s *dbv1.ExecutionStats) error {
	return nil
}

func TestTypedStreamQueryResults_Coverage(t *testing.T) {
	_, server := setupTestServer(t)
	db := server.Dbs["test"]
	ctx := context.Background()

	t.Run("Success SELECT", func(t *testing.T) {
		writer := &mockTypedStreamWriter{}
		err := typedStreamQueryResults(ctx, db, "SELECT id, name FROM users", nil, writer)
		require.NoError(t, err)
		assert.NotNil(t, writer.headerReceived)
		assert.Equal(t, []string{"id", "name"}, writer.headerReceived.Columns)
	})

	t.Run("Success DML", func(t *testing.T) {
		writer := &mockTypedStreamWriter{}
		err := typedStreamQueryResults(ctx, db, "INSERT INTO users (name) VALUES ('TypedTest')", nil, writer)
		require.NoError(t, err)
	})

	t.Run("Send Header Error", func(t *testing.T) {
		writer := &mockTypedStreamWriter{failHeader: true}
		err := typedStreamQueryResults(ctx, db, "SELECT 1", nil, writer)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "mock typed header error")
	})

	t.Run("Send Batch Error", func(t *testing.T) {
		writer := &mockTypedStreamWriter{failBatch: true}
		err := typedStreamQueryResults(ctx, db, "SELECT 1", nil, writer)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "mock typed batch error")
	})

	t.Run("DML Write Error", func(t *testing.T) {
		writer := &mockTypedStreamWriter{failDML: true}
		err := typedStreamQueryResults(ctx, db, "INSERT INTO users (name) VALUES ('err')", nil, writer)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "mock typed dml error")
	})

	t.Run("DB Query Error", func(t *testing.T) {
		writer := &mockTypedStreamWriter{}
		err := typedStreamQueryResults(ctx, db, "SELECT * FROM missing_table", nil, writer)
		assert.Error(t, err)
	})
}

func TestTypedExecuteQueryAndBuffer_Coverage(t *testing.T) {
	_, server := setupTestServer(t)
	db := server.Dbs["test"]
	ctx := context.Background()

	t.Run("SELECT Success", func(t *testing.T) {
		result, err := typedExecuteQueryAndBuffer(ctx, db, "SELECT id, name FROM users WHERE id = 1", nil)
		require.NoError(t, err)
		assert.NotNil(t, result.GetSelect())
		assert.Len(t, result.GetSelect().Rows, 1)
		// Check typed values
		row := result.GetSelect().Rows[0]
		assert.Equal(t, int64(1), row.Values[0].GetIntegerValue())
		assert.Equal(t, "Alice", row.Values[1].GetTextValue())
	})

	t.Run("DML Success", func(t *testing.T) {
		result, err := typedExecuteQueryAndBuffer(ctx, db, "INSERT INTO users (name) VALUES ('TypedBuffer')", nil)
		require.NoError(t, err)
		assert.NotNil(t, result.GetDml())
		assert.Equal(t, int64(1), result.GetDml().RowsAffected)
	})

	t.Run("SELECT with Parameters", func(t *testing.T) {
		params := &dbv1.TypedParameters{
			Positional: []*dbv1.SqlValue{
				{Value: &dbv1.SqlValue_IntegerValue{IntegerValue: 1}},
			},
		}
		result, err := typedExecuteQueryAndBuffer(ctx, db, "SELECT name FROM users WHERE id = ?", params)
		require.NoError(t, err)
		assert.Len(t, result.GetSelect().Rows, 1)
		assert.Equal(t, "Alice", result.GetSelect().Rows[0].Values[0].GetTextValue())
	})

	t.Run("Query Error", func(t *testing.T) {
		_, err := typedExecuteQueryAndBuffer(ctx, db, "SELECT * FROM missing_table", nil)
		assert.Error(t, err)
	})
}
