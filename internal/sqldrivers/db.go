package sqldrivers

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
)

const DefaultEncryptionKey = "4ddd9418-1589-4887-a5b0-ad518bd764dd"

/**
 * @struct DBConfig
 * @description Models a single database configuration entry from the `config.json` file.
 * This struct provides a type-safe, in-memory representation of a database's logical
 * name and its corresponding file path on disk. Using a struct allows Go's `json`
 * package to unmarshal the configuration file directly and safely into these objects.
 */
type DBConfig struct {
	// Name is the logical identifier for the database that clients will use in their requests.
	// For example: "primary_db", "user_profiles".
	Name string
	// DBPath is the file system path to the SQLite database file.
	// For example: "./primary.db".
	DBPath string
	// Is Db encrypted by default it will be considered as unercypted
	IsEncrypted bool
	// Key for sql cipher
	// If key is not provided then it will use default value.
	Key string
	// ReadOnly opens the database in read-only mode (mode=ro).
	ReadOnly bool `json:"readOnly"`
	// Extensions is a list of paths to shared library extensions to load (.so, .dll, .dylib).
	Extensions []string `json:"extensions"`
	// Pragmas allows passing arbitrary key-value pairs to the DSN.
	// Example: {"synchronous": "NORMAL", "cache_size": "-2000"}
	Pragmas map[string]string `json:"pragmas"`

	// MaxOpenConns limits the number of open physical connections.
	// Recommended: 1 for strictly serial, or higher for concurrent reads (WAL).
	MaxOpenConns int `json:"maxOpenConns"`
	// MaxIdleConns limits how many connections wait in the pool.
	MaxIdleConns int `json:"maxIdleConns"`
	// ConnMaxLifetimeMs sets how long a connection can be reused before closing (prevents stale connections).
	ConnMaxLifetimeMs int `json:"connMaxLifetimeMs"`
}

/**
 * @function LoadJsonDBConfigs
 * @description A helper function that encapsulates the logic for loading and parsing the
 * database configuration file. It follows the single-responsibility principle by separating
 * the concern of configuration loading from the concern of server setup and initialization.
 * @param {string} filename - The path to the JSON configuration file.
 * @returns {[]DBConfig} A slice of database configurations if successful.
 * @returns {error} An error if the file cannot be read, cannot be parsed as JSON, or contains no configurations.
 */
func LoadJsonDBConfigs(filename string) ([]DBConfig, error) {
	// Read the entire configuration file from disk.
	data, err := os.ReadFile(filename)
	if err != nil {
		// Return a wrapped error for better context if file reading fails.
		return nil, fmt.Errorf("could not read config file '%s': %w", filename, err)
	}

	var configs []DBConfig
	// Unmarshal the JSON data into the slice of DBConfig structs. The `json` package
	// automatically matches the JSON keys ("name", "dbPath") to the struct fields.
	if err := json.Unmarshal(data, &configs); err != nil {
		return nil, fmt.Errorf("could not parse JSON from config file '%s': %w", filename, err)
	}

	// It's a critical error if the configuration file is valid JSON but empty.
	// The server would have no databases to manage, so we fail fast.
	if len(configs) == 0 {
		return nil, errors.New("no databases found in config file")
	}

	return configs, nil
}
