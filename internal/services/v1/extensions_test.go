package servicesv1

import (
	"context"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"connectrpc.com/connect"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"
)

func TestExtensionRPCs(t *testing.T) {
	// 1. Setup Mock Extensions Dir
	tmpDir := t.TempDir()
	os.Setenv("SQLITE_SERVER_EXTENSIONS", tmpDir)
	defer os.Unsetenv("SQLITE_SERVER_EXTENSIONS")

	currentOS := runtime.GOOS
	if currentOS == "darwin" {
		currentOS = "macos"
	}
	currentArch := runtime.GOARCH

	fileExt := "so"
	if currentOS == "windows" {
		fileExt = "dll"
	} else if currentOS == "macos" {
		fileExt = "dylib"
	}

	// Create a dummy crypto extension
	cryptoDir := filepath.Join(tmpDir, "crypto-0.28.0")
	os.MkdirAll(cryptoDir, 0755)
	compFile := filepath.Join(cryptoDir, "crypto-0.28.0-"+currentOS+"-"+currentArch+"."+fileExt)
	os.WriteFile(compFile, []byte("fake"), 0644)

	// 2. Setup Server with MetaStore
	metaPath := filepath.Join(tmpDir, "_meta.db")
	store, err := auth.NewMetaStore(metaPath)
	require.NoError(t, err)
	defer store.Close()

	dbPath := filepath.Join(tmpDir, "ext_test.db")
	config := &dbv1.DatabaseConfig{
		Name:   "extdb",
		DbPath: dbPath,
	}

	// Persist config to store
	settingsBytes, _ := protojson.Marshal(config)
	err = store.UpsertDatabaseConfig(context.Background(), config.Name, config.DbPath, true, string(settingsBytes))
	require.NoError(t, err)

	server := NewDbServer([]*dbv1.DatabaseConfig{config}, store)
	defer server.Stop()

	ctx := auth.NewContext(context.Background(), &auth.UserClaims{
		Username: "admin",
		Role:     dbv1.Role_ROLE_ADMIN,
	})

	t.Run("ListExtensions", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.ListExtensionsRequest{
			Database: proto.String("extdb"),
		})
		res, err := server.ListExtensions(ctx, req)
		require.NoError(t, err)

		found := false
		for _, ext := range res.Msg.Extensions {
			if ext.Name == "crypto" {
				found = true
				assert.Equal(t, "0.28.0", ext.Version)
				assert.Equal(t, "crypto-0.28.0", ext.FolderName)
				assert.False(t, ext.IsLoaded)
			}
		}
		assert.True(t, found)
	})

	t.Run("LoadExtension", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.LoadExtensionRequest{
			Database:   "extdb",
			FolderName: "crypto-0.28.0",
		})
		res, err := server.LoadExtension(ctx, req)
		require.NoError(t, err)
		assert.True(t, res.Msg.Success)

		// Verify it's now marked as loaded in ListExtensions
		listReq := connect.NewRequest(&dbv1.ListExtensionsRequest{
			Database: proto.String("extdb"),
		})
		listRes, _ := server.ListExtensions(ctx, listReq)
		for _, ext := range listRes.Msg.Extensions {
			if ext.Name == "crypto" {
				assert.True(t, ext.IsLoaded)
			}
		}

		// Verify MetaStore persistence
		dbCfg, err := store.GetDatabaseConfig(context.Background(), "extdb")
		require.NoError(t, err)
		assert.Contains(t, dbCfg.Settings, "crypto-0.28.0")
	})

	t.Run("LoadExtension Incompatible", func(t *testing.T) {
		req := connect.NewRequest(&dbv1.LoadExtensionRequest{
			Database:   "extdb",
			FolderName: "nonexistent-1.0.0",
		})
		_, err := server.LoadExtension(ctx, req)
		assert.Error(t, err)
		assert.Equal(t, connect.CodeNotFound, connect.CodeOf(err))
	})
}
