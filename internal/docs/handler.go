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

	// Serve the Scalar UI at /docs/
	mux.HandleFunc("/docs/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(scalarHTML)
	})

	// Serve the OpenAPI spec at /docs/openapi.yaml
	mux.HandleFunc("/docs/openapi.yaml", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/yaml")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(openapiYAML)
	})

	return mux
}
