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

	_ "github.com/mattn/go-sqlite3"
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

// UserClaims represents the identity of an authenticated user
type UserClaims struct {
	UserID   int64
	Username string
	Role     string
}

// ValidateUser checks username and password. Returns UserClaims if valid.
func (s *MetaStore) ValidateUser(ctx context.Context, username, password string) (*UserClaims, error) {
	var id int64
	var hash string
	var role string

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
		Role:     role,
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
	`, "admin", passwordHash, RoleAdmin)

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
func (s *MetaStore) CreateUser(ctx context.Context, username, password, role string) (int64, error) {
	// Validate role
	if role != RoleAdmin && role != RoleReadWrite && role != RoleReadOnly {
		return 0, fmt.Errorf("invalid role: %s", role)
	}

	// Hash password (fast SHA256+salt)
	passwordHash := hashPassword(password)

	result, err := s.db.ExecContext(ctx, `
		INSERT INTO users (username, password_hash, role)
		VALUES (?, ?, ?)
	`, username, passwordHash, role)
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
	err := s.db.QueryRowContext(ctx, `
		SELECT id, username, password_hash, role, created_at, updated_at
		FROM users WHERE username = ?
	`, username).Scan(&user.ID, &user.Username, &user.PasswordHash, &user.Role, &user.CreatedAt, &user.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// ============================================================================
// API Key Operations
// ============================================================================

// CreateApiKey generates a new API key for a user
// Returns the raw key (only shown once) and the key ID
func (s *MetaStore) CreateApiKey(ctx context.Context, userID int64, name string, expiresAt *time.Time) (string, int64, error) {
	// Generate random key
	rawKey := "sk_" + generateRandomPassword(32)

	// Store hash of key
	hash := sha256.Sum256([]byte(rawKey))
	keyHash := hex.EncodeToString(hash[:])

	// Prefix for identification
	prefix := rawKey[:10]

	var expiresAtStr interface{}
	if expiresAt != nil {
		expiresAtStr = expiresAt.Format(time.RFC3339)
	}

	result, err := s.db.ExecContext(ctx, `
		INSERT INTO api_keys (user_id, key_prefix, key_hash, name, expires_at)
		VALUES (?, ?, ?, ?, ?)
	`, userID, prefix, keyHash, name, expiresAtStr)
	if err != nil {
		return "", 0, fmt.Errorf("failed to create api key: %w", err)
	}

	keyID, _ := result.LastInsertId()
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

// RevokeApiKey deletes an API key
func (s *MetaStore) RevokeApiKey(ctx context.Context, keyID int64) error {
	result, err := s.db.ExecContext(ctx, "DELETE FROM api_keys WHERE id = ?", keyID)
	if err != nil {
		return fmt.Errorf("failed to revoke api key: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("api key not found: %d", keyID)
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
	var username, role string
	err = s.db.QueryRowContext(ctx, `
		SELECT username, role FROM users WHERE id = ?
	`, userID).Scan(&username, &role)
	if err != nil {
		return nil, err
	}

	return &UserClaims{
		UserID:   userID,
		Username: username,
		Role:     role,
	}, nil
}
