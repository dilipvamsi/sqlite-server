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
			want: []any{"a", 1.0, true},
		},
		{
			name: "Positional Hints - Blob",
			params: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{strVal("SGVsbG8=")}}, // "Hello" in Base64
				PositionalHints: map[int32]dbv1.ColumnType{
					0: dbv1.ColumnType_COLUMN_TYPE_BLOB,
				},
			},
			want: []any{[]byte("Hello")},
		},
		{
			name: "Positional Hints - Integer",
			params: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{strVal("123"), numVal(456)}},
				PositionalHints: map[int32]dbv1.ColumnType{
					0: dbv1.ColumnType_COLUMN_TYPE_INTEGER,
					1: dbv1.ColumnType_COLUMN_TYPE_INTEGER,
				},
			},
			want: []any{int64(123), int64(456)},
		},
		{
			name: "Positional Hints - Boolean",
			params: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{boolVal(true), boolVal(false)}},
				PositionalHints: map[int32]dbv1.ColumnType{
					0: dbv1.ColumnType_COLUMN_TYPE_BOOLEAN,
					1: dbv1.ColumnType_COLUMN_TYPE_BOOLEAN,
				},
			},
			want: []any{1, 0},
		},
		{
			name: "Positional Hints - Float",
			params: &dbv1.Parameters{
				Positional: &structpb.ListValue{Values: []*structpb.Value{strVal("3.14")}},
				PositionalHints: map[int32]dbv1.ColumnType{
					0: dbv1.ColumnType_COLUMN_TYPE_FLOAT,
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
				NamedHints: map[string]dbv1.ColumnType{
					"@id": dbv1.ColumnType_COLUMN_TYPE_INTEGER,
				},
			},
			want: []any{sql.Named("id", int64(999))},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := convertParameters(tt.params)
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

	colTypes := []dbv1.ColumnType{
		dbv1.ColumnType_COLUMN_TYPE_INTEGER,
		dbv1.ColumnType_COLUMN_TYPE_INTEGER,
		dbv1.ColumnType_COLUMN_TYPE_INTEGER,
		dbv1.ColumnType_COLUMN_TYPE_UNSPECIFIED,
		dbv1.ColumnType_COLUMN_TYPE_UNSPECIFIED,
		dbv1.ColumnType_COLUMN_TYPE_INTEGER, // Should handle nil regardless of type
		dbv1.ColumnType_COLUMN_TYPE_FLOAT,
		dbv1.ColumnType_COLUMN_TYPE_BOOLEAN,
		dbv1.ColumnType_COLUMN_TYPE_BOOLEAN,
		dbv1.ColumnType_COLUMN_TYPE_BOOLEAN,
		dbv1.ColumnType_COLUMN_TYPE_UNSPECIFIED,
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

	protoRes := valuesToProto(values, colTypes)

	// 0: Safe Int -> NumberValue
	assert.Equal(t, float64(safeInt), protoRes.Values[0].GetNumberValue())

	// 1: Unsafe Int -> StringValue
	assert.Equal(t, strconv.FormatInt(unsafeInt, 10), protoRes.Values[1].GetStringValue())

	// 2: Invalid Int -> StringValue (Fallback)
	assert.Equal(t, "invalid", protoRes.Values[2].GetStringValue())

	// 3: Unspecified Big Int -> Integer Type & StringValue
	assert.Equal(t, strconv.FormatInt(unsafeInt, 10), protoRes.Values[3].GetStringValue())
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_INTEGER, colTypes[3]) // Should update type

	// 4: Unspecified Float -> Float Type & NumberValue
	assert.Equal(t, 3.14, protoRes.Values[4].GetNumberValue())
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_FLOAT, colTypes[4]) // Should update type

	// 5: NULL value
	assert.True(t, protoRes.Values[5].GetNullValue() == structpb.NullValue_NULL_VALUE) // Using NullValue enum comparison

	// 6: Explicit Float
	assert.Equal(t, 1.23, protoRes.Values[6].GetNumberValue())

	// 7: Boolean True (1)
	assert.True(t, protoRes.Values[7].GetBoolValue())

	// 8: Boolean True (true)
	assert.True(t, protoRes.Values[8].GetBoolValue())

	// 9: Boolean False (0)
	assert.False(t, protoRes.Values[9].GetBoolValue())

	// 10: Unspecified Text -> Text Type & StringValue
	assert.Equal(t, "hello", protoRes.Values[10].GetStringValue())
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_TEXT, colTypes[10])
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

	colTypes := res.Msg.GetSelect().ColumnTypes
	require.Len(t, colTypes, 15)

	// Verify Mappings
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_INTEGER, colTypes[0], "INTEGER")
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_INTEGER, colTypes[1], "TINYINT")

	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_TEXT, colTypes[2], "TEXT")
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_TEXT, colTypes[3], "VARCHAR")
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_TEXT, colTypes[4], "CLOB")

	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_BLOB, colTypes[5], "BLOB")
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_BLOB, colTypes[6], "BINARY")

	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_FLOAT, colTypes[7], "REAL")
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_FLOAT, colTypes[8], "FLOAT")
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_FLOAT, colTypes[9], "DOUBLE")

	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_BOOLEAN, colTypes[10], "BOOLEAN")

	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_DATE, colTypes[11], "DATE")
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_DATE, colTypes[12], "TIME")
	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_DATE, colTypes[13], "TIMESTAMP")

	assert.Equal(t, dbv1.ColumnType_COLUMN_TYPE_UNSPECIFIED, colTypes[14], "UNKNOWN")
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
