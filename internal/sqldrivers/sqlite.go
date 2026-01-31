package sqldrivers

import (
	"database/sql"
	"fmt"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/mattn/go-sqlite3"
	_ "github.com/mattn/go-sqlite3"

	dbv1 "sqlite-server/internal/protos/db/v1"
)

var (
	registeredDrivers   = make(map[string]bool)
	registeredDriversMu sync.Mutex
)

// const BuildType = "std"

func NewSqliteDb(config *dbv1.DatabaseConfig, readOnlySecured bool) (*sql.DB, error) {
	// Resolve absolute path to avoid issues with relative paths in URI mode (file:...) via CGO
	// Skip for in-memory databases and pre-formatted URIs.
	if config.DbPath != ":memory:" && !strings.HasPrefix(config.DbPath, "file:") {
		absPath, err := filepath.Abs(config.DbPath)
		if err == nil {
			config.DbPath = absPath
		}
	}

	// Construct the Data Source Name (DSN)
	var dsn string
	if strings.HasPrefix(config.DbPath, "file:") {
		dsn = config.DbPath
	} else {
		dsn = fmt.Sprintf("file:%s", config.DbPath)
	}

	// Helper to append params safely
	addParam := func(key, val string) {
		sep := "?"
		if strings.Contains(dsn, "?") {
			sep = "&"
		}
		dsn += fmt.Sprintf("%s%s=%s", sep, key, val)
	}

	addParam("_journal", "WAL")
	addParam("_busy_timeout", "10000")
	addParam("_foreign_keys", "on")

	if config.IsEncrypted {
		key := config.Key
		if key == "" {
			key = DefaultEncryptionKey
		}
		dsn += fmt.Sprintf("&_key=%s", key)
	}

	// Handle Read-Only mode
	if config.ReadOnly || readOnlySecured {
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
	if len(config.Extensions) > 0 || readOnlySecured {
		// Generate a unique driver name for this specific DB configuration to avoid collisions.
		// e.g., "sqlite3_ext_primary_db" or "sqlite3_ext_primary_db_ro"
		suffix := ""
		if readOnlySecured {
			suffix = "_ro"
		}
		driverName = fmt.Sprintf("sqlite3_ext_%s%s", config.Name, suffix)

		// Register the custom driver ONLY if it hasn't been registered yet.
		registeredDriversMu.Lock()
		if !registeredDrivers[driverName] {
			sql.Register(driverName, &sqlite3.SQLiteDriver{
				Extensions: config.Extensions,
				ConnectHook: func(conn *sqlite3.SQLiteConn) error {
					if readOnlySecured {
						// Register Authorizer to deny writes
						conn.RegisterAuthorizer(func(action int, arg1, arg2, arg3 string) int {
							return ReadOnlyAuthorizer(action, arg1, arg2, arg3, "")
						})
					}
					return nil
				},
			})
			registeredDrivers[driverName] = true
		}
		registeredDriversMu.Unlock()
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
		db.SetMaxOpenConns(int(config.MaxOpenConns))
	}
	if config.MaxIdleConns > 0 {
		db.SetMaxIdleConns(int(config.MaxIdleConns))
	}
	if config.ConnMaxLifetimeMs > 0 {
		db.SetConnMaxLifetime(time.Duration(config.ConnMaxLifetimeMs) * time.Millisecond)
	}
	return db, nil
}
