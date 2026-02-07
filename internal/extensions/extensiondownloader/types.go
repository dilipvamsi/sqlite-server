package extensiondownloader

// ExtensionConfig defines how to download and install a specific extension
type ExtensionConfig struct {
	Name        string
	Version     string
	BaseURL     string // Constructed dynamically or static
	Description string
	DocURL      string
	// Function to generate the download URL based on OS and Arch
	GetURL func(osName, arch, version string) (string, string, error) // Returns URL, filename, error
	// Function to find the library file in the extracted archive
	FindLib func(files []string, osName, arch string) string
}

// ExtensionMetadata represents the schema of info.json
type ExtensionMetadata struct {
	Description      string `json:"description"`
	DocumentationURL string `json:"documentation_url"`
}
