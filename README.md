# SQlite Server

**SQlite Server** is a production-ready, high-performance gRPC bridge for SQLite. It exposes multiple SQLite database files over a network via a strictly typed, schema-safe API.

It is designed to solve the common limitations of using SQLite in networked architectures by providing connection pooling, safe streaming for large datasets, and hybrid transaction management.

---

## 🚀 Key Features

### 1. Hybrid Transaction Models
The service supports two distinct transaction patterns to suit different client needs:
*   **Streaming Transactions (Interactive):** Uses a bidirectional gRPC stream. The TCP connection lifecycle dictates the transaction lifecycle. Perfect for interactive sessions where automatic rollback on disconnect is required.
*   **Unary Transactions (ID-Based):** Uses a token-based system (`transaction_id`). The server maintains an in-memory registry of active transactions with a "Heartbeat" mechanism. Perfect for stateless HTTP/REST clients or long-running workflows.

### 2. "Sparse Hint" Type System
SQLite is dynamically typed, but gRPC/Protobuf is statically typed. To bridge this gap without overhead:
*   Standard values are sent as native JSON/Protobuf types.
*   Ambiguous values (e.g., `BLOB` vs Base64 String, `INT64` vs JSON Number) use a **Sparse Hint** map.
*   The client only provides type hints for specific columns when necessary.

### 3. Safety & Performance
*   **Chunked Streaming:** Large result sets are streamed in batches (default: 500 rows), ensuring constant $O(1)$ memory usage regardless of table size.
*   **Zombie Protection:** A background "Reaper" process automatically rolls back ID-based transactions that have timed out.
*   **Graceful Shutdown:** Ensures ongoing queries complete and active transactions are rolled back cleanly before the server exits.

### 4. Observability
*   **Request Tracing:** Supports `X-Request-Id` header propagation.
*   **UUIDv7:** Generates time-ordered unique identifiers for all requests and sessions.
*   **Error Fidelity:** Maps native C SQLite error codes (e.g., `SQLITE_BUSY`, `SQLITE_CONSTRAINT`) to a Protobuf Enum for programmatic error handling.

---

## 🏗 Architecture

### Component Diagram

```text
       [ gRPC / HTTP Client ]
                 |
                 | (Query / Stream / Begin)
                 v
+----------------------------------------------------------+
|                 SQlite Server (Process)                  |
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

### 1. Build the Project
```bash
# Generate Protobuf code
buf generate

# Build the binary
go build -o server main.go
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
# Run with default config.json
./server

# Run with specific config
./server my_config.json
```

The server listens on `localhost:50051` using HTTP/2 (h2c).

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

### 4. Interactive Transaction (Bidirectional Stream)
*Best for: High-performance interactive sessions.*

This requires a gRPC or Connect client that supports bidirectional streaming.
1.  Send `BeginRequest`.
2.  Send `TransactionalQueryRequest` (Wait for response).
3.  Send `TransactionalQueryRequest` (Wait for response).
4.  Send `CommitRequest`.

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

## 🧪 Testing

A comprehensive HTTP test suite is provided in `tests/api_tests.http`.
You can run this using the **VS Code REST Client** extension.

1.  Run the seed script: `go run main.go` (This creates `loadtest.db`).
2.  Open `tests/api_tests.http`.
3.  Click "Send Request" to verify endpoints.

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
