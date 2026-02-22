# Hurl examples for sequential transactions

# 1. Atomic Transaction Script
POST {{host}}/sqlrpc.v1.DatabaseService/ExecuteTransaction
Content-Type: application/json
Authorization: {{auth}}
{
  "requests": [
    {
      "begin": {
        "database": "{{dbName}}",
        "mode": "TRANSACTION_LOCK_MODE_IMMEDIATE"
      }
    },
    {
      "exec": {
        "sql": "INSERT INTO users (name, email) VALUES ('Atomic Hurl', 'atomic.hurl@test.com')"
      }
    },
    {
      "query": {
        "sql": "SELECT last_insert_rowid() as id"
      }
    },
    {
      "commit": {}
    }
  ]
}
HTTP 200
[Asserts]
jsonpath "$.responses" count == 4

# 2. Begin Unary Transaction (Capture ID)
POST {{host}}/sqlrpc.v1.DatabaseService/BeginTransaction
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "mode": "TRANSACTION_LOCK_MODE_DEFERRED"
}
HTTP 200
[Captures]
tx_id: jsonpath "$.transactionId"

# 3. Transactional Query using captured ID
POST {{host}}/sqlrpc.v1.DatabaseService/TransactionQuery
Content-Type: application/json
Authorization: {{auth}}
{
  "transaction_id": "{{tx_id}}",
  "sql": "SELECT id, name FROM users LIMIT 1"
}
HTTP 200
[Asserts]
jsonpath "$.columns" count == 2

# 4. Transactional Exec using captured ID
POST {{host}}/sqlrpc.v1.DatabaseService/TransactionExec
Content-Type: application/json
Authorization: {{auth}}
{
  "transaction_id": "{{tx_id}}",
  "sql": "INSERT INTO users (name) VALUES ('Unary Hurl User')"
}
HTTP 200
[Asserts]
jsonpath "$.dml.rowsAffected" exists

# 5. Commit Transaction using captured ID
POST {{host}}/sqlrpc.v1.DatabaseService/CommitTransaction
Content-Type: application/json
Authorization: {{auth}}
{
  "transaction_id": "{{tx_id}}"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true
