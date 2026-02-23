# Pub/Sub E2E Tests

This directory contains the integration and end-to-end test suite for the `PubSub` broker, SQL functions, and gRPC endpoints. The tests are executed numerically to provide a progressive guarantee of stability.

## Test Infrastructure

- **`client_test.go`**: Contains the testing harnesses and helpers. It ensures that every single test creates and connects to its very own isolated database (e.g., `pubsub_test_TestIsolation`), guaranteeing that tests do not leak state or disrupt each other.

## Test Cases

| File | Purpose | Description |
|---|---|---|
| **`01_isolation_test.go`** | Channel Isolation | Verifies that subscribing to `channel-A` does not leak messages published to `channel-B`. Proof of strict channel routing. |
| **`02_durable_test.go`** | Historical Catch-Up | Simulates an offline subscriber. Publishes messages while the client is absent, reconnects the client, and verifies that the client receives all missed messages from the database before seamlessly switching to the live signal stream. |
| **`03_aggregate_test.go`** | SQL Aggregates | Tests the `publish_batch()` custom SQLite aggregate function. Verifies that bulk row processing via SQL correctly batches payloads and interfaces with the underlying broker. |
| **`04_vpubsub_test.go`** | Virtual Table (`vpubsub`) | Verifies that inserting data via standard SQL `INSERT INTO vpubsub (channel, payload)` correctly triggers the broker. Covers both single and bulk transaction inserts. |
| **`05_typed_query_test.go`** | Typed RPC Integration | Ensures that standard SQL `TypedQuery` can successfully read from `vpubsub` with proper type mappings. |
| **`06_auth_test.go`** | Authentication Policies | Validates that `Publish`/`Subscribe` RPC methods correctly respect the auth interceptors and reject unauthenticated requests when auth is enabled. |
| **`07_concurrency_test.go`** | High Throughput Metrics | A stress test launching 5 concurrent publishers that aggressively hammer the broker with messages simultaneously, validating that the broker handles batch flushes seamlessly without dropping payloads. |
| **`08_deadlock_test.go`** | Synchronization Stress | Specifically designed to break internal `RWMutex` locks and `sync.WaitGroup` mechanics. It launches 50 chaotic goroutines that subscribe, rapidly publish, and abruptly cancel contexts to ensure the server remains stable under chaotic disconnects. |
| **`09_multiplex_test.go`** | Stream Multiplexing | Tests multiple concurrent subscriptions operating on the exact same HTTP/2 connection (`client`). Verifies that the gRPC stream multiplexer cleanly routes messages without cross-talk or deadlocks. |

## Running the Tests

To run the full suite:

```bash
make test-pubsub
```

Because these are true E2E tests, **the `sqlite-server.bin` daemon must be running** prior to executing the tests:

```bash
# Start the server first
SQLITE_SERVER_ADMIN_PASSWORD=admin ./bin/sqlite-server.bin --pubsub-enabled &

# Then run the tests
make test-pubsub
```
