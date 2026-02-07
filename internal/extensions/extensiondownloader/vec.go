package extensiondownloader

import (
	"fmt"
	"path/filepath"
)

func init() {
	Register(ExtensionConfig{
		Name:        "vec",
		Version:     "0.1.6",
		Description: "A vector search extension for SQLite",
		DocURL:      "https://github.com/asg017/sqlite-vec",
		GetURL: func(osName, arch, version string) (string, string, error) {
			var remoteSuffix string
			switch osName {
			case "linux":
				switch arch {
				case "amd64":
					remoteSuffix = "linux-x86_64"
				case "arm64":
					remoteSuffix = "linux-aarch64"
				}
			case "macos":
				switch arch {
				case "amd64":
					remoteSuffix = "macos-x86_64"
				case "arm64":
					remoteSuffix = "macos-aarch64"
				}
			case "windows":
				switch arch {
				case "amd64":
					remoteSuffix = "windows-x86_64"
				}
			}

			if remoteSuffix == "" {
				return "", "", fmt.Errorf("unsupported platform for vec: %s/%s", osName, arch)
			}

			filename := fmt.Sprintf("sqlite-vec-%s-loadable-%s.tar.gz", version, remoteSuffix)
			url := fmt.Sprintf("https://github.com/asg017/sqlite-vec/releases/download/v%s/%s", version, filename)
			return url, filename, nil
		},
		FindLib: func(files []string, osName, arch string) string {
			ext := getLibExt(osName)
			target := "vec0." + ext
			for _, f := range files {
				if filepath.Base(f) == target {
					return f
				}
			}
			return ""
		},
	})
}
