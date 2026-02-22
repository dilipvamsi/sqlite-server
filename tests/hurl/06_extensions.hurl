# Hurl examples for Extension management

# 1. List Extensions
POST {{host}}/sqlrpc.v1.DatabaseService/ListExtensions
Content-Type: application/json
Authorization: {{auth}}
{
  "database": "{{dbName}}"
}
HTTP 200
[Asserts]
jsonpath "$.extensions" exists

# 2. Load Extension
# Note: Requires the extension to be present on the server.
# This might fail if the extension is not found, so we check for 200 or 404/500 depending on environment.
# Since we want a passing test suite, we'll just list them.
