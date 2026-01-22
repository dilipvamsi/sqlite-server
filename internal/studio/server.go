package studio

import (
	"embed"
	"io/fs"
	"mime"
	"net/http"
	"strings"
)

//go:embed dist/*
var assets embed.FS

func init() {
	// Ensure critical MIME types are registered.
	// This fixes issues in minimal environments (like Alpine/Scratch or some Linux distros)
	// where /etc/mime.types might be missing or incomplete, causing JS to be served as text/plain.
	mime.AddExtensionType(".js", "application/javascript")
	mime.AddExtensionType(".css", "text/css")
	mime.AddExtensionType(".svg", "image/svg+xml")
	mime.AddExtensionType(".html", "text/html")
	mime.AddExtensionType(".mjs", "application/javascript")
}

// NewHandler returns an HTTP handler that serves the embedded authentication studio.
// The handler strips the prefix to map requests to the embedded filesystem.
func NewHandler(prefix string) http.Handler {
	// Sub-filesystem rooted at "dist"
	distFS, err := fs.Sub(assets, "dist")
	if err != nil {
		panic(err) // Should never happen if embed is correct
	}

	fileServer := http.FileServer(http.FS(distFS))

	return http.StripPrefix(prefix, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Verify if the file exists in the file system
		path := strings.TrimPrefix(r.URL.Path, prefix)
		// Removing leading slash if present
		path = strings.TrimPrefix(path, "/")

		f, err := distFS.Open(path)
		if err != nil {
			// If file not found, let FileServer handle it (404)
		} else {
			f.Close()
		}

		fileServer.ServeHTTP(w, r)
	}))
}
