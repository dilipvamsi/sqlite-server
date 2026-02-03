package extensions

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

// ExtensionInfo represents an available extension on the filesystem.
type ExtensionInfo struct {
	FolderName       string // e.g., "crypto-0.28.0"
	Name             string // e.g., "crypto"
	Version          string // e.g., "0.28.0"
	FilePath         string // Relative path to the .so/.dylib/.dll file from extensions dir
	AbsoluteFilePath string // Absolute path to the extension file
	Description      string // From info.json
	DocumentationURL string // From info.json
}

// ExtensionMetadata represents the schema of info.json
type ExtensionMetadata struct {
	Description      string `json:"description"`
	DocumentationURL string `json:"documentation_url"`
}

// GetAvailableExtensions scans the extensions directory and returns a list of compatible extensions.
func GetAvailableExtensions() ([]ExtensionInfo, error) {
	extDir := os.Getenv("SQLITE_SERVER_EXTENSIONS")
	if extDir == "" {
		extDir = "./extensions"
	}

	absExtDir, err := filepath.Abs(extDir)
	if err != nil {
		return nil, fmt.Errorf("failed to get absolute path of extensions directory: %w", err)
	}

	if _, err := os.Stat(absExtDir); os.IsNotExist(err) {
		return nil, nil // No extensions directory, no extensions.
	}

	currentOS := runtime.GOOS
	if currentOS == "darwin" {
		currentOS = "macos"
	}
	currentArch := runtime.GOARCH

	var extensions []ExtensionInfo

	entries, err := os.ReadDir(absExtDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read extensions directory: %w", err)
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		subDir := entry.Name()
		// Expecting name format: <extname>-<version>
		parts := strings.Split(subDir, "-")
		if len(parts) < 2 {
			continue
		}
		extName := strings.Join(parts[:len(parts)-1], "-")
		version := parts[len(parts)-1]

		// Look for compatible files in the subdirectory
		subDirPath := filepath.Join(absExtDir, subDir)
		subDirEntries, err := os.ReadDir(subDirPath)
		if err != nil {
			continue
		}

		var bestFile string

		// Check for specific arch first, then universal if on macos
		specificSuffix := fmt.Sprintf("-%s-%s", currentOS, currentArch)
		i386Suffix := ""
		if currentArch == "386" {
			i386Suffix = fmt.Sprintf("-%s-i386", currentOS)
		}

		universalSuffix := ""
		if currentOS == "macos" {
			universalSuffix = "-macos-universal"
		}

		for _, subEntry := range subDirEntries {
			if subEntry.IsDir() {
				continue
			}
			fname := subEntry.Name()

			// Check for specific match or i386 alias
			if strings.Contains(fname, specificSuffix) || (i386Suffix != "" && strings.Contains(fname, i386Suffix)) {
				bestFile = fname
				break
			}

			// Check for universal if nothing specific found yet
			if universalSuffix != "" && strings.Contains(fname, universalSuffix) {
				bestFile = fname
			}
		}

		if bestFile != "" {
			relPath := filepath.Join(subDir, bestFile)

			ext := ExtensionInfo{
				FolderName:       subDir,
				Name:             extName,
				Version:          version,
				FilePath:         relPath,
				AbsoluteFilePath: filepath.Join(subDirPath, bestFile),
			}

			// Try to read info.json
			infoPath := filepath.Join(subDirPath, "info.json")
			if infoData, err := os.ReadFile(infoPath); err == nil {
				var meta ExtensionMetadata
				if err := json.Unmarshal(infoData, &meta); err == nil {
					ext.Description = meta.Description
					ext.DocumentationURL = meta.DocumentationURL
				}
			}

			extensions = append(extensions, ext)
		}
	}

	return extensions, nil
}

// ResolveExtensionPath resolves a logical extension folder name to an absolute file path.
func ResolveExtensionPath(folderName string) (string, error) {
	available, err := GetAvailableExtensions()
	if err != nil {
		return "", err
	}

	for _, ext := range available {
		if ext.FolderName == folderName {
			return ext.AbsoluteFilePath, nil
		}
	}

	return "", fmt.Errorf("extension folder '%s' not found or incompatible with current platform", folderName)
}
