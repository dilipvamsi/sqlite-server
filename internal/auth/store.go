package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	_ "embed"
	"encoding/hex"
	"fmt"
	"log"
	"math/big"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"

	dbv1 "sqlite-server/internal/protos/db/v1"
)

// hashPassword creates a salted SHA256 hash of the password
// Format: salt:hash (both hex encoded)
func hashPassword(password string) string {
	salt := make([]byte, 16)
	rand.Read(salt)
	saltHex := hex.EncodeToString(salt)

	hash := sha256.Sum256([]byte(saltHex + password))
	hashHex := hex.EncodeToString(hash[:])

	return saltHex + ":" + hashHex
}

// verifyPassword checks if password matches the stored hash
func verifyPassword(storedHash, password string) bool {
	parts := strings.SplitN(storedHash, ":", 2)
	if len(parts) != 2 {
		return false
	}
	saltHex, expectedHash := parts[0], parts[1]

	hash := sha256.Sum256([]byte(saltHex + password))
	actualHash := hex.EncodeToString(hash[:])

	return actualHash == expectedHash
}

//go:embed schema.sql
var schemaSQL string

type MetaStore struct {
	db *sql.DB
}

// DatabaseConfig represents a persisted database configuration
type DatabaseConfig struct {
	ID        int64
	Name      string
	Path      string
	IsManaged bool
	Settings  string
	CreatedAt time.Time
}

// UserClaims represents the identity of an authenticated user
type UserClaims struct {
	UserID   int64
	Username string
	Role     dbv1.Role
}

// dbRole is the string representation of a role in the database
type dbRole string

// Role string constants for database storage
const (
	dbRoleAdmin           dbRole = "admin"
	dbRoleDatabaseManager dbRole = "database_manager"
	dbRoleReadWrite       dbRole = "read_write"
	dbRoleReadOnly        dbRole = "read_only"
	dbRoleUnspecified     dbRole = "unspecified"
)

// Helper to convert DB string to Enum
func ParseRole(roleStr dbRole) dbv1.Role {
	switch roleStr {
	case dbRoleAdmin:
		return dbv1.Role_ROLE_ADMIN
	case dbRoleDatabaseManager:
		return dbv1.Role_ROLE_DATABASE_MANAGER
	case dbRoleReadWrite:
		return dbv1.Role_ROLE_READ_WRITE
	case dbRoleReadOnly:
		return dbv1.Role_ROLE_READ_ONLY
	default:
		return dbv1.Role_ROLE_UNSPECIFIED
	}
}

// Helper to convert Enum to DB string
func FormatRole(role dbv1.Role) dbRole {
	switch role {
	case dbv1.Role_ROLE_ADMIN:
		return dbRoleAdmin
	case dbv1.Role_ROLE_DATABASE_MANAGER:
		return dbRoleDatabaseManager
	case dbv1.Role_ROLE_READ_WRITE:
		return dbRoleReadWrite
	case dbv1.Role_ROLE_READ_ONLY:
		return dbRoleReadOnly
	default:
		return dbRoleUnspecified
	}
}

// ValidateUser checks username and password. Returns UserClaims if valid.
func (s *MetaStore) ValidateUser(ctx context.Context, username, password string) (*UserClaims, error) {
	var id int64
	var hash string
	var role dbRole

	err := s.db.QueryRowContext(ctx, "SELECT id, password_hash, role FROM users WHERE username = ?", username).Scan(&id, &hash, &role)
	if err == sql.ErrNoRows {
		return nil, nil // Invalid user
	}
	if err != nil {
		return nil, err
	}

	// Compare Hash (fast SHA256)
	if !verifyPassword(hash, password) {
		return nil, nil // Invalid password
	}

	return &UserClaims{
		UserID:   id,
		Username: username,
		Role:     ParseRole(role),
	}, nil
}

// ValidateApiKey checks the bearer token. Returns UserClaims if valid.
// Note: We hash the incoming token to match the stored hash.
func (s *MetaStore) ValidateApiKey(ctx context.Context, token string) (*UserClaims, error) {
	// TODO: Implement SHA256 hashing of token here when we implement key creation.
	// For now, we assume direct comparison for scaffolding (or unimplemented).
	// Real implementation requires hashing the input `token` then querying `api_keys`.
	return nil, fmt.Errorf("api key auth not implemented yet")
}

// NewMetaStore initializes the authorization metadata database.
// It automatically applies the schema if tables do not exist.
func NewMetaStore(dbPath string) (*MetaStore, error) {
	// Use WAL mode for better concurrency
	dsn := fmt.Sprintf("file:%s?_journal=WAL&_busy_timeout=5000&_foreign_keys=on", dbPath)
	db, err := sql.Open("sqlite3", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open meta db: %w", err)
	}

	// Verify connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping meta db: %w", err)
	}

	store := &MetaStore{db: db}
	if err := store.migrate(); err != nil {
		db.Close()
		return nil, err
	}

	return store, nil
}

func (s *MetaStore) migrate() error {
	_, err := s.db.Exec(schemaSQL)
	if err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}
	return nil
}

func (s *MetaStore) Close() error {
	return s.db.Close()
}

// GetDB returns the underlying sql.DB (useful for testing or advanced usage)
func (s *MetaStore) GetDB() *sql.DB {
	return s.db
}

// EnsureDefaultAdmin creates an admin user if no users exist.
// Returns the password used (either from env or generated).
func (s *MetaStore) EnsureDefaultAdmin() (string, error) {
	var count int
	err := s.db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)
	if err != nil {
		return "", err
	}

	if count > 0 {
		return "", nil // Users exist, no action needed
	}

	// No users, create admin
	password := os.Getenv("SQLITE_SERVER_ADMIN_PASSWORD")
	generated := false
	if password == "" {
		password = generateRandomPassword(16)
		generated = true
	}

	// Hash the password (fast SHA256+salt)
	passwordHash := hashPassword(password)

	_, err = s.db.Exec(`
		INSERT INTO users (username, password_hash, role)
		VALUES (?, ?, ?)
	`, "admin", passwordHash, dbRoleAdmin)

	if err != nil {
		return "", fmt.Errorf("failed to create admin user: %w", err)
	}

	if generated {
		log.Printf("\n[AUTH] Created default 'admin' user.\n[AUTH] Password: %s\n[AUTH] Please change this immediately!\n", password)
	}

	return password, nil
}

// generateRandomPassword creates a secure random string
func generateRandomPassword(n int) string {
	const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"
	ret := make([]byte, n)
	for i := 0; i < n; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(letters))))
		if err != nil {
			return "admin-fallback-secret" // Should rarely happen
		}
		ret[i] = letters[num.Int64()]
	}
	return string(ret)
}

// ============================================================================
// User CRUD Operations
// ============================================================================

// CreateUser creates a new user with the given credentials
func (s *MetaStore) CreateUser(ctx context.Context, username, password string, role dbv1.Role) (int64, error) {
	// Validate role
	if role == dbv1.Role_ROLE_UNSPECIFIED {
		return 0, fmt.Errorf("invalid role: UNSPECIFIED")
	}

	// Hash password (fast SHA256+salt)
	passwordHash := hashPassword(password)
	roleStr := FormatRole(role)

	result, err := s.db.ExecContext(ctx, `
		INSERT INTO users (username, password_hash, role)
		VALUES (?, ?, ?)
	`, username, passwordHash, roleStr)
	if err != nil {
		return 0, fmt.Errorf("failed to create user: %w", err)
	}

	return result.LastInsertId()
}

// DeleteUser removes a user by username
func (s *MetaStore) DeleteUser(ctx context.Context, username string) error {
	result, err := s.db.ExecContext(ctx, "DELETE FROM users WHERE username = ?", username)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("user not found: %s", username)
	}
	return nil
}

// UpdatePassword changes a user's password
func (s *MetaStore) UpdatePassword(ctx context.Context, username, newPassword string) error {
	// Hash password (fast SHA256+salt)
	passwordHash := hashPassword(newPassword)

	result, err := s.db.ExecContext(ctx, `
		UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
		WHERE username = ?
	`, passwordHash, username)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("user not found: %s", username)
	}
	return nil
}

// GetUserByUsername retrieves a user by username
func (s *MetaStore) GetUserByUsername(ctx context.Context, username string) (*User, error) {
	var user User
	var role dbRole
	err := s.db.QueryRowContext(ctx, `
		SELECT id, username, password_hash, role, created_at, updated_at
		FROM users WHERE username = ?
	`, username).Scan(&user.ID, &user.Username, &user.PasswordHash, &role, &user.CreatedAt, &user.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	user.Role = ParseRole(role)
	return &user, nil
}

// ListUsers retrieves all users
func (s *MetaStore) ListUsers(ctx context.Context) ([]User, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, username, role, created_at
		FROM users ORDER BY id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		var role dbRole
		if err := rows.Scan(&user.ID, &user.Username, &role, &user.CreatedAt); err != nil {
			return nil, err
		}
		user.Role = ParseRole(role)
		users = append(users, user)
	}
	return users, nil
}

// UpdateUserRole updates a user's role
func (s *MetaStore) UpdateUserRole(ctx context.Context, username string, role dbv1.Role) error {
	if role == dbv1.Role_ROLE_UNSPECIFIED {
		return fmt.Errorf("invalid role: UNSPECIFIED")
	}
	roleStr := FormatRole(role)

	result, err := s.db.ExecContext(ctx, `
		UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP
		WHERE username = ?
	`, roleStr, username)
	if err != nil {
		return fmt.Errorf("failed to update user role: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("user not found: %s", username)
	}
	return nil
}

// ============================================================================
// API Key Operations
// ============================================================================

// CreateApiKey generates a new API key for a user
// Returns the raw key (only shown once) and the key ID (UUID v7)
func (s *MetaStore) CreateApiKey(ctx context.Context, userID int64, name string, expiresAt *time.Time) (string, string, error) {
	// Generate UUID v7 for time-sortable, unique key
	uuidV7, err := uuid.NewV7()
	if err != nil {
		return "", "", fmt.Errorf("failed to generate UUID v7: %w", err)
	}
	rawKey := "sk_" + strings.ReplaceAll(uuidV7.String(), "-", "")

	// Generate UUID v7 for the key ID
	keyIDUUID, err := uuid.NewV7()
	if err != nil {
		return "", "", fmt.Errorf("failed to generate key ID UUID v7: %w", err)
	}
	keyID := keyIDUUID.String()

	// Store hash of key
	hash := sha256.Sum256([]byte(rawKey))
	keyHash := hex.EncodeToString(hash[:])

	// Prefix for identification
	prefix := rawKey[:10]

	var expiresAtStr interface{}
	if expiresAt != nil {
		expiresAtStr = expiresAt.Format(time.RFC3339)
	}

	_, err = s.db.ExecContext(ctx, `
		INSERT INTO api_keys (id, user_id, key_prefix, key_hash, name, expires_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`, keyID, userID, prefix, keyHash, name, expiresAtStr)
	if err != nil {
		return "", "", fmt.Errorf("failed to create api key: %w", err)
	}

	return rawKey, keyID, nil
}

// ListApiKeys returns all API keys for a user (without the secret)
func (s *MetaStore) ListApiKeys(ctx context.Context, userID int64) ([]ApiKey, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, user_id, key_prefix, name, expires_at, created_at
		FROM api_keys WHERE user_id = ?
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var keys []ApiKey
	for rows.Next() {
		var key ApiKey
		var expiresAt sql.NullTime
		err := rows.Scan(&key.ID, &key.UserID, &key.KeyPrefix, &key.Name, &expiresAt, &key.CreatedAt)
		if err != nil {
			return nil, err
		}
		if expiresAt.Valid {
			key.ExpiresAt = expiresAt.Time
		}
		keys = append(keys, key)
	}
	return keys, nil
}

// RevokeApiKey deletes an API key.
// If username is provided, it ensures the key belongs to that user.
func (s *MetaStore) RevokeApiKey(ctx context.Context, keyID string, username string) error {
	var result sql.Result
	var err error

	if username != "" {
		result, err = s.db.ExecContext(ctx, `
			DELETE FROM api_keys
			WHERE id = ? AND user_id = (SELECT id FROM users WHERE username = ?)
		`, keyID, username)
	} else {
		result, err = s.db.ExecContext(ctx, "DELETE FROM api_keys WHERE id = ?", keyID)
	}

	if err != nil {
		return fmt.Errorf("failed to revoke api key: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("api key not found: %s", keyID)
	}
	return nil
}

// RevokeAllApiKeysForUser deletes all API keys for a specific user
func (s *MetaStore) RevokeAllApiKeysForUser(ctx context.Context, userID int64) error {
	_, err := s.db.ExecContext(ctx, "DELETE FROM api_keys WHERE user_id = ?", userID)
	if err != nil {
		return fmt.Errorf("failed to revoke api keys for user: %w", err)
	}
	return nil
}

// ValidateApiKey checks the bearer token. Returns UserClaims if valid.
func (s *MetaStore) ValidateApiKeyImpl(ctx context.Context, token string) (*UserClaims, error) {
	// Hash the incoming token
	hash := sha256.Sum256([]byte(token))
	keyHash := hex.EncodeToString(hash[:])

	var userID int64
	var expiresAt sql.NullTime
	err := s.db.QueryRowContext(ctx, `
		SELECT user_id, expires_at FROM api_keys WHERE key_hash = ?
	`, keyHash).Scan(&userID, &expiresAt)
	if err == sql.ErrNoRows {
		return nil, nil // Invalid key
	}
	if err != nil {
		return nil, err
	}

	// Check expiry
	if expiresAt.Valid && expiresAt.Time.Before(time.Now()) {
		return nil, nil // Expired
	}

	// Get user details
	var username string
	var role dbRole
	err = s.db.QueryRowContext(ctx, `
		SELECT username, role FROM users WHERE id = ?
	`, userID).Scan(&username, &role)
	if err != nil {
		return nil, err
	}

	return &UserClaims{
		UserID:   userID,
		Username: username,
		Role:     ParseRole(role),
	}, nil
}

// ============================================================================
// Database Persistence Operations
// ============================================================================

// UpsertDatabaseConfig adds or updates a database configuration.
// If the database already exists, it updates the path and settings.
func (s *MetaStore) UpsertDatabaseConfig(ctx context.Context, name, path string, isManaged bool, settings string) error {
	_, err := s.db.ExecContext(ctx, `
		INSERT INTO databases (name, path, is_managed, settings)
		VALUES (?, ?, ?, ?)
		ON CONFLICT(name) DO UPDATE SET
			path = excluded.path,
			is_managed = excluded.is_managed,
			settings = excluded.settings
	`, name, path, isManaged, settings)
	if err != nil {
		return fmt.Errorf("failed to upsert database config: %w", err)
	}
	return nil
}

// GetDatabaseConfig retrieves a single database configuration by name.
func (s *MetaStore) GetDatabaseConfig(ctx context.Context, name string) (*DatabaseConfig, error) {
	var config DatabaseConfig
	err := s.db.QueryRowContext(ctx, `
		SELECT id, name, path, is_managed, settings, created_at
		FROM databases WHERE name = ?
	`, name).Scan(&config.ID, &config.Name, &config.Path, &config.IsManaged, &config.Settings, &config.CreatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get database config: %w", err)
	}
	return &config, nil
}

// RemoveDatabaseConfig removes a database configuration.
func (s *MetaStore) RemoveDatabaseConfig(ctx context.Context, name string) error {
	_, err := s.db.ExecContext(ctx, "DELETE FROM databases WHERE name = ?", name)
	if err != nil {
		return fmt.Errorf("failed to remove database config: %w", err)
	}
	return nil
}

// ListDatabaseConfigs retrieves all database configurations.
func (s *MetaStore) ListDatabaseConfigs(ctx context.Context) ([]DatabaseConfig, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, name, path, is_managed, settings, created_at
		FROM databases ORDER BY name
	`)
	if err != nil {
		return nil, fmt.Errorf("failed to list database configs: %w", err)
	}
	defer rows.Close()

	var configs []DatabaseConfig
	for rows.Next() {
		var config DatabaseConfig
		if err := rows.Scan(&config.ID, &config.Name, &config.Path, &config.IsManaged, &config.Settings, &config.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan database config: %w", err)
		}
		configs = append(configs, config)
	}
	return configs, nil
}
