package auth

import "time"

// Role constants
const (
	RoleAdmin     = "admin"
	RoleReadWrite = "read_write"
	RoleReadOnly  = "read_only"
)

type User struct {
	ID           int64     `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"` // Never export hash
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type ApiKey struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	KeyPrefix string    `json:"key_prefix"`
	KeyHash   string    `json:"-"`
	Name      string    `json:"name"`
	ExpiresAt time.Time `json:"expires_at"` // Zero if never
	CreatedAt time.Time `json:"created_at"`
}
