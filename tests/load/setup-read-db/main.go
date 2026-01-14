package main

import (
	"flag"
	"fmt"
	"sqlite-server/internal/sqldrivers"
	"log"
	"os"
)

func main() {
	enableCipher := flag.Bool("cipher", false, "Enable default ciphering")

	// Parse the command-line arguments.
	flag.Parse()

	var config sqldrivers.DBConfig
	if *enableCipher {
		config = sqldrivers.DBConfig{
			Name:        "loadtest-cipher",
			DBPath:      "loadtest-cipher.db",
			IsEncrypted: true,
		}
	} else {
		config = sqldrivers.DBConfig{
			Name:   "loadtest",
			DBPath: "loadtest.db",
		}
	}

	_ = os.Remove(config.DBPath) // Remove old db file if it exists

	log.Printf("Creating test database: %s", config.DBPath)
	db, err := sqldrivers.NewSqliteDb(config)
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
