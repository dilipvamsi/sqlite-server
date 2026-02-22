# Hurl examples for Exec (DML) operations

# 1. Simple Insert (Exec)
POST {{host}}/sqlrpc.v1.DatabaseService/Exec
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "sql": "INSERT INTO users (name, email, country, age) VALUES ('Hurl User', 'hurl@example.com', 'Internet', 30)"
}
HTTP 200
[Asserts]
jsonpath "$.dml" exists

# 2. Parameterized Insert (Positional)
POST {{host}}/sqlrpc.v1.DatabaseService/Exec
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "sql": "INSERT INTO users (name, email, country, age) VALUES (?, ?, ?, ?)",
  "parameters": {
    "positional": ["New Hurl User", "hurl_new@test.com", "Canada", 25]
  }
}
HTTP 200
[Asserts]
jsonpath "$.dml" exists

# 3. Typed Exec (Strictly Typed)
POST {{host}}/sqlrpc.v1.DatabaseService/TypedExec
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}",
  "sql": "UPDATE users SET age = age + 1 WHERE id = ?",
  "parameters": {
    "positional": [
      { "integer_value": "1" }
    ]
  }
}
HTTP 200
[Asserts]
jsonpath "$.dml" exists
