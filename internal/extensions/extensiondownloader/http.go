package extensiondownloader

import (
	"fmt"
	"path/filepath"
)

func init() {
	Register(ExtensionConfig{
		Name:        "http",
		Version:     "0.1.1",
		Description: "HTTP request support for SQLite",
		DocURL:      "https://github.com/asg017/sqlite-http",
		GetURL: func(osName, arch, version string) (string, string, error) {
			var remoteSuffix string
			var archiveType string = "tar.gz"

			switch osName {
			case "linux":
				switch arch {
				case "amd64":
					remoteSuffix = "linux-x86_64"
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
					archiveType = "zip"
				}
			}

			if remoteSuffix == "" {
				return "", "", fmt.Errorf("unsupported platform for http: %s/%s", osName, arch)
			}

			filename := fmt.Sprintf("sqlite-http-v%s-loadable-%s.%s", version, remoteSuffix, archiveType)
			url := fmt.Sprintf("https://github.com/asg017/sqlite-http/releases/download/v%s/%s", version, filename)
			return url, filename, nil
		},
		FindLib: func(files []string, osName, arch string) string {
			ext := getLibExt(osName)
			target := "http0." + ext
			for _, f := range files {
				if filepath.Base(f) == target {
					return f
				}
			}
			return ""
		},
	})
}
