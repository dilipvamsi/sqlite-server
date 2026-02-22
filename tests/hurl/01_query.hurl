# Hurl examples for Query operations

# 1. Simple Query (Unary)
POST {{host}}/sqlrpc.v1.DatabaseService/Query
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "sql": "SELECT id, name, email FROM users LIMIT 5"
}
HTTP 200
[Asserts]
jsonpath "$.columns" count == 3
jsonpath "$.columns[0]" == "id"
jsonpath "$.rows" count >= 1

# 2. Parameterized Query (Positional)
POST {{host}}/sqlrpc.v1.DatabaseService/Query
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "sql": "SELECT name FROM users WHERE country = ? AND age > ?",
  "parameters": {
    "positional": ["USA", 25]
  }
}
HTTP 200
[Asserts]
jsonpath "$.columns[0]" == "name"
jsonpath "$.rows" count >= 1

# 3. Parameterized Query (Named)
POST {{host}}/sqlrpc.v1.DatabaseService/Query
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "sql": "SELECT name FROM users LIMIT 1"
}
HTTP 200
[Asserts]
jsonpath "$.rows" count >= 1

# 4. Typed Query (Strictly Typed)
POST {{host}}/sqlrpc.v1.DatabaseService/TypedQuery
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "sql": "SELECT * FROM users WHERE age > ?",
  "parameters": {
    "positional": [
      { "integer_value": "25" }
    ]
  }
}
HTTP 200
[Asserts]
jsonpath "$.rows" count >= 1
