package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"sqlite-server/internal/auth"
	"sqlite-server/internal/protos/db/v1/dbv1connect"
	servicesv1 "sqlite-server/internal/services/v1"
	"sqlite-server/internal/sqldrivers"
)

// ===================================================================================
// Main Application Entry Point
// ===================================================================================

func main() {
	// 1. Argument Parsing & Configuration
	var configFile string
	switch len(os.Args) {
	case 1:
		configFile = "config.json"
		log.Printf("No configuration file specified, using default: %s", configFile)
	case 2:
		configFile = os.Args[1]
		log.Printf("Using configuration file: %s", configFile)
	default:
		fmt.Fprintf(os.Stderr, "Error: Too many arguments.\nUsage: %s [config_file]\n", os.Args[0])
		os.Exit(1)
	}

	configs, err := sqldrivers.LoadJsonDBConfigs(configFile)
	if err != nil {
		log.Fatalf("Fatal: could not load configurations from '%s': %v", configFile, err)
	}

	// 2. Service Initialization
	// NewDbServer starts the background 'Reaper' goroutine.
	dbServer := servicesv1.NewDbServer(configs)

	// Check if auth is enabled (default: true)
	authEnabled := os.Getenv("SQLITE_SERVER_AUTH_ENABLED") != "false"

	var interceptors connect.HandlerOption
	var authStore *auth.MetaStore

	if authEnabled {
		// Initialize Auth MetaStore
		var err error
		authStore, err = auth.NewMetaStore("_meta.db")
		if err != nil {
			log.Fatalf("Fatal: could not initialize auth store: %v", err)
		}
		defer authStore.Close()

		// Create Default Admin (if needed)
		if _, err := authStore.EnsureDefaultAdmin(); err != nil {
			log.Printf("Warning: failed to ensure default admin: %v", err)
		}

		// Chain Logging and Auth interceptors
		authInterceptor := servicesv1.NewAuthInterceptor(authStore)
		interceptors = connect.WithInterceptors(
			servicesv1.LoggingInterceptor(),
			authInterceptor,
		)
		log.Println("[AUTH] Authentication ENABLED")
	} else {
		// No auth, just logging
		interceptors = connect.WithInterceptors(
			servicesv1.LoggingInterceptor(),
		)
		log.Println("[AUTH] Authentication DISABLED (SQLITE_SERVER_AUTH_ENABLED=false)")
	}

	// 3. HTTP Server Setup
	path, handler := dbv1connect.NewDatabaseServiceHandler(dbServer, interceptors)
	mux := http.NewServeMux()
	mux.Handle(path, handler)

	// Register AdminService (only if auth is enabled)
	if authEnabled && authStore != nil {
		adminServer := servicesv1.NewAdminServer(authStore)
		adminPath, adminHandler := dbv1connect.NewAdminServiceHandler(adminServer, interceptors)
		mux.Handle(adminPath, adminHandler)
	}

	srv := &http.Server{
		Addr: ":50051",
		// h2c is required for gRPC over cleartext (no TLS).
		Handler: h2c.NewHandler(mux, &http2.Server{}),
		// Good practice: Set timeouts to prevent slowloris attacks
		ReadHeaderTimeout: 5 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	// 4. Start Server in a Goroutine
	// This allows the main thread to block waiting for a shutdown signal.
	go func() {
		log.Println("Starting gRPC/HTTP server on localhost:50051...")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Fatal: listen failed: %v", err)
		}
	}()

	// 5. Graceful Shutdown Logic
	// Create a channel to listen for interrupt signals (Ctrl+C, SIGTERM).
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	// Block here until a signal is received.
	<-quit
	log.Println("Shutting down server...")

	// Create a context with a timeout to allow active requests to finish.
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// A. Stop accepting new HTTP requests and wait for active ones to complete.
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("HTTP server forced to shutdown: %v", err)
	}

	// B. Stop the DbServer background processes (Transaction Reaper).
	// This ensures the background goroutine exits cleanly.
	dbServer.Stop()

	log.Println("Server exited properly.")
}
