package main

import (
	"flag"
	"sqlite-server/internal/sqldrivers"
	"log"
	"os"
)

const (
	numAccounts    = 100
	initialBalance = 1000
)

func main() {
	enableCipher := flag.Bool("cipher", false, "Enable default ciphering")

	// Parse the command-line arguments.
	flag.Parse()

	var config sqldrivers.DBConfig
	if *enableCipher {
		config = sqldrivers.DBConfig{
			Name:        "loadtest-mixed-cipher",
			DBPath:      "./data-test/loadtest-mixed-cipher.db",
			IsEncrypted: true,
		}
	} else {
		config = sqldrivers.DBConfig{
			Name:   "loadtest",
			DBPath: "./data-test/loadtest-mixed.db",
		}
	}

	_ = os.Remove(config.DBPath) // Remove old db file if it exists

	log.Printf("Creating test database: %s", config.DBPath)
	db, err := sqldrivers.NewSqliteDb(config)
	if err != nil {
		log.Fatalf("Fatal: failed to open db: %v", err)
	}
	defer db.Close()

	createTableSQL := `CREATE TABLE accounts (id INTEGER PRIMARY KEY, balance REAL NOT NULL);`
	if _, err := db.Exec(createTableSQL); err != nil {
		log.Fatalf("Fatal: failed to create table: %v", err)
	}

	log.Printf("Inserting %d accounts with initial balance of %d...", numAccounts, initialBalance)
	tx, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}

	stmt, err := tx.Prepare("INSERT INTO accounts(id, balance) VALUES(?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	for i := 1; i <= numAccounts; i++ {
		if _, err := stmt.Exec(i, initialBalance); err != nil {
			log.Fatal(err)
		}
	}
	tx.Commit()

	expectedSum := float64(numAccounts * initialBalance)
	log.Printf("Database setup complete. Initial total balance (for verification): %.2f", expectedSum)
}
