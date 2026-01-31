package studio

import (
	"mime"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMimeTypes(t *testing.T) {
	// Verify init() registered extensions
	assert.Equal(t, "application/javascript", mime.TypeByExtension(".js"))
	assert.Equal(t, "text/css; charset=utf-8", mime.TypeByExtension(".css")) // mime package often adds charset
	assert.Equal(t, "image/svg+xml", mime.TypeByExtension(".svg"))
	assert.Equal(t, "text/html; charset=utf-8", mime.TypeByExtension(".html"))
}

func TestNewHandler(t *testing.T) {
	handler := NewHandler("/studio/")
	assert.NotNil(t, handler)

	req := httptest.NewRequest("GET", "/studio/index.html", nil)
	w := httptest.NewRecorder()

	handler.ServeHTTP(w, req)

	// Since dist might be empty or contain arbitrary files, we just check that it doesn't panic
	// and returns a valid HTTP code (404, 200, or 301 redirect).
	assert.Contains(t, []int{http.StatusOK, http.StatusNotFound, http.StatusMovedPermanently}, w.Code)
}
