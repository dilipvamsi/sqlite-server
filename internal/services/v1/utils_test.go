package servicesv1

import (
	"encoding/base64"
	"net/http"
	"testing"

	dbv1 "sqlite-server/internal/protos/db/v1"

	"github.com/stretchr/testify/assert"
	"google.golang.org/protobuf/types/known/structpb"
)

// --- Test Utils.go ---

func TestGenRequestID(t *testing.T) {
	id1 := genRequestID()
	id2 := genRequestID()
	assert.NotEqual(t, id1, id2)
	assert.Len(t, id1, 36) // UUID length
}

func TestUnsafeConversions(t *testing.T) {
	// 1. String to Bytes
	s := "hello"
	b := UnsafeStringToBytesNoCopy(s)
	assert.Equal(t, []byte("hello"), b)

	// 2. Bytes to String
	b2 := []byte("world")
	s2 := UnsafeBytesToStringNoCopy(b2)
	assert.Equal(t, "world", s2)

	// 3. Empty cases
	assert.Empty(t, UnsafeBytesToStringNoCopy(nil))
	assert.Empty(t, UnsafeStringToBytesNoCopy(""))
}

// --- Test Query Utils ---

func TestIsReader(t *testing.T) {
	assert.True(t, IsReader("SELECT * FROM t"))
	assert.True(t, IsReader("  explain query plan"))
	assert.True(t, IsReader("INSERT INTO t VALUES(1) RETURNING id"))
	assert.False(t, IsReader("UPDATE t SET a=1"))
}

func TestIsReadOnly(t *testing.T) {
	assert.True(t, IsReadOnly("SELECT * FROM t"))
	assert.False(t, IsReadOnly("INSERT INTO t VALUES(1)"))
	// BEGIN IMMEDIATE/EXCLUSIVE are write ops
	assert.False(t, IsReadOnly("BEGIN IMMEDIATE"))
	// RETURNING implies writing
	assert.False(t, IsReadOnly("INSERT ... RETURNING *"))
}

func TestApplyHint(t *testing.T) {
	// 1. BLOB Hint
	blobStr := base64.StdEncoding.EncodeToString([]byte("data"))
	val := applyHint(blobStr, dbv1.ColumnAffinity_COLUMN_AFFINITY_BLOB, true)
	assert.Equal(t, []byte("data"), val)

	// 2. Integer Hint (String -> Int)
	val = applyHint("123", dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, true)
	assert.Equal(t, int64(123), val)

	// 3. Integer Hint (Float -> Int)
	val = applyHint(float64(123.0), dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, true)
	assert.Equal(t, int64(123), val)

	// 4. Boolean
	// Boolean is not in Affinity enum explicitly as a hint input usually, but we treat it as INTEGER/NUMERIC
	// The implementation of applyHint converts BOOLEAN affinity roughly to Integer logic?
	// applyHint switch:
	// case dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER: ...
	// Wait, if I pass true/false and use INTEGER affinity, does it convert?
	// In query_utils.go applyHint for INTEGER:
	// case bool: return 1 or 0.
	// So we should use INTEGER affinity for boolean test here.
	val = applyHint(true, dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, true)
	assert.Equal(t, 1, val)
	val = applyHint(false, dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER, true)
	assert.Equal(t, 0, val)
}

func TestParameterConversion(t *testing.T) {
	// Test Sparse Hints logic
	params := &dbv1.Parameters{
		Positional: &structpb.ListValue{Values: []*structpb.Value{
			structpb.NewStringValue("123"),
		}},
		PositionalHints: map[int32]dbv1.ColumnAffinity{0: dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER},
		Named: &structpb.Struct{Fields: map[string]*structpb.Value{
			":id": structpb.NewStringValue("456"),
		}},
		NamedHints: map[string]dbv1.ColumnAffinity{":id": dbv1.ColumnAffinity_COLUMN_AFFINITY_INTEGER},
	}

	res, err := convertParameters("", params)
	assert.NoError(t, err)
	assert.Equal(t, int64(123), res[0])
	// Named params are usually last or specific in sql package, check existence
	assert.Len(t, res, 2)
}

func TestGenerateSavepointSQL(t *testing.T) {
	// Valid
	sql, err := generateSavepointSQL(&dbv1.SavepointRequest{Name: "p1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE})
	assert.NoError(t, err)
	assert.Equal(t, "SAVEPOINT p1", sql)

	// Rollback
	sql, _ = generateSavepointSQL(&dbv1.SavepointRequest{Name: "p1", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_ROLLBACK})
	assert.Equal(t, "ROLLBACK TO p1", sql)

	// Invalid Name
	_, err = generateSavepointSQL(&dbv1.SavepointRequest{Name: "", Action: dbv1.SavepointAction_SAVEPOINT_ACTION_CREATE})
	assert.Error(t, err)
}

func TestEnsureRequestID_PreExisting(t *testing.T) {
	header := http.Header{}
	header.Set("X-Request-Id", "existing-id-123")
	id := ensureRequestID(header)
	assert.Equal(t, "existing-id-123", id)
}
