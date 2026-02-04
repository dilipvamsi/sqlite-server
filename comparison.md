# Comparison: SQLite Server vs. The Ecosystem

This document outlines how `sqlite-server` compares to other popular networked SQLite solutions. It highlights the unique architectural choices that differentiate it from distributed systems (rqlite), edge replicators (Turso), and backend-as-a-service platforms (PocketBase).

## 📊 Comparison Matrix

| Feature | **sqlite-server** (This Project) | **rqlite** / **dqlite** | **Turso** (libSQL) | **PocketBase** |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Goal** | **Application DB Server**<br>(Strictly typed access to SQLite files) | **High Availability**<br>(Distributed consensus for SQLite) | **Edge Replication**<br>(Data close to users) | **Backend-as-a-Service**<br>(Auth + DB + Files + API) |
| **Wire Protocol** | **Connect / gRPC + Protobuf**<br>(Strict schemas, fast, streaming) | **HTTP / JSON**<br>(Standard REST-like API) | **WebSocket / HTTP**<br>(Custom protocol for state) | **HTTP / JSON**<br>(REST API for CRUD) |
| **Transactions** | **Hybrid "Dual Model"**<br>1. **Stream:** Interactive TCP-like session<br>2. **ID-Based:** Stateless Wrapper | **Raft-Based**<br>Batch processing. Interactive txns are complex/brittle. | **Stateless / Baton**<br>HTTP is stateless; requires passing a "baton" token to maintain state. | **Internal Only**<br>API calls are atomic, but you can't open an interactive txn via API. |
| **Extensions** | **Managed & Dynamic**<br>Runtime loading; **Rich Ecosystem** (`mview`, `vec`, `sqlean`). | **Static / Compile-Time**<br>Usually requires rebuilding the binary to add extensions. | **Preloaded / Experimental**<br>Comes with common set; custom requires Rust SDK or special builds. | **Static / Go Hooks**<br>Requires writing Go code to register extensions in the driver. |
| **Deployment** | **Single Binary**<br>Server + UI + SQLite Engine all in one static binary. | **Single Binary**<br>Server only. | **Cloud / Binary**<br>Managed service focus. | **Single Binary**<br>App + DB in one. |
| **Pool Management** | **Dual Pools (RW/RO)**<br>+ Smart LRU Eviction for multi-tenancy. | **Consensus-Driven**<br>Writes via Raft log; Reads can be local/stale. | **Serverless / Edge**<br>Short-lived connections optimized for high cold-start. | **Single Shared Pool**<br>Standard Go `sql.DB` pooling (RW/RO mixed). |
| **Type System** | **Sparse Hints**<br>Hybrid: Native Protobuf types + Type hints for ambiguity. | **JSON Types**<br>Standard JSON mapping (Numbers often float64). | **Driver Dependent**<br>Relies on client driver implementation. | **Strict Schema**<br>API enforces types defined in Admin UI. |
| **Observability** | **Tracing + UUIDv7**<br>Request ID propagation & Time-sortable IDs. | **Cluster Stats**<br>Expvars for Raft/Node status. | **Dashboard Metrics**<br>Cloud-focused usage stats. | **App Logs**<br>Request logging & Admin UI logs. |
| **Auth** | **RBAC + API Keys**<br>Built-in Admin/RW/RO roles & Session keys. | **Basic Auth / TLS**<br>Simple user/pass lists or mTLS. | **JWT (Token)**<br>Token-based access control. | **Full User Management**<br>Email/Pass, OAuth, strict Row-Level Security. |

---

## 🔍 Detailed Analysis

### 1. vs. rqlite (The "Consistency" Competitor)
*   **Philosophy**: rqlite focuses on **distributed consensus** (Raft). It replicates SQLite across a cluster to survive node failures.
*   **sqlite-server Differentiation**:
    *   **Single-Node Focus**: We do not attempt distributed consensus. We focus on maximizing performance and feature richness for a single node.
    *   **Performance**: Writes are significantly faster as they don't wait for network round-trips to peers.

### 2. vs. Turso / libSQL (The "Edge" Competitor)
*   **Philosophy**: Turso (built on libSQL) focuses on **Edge Replication**, allowing you to fork databases cheaply and place read replicas near users.
*   **sqlite-server Differentiation**:
    *   **Streaming Transactions**: We use gRPC bidirectional streaming, providing a "TCP-like" experience where a transaction lives as long as the connection.

### 3. vs. PocketBase (The "Product" Competitor)
*   **Philosophy**: PocketBase is a "Battery-Included" backend. It wraps SQLite but hides it behind an abstract API for users, authentication, and file storage.
*   **sqlite-server Differentiation**:
    *   **Raw SQL Power**: We expose the full power of SQL (Complex joins, CTEs) rather than an abstraction layer.
    *   **Backend Component**: `sqlite-server` is designed to be the *database layer* of your stack, not the entire stack.

---

## 🌟 Key Differentiators

### 1. Resource Efficiency (Smart Eviction)
Unlike simple wrappers that keep connections open indefinitely or open them per-request, `sqlite-server` uses a sophisticated **LRU (Least Recently Used) Eviction Policy** (`db_manager.go`):
*   **Lazy Loading**: Database connections are not opened until the first request hits them.
*   **Automatic Eviction**: A background cleaner runs every minute. Any database connection (RO or RW) that hasn't been used for **10 minutes** is automatically closed and removed from memory.
*   **Benefit**: You can "Mount" thousands of SQLite databases on a single server. Only the active ones consume file descriptors and memory. This makes it ideal for multi-tenant SaaS architectures where users have their own DBs but are rarely active simultaneously.

### 2. Rich "Batteries-Included" Extension Ecosystem
We treat extensions as first-class citizens. The `scripts/` directory provides one-click setup for a powerful suite of tools.

#### ⚡ Postgres-like Materialized Views (`mview`)
`sqlite-server` integration with **`sqlite-mview`** brings true **Materialized Views** to SQLite:
*   **Cache Expensive Queries**: Store results of complex aggregations/joins physically on disk.
*   **Manual Refresh**: Control when data updates (like Postgres `REFRESH MATERIALIZED VIEW`).
*   **Analytics Ready**: Transforms SQLite into a viable **Analytics (OLAP)** engine.

#### 🛠️ Other Essential Tools
*   **`sqlite-vec`**: High-performance vector search (Embeddings, AI/LLM support).
*   **`sqlite-http`**: Make HTTP requests directly from SQL queries (Webhooks, API calls).
*   **`sqlean` Suite**: A massive collection of essential functions (Crypto, Fuzzy Match, Regex, FileIO, etc.).

### 3. Client Drivers (SDKs)
We offer two tiers of implementation for client drivers, balancing power vs. simplicity:

#### 🟢 **Zero-Dependency** JavaScript Client (`js-fetch`)
*   **Zero Bloat**: A pure JavaScript client that uses standard `fetch` API.
*   **No `node_modules` hell**: It has **0 runtime dependencies**.
*   **Universal**: Works in Node.js, Browsers, Deno, Bun, and Edge Workers.

#### 🔵 **Full-Featured** gRPC Clients (`js`)
*   **Strict Typing**: Uses official Connect/Protobuf libraries for maximum type safety.
*   **Streaming Support**: Access to bidirectional streaming transactions.

*Note: Go clients can be generated from the proto files, but a pre-packaged SDK is in progress.*

### 4. Dual Connection Pools (Security & Performance)
Unlike simple wrappers that use a single connection pool, `sqlite-server` maintains **Two Separate Pools** per database:
*   **RW Pool**: For operations requiring write access.
*   **RO Pool**: For read-only operations.
*   **Security Benefit**: Users with `read_only` roles are strictly routed to the RO Pool. Even if there's a bug in the SQL parser or higher-level logic, the underlying database connection simply *cannot* write to the file.
*   **Concurrency**: Read operations don't block write operations (when WAL mode is enabled), and having dedicated pools allows optimizing connection settings for each workload.

### 5. Zero-Dependency "Single Binary"
`sqlite-server` compiles into a **single static binary** that contains everything:
*   **The Database Engine**: Embedded CGO-enabled SQLite driver (`github.com/mattn/go-sqlite3`).
*   **The Server**: gRPC, HTTP/1.1, and connection pool logic.
*   **The Web Studio**: The React/Astro UI is compiled to static assets and **embedded into the Go binary**.
*   **Result**: You drop one file (`sqlite-server`) onto a server and run it. No external runtime dependencies (not even for the web UI).


## 🏆 Capability Scorecard

How does `sqlite-server` rate on key architectural dimensions?

| Dimension | **sqlite-server** | **rqlite** | **Turso** | **PocketBase** |
| :--- | :---: | :---: | :---: | :---: |
| **Write Performance** | ⭐⭐⭐⭐⭐<br>(Local CGO Speed) | ⭐⭐<br>(Raft Consensus needed) | ⭐⭐⭐<br>(Network Trip to Primary) | ⭐⭐⭐⭐<br>(Local, but wrapper overhead) |
| **High Availability** | ⭐<br>(Single Node only) | ⭐⭐⭐⭐⭐<br>(Raft / Clustering) | ⭐⭐⭐⭐⭐<br>(Managed Cloud) | ⭐<br>(Single Node usually) |
| **Type Safety** | ⭐⭐⭐⭐⭐<br>(Strict Protobuf) | ⭐⭐<br>(JSON / Loose) | ⭐⭐⭐<br>(Client/Driver dependent) | ⭐⭐⭐⭐<br>(Schema enforced via UI) |
| **Ops Simplicity** | ⭐⭐⭐⭐⭐<br>(1 Binary, 0 Deps) | ⭐⭐⭐<br>(Cluster Management) | ⭐⭐⭐⭐<br>(Managed Service) | ⭐⭐⭐⭐⭐<br>(1 Binary) |
| **Multi-Tenancy** | ⭐⭐⭐⭐⭐<br>(Smart Eviction) | ⭐<br>(Heavy per-node cost) | ⭐⭐⭐⭐⭐<br>(Designed for this) | ⭐⭐<br>(1 App per Instance) |

---

## 🏁 Verdict: When to Choose `sqlite-server`?

### ✅ Choose `sqlite-server` if:
*   **Performance is Critical**: You need the raw speed of a local CGO SQLite driver but over a network.
*   **You need Strict Typing**: You want Protobuf schemas to enforce data integrity across your stack.
*   **You run Multi-Tenant SaaS**: You need to host thousands of databases efficiently on a single node (using Smart Eviction).
*   **You want Simple Operations**: You prefer a single binary deployment without complex cluster management.
*   **You use Advanced Features**: You need Extensions (`vec`, `mview`) or interactive Streaming Transactions.

### ❌ Choose a Competitor if:
*   **You need HA / Consensus**: Choose **rqlite** if you need Raft-based consensus to survive node failures.
*   **You need Edge Replication**: Choose **Turso** if you need read replicas geographically distributed near users.
*   **You want a Backend-as-a-Service**: Choose **PocketBase** if you want built-in Auth UI, File Uploads, and a high-level JS SDK rather than raw SQL.
