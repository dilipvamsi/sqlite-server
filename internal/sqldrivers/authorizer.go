package sqldrivers

import (
	"github.com/mattn/go-sqlite3"
)

// AuthorizerAction maps sqlite3 action codes to human-readable names
// for debugging purposes.
var AuthorizerAction = map[int]string{
	sqlite3.SQLITE_CREATE_INDEX:        "CREATE_INDEX",
	sqlite3.SQLITE_CREATE_TABLE:        "CREATE_TABLE",
	sqlite3.SQLITE_CREATE_TEMP_INDEX:   "CREATE_TEMP_INDEX",
	sqlite3.SQLITE_CREATE_TEMP_TABLE:   "CREATE_TEMP_TABLE",
	sqlite3.SQLITE_CREATE_TEMP_TRIGGER: "CREATE_TEMP_TRIGGER",
	sqlite3.SQLITE_CREATE_TEMP_VIEW:    "CREATE_TEMP_VIEW",
	sqlite3.SQLITE_CREATE_TRIGGER:      "CREATE_TRIGGER",
	sqlite3.SQLITE_CREATE_VIEW:         "CREATE_VIEW",
	sqlite3.SQLITE_DELETE:              "DELETE",
	sqlite3.SQLITE_DROP_INDEX:          "DROP_INDEX",
	sqlite3.SQLITE_DROP_TABLE:          "DROP_TABLE",
	sqlite3.SQLITE_DROP_TEMP_INDEX:     "DROP_TEMP_INDEX",
	sqlite3.SQLITE_DROP_TEMP_TABLE:     "DROP_TEMP_TABLE",
	sqlite3.SQLITE_DROP_TEMP_TRIGGER:   "DROP_TEMP_TRIGGER",
	sqlite3.SQLITE_DROP_TEMP_VIEW:      "DROP_TEMP_VIEW",
	sqlite3.SQLITE_DROP_TRIGGER:        "DROP_TRIGGER",
	sqlite3.SQLITE_DROP_VIEW:           "DROP_VIEW",
	sqlite3.SQLITE_INSERT:              "INSERT",
	sqlite3.SQLITE_PRAGMA:              "PRAGMA",
	sqlite3.SQLITE_READ:                "READ",
	sqlite3.SQLITE_SELECT:              "SELECT",
	sqlite3.SQLITE_TRANSACTION:         "TRANSACTION",
	sqlite3.SQLITE_UPDATE:              "UPDATE",
	sqlite3.SQLITE_ATTACH:              "ATTACH",
	sqlite3.SQLITE_DETACH:              "DETACH",
	sqlite3.SQLITE_ALTER_TABLE:         "ALTER_TABLE",
	sqlite3.SQLITE_REINDEX:             "REINDEX",
	sqlite3.SQLITE_ANALYZE:             "ANALYZE",
	sqlite3.SQLITE_CREATE_VTABLE:       "CREATE_VTABLE",
	sqlite3.SQLITE_DROP_VTABLE:         "DROP_VTABLE",
	sqlite3.SQLITE_FUNCTION:            "FUNCTION",
	sqlite3.SQLITE_SAVEPOINT:           "SAVEPOINT",
}

// WriteActions are actions that modify the database and should be denied for read_only users
var WriteActions = map[int]bool{
	sqlite3.SQLITE_CREATE_INDEX:        true,
	sqlite3.SQLITE_CREATE_TABLE:        true,
	sqlite3.SQLITE_CREATE_TEMP_INDEX:   true,
	sqlite3.SQLITE_CREATE_TEMP_TABLE:   true,
	sqlite3.SQLITE_CREATE_TEMP_TRIGGER: true,
	sqlite3.SQLITE_CREATE_TEMP_VIEW:    true,
	sqlite3.SQLITE_CREATE_TRIGGER:      true,
	sqlite3.SQLITE_CREATE_VIEW:         true,
	sqlite3.SQLITE_DELETE:              true,
	sqlite3.SQLITE_DROP_INDEX:          true,
	sqlite3.SQLITE_DROP_TABLE:          true,
	sqlite3.SQLITE_DROP_TEMP_INDEX:     true,
	sqlite3.SQLITE_DROP_TEMP_TABLE:     true,
	sqlite3.SQLITE_DROP_TEMP_TRIGGER:   true,
	sqlite3.SQLITE_DROP_TEMP_VIEW:      true,
	sqlite3.SQLITE_DROP_TRIGGER:        true,
	sqlite3.SQLITE_DROP_VIEW:           true,
	sqlite3.SQLITE_INSERT:              true,
	sqlite3.SQLITE_UPDATE:              true,
	sqlite3.SQLITE_ALTER_TABLE:         true,
	sqlite3.SQLITE_CREATE_VTABLE:       true,
	sqlite3.SQLITE_DROP_VTABLE:         true,
	sqlite3.SQLITE_REINDEX:             true,
}

// ReadOnlyAuthorizer returns an authorizer callback that denies all write operations.
// This is used to enforce read-only access at the SQLite engine level.
// The function signature matches what RegisterAuthorizer expects.
func ReadOnlyAuthorizer(action int, arg1, arg2, arg3, arg4 string) int {
	// Check if this action modifies data
	if WriteActions[action] {
		return sqlite3.SQLITE_DENY
	}
	// Allow all read operations
	return sqlite3.SQLITE_OK
}
