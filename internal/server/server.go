package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"google.golang.org/protobuf/encoding/protojson"

	"sqlite-server/internal/auth"
	"sqlite-server/internal/docs"
	"sqlite-server/internal/landing"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/protos/sqlrpc/v1/sqlrpcv1connect"
	servicesv1 "sqlite-server/internal/services/v1"
	"sqlite-server/internal/sqldrivers"
	"sqlite-server/internal/studio"

	_ "embed"
)

//go:embed VERSION
var Version string

func init() {
	Version = strings.TrimSpace(Version)
}

// Config holds the configuration for the SQLite server.
type Config struct {
	Mounts                string // Path to initial database mounts JSON
	Port                  int    // Port to listen on
	Host                  string // Host/IP to bind to
	ExtDir                string // Directory for SQLite extensions
	AuthDisabled          bool   // Whether to bypass authentication
	CorsOrigin            string // Allowed CORS origin
	MetaDB                string // Path to the metadata SQLite database
	DbDir                 string // Base directory for database files
	MountsOverwrite       bool   // Whether to overwrite metadata with mounts file
	InitialAdmin          string // Default admin username
	InitialPassword       string // Default admin password
	IdleTimeout           int    // Idle connection timeout in seconds
	ShutdownTimeout       int    // Graceful shutdown timeout in seconds
	ShowVersion           bool   // Whether to show version and exit
	DownloadExtensions    string // Comma-separated list of extensions to download
	DownloadAllExtensions bool   // Whether to download all extensions
}

// Server represents the SQLite server instance.
type Server struct {
	cfg        *Config
	dbServer   *servicesv1.DbServer
	authStore  *auth.MetaStore
	httpServer *http.Server
	version    string
}

// New creates a new Server instance.
func New(cfg *Config) *Server {
	return &Server{
		cfg:     cfg,
		version: Version,
	}
}

// Start initializes and starts the server.
func (s *Server) Start() error {
	// Ensure the base database directory exists
	initDbDir(s.cfg.DbDir)

	// Load static mounts from the specified JSON file (if any)
	initialConfigs := s.loadInitialConfigs(s.cfg.Mounts)

	log.Printf("[EXT] Extensions path: %s", s.cfg.ExtDir)

	// Setup Metadata Store & Configuration Synchronization
	var err error
	s.authStore, initialConfigs, err = s.setupMetadata(s.cfg, initialConfigs)
	if err != nil {
		return err
	}

	// Setup Middleware/Interceptors layer
	var interceptors connect.HandlerOption
	var authInterceptor *servicesv1.AuthInterceptor

	authEnabled := !s.cfg.AuthDisabled
	if authEnabled {
		authInterceptor = servicesv1.NewAuthInterceptor(s.authStore)
		interceptors = connect.WithInterceptors(
			servicesv1.LoggingInterceptor(),
			authInterceptor,
		)
		log.Println("[AUTH] Authentication ENABLED")
	} else {
		interceptors = connect.WithInterceptors(
			servicesv1.LoggingInterceptor(),
			servicesv1.NewNoAuthInterceptor(),
		)
		log.Println("[AUTH] Authentication DISABLED - Running in Anonymous Admin Mode")
	}

	// Initialize the Core Database Server
	s.dbServer = servicesv1.NewDbServer(initialConfigs, s.authStore)

	// Setup Routing and Handlers
	mux := s.setupMux(s.dbServer, s.authStore, authInterceptor, interceptors)

	// Configure HTTP server
	addr := fmt.Sprintf("%s:%d", s.cfg.Host, s.cfg.Port)
	s.httpServer = &http.Server{
		Addr:              addr,
		Handler:           h2c.NewHandler(s.newCORSHandler(mux, s.cfg.CorsOrigin), &http2.Server{}),
		ReadHeaderTimeout: 5 * time.Second,
		IdleTimeout:       time.Duration(s.cfg.IdleTimeout) * time.Second,
	}

	log.Printf("Starting gRPC/HTTP server on %s...", addr)
	if err := s.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("listen failed: %w", err)
	}

	return nil
}

// Stop gracefully shuts down the server.
func (s *Server) Stop(ctx context.Context) error {
	log.Println("Shutting down server...")

	var errs []error

	if s.httpServer != nil {
		if err := s.httpServer.Shutdown(ctx); err != nil {
			errs = append(errs, fmt.Errorf("HTTP server forced to shutdown: %w", err))
		}
	}

	if s.dbServer != nil {
		s.dbServer.Stop()
	}

	if s.authStore != nil {
		s.authStore.Close()
	}

	log.Println("Server exited properly.")

	if len(errs) > 0 {
		return errs[0] // Return the first error for simplicity
	}
	return nil
}

// setupMux initializes the HTTP multiplexer and registers all RPC and UI handlers.
func (s *Server) setupMux(dbServer *servicesv1.DbServer, authStore *auth.MetaStore, authInterceptor *servicesv1.AuthInterceptor, interceptors connect.HandlerOption) *http.ServeMux {
	mux := http.NewServeMux()

	// 1. Core Database Service (gRPC/Connect)
	dbPath, dbHandler := sqlrpcv1connect.NewDatabaseServiceHandler(dbServer, interceptors)
	mux.Handle(dbPath, dbHandler)

	// 2. Admin Service (gRPC/Connect) - only available when metadata store is active
	if authStore != nil {
		adminServer := servicesv1.NewAdminServer(authStore, dbServer, authInterceptor, s.cfg.AuthDisabled, s.version)
		adminPath, adminHandler := sqlrpcv1connect.NewAdminServiceHandler(adminServer, interceptors)
		mux.Handle(adminPath, adminHandler)
	}

	// 3. Static and UI content handlers
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		if authStore != nil {
			if err := authStore.GetDB().Ping(); err != nil {
				w.WriteHeader(http.StatusServiceUnavailable)
				w.Write([]byte(fmt.Sprintf("ERROR: metadata database unreachable: %v", err)))
				return
			}
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
	mux.HandleFunc("/version", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(s.version))
	})
	mux.Handle("/studio/", studio.NewHandler("/studio/"))
	mux.Handle("/docs/", docs.Handler())
	mux.HandleFunc("/", landing.Handler(s.cfg.Port))

	return mux
}

// setupMetadata initializes the MetaStore and performs the synchronization.
func (s *Server) setupMetadata(cfg *Config, initialConfigs []*sqlrpcv1.DatabaseConfig) (*auth.MetaStore, []*sqlrpcv1.DatabaseConfig, error) {
	authStore, err := auth.NewMetaStore(cfg.MetaDB)
	if err != nil {
		return nil, nil, fmt.Errorf("could not initialize metadata store: %w", err)
	}

	// Sync initial mounts to MetaStore
	syncedNames := make(map[string]bool)
	for _, dbCfg := range initialConfigs {
		if err := s.validateMountConnectivity(dbCfg); err != nil {
			authStore.Close()
			return nil, nil, fmt.Errorf("mount connectivity check failed for '%s': %w", dbCfg.Name, err)
		}

		existing, err := authStore.GetDatabaseConfig(context.Background(), dbCfg.Name)
		if err == nil && existing != nil && existing.Path == dbCfg.DbPath && !cfg.MountsOverwrite {
			log.Printf("Preserving existing metadata settings for mount '%s' (use --mounts-overwrite to update)", dbCfg.Name)
			if err := protojson.Unmarshal([]byte(existing.Settings), dbCfg); err != nil {
				log.Printf("Warning: failed to parse existing settings for '%s': %v", dbCfg.Name, err)
			}
			dbCfg.Name = existing.Name
			dbCfg.DbPath = existing.Path
		} else {
			settingsBytes, _ := protojson.Marshal(dbCfg)
			err = authStore.UpsertDatabaseConfig(context.Background(), dbCfg.Name, dbCfg.DbPath, false, string(settingsBytes))
			if err != nil {
				log.Printf("Warning: failed to sync config '%s' to metadata: %v", dbCfg.Name, err)
			}
		}
		syncedNames[dbCfg.Name] = true
	}

	// Load all other databases from MetaStore that weren't explicitly in the mounts file
	activeConfigs := initialConfigs
	storedConfigs, err := authStore.ListDatabaseConfigs(context.Background())
	if err == nil {
		for _, sc := range storedConfigs {
			if !syncedNames[sc.Name] {
				var dbCfg sqlrpcv1.DatabaseConfig
				if err := protojson.Unmarshal([]byte(sc.Settings), &dbCfg); err == nil {
					dbCfg.Name = sc.Name
					dbCfg.DbPath = sc.Path
					activeConfigs = append(activeConfigs, &dbCfg)
				}
			}
		}
	}

	// Ensure at least one admin user exists
	if _, err := authStore.EnsureDefaultAdmin(cfg.InitialAdmin, cfg.InitialPassword); err != nil {
		log.Printf("Warning: failed to ensure default admin: %v", err)
	}

	return authStore, activeConfigs, nil
}

// loadInitialConfigs attempts to load database configurations from a JSON mounts file.
func (s *Server) loadInitialConfigs(mountsFile string) []*sqlrpcv1.DatabaseConfig {
	var initialConfigs []*sqlrpcv1.DatabaseConfig
	if mountsFile == "" {
		return initialConfigs
	}
	if _, err := os.Stat(mountsFile); err == nil {
		configs, err := sqldrivers.LoadJsonDBConfigs(mountsFile)
		if err != nil {
			log.Printf("Warning: could not load configurations from '%s': %v", mountsFile, err)
		} else {
			initialConfigs = configs
			log.Printf("Loaded %d database configurations from: %s", len(initialConfigs), mountsFile)
		}
	}
	return initialConfigs
}

// validateMountConnectivity performs a transient test connection.
func (s *Server) validateMountConnectivity(cfg *sqlrpcv1.DatabaseConfig) error {
	db, err := sqldrivers.NewSqliteDb(cfg, false)
	if err != nil {
		return fmt.Errorf("failed to open: %w", err)
	}
	defer db.Close()
	if err := db.Ping(); err != nil {
		return fmt.Errorf("failed to ping: %w", err)
	}
	return nil
}

// newCORSHandler builds a basic CORS middleware.
func (s *Server) newCORSHandler(h http.Handler, allowedOrigin string) http.Handler {
	if allowedOrigin == "" {
		return h
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, CONNECT")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Connect-Protocol-Version, Authorization")
		w.Header().Set("Access-Control-Max-Age", "7200")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		h.ServeHTTP(w, r)
	})
}

// initDbDir creates the database directory if it doesn't exist.
func initDbDir(path string) {
	if path != "." {
		if err := os.MkdirAll(path, 0755); err != nil {
			log.Fatalf("Fatal: could not create database directory '%s': %v", path, err)
		}
		log.Printf("[DB] Base directory: %s", path)
	}
}
