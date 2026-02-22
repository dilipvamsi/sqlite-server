# Automated Hurl Tests

These files provide automated integration tests for the `sqlite-server` API using [Hurl](https://hurl.dev/).

## Prerequisites
- **Hurl**: Must be installed on your system.
- **Server**: Must be running (e.g., `make run-load-test-auth-dev`).

## Running the Tests

You can run all tests using the Makefile:
```bash
make test-hurl
```

Or manually:
```bash
hurl --variables-file tests/hurl/vars.env tests/hurl/*.hurl
```

## Test Structure

- **01_query.hurl**: Read operations with assertions on result schema and row counts.
- **02_exec.hurl**: Mutation operations confirming rows affected.
- **03_transaction.hurl**: **Advanced Chaining**. Captures `transaction_id` from a `Begin` response and passes it to subsequent transactional operations.
- **04_maintenance.hurl**: Validates success of maintenance RPCs.
- **05_introspection.hurl**: Validates schema retrieval and query plan node generation.

## Variables
Global variables are stored in `tests/hurl/vars.env`. Modify this file to change the target host, database, or credentials.
