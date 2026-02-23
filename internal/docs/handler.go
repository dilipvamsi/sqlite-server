package docs

import (
	_ "embed"
	"net/http"
)

//go:embed openapi.yaml
var openapiYAML []byte

//go:embed scalar.html
var scalarHTML []byte

// Handler returns an http.Handler that serves the API documentation
func Handler() http.Handler {
	mux := http.NewServeMux()

	// Handle /docs/ with a redirect if trailing slash is missing
	// Serve the Scalar UI at /docs/
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Write(scalarHTML)
			return
		}

		// Serve the OpenAPI spec at /docs/openapi.yaml
		if r.URL.Path == "/openapi.yaml" {
			w.Header().Set("Content-Type", "application/yaml")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Write(openapiYAML)
			return
		}

		http.NotFound(w, r)
	})

	return http.StripPrefix("/docs", mux)
}
