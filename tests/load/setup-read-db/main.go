package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sqlite-server/internal/sqldrivers"

	dbv1 "sqlite-server/internal/protos/db/v1"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	enableCipher := flag.Bool("cipher", false, "Enable default ciphering")

	// Parse the command-line arguments.
	flag.Parse()

	var config *dbv1.DatabaseConfig
	if *enableCipher {
		config = &dbv1.DatabaseConfig{
			Name:        "loadtest-cipher",
			DbPath:      "./data-test/loadtest-cipher.db",
			IsEncrypted: true,
		}
	} else {
		config = &dbv1.DatabaseConfig{
			Name:   "loadtest",
			DbPath: "./data-test/loadtest.db",
		}
	}

	// Ensure directory exists
	if err := os.MkdirAll("data-test", 0755); err != nil {
		log.Fatalf("Failed to create data dir: %v", err)
	}

	// cwd, _ := os.Getwd()
	absPath, _ := filepath.Abs(config.DbPath)
	// log.Printf("Absolute DB path: %s", absPath)

	// Update config to use absolute path to avoid potential relative path issues with sqlite/CGO
	config.DbPath = absPath

	_ = os.Remove(config.DbPath)
	_ = os.Remove(config.DbPath + "-wal")
	_ = os.Remove(config.DbPath + "-shm")

	log.Printf("Creating test database: %s", config.DbPath)
	db, err := sqldrivers.NewSqliteDb(config, false)
	if err != nil {
		log.Fatalf("Fatal: failed to open db: %v", err)
	}
	defer db.Close()

	createTableSQL := `
	CREATE TABLE users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		email TEXT,
		country TEXT,
		age INTEGER
	);`
	if _, err := db.Exec(createTableSQL); err != nil {
		log.Fatalf("Fatal: failed to create table: %v", err)
	}

	log.Println("Inserting 10,000 records...")
	tx, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}

	stmt, err := tx.Prepare("INSERT INTO users(name, email, country, age) VALUES(?, ?, ?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	for i := 0; i < 10000; i++ {
		name := fmt.Sprintf("User %d", i)
		email := fmt.Sprintf("user%d@example.com", i)
		country := "USA"
		if i%5 == 0 {
			country = "Canada"
		}
		age := 20 + (i % 50)
		if _, err := stmt.Exec(name, email, country, age); err != nil {
			log.Fatal(err)
		}
	}
	tx.Commit()

	log.Println("Database setup complete.")
}
