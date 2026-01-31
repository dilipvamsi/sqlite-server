# SQLite Server

**SQLite Server** is a production-ready, high-performance gRPC bridge for SQLite. It exposes multiple SQLite database files over a network via a strictly typed, schema-safe API.

It is designed to solve the common limitations of using SQLite in networked architectures by providing connection pooling, safe streaming for large datasets, and hybrid transaction management.

---

## 🚀 Key Features

### 1. Web Studio
A built-in web-based UI for database management:
*   **Query Console:** Execute SQL queries with syntax highlighting and result visualization.
*   **Transaction Console:** Step-by-step interactive transactions with savepoint support.
*   **Database Management:** Create, mount, unmount, and delete databases through the UI.

Access the Studio at `http://localhost:50051/studio/`

### 2. Authentication & Authorization
Secure your server with built-in authentication:
*   **API Key Authentication:** SHA256-hashed API keys for programmatic access.
*   **Basic Auth:** Username/password with salted SHA256 hashing.
*   **Role-Based Access Control:**
    *   `admin`: Full access to all data and system configuration.
    *   `read_write`: Can read and modify data (INSERT, UPDATE, DELETE).
    *   `read_only`: Strictly limits access to `SELECT` queries only. Use this for reporting dashboards or public-facing read replicas. Attempts to write will return a permission error.
*   **Session Management:** UUID v7-based session keys with automatic expiry.

### 3. Hybrid Transaction Models
The service supports two distinct transaction patterns to suit different client needs:
*   **Streaming Transactions (Interactive):** Uses a bidirectional gRPC stream. The TCP connection lifecycle dictates the transaction lifecycle. Perfect for interactive sessions where automatic rollback on disconnect is required.
*   **Unary Transactions (ID-Based):** Uses a token-based system (`transaction_id`). The server maintains an in-memory registry of active transactions with a "Heartbeat" mechanism. Perfect for stateless HTTP/REST clients or long-running workflows.
*   **Atomic Scripts:** Single-call transaction scripts for batch operations.

### 4. "Sparse Hint" Type System
SQLite is dynamically typed, but gRPC/Protobuf is statically typed. To bridge this gap without overhead:
*   Standard values are sent as native JSON/Protobuf types.
*   Ambiguous values (e.g., `BLOB` vs Base64 String, `INT64` vs JSON Number) use a **Sparse Hint** map.
*   The client only provides type hints for specific columns when necessary.

### 5. Safety & Performance
*   **Chunked Streaming:** Large result sets are streamed in batches (default: 500 rows), ensuring constant $O(1)$ memory usage regardless of table size.
*   **Zombie Protection:** A background "Reaper" process automatically rolls back ID-based transactions that have timed out.
*   **Dual Connection Pools:** Maintains separate pools for Read-Write and Read-Only connections, ensuring that `read_only` users are served by strictly read-only connections for enhanced security.
*   **Graceful Shutdown:** Ensures ongoing queries complete and active transactions are rolled back cleanly before the server exits.

### 6. Observability
*   **Request Tracing:** Supports `X-Request-Id` header propagation.
*   **UUIDv7:** Generates time-ordered unique identifiers for all requests, sessions, and API keys.
*   **Error Fidelity:** Maps native C SQLite error codes (e.g., `SQLITE_BUSY`, `SQLITE_CONSTRAINT`) to a Protobuf Enum for programmatic error handling.

### 7. Introspection & Schema
Inspect the database structure programmatically:
*   **Explain:** Get the query plan for performance analysis.
*   **ListTables:** Get a lightweight list of all tables.
*   **GetDatabaseSchema:** Get a full JSON representation of the database schema (tables, columns, indexes, triggers).

### 8. Maintenance & Integrity
Perform essential database maintenance tasks:
*   **Vacuum:** Rebuilds the database file to reclaim space and reduce fragmentation.
*   **Checkpoint:** Forces a WAL checkpoint to sync the write-ahead log to the main database file.
*   **IntegrityCheck:** Runs a quick integrity check to detect corruption.

### 9. Typed API
A strictly typed alternative to the sparse hint system. Instead of generic `ListValue`, it uses specific Protobuf messages for each data type (`TypedQuery`, `TypedTransactionQuery`). This provides better wire efficiency and type safety at the cost of flexibility.

---

## 🏗 Architecture

### Component Diagram

```text
       [ gRPC / HTTP Client ]
                 |
                 | (Query / Stream / Begin)
                 v
+----------------------------------------------------------+
|                 SQLite Server (Process)                  |
|                                                          |
|  +-----------------+          +-----------------------+  |
|  |  gRPC Handler   | Stateful | In-Memory Transaction |  |
|  | (Entry Point)   +--------->|        Registry       |  |
|  +-------+---------+          +----------+------------+  |
|          |                               |               |
|          | Stateless                     | Hold Tx       |
|          |                               v               |
|          |                    +--------------------+     |
|          |                    |   SQL Connection   |     |
|          v                    |       Pools        |     |
|  +-------+---------+          +----------+---------+     |
|  |   Background    |                     |               |
|  |     Reaper      |--- Periodically ----^               |
|  | (Cleanup Task)  |     Scans Registry                  |
|  +-----------------+                                     |
+----------------------------------------------------------+
                 |                     |
                 v                     v
          [(  User.db  )]       [(  Data.db  )]
```

### Flow Explanation:
1.  **Request Entry:** The **Client** communicates via gRPC or HTTP.
2.  **Handling:** The **Handler** decides if a request is:
    *   **Stateless:** Routed directly to the **Pool** for immediate execution.
    *   **Stateful:** Logged in the **In-Memory Registry** to keep the transaction alive across multiple calls.
3.  **Registry & Reaper:** The **Registry** holds onto specific database connections from the **Pool**. The **Reaper** background task constantly checks the registry for "zombie" transactions that have timed out and rolls them back.
4.  **Persistence:** The **Pool** manages the actual file-system handles for various SQLite databases (e.g., `User.db`, `Data.db`).

### The Transaction Registry
For Unary Transactions (`BeginTransaction` -> `TransactionQuery`), the server holds state in memory:
1.  **Begin:** Server creates a `*sql.Tx`, generates a `UUIDv7` ID, and stores it in a thread-safe map.
2.  **Query:** Client sends the ID. Server looks up the `*sql.Tx`, resets the timeout (Heartbeat), and executes the SQL.
3.  **Timeout:** If the client disappears, the background **Reaper** (running every 5s) detects the expired session, calls `Rollback`, and frees memory.

---

## 🛠 Installation & Setup

### Prerequisites
*   Go 1.22+
*   `buf` (for Proto generation)
*   `protoc-gen-go`, `protoc-gen-connect-go`
*   Node.js 18+ (for Studio development)

### 1. Build the Project
The project uses a `Makefile` to automate common tasks.

```bash
# Install all dependencies and build everything (Proto + Studio + Server)
# This is required for the first-time setup as the Studio must be built for the dev server to run.
make studio-install
make build

# Or build specific components:
make gen-proto      # Generate Protobuf code
make studio-build   # Build the Web Studio (requires studio-install first)
make build-dynamic  # Build only the server binary
```

### 2. Configuration (`config.json`)
Create a `config.json` file to define your databases.

```json
[
  {
    "name": "primary",
    "db_path": "./data/primary.db",
    "enable_wal": true,
    "busy_timeout": 5000
  },
  {
    "name": "analytics",
    "db_path": "./data/analytics.db",
    "read_only": true
  }
]
```

### 3. Run the Server
```bash
# Build and run with default config.json
make run

# Fast development run (using go run)
make run-dev

# Quick test with multiple databases and Auth enabled (admin/admin)
make run-load-test-auth-dev

# Run with specific config manually
./bin/sqlite-server.bin my_config.json

# Disable authentication (development only)
SQLITE_SERVER_AUTH_ENABLED=false make run
```

The server listens on `localhost:50051` using HTTP/2 (h2c).

### 4. Access Points
| Endpoint | Description |
| :--- | :--- |
| `http://localhost:50051/` | Landing page with server overview |
| `http://localhost:50051/docs/` | Interactive OpenAPI documentation |
| `http://localhost:50051/studio/` | Web-based database management UI |
| `http://localhost:50051/db.v1.*` | gRPC/Connect API endpoints |

---

## 🔐 Authentication

Authentication is enabled by default. On first run, a default admin user is created:

```
[AUTH] Created default 'admin' user.
[AUTH] Password: <random-password>
[AUTH] Please change this immediately!
```

### Login via API
```bash
curl -X POST http://localhost:50051/db.v1.AdminService/Login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "<password>"}'
```

Response:
```json
{
  "apiKey": "sk_019488b2...",
  "keyId": "019488b2-4e7e-7a27-94b6-...",
  "expiresAt": "2024-02-06T12:00:00Z",
  "user": { "id": "1", "username": "admin", "role": "admin" }
}
```

### Using API Keys
Include the API key in requests:
```bash
curl -X POST http://localhost:50051/db.v1.DatabaseService/Query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_019488b2..." \
  -d '{"database": "primary", "sql": "SELECT 1"}'
```

---

## 📡 API Usage Examples

The API supports **Connect**, **gRPC**, and **gRPC-Web**. You can also use standard HTTP/1.1 POST requests.

### 1. Stateless Query (Unary)
*Best for: Simple point-lookups.*

**POST** `/db.v1.DatabaseService/Query`
```json
{
  "database": "primary",
  "sql": "SELECT name, age FROM users WHERE id = ?",
  "parameters": {
    "positional": [123]
  }
}
```

### 2. Streaming Query (Server Stream)
*Best for: Large datasets, exports.*

**POST** `/db.v1.DatabaseService/QueryStream`
```json
{
  "database": "primary",
  "sql": "SELECT * FROM huge_log_table WHERE created_at > ?",
  "parameters": {
    "positional": ["2023-01-01"]
  }
}
```
*Response:* A stream of messages: `Header` -> `RowBatch` -> `RowBatch` ... -> `Complete`.

### 3. Unary Transaction (ID-Based)
*Best for: HTTP Clients, Logic spanning multiple requests.*

**Step A: Begin**
**POST** `/db.v1.DatabaseService/BeginTransaction`
```json
{ "database": "primary", "timeout": "30s", "mode": "TRANSACTION_MODE_IMMEDIATE" }
```
*Response:* `{ "transaction_id": "018c..." }`

**Step B: Execute**
**POST** `/db.v1.DatabaseService/TransactionQuery`
```json
{
  "transaction_id": "018c...",
  "sql": "INSERT INTO users (name) VALUES (?)",
  "parameters": { "positional": ["Alice"] }
}
```

**Step C: Commit**
**POST** `/db.v1.DatabaseService/CommitTransaction`
```json
{ "transaction_id": "018c..." }
```

### 4. Atomic Transaction Script
*Best for: Batch operations with automatic rollback on failure.*

**POST** `/db.v1.DatabaseService/ExecuteTransaction`
```json
{
  "database": "primary",
  "requests": [
    { "begin": { "mode": "TRANSACTION_MODE_IMMEDIATE" } },
    { "query": { "sql": "INSERT INTO users (name) VALUES (?)", "parameters": { "positional": ["Bob"] } } },
    { "query": { "sql": "UPDATE counters SET value = value + 1" } },
    { "commit": {} }
  ]
}
```

### 5. Interactive Transaction (Bidirectional Stream)
*Best for: High-performance interactive sessions.*

This requires a gRPC or Connect client that supports bidirectional streaming.
1.  Send `BeginRequest`.
2.  Send `TransactionalQueryRequest` (Wait for response).
3.  Send `TransactionalQueryRequest` (Wait for response).
4.  Send `CommitRequest`.

### 6. Explain Query Plan
*Best for: Performance debugging.*

**POST** `/db.v1.DatabaseService/Explain`
```json
{
  "database": "primary",
  "sql": "SELECT * FROM users WHERE email = ?",
  "parameters": { "positional": ["test@example.com"] }
}
```
*Response:* A hierarchical tree of query plan nodes (`ExplainResponse`).

### 7. Maintenance (Vacuum)
*Best for: optimizing storage.*

**POST** `/db.v1.DatabaseService/Vacuum`
```json
{ "database": "primary" }
```

---

## 🧩 The Sparse Hint System

When sending parameters, JSON is often ambiguous. Use hints to ensure data lands in SQLite correctly.

**Example: Sending a BLOB**
In JSON, bytes must be Base64 encoded. You must tell the server to decode it back to bytes.

```json
{
  "sql": "INSERT INTO images (id, raw_data) VALUES (?, ?)",
  "parameters": {
    "positional": [1, "SGVsbG8gV29ybGQ="],
    "positional_hints": {
      "1": "COLUMN_TYPE_BLOB"
    }
  }
}
```

**Supported Hints:**
| Enum | Description |
| :--- | :--- |
| `COLUMN_TYPE_BLOB` | Decodes Base64 String -> Bytes |
| `COLUMN_TYPE_INTEGER` | Casts JSON Float64 -> Int64 |
| `COLUMN_TYPE_DATE` | Passes through as ISO String |

---

## 🎨 Web Studio

The built-in Studio provides a web interface for database management:

### Features
*   **Query Console:** Execute SQL with results displayed in a table format
*   **Transaction Console:** Step-by-step transaction execution with savepoints
*   **Database Selector:** Switch between configured databases
*   **Query History:** Persistent local storage of query history
*   **Dark Theme:** Modern, eye-friendly interface

### Screenshots
Access the Studio at `http://localhost:50051/studio/` after logging in.

---

## 🧪 Testing

### 1. Running Tests
```bash
# Run all unit tests
make test

# Run tests and generate an HTML coverage report
make test-coverage

# Run Studio linting
cd studio && npm run lint
```

### 2. Load Testing (Benchmarks)
The project includes a comprehensive load testing suite to verify performance under high concurrency.

**Setup Test Databases:**
```bash
# Initialize unencrypted test DBs
make build-load-test-setup

# Initialize encrypted (SQLCipher) test DBs
make build-load-test-setup-cipher
```

**Run Server for Load Testing:**
```bash
# Run server with loadtest config (No Auth)
make run-load-test-setup

# Run server with loadtest config (With Auth - admin/admin)
make run-load-test-setup-auth
```

**Run Benchmark Clients:**
```bash
# Build and run all benchmarks
make load-test

# API Key benchmarks (requires 'make setup-apikey' first)
make load-test-apikey

# Basic Auth benchmarks (uses admin/admin)
make load-test-basic
```

---

## ⚠️ Error Handling

Errors are returned with detailed metadata.
*   **HTTP Status / gRPC Code:** Maps broadly (e.g., `400 Bad Request` for Syntax Error).
*   **Detail `ErrorResponse`:** Contains the specific `sqlite_error_code`.

**Example Error Response:**
```json
{
  "code": "invalid_argument",
  "message": "no such table: missing_table",
  "details": [
    {
      "@type": "type.googleapis.com/db.v1.ErrorResponse",
      "message": "no such table: missing_table",
      "failed_sql": "SELECT * FROM missing_table",
      "sqlite_error_code": "SQLITE_CODE_ERROR"
    }
  ]
}
```

---

## 📦 Client Libraries

### JavaScript/TypeScript (Fetch)
```bash
cd clients/js-fetch && npm install
```

### JavaScript/TypeScript (Full)
```bash
cd clients/js && npm install
```

See the `clients/` directory for usage examples and API documentation.

---

## 💻 Development Reference (Makefile)

The `Makefile` is the source of truth for all development workflows. Run `make help` to see all available targets.

### Key Targets:
| Target | Description |
| :--- | :--- |
| `make build` | Full production build (Studio + Binary) |
| `make gen-proto` | Regenerates all Protobuf and enriched OpenAPI code |
| `make run-dev` | Fast-reload server for local development |
| `make test-coverage` | Runs unit tests and generates HTML report |
| `make clean` | Resets the workspace (removes bins, metadata, and test DBs) |
| `make help` | Lists all available targets with descriptions |

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.
