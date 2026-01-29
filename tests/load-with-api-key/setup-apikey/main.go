/**
 * @file Setup script to create an API key for load testing
 * @description Creates an admin user and generates an API key for auth load tests
 */
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"sqlite-server/internal/auth"
)

func main() {
	keyName := flag.String("name", "loadtest-key", "Name for the API key")
	flag.Parse()

	// Initialize MetaStore
	store, err := auth.NewMetaStore("_meta.db")
	if err != nil {
		log.Fatalf("Failed to open meta store: %v", err)
	}
	defer store.Close()

	// Ensure admin user exists
	password, err := store.EnsureDefaultAdmin()
	if err != nil {
		log.Fatalf("Failed to ensure admin: %v", err)
	}
	if password != "" {
		log.Printf("Created admin user with password: %s", password)
	}

	// Get admin user ID
	ctx := context.Background()
	adminUser, err := store.GetUserByUsername(ctx, "admin")
	if err != nil {
		log.Fatalf("Failed to get admin user: %v", err)
	}
	if adminUser == nil {
		log.Fatal("Admin user not found")
	}

	// Create API key
	rawKey, keyID, err := store.CreateApiKey(ctx, adminUser.ID, *keyName, nil)
	if err != nil {
		log.Fatalf("Failed to create API key: %v", err)
	}

	log.Printf("Created API key (ID: %s, Name: %s)", keyID, *keyName)

	// Output the key in a format that can be used directly
	fmt.Println("\n=== API KEY FOR LOAD TESTS ===")
	fmt.Printf("export LOADTEST_API_KEY='%s'\n", rawKey)
	fmt.Println("==============================")

	// Also write to a file for convenience
	os.WriteFile(".loadtest-api-key", []byte(rawKey), 0600)
	log.Println("Key also saved to .loadtest-api-key")
}
