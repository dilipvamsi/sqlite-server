package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"sqlite-server/internal/extensions/extensiondownloader"
	"sqlite-server/internal/server"
)

func main() {
	// 1. Initial configuration and flag parsing
	cfg := parseFlags()

	if cfg.ShowVersion {
		fmt.Printf("sqlite-server version %s\n", server.Version)
		os.Exit(0)
	}

	// 1.5. Download extensions if requested (exit after completion)
	if cfg.DownloadAllExtensions {
		log.Println("Downloading all extensions...")
		if err := extensiondownloader.DownloadExtensions(cfg.ExtDir, []string{"all"}); err != nil {
			log.Fatalf("Fatal: failed to download extensions: %v", err)
		}
		log.Println("All extensions downloaded successfully.")
		os.Exit(0)
	} else if cfg.DownloadExtensions != "" {
		log.Println("Downloading extensions...")
		list := strings.Split(cfg.DownloadExtensions, ",")
		if err := extensiondownloader.DownloadExtensions(cfg.ExtDir, list); err != nil {
			log.Fatalf("Fatal: failed to download extensions: %v", err)
		}
		log.Println("Extensions downloaded successfully.")
		os.Exit(0)
	}

	// 2. Initialize the Server
	srv := server.New(cfg)

	// 3. Start the Server in a background goroutine
	go func() {
		if err := srv.Start(); err != nil {
			log.Fatalf("Fatal: server failed: %v", err)
		}
	}()

	// 4. Handle Graceful Shutdown
	handleGracefulShutdown(srv, cfg.ShutdownTimeout)
}

// parseFlags initializes the FlagSet and parses CLI arguments/environment variables.
func parseFlags() *server.Config {
	cfg := &server.Config{}
	fs := flag.NewFlagSet("sqlite-server", flag.ExitOnError)

	// Define flags with both environment variable fallbacks and default values
	fs.StringVar(&cfg.Mounts, "mounts", getEnv("SQLITE_SERVER_MOUNTS", ""), "Path to the JSON database mount configurations file")
	fs.IntVar(&cfg.Port, "port", getEnvInt("SQLITE_SERVER_PORT", 50173), "Port to listen on")
	fs.StringVar(&cfg.Host, "host", getEnv("SQLITE_SERVER_HOST", "localhost"), "Host to bind to")
	fs.StringVar(&cfg.ExtDir, "extensions", getEnv("SQLITE_SERVER_EXTENSIONS", "./extensions"), "Path to the extensions directory")
	fs.BoolVar(&cfg.AuthDisabled, "auth-disabled", getEnvBool("SQLITE_SERVER_AUTH_ENABLED", true) == false, "Disable authentication")
	fs.StringVar(&cfg.CorsOrigin, "cors-origin", getEnv("SQLITE_SERVER_CORS_ORIGIN", ""), "Allowed CORS origin")
	fs.StringVar(&cfg.MetaDB, "meta-db", getEnv("SQLITE_SERVER_META_DB", "_meta.db"), "Path to the metadata database")
	fs.StringVar(&cfg.DbDir, "db-dir", getEnv("SQLITE_SERVER_DB_DIR", "./databases"), "Base directory for all database files")
	fs.BoolVar(&cfg.MountsOverwrite, "mounts-overwrite", false, "Overwrite existing database configurations in metadata with mounts file")
	fs.StringVar(&cfg.InitialAdmin, "initial-admin", getEnv("SQLITE_SERVER_INITIAL_ADMIN", "admin"), "Username for the initial admin user")
	fs.StringVar(&cfg.InitialPassword, "initial-password", getEnv("SQLITE_SERVER_INITIAL_PASSWORD", ""), "Password for the initial admin user (if not set, random will be generated)")
	fs.IntVar(&cfg.IdleTimeout, "idle-timeout", getEnvInt("SQLITE_SERVER_IDLE_TIMEOUT", 120), "Idle connection timeout in seconds")
	fs.IntVar(&cfg.ShutdownTimeout, "shutdown-timeout", getEnvInt("SQLITE_SERVER_SHUTDOWN_TIMEOUT", 10), "Graceful shutdown timeout in seconds")
	fs.BoolVar(&cfg.ShowVersion, "version", false, "Print server version and exit")
	fs.StringVar(&cfg.DownloadExtensions, "download-extensions", getEnv("SQLITE_SERVER_DOWNLOAD_EXTENSIONS", ""), "Comma-separated list of extensions to download/update on startup (e.g. 'sqlean,vec,http' or 'all')")
	fs.BoolVar(&cfg.DownloadAllExtensions, "download-all-extensions", false, "Download all available extensions on startup")

	// Custom Usage to support --flag style and clean documentation
	fs.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: %s [flags]\n\nFlags:\n", os.Args[0])
		fs.VisitAll(func(f *flag.Flag) {
			s := fmt.Sprintf("  --%s", f.Name)
			name, usage := flag.UnquoteUsage(f)
			if len(name) > 0 {
				s += " " + name
			}
			fmt.Fprintf(os.Stderr, "%-20s\n    \t%s", s, usage)
			if f.DefValue != "" {
				fmt.Fprintf(os.Stderr, " (default %v)", f.DefValue)
			}
			fmt.Fprint(os.Stderr, "\n")
		})
	}

	if err := fs.Parse(os.Args[1:]); err != nil {
		log.Fatalf("Fatal: failed to parse flags: %v", err)
	}

	if fs.NArg() > 0 {
		log.Fatalf("Fatal: unexpected positional arguments: %v", fs.Args())
	}

	return cfg
}

// handleGracefulShutdown waits for termination signals and shuts down the server cleanly.
func handleGracefulShutdown(srv *server.Server, timeout int) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	<-quit
	log.Println("Shutting down server...")

	// Create a context with timeout for the graceful shutdown period
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Second)
	defer cancel()

	if err := srv.Stop(ctx); err != nil {
		log.Printf("Shutdown error: %v", err)
	}
}

// getEnv retrieves an environment variable or returns a fallback string.
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// getEnvInt retrieves an environment variable as an integer or returns a fallback.
func getEnvInt(key string, fallback int) int {
	valueStr, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return fallback
	}
	return value
}

// getEnvBool retrieves an environment variable as a boolean or returns a fallback.
func getEnvBool(key string, fallback bool) bool {
	valueStr, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	value, err := strconv.ParseBool(valueStr)
	if err != nil {
		return fallback
	}
	return value
}
