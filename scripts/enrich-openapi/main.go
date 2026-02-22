package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run enrich.go <openapi.yaml>")
		os.Exit(1)
	}

	path := os.Args[1]
	content, err := os.ReadFile(path)
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		os.Exit(1)
	}

	lines := strings.Split(string(content), "\n")
	var result []string

	extraInfo := `  description: |
    SQLite Server is a production-ready, multi-database SQL engine.

    ## Authentication
    Most endpoints require authentication via Bearer token (API Key) or Basic Auth.

    **To authenticate:**
    1. Use the /db.v1.AdminService/Login endpoint with username/password
    2. Copy the apiKey from the response
    3. Click "Authorize" above and enter your API key

    **Format:** Bearer sk_... (include the Bearer prefix)
  version: "1.0.0"
  contact:
    name: SQLite Server`

	securitySchemes := `  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: API Key
      description: "API Key obtained from Login endpoint (format: sk_...)"
    basicAuth:
      type: http
      scheme: basic
      description: "Username and password for initial authentication"`

	globalSecurity := `security:
  - bearerAuth: []
  - basicAuth: []`

	skipDescription := false
	for _, line := range lines {
		// Replace title
		if strings.HasPrefix(line, "  title: db.v1") || strings.HasPrefix(line, "  title: sqlrpc.v1") {
			result = append(result, "  title: SQLite Server API")
			result = append(result, extraInfo)
			skipDescription = true
			continue
		}

		if skipDescription && strings.HasPrefix(line, "  description: |") {
			continue
		}
		if skipDescription && strings.HasPrefix(line, "    ") {
			continue
		}
		if skipDescription && line == "" {
			continue
		}
		if skipDescription {
			skipDescription = false
		}

		// Inject global security after info
		if strings.HasPrefix(line, "paths:") {
			result = append(result, globalSecurity)
		}

		// Remove the empty security: [] if present
		if strings.TrimSpace(line) == "security: []" {
			continue
		}

		// Inject securitySchemes into components
		if strings.TrimSpace(line) == "components:" {
			result = append(result, line)
			result = append(result, securitySchemes)
			continue
		}

		// Cleanup tags (simplified tags)
		if strings.HasPrefix(line, "  - name: db.v1.DatabaseService") || strings.HasPrefix(line, "  - name: sqlrpc.v1.DatabaseService") {
			result = append(result, "  - name: db.v1.DatabaseService")
			result = append(result, "    description: Database operations including queries and transactions")
			continue
		}
		if strings.HasPrefix(line, "  - name: db.v1.AdminService") || strings.HasPrefix(line, "  - name: sqlrpc.v1.AdminService") {
			result = append(result, "  - name: db.v1.AdminService")
			result = append(result, "    description: Administrative operations for user management and system configuration")
			continue
		}

		result = append(result, line)
	}

	err = os.WriteFile(path, []byte(strings.Join(result, "\n")), 0644)
	if err != nil {
		fmt.Printf("Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("OpenAPI spec enriched successfully.")
}
