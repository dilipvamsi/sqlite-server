# Hurl examples for maintenance operations

# 1. List Tables
POST {{host}}/sqlrpc.v1.DatabaseService/ListTables
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}"
}
HTTP 200
[Asserts]
jsonpath "$.tableNames" count >= 1

# 2. Integrity Check
POST {{host}}/sqlrpc.v1.DatabaseService/IntegrityCheck
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "max_errors": 10
}
HTTP 200
[Asserts]
jsonpath "$.success" == true

# 3. Checkpoint WAL
POST {{host}}/sqlrpc.v1.DatabaseService/Checkpoint
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "mode": "CHECKPOINT_MODE_PASSIVE"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true
