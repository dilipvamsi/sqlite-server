package landing

import (
	_ "embed"
	"net/http"
	"strconv"
	"strings"
)

//go:embed index.html
var indexHTML string

// Handler returns an http.HandlerFunc that serves the landing page
// with dynamic port substitution
func Handler(port int) http.HandlerFunc {
	// Pre-render the HTML with the port substituted
	renderedHTML := strings.ReplaceAll(indexHTML, "{{PORT}}", strconv.Itoa(port))

	return func(w http.ResponseWriter, r *http.Request) {
		// Only serve landing page at exact root path
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write([]byte(renderedHTML))
	}
}
