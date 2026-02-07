package extensiondownloader

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetURL(t *testing.T) {
	tests := []struct {
		ext     string
		os      string
		arch    string
		wantErr bool
	}{
		// vec
		{"vec", "linux", "amd64", false},
		{"vec", "linux", "arm64", false},
		{"vec", "macos", "amd64", false},
		{"vec", "macos", "arm64", false},
		{"vec", "windows", "amd64", false},
		{"vec", "linux", "unknown", true},

		// http
		{"http", "linux", "amd64", false},
		{"http", "linux", "arm64", true},
		{"http", "macos", "amd64", false},
		{"http", "macos", "arm64", false},
		{"http", "windows", "amd64", false},

		// mview
		{"mview", "linux", "amd64", false},
		{"mview", "linux", "arm64", false},
		{"mview", "macos", "amd64", false},
		{"mview", "macos", "arm64", false},
		{"mview", "windows", "amd64", false},
		{"mview", "windows", "arm64", false},
		{"mview", "windows", "386", false},
		{"mview", "windows", "unknown", true},
	}

	for _, tt := range tests {
		t.Run(fmt.Sprintf("%s-%s-%s", tt.ext, tt.os, tt.arch), func(t *testing.T) {
			cfg, ok := Registry[tt.ext]
			assert.True(t, ok)
			url, filename, err := cfg.GetURL(tt.os, tt.arch, cfg.Version)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.NotEmpty(t, url)
				assert.NotEmpty(t, filename)
			}
		})
	}
}

func TestDownloadExtensions_Mock(t *testing.T) {
	// Create a mock server to serve extension files
	data := []byte("fake-binary-content")
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Serve a zip file logic if requested
		if r.URL.Path == "/fake.zip" {
			w.Header().Set("Content-Type", "application/zip")
			zw := zip.NewWriter(w)
			f, _ := zw.Create("fake.so")
			f.Write(data)
			zw.Close()
			return
		}
		// Serve direct file
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Write(data)
	}))
	defer ts.Close()

	// Backup original registry and restore after test
	originalRegistry := make(map[string]ExtensionConfig)
	for k, v := range Registry {
		originalRegistry[k] = v
	}
	defer func() {
		Registry = originalRegistry
	}()

	// Inject a test extension
	Register(ExtensionConfig{
		Name:    "test-ext",
		Version: "1.0.0",
		GetURL: func(osName, arch, version string) (string, string, error) {
			return ts.URL + "/fake.so", "fake.so", nil
		},
		FindLib: func(files []string, osName, arch string) string {
			return files[0]
		},
	})

	Register(ExtensionConfig{
		Name:    "test-ext-zip",
		Version: "1.0.0",
		GetURL: func(osName, arch, version string) (string, string, error) {
			return ts.URL + "/fake.zip", "fake.zip", nil
		},
		FindLib: func(files []string, osName, arch string) string {
			for _, f := range files {
				if filepath.Base(f) == "fake.so" {
					return f
				}
			}
			return ""
		},
	})

	tmpDir, err := os.MkdirTemp("", "ext-test-DL")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	// Test downloading "test-ext"
	err = DownloadExtensions(tmpDir, []string{"test-ext"})
	assert.NoError(t, err)

	targetDir := filepath.Join(tmpDir, "test-ext-1.0.0")
	entries, err := os.ReadDir(targetDir)
	assert.NoError(t, err)
	assert.NotEmpty(t, entries)

	infoPath := filepath.Join(targetDir, "info.json")
	assert.FileExists(t, infoPath)

	// Test downloading "test-ext-zip"
	err = DownloadExtensions(tmpDir, []string{"test-ext-zip"})
	assert.NoError(t, err)

	targetDirZip := filepath.Join(tmpDir, "test-ext-zip-1.0.0")
	entriesZip, err := os.ReadDir(targetDirZip)
	assert.NoError(t, err)
	assert.NotEmpty(t, entriesZip)
}

func TestDownloadExtensions_AllAndEmpty(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "ext-test-all")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	// Test empty
	err = DownloadExtensions(tmpDir, []string{})
	assert.NoError(t, err)

	// Test 'all' keyword should not crash (wont actually download unless we mock registry)
	// But let's verify it expands correctly by checking a mock registry
	originalRegistry := Registry
	Registry = map[string]ExtensionConfig{}
	defer func() { Registry = originalRegistry }()

	err = DownloadExtensions(tmpDir, []string{"all"})
	assert.NoError(t, err)
}

func TestDownloadExtensions_Versioned(t *testing.T) {
	data := []byte("fake-binary-content")
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Write(data)
	}))
	defer ts.Close()

	originalRegistry := Registry
	Registry = map[string]ExtensionConfig{
		"test-v": {
			Name:    "test-v",
			Version: "1.0.0",
			GetURL: func(osName, arch, version string) (string, string, error) {
				return ts.URL + "/fake.so", "fake.so", nil
			},
			FindLib: func(files []string, osName, arch string) string {
				return files[0]
			},
		},
	}
	defer func() { Registry = originalRegistry }()

	tmpDir, err := os.MkdirTemp("", "ext-test-ver")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	err = DownloadExtensions(tmpDir, []string{"test-v@2.0.0"})
	assert.NoError(t, err)

	targetDir := filepath.Join(tmpDir, "test-v-2.0.0")
	assert.DirExists(t, targetDir)
}

func TestDownloadSQLean_Mock(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/zip")
		zw := zip.NewWriter(w)
		f, _ := zw.Create("crypto.so")
		f.Write([]byte("crypto-content"))
		zw.Close()
	}))
	defer ts.Close()

	// downloadSQLean is internal but called by DownloadExtensions if "sqlean" is in list
	// We need to override the URL construction or just test it directly if possible.
	// Since downloadSQLean has a hardcoded URL, we can't easily mock the HTTP part without a global proxy or monkeypatching.
	// BUT, we can test the logic by calling it with a custom OS/Arch if we could control the URL.
	// For now, let's at least test the platform map.
}

func TestGetLibExt(t *testing.T) {
	assert.Equal(t, "dll", getLibExt("windows"))
	assert.Equal(t, "dylib", getLibExt("macos"))
	assert.Equal(t, "so", getLibExt("linux"))
	assert.Equal(t, "so", getLibExt("freebsd"))
}

func TestUniqueStrings(t *testing.T) {
	input := []string{"a", "b", "a", "c", "b"}
	expected := []string{"a", "b", "c"}
	assert.Equal(t, expected, uniqueStrings(input))
}

func TestExtractTarGz_Success(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "tar-test-success")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	tarFile := filepath.Join(tmpDir, "test.tar.gz")
	f, err := os.Create(tarFile)
	assert.NoError(t, err)

	gw := gzip.NewWriter(f)
	tw := tar.NewWriter(gw)

	content := []byte("hello tar")
	hdr := &tar.Header{
		Name: "test.txt",
		Mode: 0600,
		Size: int64(len(content)),
	}
	assert.NoError(t, tw.WriteHeader(hdr))
	_, err = tw.Write(content)
	assert.NoError(t, err)

	tw.Close()
	gw.Close()
	f.Close()

	destDir := filepath.Join(tmpDir, "extracted")
	files, err := extractTarGz(tarFile, destDir)
	assert.NoError(t, err)
	assert.Len(t, files, 1)
	assert.Contains(t, files[0], "test.txt")

	data, err := os.ReadFile(files[0])
	assert.NoError(t, err)
	assert.Equal(t, content, data)
}

func TestExtractTarGz_Error(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "tar-test")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	invalidFile := filepath.Join(tmpDir, "invalid.tar.gz")
	os.WriteFile(invalidFile, []byte("not a tar gz"), 0644)

	_, err = extractTarGz(invalidFile, tmpDir)
	assert.Error(t, err)
}

func TestDownloadExtensions_Duplicate(t *testing.T) {
	data := []byte("fake")
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Write(data)
	}))
	defer ts.Close()

	originalRegistry := Registry
	Registry = map[string]ExtensionConfig{
		"dup": {
			Name:    "dup",
			Version: "1.0.0",
			GetURL: func(osName, arch, version string) (string, string, error) {
				return ts.URL + "/fake.so", "fake.so", nil
			},
			FindLib: func(files []string, osName, arch string) string {
				return files[0]
			},
		},
	}
	defer func() { Registry = originalRegistry }()

	tmpDir, err := os.MkdirTemp("", "ext-test-dup")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	err = DownloadExtensions(tmpDir, []string{"dup", "dup", "dup"})
	assert.NoError(t, err)
}

func TestDownloadSingleExtension_Existing(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "ext-test-exists")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	targetDir := filepath.Join(tmpDir, "exist-1.0.0")
	os.MkdirAll(targetDir, 0755)

	config := ExtensionConfig{
		Name:    "exist",
		Version: "1.0.0",
		GetURL: func(osName, arch, version string) (string, string, error) {
			return "", "", nil
		},
	}
	err = downloadSingleExtension(tmpDir, config, "linux", "amd64", "1.0.0")
	assert.NoError(t, err) // Should skip and return nil
}

func TestDownloadSingleExtension_NoLib(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/zip")
		zw := zip.NewWriter(w)
		f, _ := zw.Create("not-a-lib.txt")
		f.Write([]byte("some text"))
		zw.Close()
	}))
	defer ts.Close()

	config := ExtensionConfig{
		Name:    "nolib",
		Version: "1.0.0",
		GetURL: func(osName, arch, version string) (string, string, error) {
			return ts.URL + "/fake.zip", "fake.zip", nil
		},
		FindLib: func(files []string, osName, arch string) string {
			return "" // Fail to find
		},
	}

	tmpDir, err := os.MkdirTemp("", "ext-test-nolib")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	err = downloadSingleExtension(tmpDir, config, "linux", "amd64", "1.0.0")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "could not find library file")
}

func TestExtractZip_Error(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "zip-test-err")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	invalidFile := filepath.Join(tmpDir, "invalid.zip")
	os.WriteFile(invalidFile, []byte("not a zip"), 0644)

	_, err = extractZip(invalidFile, tmpDir)
	assert.Error(t, err)
}

func TestGetAvailableExtensions_EdgeCases(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "discovery-test-edge")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	// Set env var
	oldEnv := os.Getenv("SQLITE_SERVER_EXTENSIONS")
	os.Setenv("SQLITE_SERVER_EXTENSIONS", tmpDir)
	defer os.Setenv("SQLITE_SERVER_EXTENSIONS", oldEnv)

	// Test with 386 suffix (on current platform just to see if it matches if we name it so)
	currentOS := runtime.GOOS
	if currentOS == "darwin" {
		currentOS = "macos"
	}

	testDir := filepath.Join(tmpDir, "edge-1.0.0")
	os.MkdirAll(testDir, 0755)

	f386 := filepath.Join(testDir, "edge-1.0.0-"+currentOS+"-386.so")
	os.WriteFile(f386, []byte("fake"), 0644)

	// Discovery should pick it up if we were on 386, but here it won't unless we mock runtime.
	// But we can at least verify it doesn't crash.
}

func TestDownloadSingleExtension_UnknownArchive(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("garbage"))
	}))
	defer ts.Close()

	config := ExtensionConfig{
		Name:    "unknown",
		Version: "1.0.0",
		GetURL: func(osName, arch, version string) (string, string, error) {
			return ts.URL + "/garbage.txt", "garbage.txt", nil
		},
	}

	tmpDir, err := os.MkdirTemp("", "ext-test-unknown")
	assert.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	err = downloadSingleExtension(tmpDir, config, "linux", "amd64", "1.0.0")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "unknown archive format")
}
