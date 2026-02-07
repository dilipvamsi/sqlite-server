package extensiondownloader

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// SQLeanPlatformMap maps os/arch to sqlean release suffix
var SQLeanPlatformMap = map[string]string{
	"linux/arm64":   "linux-arm64",
	"linux/amd64":   "linux-x64",
	"macos/arm64":   "macos-arm64",
	"macos/amd64":   "macos-x64",
	"windows/amd64": "win-x64",
}

func downloadSQLean(destDir, osName, arch, requestedVersion string) error {
	version := "0.28.0" // default
	if requestedVersion != "" {
		version = requestedVersion
	}
	platformKey := fmt.Sprintf("%s/%s", osName, arch)
	remoteSuffix, ok := SQLeanPlatformMap[platformKey]
	if !ok {
		return fmt.Errorf("unsupported platform for sqlean: %s", platformKey)
	}

	filename := fmt.Sprintf("sqlean-%s.zip", remoteSuffix)
	url := fmt.Sprintf("https://github.com/nalgeon/sqlean/releases/download/%s/%s", version, filename)

	fmt.Printf("Downloading sqlean v%s...\n", version)

	tmpDir, err := os.MkdirTemp("", "sqlean-dl-*")
	if err != nil {
		return err
	}
	defer os.RemoveAll(tmpDir)

	downloadPath := filepath.Join(tmpDir, filename)
	if err := downloadFile(url, downloadPath); err != nil {
		return err
	}

	extractedFiles, err := extractZip(downloadPath, tmpDir)
	if err != nil {
		return err
	}

	ext := getLibExt(osName)
	for _, file := range extractedFiles {
		if !strings.HasSuffix(file, "."+ext) {
			continue
		}

		baseName := filepath.Base(file)
		extName := strings.TrimSuffix(baseName, "."+ext)

		// Target dir: sqlean-<extname>-<version>
		targetDirName := fmt.Sprintf("sqlean-%s-%s", extName, version)
		targetDir := filepath.Join(destDir, targetDirName)

		if err := os.MkdirAll(targetDir, 0755); err != nil {
			return err
		}

		finalName := fmt.Sprintf("%s-%s-%s-%s.%s", extName, version, osName, arch, ext)
		destPath := filepath.Join(targetDir, finalName)

		if err := copyFile(file, destPath); err != nil {
			return err
		}

		// info.json
		writeInfoJSON(filepath.Join(targetDir, "info.json"), ExtensionMetadata{
			Description:      fmt.Sprintf("SQLean %s extension", extName),
			DocumentationURL: fmt.Sprintf("https://github.com/nalgeon/sqlean/blob/main/docs/%s.md", extName),
		})
	}
	return nil
}
