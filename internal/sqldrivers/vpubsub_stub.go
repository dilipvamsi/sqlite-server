//go:build !sqlite_vtable
// +build !sqlite_vtable

package sqldrivers

import (
	"github.com/mattn/go-sqlite3"
)

// registerVPubSub is a no-op when the sqlite_vtable tag is not present.
func registerVPubSub(conn *sqlite3.SQLiteConn, databaseName string) {}
