# Hurl examples for introspection

# 1. Get Table Schema
POST {{host}}/sqlrpc.v1.DatabaseService/GetTableSchema
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "table_name": "users"
}
HTTP 200
[Asserts]
jsonpath "$.name" == "users"
jsonpath "$.columns" count >= 1

# 2. Explain Query Plan
POST {{host}}/sqlrpc.v1.DatabaseService/Explain
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "sql": "SELECT * FROM users WHERE age > 50"
}
HTTP 200
[Asserts]
jsonpath "$.nodes" count >= 1
