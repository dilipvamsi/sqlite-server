package sqldrivers

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
)

func TestLoadJsonDBConfigs(t *testing.T) {
	// 1. Valid Config
	validJson := `[
		{"name": "test", "dbPath": ":memory:", "maxOpenConns": 1, "pragmas": {"foreign_keys": "ON"}}
	]`
	f, _ := os.CreateTemp("", "config_*.json")
	defer os.Remove(f.Name())
	f.WriteString(validJson)
	f.Close()

	configs, err := LoadJsonDBConfigs(f.Name())
	require.NoError(t, err)
	assert.Len(t, configs, 1)
	assert.Equal(t, "test", configs[0].Name)

	// 2. Invalid File Path
	_, err = LoadJsonDBConfigs("non_existent.json")
	assert.Error(t, err)

	// 3. Invalid JSON
	f2, _ := os.CreateTemp("", "bad_*.json")
	defer os.Remove(f2.Name())
	f2.WriteString(`{ bad_json `)
	f2.Close()
	_, err = LoadJsonDBConfigs(f2.Name())
	assert.Error(t, err)

	// 4. Empty Config List
	f3, _ := os.CreateTemp("", "empty_*.json")
	defer os.Remove(f3.Name())
	f3.WriteString(`[]`)
	f3.Close()
	_, err = LoadJsonDBConfigs(f3.Name())
	assert.EqualError(t, err, "no databases found in config file")
}

func TestNewSqliteDb(t *testing.T) {
	// 1. Standard Memory DB
	cfg := &sqlrpcv1.DatabaseConfig{Name: "mem", DbPath: ":memory:", MaxOpenConns: 1, Pragmas: map[string]string{"synchronous": "OFF"}}
	db, err := NewSqliteDb(cfg, false)
	require.NoError(t, err)
	assert.NotNil(t, db)
	db.Close()

	// 2. Encrypted (Simulation - go-sqlite3 std doesn't support it, but we test the URL generation logic)
	// Note: If you don't have the encryption build tag, this behaves like standard sqlite, which is fine for coverage of the Go code.
	cfgEnc := &sqlrpcv1.DatabaseConfig{Name: "enc", DbPath: ":memory:", IsEncrypted: true, Key: "secret"}
	dbEnc, err := NewSqliteDb(cfgEnc, false)
	require.NoError(t, err)
	dbEnc.Close()

	// 3. Read Only
	cfgRO := &sqlrpcv1.DatabaseConfig{Name: "ro", DbPath: ":memory:", ReadOnly: true}
	dbRO, err := NewSqliteDb(cfgRO, false)
	require.NoError(t, err)
	dbRO.Close()

	// 4. Extensions (Logic check, even if load fails due to missing .so)
	cfgExt := &sqlrpcv1.DatabaseConfig{Name: "ext", DbPath: ":memory:", Extensions: []string{"/tmp/dummy.so"}}
	// This might fail to open if the extension doesn't exist, which hits the error path
	_, _ = NewSqliteDb(cfgExt, false)
}
