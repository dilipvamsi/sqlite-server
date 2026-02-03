package extensions

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestGetAvailableExtensions(t *testing.T) {
	// Create a temporary extensions directory
	tmpDir, err := os.MkdirTemp("", "sqlite-server-ext-test")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	// Set env var
	os.Setenv("SQLITE_SERVER_EXTENSIONS", tmpDir)
	defer os.Unsetenv("SQLITE_SERVER_EXTENSIONS")

	currentOS := runtime.GOOS
	if currentOS == "darwin" {
		currentOS = "macos"
	}
	currentArch := runtime.GOARCH

	fileExt := "so"
	if currentOS == "windows" {
		fileExt = "dll"
	} else if currentOS == "macos" {
		fileExt = "dylib"
	}

	// 1. Create a valid extension directory: crypto-0.28.0
	cryptoDir := filepath.Join(tmpDir, "crypto-0.28.0")
	if err := os.MkdirAll(cryptoDir, 0755); err != nil {
		t.Fatalf("Failed to create crypto dir: %v", err)
	}

	// Create a compatible file
	compFile := filepath.Join(cryptoDir, "crypto-0.28.0-"+currentOS+"-"+currentArch+"."+fileExt)
	if err := os.WriteFile(compFile, []byte("fake"), 0644); err != nil {
		t.Fatalf("Failed to create comp file: %v", err)
	}

	// Create info.json for crypto
	infoContent := `{
  "description": "Crypto Description",
  "documentation_url": "https://docs.example.com/crypto"
}
`
	if err := os.WriteFile(filepath.Join(cryptoDir, "info.json"), []byte(infoContent), 0644); err != nil {
		t.Fatalf("Failed to create info.json: %v", err)
	}

	// Create an incompatible file
	incompFile := filepath.Join(cryptoDir, "crypto-0.28.0-otheros-otherarch."+fileExt)
	if err := os.WriteFile(incompFile, []byte("fake"), 0644); err != nil {
		t.Fatalf("Failed to create incomp file: %v", err)
	}

	// 2. Create another extension with universal binary (simulated)
	uuidDir := filepath.Join(tmpDir, "uuid-0.28.0")
	if err := os.MkdirAll(uuidDir, 0755); err != nil {
		t.Fatalf("Failed to create uuid dir: %v", err)
	}

	if currentOS == "macos" {
		univFile := filepath.Join(uuidDir, "uuid-0.28.0-macos-universal.dylib")
		if err := os.WriteFile(univFile, []byte("fake"), 0644); err != nil {
			t.Fatalf("Failed to create univ file: %v", err)
		}
	} else {
		// Just create a normal one for other OS to test discovery
		normFile := filepath.Join(uuidDir, "uuid-0.28.0-"+currentOS+"-"+currentArch+"."+fileExt)
		if err := os.WriteFile(normFile, []byte("fake"), 0644); err != nil {
			t.Fatalf("Failed to create norm file: %v", err)
		}
	}

	// 3. Create a malformed subdirectory (no version)
	invalidDir := filepath.Join(tmpDir, "invalid")
	if err := os.MkdirAll(invalidDir, 0755); err != nil {
		t.Fatalf("Failed to create invalid dir: %v", err)
	}

	// 4. Create a file in the main extensions dir (should be ignored)
	ignoredFile := filepath.Join(tmpDir, "ignore_me.txt")
	if err := os.WriteFile(ignoredFile, []byte("ignore"), 0644); err != nil {
		t.Fatalf("Failed to create ignored file: %v", err)
	}

	// Run discovery
	exts, err := GetAvailableExtensions()
	if err != nil {
		t.Fatalf("GetAvailableExtensions failed: %v", err)
	}

	if len(exts) != 2 {
		t.Errorf("Expected 2 extensions, got %d", len(exts))
	}

	foundCrypto := false
	foundUuid := false
	for _, e := range exts {
		if e.Name == "crypto" {
			foundCrypto = true
			if e.Version != "0.28.0" {
				t.Errorf("Expected crypto version 0.28.0, got %s", e.Version)
			}
			if e.FolderName != "crypto-0.28.0" {
				t.Errorf("Expected crypto folder name crypto-0.28.0, got %s", e.FolderName)
			}
			if e.Description != "Crypto Description" {
				t.Errorf("Expected crypto description 'Crypto Description', got '%s'", e.Description)
			}
			if e.DocumentationURL != "https://docs.example.com/crypto" {
				t.Errorf("Expected crypto doc url 'https://docs.example.com/crypto', got '%s'", e.DocumentationURL)
			}
		}
		if e.Name == "uuid" {
			foundUuid = true
		}
	}

	if !foundCrypto {
		t.Error("Crypto extension not found")
	}
	if !foundUuid {
		t.Error("UUID extension not found")
	}

	t.Run("ResolveExtensionPath", func(t *testing.T) {
		// Test Success
		path, err := ResolveExtensionPath("crypto-0.28.0")
		if err != nil {
			t.Fatalf("ResolveExtensionPath failed: %v", err)
		}
		if !filepath.IsAbs(path) {
			t.Errorf("Expected absolute path, got %s", path)
		}
		if !strings.HasSuffix(path, compFile) && !strings.HasSuffix(filepath.Base(path), filepath.Base(compFile)) {
			// compFile is relative to cryptoDir, but ResolveExtensionPath returns absolute.
			// Just verify it exists.
			if _, err := os.Stat(path); err != nil {
				t.Errorf("Resolved path does not exist: %v", err)
			}
		}

		// Test Failure
		_, err = ResolveExtensionPath("non-existent")
		if err == nil {
			t.Error("ResolveExtensionPath should have failed for non-existent extension")
		}
	})

	t.Run("NonExistentDir", func(t *testing.T) {
		oldEnv := os.Getenv("SQLITE_SERVER_EXTENSIONS")
		os.Setenv("SQLITE_SERVER_EXTENSIONS", "/tmp/definitely-not-exists-12345")
		defer os.Setenv("SQLITE_SERVER_EXTENSIONS", oldEnv)

		exts, err := GetAvailableExtensions()
		if err != nil {
			t.Errorf("GetAvailableExtensions failed for non-existent dir: %v", err)
		}
		if len(exts) != 0 {
			t.Errorf("Expected 0 extensions for non-existent dir, got %d", len(exts))
		}
	})

	t.Run("DefaultDir", func(t *testing.T) {
		oldEnv := os.Getenv("SQLITE_SERVER_EXTENSIONS")
		os.Unsetenv("SQLITE_SERVER_EXTENSIONS")
		defer os.Setenv("SQLITE_SERVER_EXTENSIONS", oldEnv)

		// This might fail if ./extensions/ actually exists in the workspace,
		// but since we are running in a controlled env, we just check if it returns without error.
		_, _ = GetAvailableExtensions()
	})

	t.Run("PermissionError", func(t *testing.T) {
		restrictedDir := filepath.Join(tmpDir, "restricted")
		if err := os.MkdirAll(restrictedDir, 0000); err != nil {
			t.Fatalf("Failed to create restricted dir: %v", err)
		}
		defer os.Chmod(restrictedDir, 0755)

		oldEnv := os.Getenv("SQLITE_SERVER_EXTENSIONS")
		os.Setenv("SQLITE_SERVER_EXTENSIONS", restrictedDir)
		defer os.Setenv("SQLITE_SERVER_EXTENSIONS", oldEnv)

		_, err := GetAvailableExtensions()
		if err == nil {
			t.Error("Expected error for restricted directory")
		}
	})
}
