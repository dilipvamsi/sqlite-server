package extensiondownloader

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

// DownloadExtensions downloads the specified extensions to the destination directory.
func DownloadExtensions(destDir string, exts []string) error {
	if len(exts) == 0 {
		return nil
	}

	// Ensure destination exists
	absDestDir, err := filepath.Abs(destDir)
	if err != nil {
		return fmt.Errorf("failed to get absolute path: %w", err)
	}
	if err := os.MkdirAll(absDestDir, 0755); err != nil {
		return fmt.Errorf("failed to create extensions directory: %w", err)
	}

	currentOS := runtime.GOOS
	if currentOS == "darwin" {
		currentOS = "macos"
	}
	currentArch := runtime.GOARCH

	// Handle 'all' keyword
	downloadList := []string{}
	for _, e := range exts {
		if e == "all" {
			downloadList = []string{"vec", "http", "mview", "sqlean"}
			break
		}
		downloadList = append(downloadList, e)
	}
	// Deduplicate
	downloadList = uniqueStrings(downloadList)

	for _, rawExt := range downloadList {
		rawExt = strings.TrimSpace(rawExt)
		if rawExt == "" {
			continue
		}

		extName := rawExt
		requestedVersion := ""
		if strings.Contains(rawExt, "@") {
			parts := strings.SplitN(rawExt, "@", 2)
			extName = parts[0]
			requestedVersion = parts[1]
		}

		if extName == "sqlean" {
			if err := downloadSQLean(absDestDir, currentOS, currentArch, requestedVersion); err != nil {
				fmt.Printf("Error downloading sqlean: %v\n", err)
			}
			continue
		}

		config, ok := Registry[extName]
		if !ok {
			fmt.Printf("Warning: Unknown extension '%s'\n", extName)
			continue
		}

		version := config.Version
		if requestedVersion != "" {
			version = requestedVersion
		}

		fmt.Printf("Downloading %s v%s...\n", config.Name, version)
		if err := downloadSingleExtension(absDestDir, config, currentOS, currentArch, version); err != nil {
			fmt.Printf("Error downloading %s: %v\n", extName, err)
		}
	}

	return nil
}

func downloadSingleExtension(destDir string, config ExtensionConfig, osName, arch, version string) error {
	url, filename, err := config.GetURL(osName, arch, version)
	if err != nil {
		return err
	}

	// Create target directory: <ext>-<version>
	targetDirName := fmt.Sprintf("%s-%s", config.Name, version)
	targetDir := filepath.Join(destDir, targetDirName)
	if _, err := os.Stat(targetDir); err == nil {
		fmt.Printf("  %s already exists, skipping.\n", targetDirName)
		return nil
	}

	// Temp dir for download
	tmpDir, err := os.MkdirTemp("", "sqlite-ext-dl-*")
	if err != nil {
		return err
	}
	defer os.RemoveAll(tmpDir)

	downloadPath := filepath.Join(tmpDir, filename)
	if err := downloadFile(url, downloadPath); err != nil {
		return err
	}

	// Check if it's a raw binary or archive
	var extractedFiles []string

	if strings.HasSuffix(filename, ".so") || strings.HasSuffix(filename, ".dylib") || strings.HasSuffix(filename, ".dll") {
		// It's a raw binary (like mview)
		extractedFiles = []string{downloadPath}
	} else {
		// Extract
		if strings.HasSuffix(filename, ".zip") {
			extractedFiles, err = extractZip(downloadPath, tmpDir)
		} else if strings.HasSuffix(filename, ".tar.gz") {
			extractedFiles, err = extractTarGz(downloadPath, tmpDir)
		} else {
			return fmt.Errorf("unknown archive format: %s", filename)
		}
		if err != nil {
			return fmt.Errorf("extraction failed: %w", err)
		}
	}

	// Find the library file
	libFile := config.FindLib(extractedFiles, osName, arch)
	if libFile == "" {
		// Fallback: try to find any .so/.dylib/.dll
		ext := getLibExt(osName)
		for _, f := range extractedFiles {
			if strings.HasSuffix(f, "."+ext) {
				libFile = f
				break
			}
		}
	}

	if libFile == "" {
		return fmt.Errorf("could not find library file in %s", filename)
	}

	// Prepare final destination
	if err := os.MkdirAll(targetDir, 0755); err != nil {
		return err
	}

	// Construct consistent filename: <name>-<version>-<os>-<arch>.<ext>
	finalName := fmt.Sprintf("%s-%s-%s-%s.%s", config.Name, version, osName, arch, getLibExt(osName))

	destPath := filepath.Join(targetDir, finalName)
	if err := copyFile(libFile, destPath); err != nil {
		return err
	}

	// Create info.json
	meta := ExtensionMetadata{
		Description:      config.Description,
		DocumentationURL: config.DocURL,
	}
	return writeInfoJSON(filepath.Join(targetDir, "info.json"), meta)
}

// Helpers

func downloadFile(url, dest string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	out, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}

func extractZip(src, dest string) ([]string, error) {
	r, err := zip.OpenReader(src)
	if err != nil {
		return nil, err
	}
	defer r.Close()

	var files []string
	for _, f := range r.File {
		fpath := filepath.Join(dest, f.Name)
		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, os.ModePerm)
			continue
		}

		if err := os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
			return nil, err
		}

		outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return nil, err
		}

		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return nil, err
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()

		if err != nil {
			return nil, err
		}
		files = append(files, fpath)
	}
	return files, nil
}

func extractTarGz(src, dest string) ([]string, error) {
	f, err := os.Open(src)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	gzr, err := gzip.NewReader(f)
	if err != nil {
		return nil, err
	}
	defer gzr.Close()

	tr := tar.NewReader(gzr)
	var files []string

	for {
		header, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		fpath := filepath.Join(dest, header.Name)
		if header.Typeflag == tar.TypeDir {
			os.MkdirAll(fpath, os.ModePerm)
			continue
		}

		if header.Typeflag == tar.TypeReg {
			if err := os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
				return nil, err
			}

			outFile, err := os.Create(fpath)
			if err != nil {
				return nil, err
			}
			if _, err := io.Copy(outFile, tr); err != nil {
				outFile.Close()
				return nil, err
			}
			outFile.Close()
			files = append(files, fpath)
		}
	}
	return files, nil
}

func copyFile(src, dest string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

func writeInfoJSON(path string, meta ExtensionMetadata) error {
	data, err := json.MarshalIndent(meta, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

func getLibExt(osName string) string {
	switch osName {
	case "windows":
		return "dll"
	case "macos":
		return "dylib"
	default:
		return "so"
	}
}

func uniqueStrings(input []string) []string {
	u := make([]string, 0, len(input))
	m := make(map[string]bool)
	for _, val := range input {
		if !m[val] {
			m[val] = true
			u = append(u, val)
		}
	}
	return u
}
