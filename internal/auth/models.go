package auth

import (
	"time"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
)

type User struct {
	ID           int64     `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"` // Never export hash
	Role         sqlrpcv1.Role `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type ApiKey struct {
	ID        string    `json:"id"` // UUID v7
	UserID    int64     `json:"user_id"`
	KeyPrefix string    `json:"key_prefix"`
	KeyHash   string    `json:"-"`
	Name      string    `json:"name"`
	ExpiresAt time.Time `json:"expires_at"` // Zero if never
	CreatedAt time.Time `json:"created_at"`
}
