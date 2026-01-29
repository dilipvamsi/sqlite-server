package landing

import (
	_ "embed"
	"net/http"
)

//go:embed index.html
var indexHTML []byte

// Handler returns an http.HandlerFunc that serves the landing page
func Handler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Only serve landing page at exact root path
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(indexHTML)
	}
}
