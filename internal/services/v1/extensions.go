package servicesv1

import (
	"context"
	"fmt"

	"sqlite-server/internal/extensions"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/encoding/protojson"
)

// ListExtensions returns available SQLite extensions.
func (s *DbServer) ListExtensions(ctx context.Context, req *connect.Request[sqlrpcv1.ListExtensionsRequest]) (*connect.Response[sqlrpcv1.ListExtensionsResponse], error) {
	// 1. Get available extensions from disk
	available, err := extensions.GetAvailableExtensions()
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to scan extensions: %w", err))
	}

	var loadedExtensions map[string]bool
	if req.Msg.Database != nil {
		dbName := *req.Msg.Database
		// Get current config to see what's loaded
		config, err := s.store.GetDatabaseConfig(ctx, dbName)
		if err != nil {
			return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to get database config: %w", err))
		}
		if config != nil {
			var dbCfg sqlrpcv1.DatabaseConfig
			if err := protojson.Unmarshal([]byte(config.Settings), &dbCfg); err == nil {
				loadedExtensions = make(map[string]bool)
				for _, folderName := range dbCfg.Extensions {
					loadedExtensions[folderName] = true
				}
			}
		}
	}

	resp := &sqlrpcv1.ListExtensionsResponse{}
	for _, ext := range available {
		isLoaded := false
		if loadedExtensions != nil {
			isLoaded = loadedExtensions[ext.FolderName]
		}

		resp.Extensions = append(resp.Extensions, &sqlrpcv1.ExtensionInfo{
			Name:             ext.Name,
			Version:          ext.Version,
			FolderName:       ext.FolderName,
			IsLoaded:         isLoaded,
			FilePath:         ext.FilePath,
			Description:      ext.Description,
			DocumentationUrl: ext.DocumentationURL,
		})
	}

	return connect.NewResponse(resp), nil
}

// LoadExtension loads an extension into a database.
func (s *DbServer) LoadExtension(ctx context.Context, req *connect.Request[sqlrpcv1.LoadExtensionRequest]) (*connect.Response[sqlrpcv1.LoadExtensionResponse], error) {
	dbName := req.Msg.Database
	folderName := req.Msg.FolderName

	// 1. Find the extension
	available, err := extensions.GetAvailableExtensions()
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to scan extensions: %w", err))
	}

	var targetExt *extensions.ExtensionInfo
	for _, ext := range available {
		if ext.FolderName == folderName {
			targetExt = &ext
			break
		}
	}

	if targetExt == nil {
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("extension folder '%s' not found or incompatible", folderName))
	}

	// 2. Update database config
	existingAuthConfig, err := s.store.GetDatabaseConfig(ctx, dbName)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if existingAuthConfig == nil {
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", dbName))
	}

	currentConfig := &sqlrpcv1.DatabaseConfig{}
	if err := protojson.Unmarshal([]byte(existingAuthConfig.Settings), currentConfig); err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to parse config: %w", err))
	}

	// 3. Check if already loaded
	for _, storedFolderName := range currentConfig.Extensions {
		if storedFolderName == targetExt.FolderName {
			return connect.NewResponse(&sqlrpcv1.LoadExtensionResponse{
				Success: true,
				Message: "Extension already loaded",
			}), nil
		}
	}

	currentConfig.Extensions = append(currentConfig.Extensions, targetExt.FolderName)

	// 4. Update memory manager (invalidates cache)
	if err := s.dbManager.UpdateDatabase(currentConfig); err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to update database manager: %w", err))
	}

	// 5. Persist to MetaStore
	jsonBytes, err := protojson.Marshal(currentConfig)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to marshal config: %w", err))
	}
	if err := s.store.UpsertDatabaseConfig(ctx, dbName, existingAuthConfig.Path, existingAuthConfig.IsManaged, string(jsonBytes)); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&sqlrpcv1.LoadExtensionResponse{
		Success: true,
		Message: fmt.Sprintf("Extension '%s' loaded successfully", targetExt.Name),
	}), nil
}
