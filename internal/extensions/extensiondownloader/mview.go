package extensiondownloader

import (
	"fmt"
)

func init() {
	Register(ExtensionConfig{
		Name:        "mview",
		Version:     "3.0.0",
		Description: "Materialized Views for SQLite",
		DocURL:      "https://github.com/dilipvamsi/sqlite-mview",
		GetURL: func(osName, arch, version string) (string, string, error) {
			var filename string
			switch osName {
			case "linux":
				switch arch {
				case "arm64":
					filename = "mview-linux-arm64.so"
				case "amd64":
					filename = "mview-linux-x64.so"
				}
			case "macos":
				filename = "mview-macos-universal.dylib"
			case "windows":
				switch arch {
				case "arm64":
					filename = "mview-windows-arm64.dll"
				case "amd64":
					filename = "mview-windows-x64.dll"
				case "386":
					filename = "mview-windows-x86.dll"
				}
			}

			if filename == "" {
				return "", "", fmt.Errorf("unsupported platform for mview: %s/%s", osName, arch)
			}

			url := fmt.Sprintf("https://github.com/dilipvamsi/sqlite-mview/releases/download/v%s/%s", version, filename)
			return url, filename, nil
		},
		FindLib: func(files []string, osName, arch string) string {
			if len(files) > 0 {
				return files[0]
			}
			return ""
		},
	})
}
