package sqldrivers

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/mattn/go-sqlite3"

	"sqlite-server/internal/extensions"
	dbv1 "sqlite-server/internal/protos/db/v1"
)

var (
	registeredDrivers   = make(map[string]bool)
	registeredDriversMu sync.Mutex
)

// const BuildType = "std"

// AttachmentInfo represents a resolved database attachment.
type AttachmentInfo struct {
	Alias    string
	Path     string
	Key      string
	ReadOnly bool
}

func NewSqliteDb(config *dbv1.DatabaseConfig, readOnlySecured bool) (*sql.DB, error) {
	return NewSqliteDbWithAttachments(config, readOnlySecured, nil)
}

func NewSqliteDbWithAttachments(config *dbv1.DatabaseConfig, readOnlySecured bool, attachments []AttachmentInfo) (*sql.DB, error) {
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

	// Handle Extensions or InitCommands
	// If extensions are specified OR InitCommands are present, we must create and register a unique driver instance
	// for this database configuration because these are properties of the driver/connection,
	// not just the DSN.
	if len(config.Extensions) > 0 || readOnlySecured || len(config.InitCommands) > 0 || len(attachments) > 0 {
		// Generate a unique driver name for this specific DB configuration to avoid collisions.
		suffix := ""
		if readOnlySecured {
			suffix = "_ro"
		}
		// Use UnixNano to ensure unique driver registration for fresh ConnectHook on every reload
		driverName = fmt.Sprintf("sqlite3_ext_%s%s_%d", config.Name, suffix, time.Now().UnixNano())

		// Resolve Extensions
		var resolvedExtensions []string
		for _, ext := range config.Extensions {
			if filepath.IsAbs(ext) {
				resolvedExtensions = append(resolvedExtensions, ext)
			} else {
				// Try to resolve as a managed extension first
				absPath, err := extensions.ResolveExtensionPath(ext)
				if err == nil {
					resolvedExtensions = append(resolvedExtensions, absPath)
				} else {
					// Fallback to relative path from SQLITE_SERVER_EXTENSIONS dir as before
					extDir := os.Getenv("SQLITE_SERVER_EXTENSIONS")
					if extDir == "" {
						extDir = "./extensions"
					}
					resolvedExtensions = append(resolvedExtensions, filepath.Join(extDir, ext))
				}
			}
		}

		// Register the custom driver ONLY if it hasn't been registered yet.
		registeredDriversMu.Lock()
		if !registeredDrivers[driverName] {
			sql.Register(driverName, &sqlite3.SQLiteDriver{
				Extensions: resolvedExtensions,
				ConnectHook: func(conn *sqlite3.SQLiteConn) error {
					if readOnlySecured {
						// Register Authorizer to deny writes
						conn.RegisterAuthorizer(func(action int, arg1, arg2, arg3 string) int {
							return ReadOnlyAuthorizer(action, arg1, arg2, arg3, "")
						})
					}

					// Execute Init Commands (e.g., PRAGMA)
					for _, cmd := range config.InitCommands {
						if _, err := conn.Exec(cmd, nil); err != nil {
							return fmt.Errorf("failed to execute init command '%s': %w", cmd, err)
						}
					}

					// Attach additional databases
					for _, adb := range attachments {
						path := adb.Path
						// Skip for in-memory databases and pre-formatted URIs.
						if adb.Path != ":memory:" && !strings.HasPrefix(adb.Path, "file:") {
							absPath, err := filepath.Abs(adb.Path)
							if err == nil {
								path = absPath
							}
						}

						// Construct URI if not already one
						var dsn string
						if strings.HasPrefix(path, "file:") {
							dsn = path
						} else {
							dsn = fmt.Sprintf("file:%s", path)
						}

						// Force mode=ro if main connection is RO or adb is marked RO
						if readOnlySecured || adb.ReadOnly {
							sep := "?"
							if strings.Contains(dsn, "?") {
								sep = "&"
							}
							dsn += sep + "mode=ro"
						}

						// Handle Encryption
						if adb.Key != "" {
							sep := "?"
							if strings.Contains(dsn, "?") {
								sep = "&"
							}
							dsn += sep + "_key=" + adb.Key
						}

						attachCmd := fmt.Sprintf("ATTACH DATABASE '%s' AS '%s'", dsn, adb.Alias)
						if _, err := conn.Exec(attachCmd, []driver.Value{}); err != nil {
							return fmt.Errorf("failed to attach database '%s' (%s): %w", adb.Alias, adb.Path, err)
						}
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
