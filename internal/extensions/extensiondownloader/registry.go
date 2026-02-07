package extensiondownloader

var (
	// Registry of known extensions
	Registry = map[string]ExtensionConfig{}
)

func Register(cfg ExtensionConfig) {
	Registry[cfg.Name] = cfg
}
