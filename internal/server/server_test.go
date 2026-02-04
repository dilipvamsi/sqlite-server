package server

import (
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/require"
)

func TestVersionTrimming(t *testing.T) {
	if strings.ContainsAny(Version, " \n\r\t") {
		t.Errorf("Version string should be trimmed, but found whitespace in %q", Version)
	}
}

func TestNew(t *testing.T) {
	cfg := &Config{Port: 50051}
	srv := New(cfg)
	if srv.cfg != cfg {
		t.Errorf("Expected cfg to be set")
	}
	if srv.version != Version {
		t.Errorf("Expected version to be %q, got %q", Version, srv.version)
	}
}

func TestHealthEndpoint(t *testing.T) {
	s := &Server{
		cfg: &Config{Port: 8080},
	}
	// Pass a valid empty option to avoid nil pointer panic in connect
	mux := s.setupMux(nil, nil, nil, connect.WithInterceptors())

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	w := httptest.NewRecorder()
	mux.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
	if w.Body.String() != "OK" {
		t.Errorf("Expected body 'OK', got %q", w.Body.String())
	}
}

func TestCORSHandler(t *testing.T) {
	s := &Server{}

	// Test with origin
	handler := s.newCORSHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}), "http://example.com")

	// Test OPTIONS
	req := httptest.NewRequest(http.MethodOptions, "/", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Errorf("Expected 204 for OPTIONS, got %d", w.Code)
	}
	if w.Header().Get("Access-Control-Allow-Origin") != "http://example.com" {
		t.Errorf("Expected CORS header")
	}

	// Test GET
	req = httptest.NewRequest(http.MethodGet, "/", nil)
	w = httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected 200 for GET, got %d", w.Code)
	}

	// Test empty origin
	handlerEmpty := s.newCORSHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}), "")
	w = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodGet, "/", nil)
	handlerEmpty.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("Expected 200")
	}
}

func TestServerStartStop(t *testing.T) {
	dbDir := t.TempDir()
	cfg := &Config{
		Port:            0, // random port
		Host:            "localhost",
		MetaDB:          ":memory:",
		DbDir:           dbDir,
		AuthDisabled:    true,
		ShutdownTimeout: 1,
	}
	srv := New(cfg)

	// Start in background
	errCh := make(chan error, 1)
	go func() {
		errCh <- srv.Start()
	}()

	// Give it a moment to start and check if it failed immediately
	time.Sleep(200 * time.Millisecond)
	select {
	case err := <-errCh:
		if err != nil {
			t.Fatalf("Server failed to start: %v", err)
		}
	default:
	}

	// Stop it
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	err := srv.Stop(ctx)
	if err != nil {
		t.Errorf("Stop failed: %v", err)
	}

	// Wait for Start to return
	select {
	case err := <-errCh:
		if err != nil && err != http.ErrServerClosed {
			t.Errorf("Start returned unexpected error: %v", err)
		}
	case <-time.After(2 * time.Second):
		t.Errorf("Server did not stop in time")
	}
}

func TestServerStartStop_AuthEnabled(t *testing.T) {
	dbDir := t.TempDir()
	cfg := &Config{
		Port:            0,
		Host:            "localhost",
		MetaDB:          ":memory:",
		DbDir:           dbDir,
		AuthDisabled:    false,
		ShutdownTimeout: 1,
	}
	srv := New(cfg)

	go func() {
		_ = srv.Start()
	}()

	time.Sleep(200 * time.Millisecond)
	_ = srv.Stop(context.Background())
}

func TestLoadInitialConfigs(t *testing.T) {
	s := &Server{}
	// Test empty
	if configs := s.loadInitialConfigs(""); len(configs) != 0 {
		t.Errorf("Expected 0 configs for empty path")
	}
	// Test missing file
	if configs := s.loadInitialConfigs("non-existent.json"); len(configs) != 0 {
		t.Errorf("Expected 0 configs for missing file")
	}

	// Test success
	tmpFile := filepath.Join(t.TempDir(), "mounts.json")
	content := `[{"name": "test", "db_path": "test.db"}]`
	_ = os.WriteFile(tmpFile, []byte(content), 0644)
	configs := s.loadInitialConfigs(tmpFile)
	if len(configs) != 1 {
		t.Errorf("Expected 1 config")
	}
}

func TestSetupMetadata_Complex(t *testing.T) {
	s := &Server{}
	metaPath := filepath.Join(t.TempDir(), "meta.db")
	cfg := &Config{
		MetaDB:          metaPath,
		InitialAdmin:    "admin",
		InitialPassword: "pass",
	}

	// 1. Initial setup
	initial := []*dbv1.DatabaseConfig{
		{Name: "test1", DbPath: "t1.db"},
	}
	store, configs, err := s.setupMetadata(cfg, initial)
	require.NoError(t, err)
	if len(configs) != 1 {
		t.Errorf("Expected 1 config")
	}
	store.Close()

	// 2. Load again and check persistence
	store2, configs2, err := s.setupMetadata(cfg, nil)
	require.NoError(t, err)
	if len(configs2) != 1 {
		t.Errorf("Expected 1 stored config to be loaded")
	}
	store2.Close()

	// 3. Test overwrite
	cfgOverwrite := &Config{
		MetaDB:          metaPath,
		InitialAdmin:    "admin",
		InitialPassword: "pass",
		MountsOverwrite: true,
	}
	initialOverwrite := []*dbv1.DatabaseConfig{
		{Name: "test1", DbPath: "t1_updated.db"},
	}
	store3, configs3, err := s.setupMetadata(cfgOverwrite, initialOverwrite)
	require.NoError(t, err)
	if len(configs3) != 1 {
		t.Errorf("Expected 1 config")
	} else if !strings.HasSuffix(configs3[0].DbPath, "t1_updated.db") {
		t.Errorf("Expected updated path suffix %q, got %q", "t1_updated.db", configs3[0].DbPath)
	}
	store3.Close()
}

func TestValidateMountConnectivity(t *testing.T) {
	s := &Server{}
	dbPath := filepath.Join(t.TempDir(), "test.db")
	cfg := &dbv1.DatabaseConfig{
		Name:   "test",
		DbPath: dbPath,
	}
	// This should not panic/fatal as it's a valid empty DB
	if err := s.validateMountConnectivity(cfg); err != nil {
		t.Errorf("Expected no error, got %v", err)
	}
}

func TestValidateMountConnectivity_Failure(t *testing.T) {
	s := &Server{}
	// Invalid path should cause failure
	cfg := &dbv1.DatabaseConfig{
		Name:   "fail",
		DbPath: "/non/existent/path/to/db.sqlite",
	}
	if err := s.validateMountConnectivity(cfg); err == nil {
		t.Errorf("Expected error for invalid mount path")
	}
}

func TestInitDbDir(t *testing.T) {
	// Test current dir (does nothing)
	initDbDir(".")

	// Test new dir
	path := filepath.Join(t.TempDir(), "new-db-dir")
	initDbDir(path)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		t.Errorf("Expected directory to be created")
	}
}

func TestHealthEndpoint_PingError(t *testing.T) {
	tmpDir := t.TempDir()
	metaPath := filepath.Join(tmpDir, "meta.db")
	store, _ := auth.NewMetaStore(metaPath)
	s := &Server{cfg: &Config{MetaDB: metaPath}}

	mux := s.setupMux(nil, store, nil, connect.WithInterceptors())

	// Close DB to force ping error
	store.GetDB().Close()

	req := httpRequest("/health")
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusServiceUnavailable {
		t.Errorf("Expected status 503, got %d", rr.Code)
	}
}

func TestSetupMetadata_ErrorPaths(t *testing.T) {
	tmpDir := t.TempDir()
	metaPath := filepath.Join(tmpDir, "meta_err.db")

	store, err := auth.NewMetaStore(metaPath)
	require.NoError(t, err)

	// 1. Force Unmarshal error in "Load all other databases" loop
	ctx := context.Background()
	_ = store.UpsertDatabaseConfig(ctx, "corrupt_list", "path", false, "{invalid")

	// 2. Force Unmarshal error in "Sync initial mounts" loop (line 207 warning)
	_ = store.UpsertDatabaseConfig(ctx, "corrupt_sync", "path_sync", false, "{invalid")
	initialConfigs := []*dbv1.DatabaseConfig{
		{Name: "corrupt_sync", DbPath: "path_sync"},
	}

	s := &Server{}
	cfg := &Config{MetaDB: metaPath}
	_, configs, err := s.setupMetadata(cfg, initialConfigs)
	require.NoError(t, err)

	// "corrupt_list" should be skipped, "corrupt_sync" should log warning but keep name/path
	for _, c := range configs {
		if c.Name == "corrupt_list" {
			t.Errorf("Expected corrupt_list to be skipped")
		}
	}

	// 3. Trigger Mount failure (newly testable after refactor)
	badConfigs := []*dbv1.DatabaseConfig{
		{Name: "bad", DbPath: "/non/existent/path"},
	}
	_, _, err = s.setupMetadata(cfg, badConfigs)
	require.Error(t, err)
	if !strings.Contains(err.Error(), "mount connectivity check failed") {
		t.Errorf("Expected mount connectivity error, got: %v", err)
	}

	// 4. Trigger MetaStore init failure (newly testable after refactor)
	badCfg := &Config{MetaDB: filepath.Join(tmpDir, "not_a_dir", "meta.db")}
	os.WriteFile(filepath.Join(tmpDir, "not_a_dir"), []byte("x"), 0644)
	_, _, err = s.setupMetadata(badCfg, nil)
	require.Error(t, err)
	// 5. Trigger ListDatabaseConfigs failure (simulated by using a locked DB for the second part)
	// This is tricky because setupMetadata opens the DB.
	// But we can hit the 100% of setupMux and high coverage of others.
}

func httpRequest(path string) *http.Request {
	req, _ := http.NewRequest("GET", path, nil)
	return req
}
