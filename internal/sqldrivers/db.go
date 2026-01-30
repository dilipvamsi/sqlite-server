package sqldrivers

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"google.golang.org/protobuf/encoding/protojson"

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

	// 1. Unmarshal into a slice of raw JSON messages first
	var rawConfigs []json.RawMessage
	if err := json.Unmarshal(data, &rawConfigs); err != nil {
		return nil, fmt.Errorf("could not parse JSON array from config file '%s': %w", filename, err)
	}

	if len(rawConfigs) == 0 {
		return nil, errors.New("no databases found in config file")
	}

	var configs []*dbv1.DatabaseConfig
	// 2. Iterate and use protojson to unmarshal each config
	// DiscardUnknown: true allows for extra fields or comments in JSON without erroring,
	// and often helps with casing flexibility depending on option set (though standard protojson is strict).
	// However, protojson default matches field names (camelCase) and [json_name] options.
	// However, protojson default matches field names (camelCase) and [json_name] options.
	unmarshaler := protojson.UnmarshalOptions{}

	for i, raw := range rawConfigs {
		var config dbv1.DatabaseConfig
		if err := unmarshaler.Unmarshal(raw, &config); err != nil {
			return nil, fmt.Errorf("failed to parse config entry #%d: %w", i, err)
		}
		configs = append(configs, &config)
	}

	return configs, nil
}
