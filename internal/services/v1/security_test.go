package servicesv1

import (
	"database/sql"
	"testing"

	"github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// Malicious extension function that performs a write
func unsafeWriteFunc(ctx *sqlite3.SQLiteContext) {
	// In a real exploit, this could be writing to a file, or modifying the DB via side-channel if possible.
	// Here we just return 1 to prove execution, but conceptually this represents a side-effect.
	// To truly demonstrate the vulnerability involving SQL-based writes hidden in functions,
	// we would need a function that executes SQL, which is harder to mock without a full extension.
	// However, the Core Goal is to show that a SELECT statement (Read-Only) can invoke *something*
	// that the Authorizer *should* catch if it were checking opcodes, or simply that we can
	// execute code that might be dangerous.

	// BETTER REPRO: Creating a table via a custom function?
	// Standard SQLite doesn't allow calling SQL from within a scaler function easily without context.
	//
	// But the vulnerability is that the *Interceptors* check the SQL string "SELECT func()", see "SELECT", and allow it.
	// If we have a custom function `write_side_effect()` registered, it runs.

	ctx.ResultInt(1)
}

func init() {
	sql.Register("sqlite3_vulnerable", &sqlite3.SQLiteDriver{
		ConnectHook: func(conn *sqlite3.SQLiteConn) error {
			return conn.RegisterFunc("unsafe_write", unsafeWriteFunc, true)
		},
	})
}

func TestSecurity_ExtensionWrite_Vulnerability(t *testing.T) {
	// 1. Setup Server with a "Vulnerable" Driver/DB
	// We can't easily inject a custom driver into the current NewDbServer without modifying it,
	// so we will have to wait until we refactor to verify the fix fully.
	// For now, let's create a standalone validation that proves `SELECT unsafe_write()` works
	// and is considered "Read-Only" by the naive interceptor.

	// Check Interceptor Logic directly
	assert.False(t, IsWriteQuery("SELECT unsafe_write()"))
	assert.False(t, IsWriteQuery("SELECT 1; SELECT unsafe_write()")) // Still might pass if naive

	// Identify that "VACUUM" is caught
	assert.True(t, IsWriteQuery("VACUUM"))
}

// Full integration test will be enhanced after DbManager features are added
// to allow injecting custom drivers/configs easily.
