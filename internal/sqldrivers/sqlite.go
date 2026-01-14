package sqldrivers

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/mattn/go-sqlite3"
	_ "github.com/mattn/go-sqlite3"
)

// const BuildType = "std"

func NewSqliteDb(config DBConfig) (*sql.DB, error) {
	// Construct the Data Source Name (DSN) with production-ready parameters.
	// - _journal=WAL: Enables Write-Ahead Logging for vastly improved concurrency.
	//   It allows multiple readers to operate while a single writer is active.
	// - _busy_timeout=10000: Tells SQLite to wait up to 10000ms (10 seconds) if the
	//   database is locked by another write operation, instead of failing immediately.
	//   This makes the server resilient to short bursts of write contention.
	// _foreign_keys=on: Ensures that INSERT/UPDATE checks constraints immediately.
	dsn := fmt.Sprintf("file:%s?_journal=WAL&_busy_timeout=10000&_foreign_keys=on", config.DBPath)

	if config.IsEncrypted {
		key := config.Key
		if key == "" {
			key = DefaultEncryptionKey
		}
		dsn += fmt.Sprintf("&_key=%s", key)
	}

	// Handle Read-Only mode
	if config.ReadOnly {
		// mode=ro forces the connection to be read-only.
		dsn += "&mode=ro"
	}

	// Determine which driver to use.
	// Default is the standard "sqlite3" driver registered by the init() of the library.
	driverName := "sqlite3"

	// Handle Extensions
	// If extensions are specified, we must create and register a unique driver instance
	// for this database configuration because extensions are a property of the driver/connection,
	// not just the DSN.
	if len(config.Extensions) > 0 {
		// Generate a unique driver name for this specific DB configuration to avoid collisions.
		// e.g., "sqlite3_ext_primary_db"
		driverName = fmt.Sprintf("sqlite3_ext_%s", config.Name)

		// Register the custom driver
		sql.Register(driverName, &sqlite3.SQLiteDriver{
			Extensions: config.Extensions,
		})
	}

	// Loop over the map and append to DSN
	for key, val := range config.Pragmas {
		dsn += fmt.Sprintf("&_%s=%s", key, val)
	}

	// Open the database using the resolved driver name.
	db, err := sql.Open(driverName, dsn)
	if err != nil {
		return nil, err
	}

	// Apply Pool Settings
	if config.MaxOpenConns > 0 {
		db.SetMaxOpenConns(config.MaxOpenConns)
	}
	if config.MaxIdleConns > 0 {
		db.SetMaxIdleConns(config.MaxIdleConns)
	}
	if config.ConnMaxLifetimeMs > 0 {
		db.SetConnMaxLifetime(time.Duration(config.ConnMaxLifetimeMs) * time.Millisecond)
	}
	return db, nil
}
