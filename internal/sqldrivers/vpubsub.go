//go:build sqlite_vtable
// +build sqlite_vtable

package sqldrivers

import (
	"database/sql"
	"fmt"
	"io"
	"runtime"
	"sqlite-server/internal/pubsub"
	"time"

	"github.com/mattn/go-sqlite3"
)

// vpubsubModule implements the sqlite3.Module interface for Pub/Sub.
// It acts as the factory for creating virtual table instances tied to a specific database.
type vpubsubModule struct {
	broker       *pubsub.Broker
	databaseName string
}

// NewVPubSubModule creates a new virtual table module instance.
func NewVPubSubModule(broker *pubsub.Broker, databaseName string) sqlite3.Module {
	return &vpubsubModule{broker: broker, databaseName: databaseName}
}

// registerVPubSub registers the vpubsub virtual table with the given connection.
func registerVPubSub(conn *sqlite3.SQLiteConn, databaseName string) {
	if GlobalBroker != nil {
		conn.CreateModule("vpubsub", NewVPubSubModule(GlobalBroker, databaseName))
	}
}

func (vtabModule *vpubsubModule) Create(sqliteConn *sqlite3.SQLiteConn, args []string) (sqlite3.VTab, error) {
	if sqliteConn != nil {
		err := sqliteConn.DeclareVTab("CREATE TABLE x(id INTEGER PRIMARY KEY, channel TEXT, payload TEXT, created_at TEXT)")
		if err != nil {
			return nil, err
		}
	}
	return &vpubsubTable{broker: vtabModule.broker, databaseName: vtabModule.databaseName}, nil
}

func (vtabModule *vpubsubModule) Connect(sqliteConn *sqlite3.SQLiteConn, args []string) (sqlite3.VTab, error) {
	return vtabModule.Create(sqliteConn, args)
}

func (vtabModule *vpubsubModule) DestroyModule() {
	runtime.KeepAlive(vtabModule)
}

// vpubsubTable represents a specific instance of the 'vpubsub' virtual table.
// It handles schema definition, index selection, and DML operations.
type vpubsubTable struct {
	broker              *pubsub.Broker
	databaseName        string
	isTransactionActive bool
	pendingMessages     []pubsub.MsgPayload
}

// Begin is called when SQLite starts a transaction involving this virtual table.
func (vtab *vpubsubTable) Begin() error {
	vtab.isTransactionActive = true
	// Pre-allocate for performance, though it will grow if needed
	if vtab.pendingMessages == nil {
		vtab.pendingMessages = make([]pubsub.MsgPayload, 0, 1000)
	} else {
		vtab.pendingMessages = vtab.pendingMessages[:0]
	}
	return nil
}

// Sync is called just before Commit (part of the VTabTransaction interface).
func (vtab *vpubsubTable) Sync() error {
	return nil
}

// Commit is called when the SQLite transaction successfully commits.
func (vtab *vpubsubTable) Commit() error {
	vtab.isTransactionActive = false
	if len(vtab.pendingMessages) > 0 {
		publishedIDs := vtab.broker.Publish(vtab.databaseName, vtab.pendingMessages)
		if len(publishedIDs) != len(vtab.pendingMessages) {
			return fmt.Errorf("vpubsub: failed to publish all buffered messages")
		}
		vtab.pendingMessages = vtab.pendingMessages[:0] // Clear buffer
	}
	return nil
}

// Rollback is called when the SQLite transaction aborts or rolls back.
func (vtab *vpubsubTable) Rollback() error {
	vtab.isTransactionActive = false
	if vtab.pendingMessages != nil {
		vtab.pendingMessages = vtab.pendingMessages[:0] // Discard buffer
	}
	return nil
}

// BestIndex is called by SQLite to ask the virtual table how to execute a query.
// Currently, it only supports full table scans without specific index optimizations.
func (vtab *vpubsubTable) BestIndex(constraints []sqlite3.InfoConstraint, orderBys []sqlite3.InfoOrderBy) (*sqlite3.IndexResult, error) {
	used := make([]bool, len(constraints))
	return &sqlite3.IndexResult{
		IdxNum: 0,
		IdxStr: "default",
		Used:   used,
	}, nil
}

func (vtab *vpubsubTable) Open() (sqlite3.VTabCursor, error) {
	return &vpubsubCursor{vtab: vtab}, nil
}

// Insert handles INSERT operations on the virtual table.
// If inside a transaction, it buffers messages in memory for extreme batching performance.
// If no transaction is active, it falls back to immediate publishing.
func (vtab *vpubsubTable) Insert(id any, queryValues []any) (int64, error) {
	if len(queryValues) < 3 {
		return 0, fmt.Errorf("vpubsub: channel and payload are required")
	}

	channelName, ok1 := queryValues[1].(string)
	messagePayload, ok2 := queryValues[2].(string)

	if !ok1 || !ok2 {
		return 0, fmt.Errorf("vpubsub: channel and payload must be text")
	}

	msg := pubsub.MsgPayload{Channel: channelName, Payload: messagePayload}

	// Optional created_at (index 3)
	if len(queryValues) >= 4 && queryValues[3] != nil {
		if caStr, ok := queryValues[3].(string); ok && caStr != "" {
			// RFC3339 or simple date strings usually work.
			// SQLite CURRENT_TIMESTAMP is "YYYY-MM-DD HH:MM:SS"
			t, err := time.Parse("2006-01-02 15:04:05", caStr)
			if err != nil {
				// Try RFC3339
				t, err = time.Parse(time.RFC3339, caStr)
			}
			if err == nil {
				msg.CreatedAt = t
			}
		}
	}

	if vtab.isTransactionActive {
		vtab.pendingMessages = append(vtab.pendingMessages, msg)
		// Sync limit to prevent excessive memory usage during massive bulk inserts
		if len(vtab.pendingMessages) >= 1000 {
			publishedIDs := vtab.broker.Publish(vtab.databaseName, vtab.pendingMessages)
			if len(publishedIDs) == 0 {
				return 0, fmt.Errorf("vpubsub: failed to publish sync limit batch")
			}
			vtab.pendingMessages = vtab.pendingMessages[:0]
		}
		return 0, nil // Virtual row ID generated by SQLite internally if 0
	}

	// Fallback to strict latency mode (no active transaction)
	publishedIDs := vtab.broker.Publish(vtab.databaseName, []pubsub.MsgPayload{msg})
	if len(publishedIDs) == 0 {
		return 0, fmt.Errorf("vpubsub: failed to publish message")
	}
	return publishedIDs[0], nil
}

func (table *vpubsubTable) Update(id any, queryValues []any) error {
	return fmt.Errorf("vpubsub: UPDATE not supported")
}

func (vtab *vpubsubTable) Delete(id any) error {
	return fmt.Errorf("vpubsub: DELETE not supported")
}

func (vtab *vpubsubTable) Disconnect() error { return nil }
func (vtab *vpubsubTable) Destroy() error    { return nil }

// vpubsubCursor iterates over the results of a SELECT query against the virtual table.
// It translates the pure SQL reads into database queries against the centralized broker DB.
type vpubsubCursor struct {
	vtab       *vpubsubTable
	sqlRows    *sql.Rows
	queryError error
	isEOF      bool
	currentMsg pubsub.MsgPayload
}

// Filter is called to initialize a scan. It executes the underlying query
// against the centralized broker database using standard SQL.
func (vtabCursor *vpubsubCursor) Filter(idxNum int, idxStr string, vals []any) error {
	// Simple scan of all messages for this database from the broker DB.
	rows, err := vtabCursor.vtab.broker.GetDB().Query("SELECT id, channel, payload, created_at FROM messages WHERE db_source = ? ORDER BY id ASC", vtabCursor.vtab.databaseName)
	if err != nil {
		return err
	}
	vtabCursor.sqlRows = rows
	vtabCursor.isEOF = false
	return vtabCursor.Next()
}

func (vtabCursor *vpubsubCursor) Next() error {
	if vtabCursor.sqlRows.Next() {
		return vtabCursor.sqlRows.Scan(&vtabCursor.currentMsg.ID, &vtabCursor.currentMsg.Channel, &vtabCursor.currentMsg.Payload, &vtabCursor.currentMsg.CreatedAt)
	}
	vtabCursor.isEOF = true
	vtabCursor.queryError = vtabCursor.sqlRows.Err()
	if vtabCursor.queryError == nil {
		vtabCursor.queryError = io.EOF
	}
	return vtabCursor.sqlRows.Close()
}

func (vtabCursor *vpubsubCursor) EOF() bool {
	return vtabCursor.isEOF
}

func (vtabCursor *vpubsubCursor) Column(c *sqlite3.SQLiteContext, col int) error {
	switch col {
	case 0:
		c.ResultInt64(vtabCursor.currentMsg.ID)
	case 1:
		c.ResultText(vtabCursor.currentMsg.Channel)
	case 2:
		c.ResultText(vtabCursor.currentMsg.Payload)
	case 3:
		c.ResultText(vtabCursor.currentMsg.CreatedAt.Format("2006-01-02 15:04:05"))
	}
	return nil
}

func (vtabCursor *vpubsubCursor) Rowid() (int64, error) {
	return vtabCursor.currentMsg.ID, nil
}

func (vtabCursor *vpubsubCursor) Close() error {
	if vtabCursor.sqlRows != nil {
		return vtabCursor.sqlRows.Close()
	}
	return nil
}
