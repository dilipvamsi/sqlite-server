package sqldrivers

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"

	dbv1 "sqlite-server/internal/protos/db/v1"
)

const DefaultEncryptionKey = "4ddd9418-1589-4887-a5b0-ad518bd764dd"

// LoadJsonDBConfigs loads database configurations from a JSON file.
// It returns a slice of *dbv1.DatabaseConfig.
func LoadJsonDBConfigs(filename string) ([]*dbv1.DatabaseConfig, error) {
	// Read the entire configuration file from disk.
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, fmt.Errorf("could not read config file '%s': %w", filename, err)
	}

	var configs []*dbv1.DatabaseConfig
	// Note: Standard json.Unmarshal works here because the proto generated struct
	// has json tags that might match if we align them, or we rely on the field names.
	// However, protojson is the "correct" way for protobufs, but it expects exact proto JSON format
	// (camelCase fields by default).
	// Let's check if the existing config.json matches the proto's JSON mapping.
	// The proto fields are snake_case in .proto, but generated Go struct has CamelCase fields
	// and `json:"field_name,omitempty"` tags using lowerCamelCase usually (or defined by proto names).
	//
	// Actually, `protoc-gen-go` generates struct fields with `json:"name,omitempty"`.
	// The proto definition used `name`, `db_path`.
	// `db_path` in proto will be `DbPath` in Go and `json:"dbPath,omitempty"` (default mapping) or `json:"db_path"` depending on options.
	// Let's stick to standard `json` unmarshal for now as it's more flexible with standard JSON files if keys match specific tags.
	// BUT, the proto generated tags are usually `protobuf:"..." json:"name,omitempty"`.
	// Let's try standard json unmarshal first.
	if err := json.Unmarshal(data, &configs); err != nil {
		// Fallback: try to unmarshal as a list of raw maps and verify/convert if needed?
		// Or better, let's assume the user config matches the json tags of the proto.
		return nil, fmt.Errorf("could not parse JSON from config file '%s': %w", filename, err)
	}

	if len(configs) == 0 {
		return nil, errors.New("no databases found in config file")
	}

	return configs, nil
}
