-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- bcrypt hash
    role TEXT NOT NULL CHECK(role IN ('admin', 'read_write', 'read_only')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_prefix TEXT NOT NULL, -- First few chars for identification
    key_hash TEXT UNIQUE NOT NULL, -- sha256 hash of the full token
    name TEXT, -- Description
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create a partial index for active keys if needed, but simple index is fine.
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
