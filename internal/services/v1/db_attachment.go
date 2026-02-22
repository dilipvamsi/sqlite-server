package servicesv1

import (
	"context"
	"errors"
	"fmt"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/encoding/protojson"
)

// AttachDatabase attaches a database to a parent database
func (s *DbServer) AttachDatabase(ctx context.Context, req *connect.Request[sqlrpcv1.AttachDatabaseRequest]) (*connect.Response[sqlrpcv1.AttachDatabaseResponse], error) {
	name := req.Msg.ParentDatabase
	attachment := req.Msg.Attachment

	// 1. Fetch existing config metadata
	existingAuthConfig, err := s.store.GetDatabaseConfig(ctx, name)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if existingAuthConfig == nil {
		return nil, connect.NewError(connect.CodeNotFound, errors.New("database config not found"))
	}

	// 2. Unmarshal existing settings
	currentConfig := &sqlrpcv1.DatabaseConfig{}
	if err := protojson.Unmarshal([]byte(existingAuthConfig.Settings), currentConfig); err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to parse existing config: %w", err))
	}

	isAlreadyAttached := false

	// 3. Update attachments
	// Check for duplicate alias
	for _, existing := range currentConfig.Attachments {
		if existing.Alias == attachment.Alias {
			if existing.TargetDatabaseName == attachment.TargetDatabaseName {
				isAlreadyAttached = true
				break
			}
			return nil, connect.NewError(connect.CodeAlreadyExists, fmt.Errorf("attachment alias '%s' already exists", attachment.Alias))
		}
	}

	// 4. Return if already attached
	if isAlreadyAttached {
		return connect.NewResponse(&sqlrpcv1.AttachDatabaseResponse{
			Success: true,
			Message: "Database already attached previously",
		}), nil
	}

	currentConfig.Attachments = append(currentConfig.Attachments, attachment)

	// 5. Validate/Reload in memory first
	if err := s.dbManager.AttachDatabase(name, attachment); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// 6. Persist to store
	jsonBytes, err := protojson.Marshal(currentConfig)
	if err != nil {
		// Rollback in-memory if persistence fails?
		// For now, we follow the previous logic which was slightly inconsistent
		// but at least we don't persist if it's fundamentally invalid for the manager.
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to marshal config: %w", err))
	}
	if err := s.store.UpsertDatabaseConfig(ctx, name, existingAuthConfig.Path, existingAuthConfig.IsManaged, string(jsonBytes)); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&sqlrpcv1.AttachDatabaseResponse{
		Success: true,
		Message: "Database attached successfully",
	}), nil
}

// DetachDatabase detaches a database from a parent database
func (s *DbServer) DetachDatabase(ctx context.Context, req *connect.Request[sqlrpcv1.DetachDatabaseRequest]) (*connect.Response[sqlrpcv1.DetachDatabaseResponse], error) {
	name := req.Msg.ParentDatabase
	alias := req.Msg.Alias

	// 1. Fetch existing config metadata
	existingAuthConfig, err := s.store.GetDatabaseConfig(ctx, name)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if existingAuthConfig == nil {
		return nil, connect.NewError(connect.CodeNotFound, errors.New("database config not found"))
	}

	// 2. Unmarshal existing settings
	currentConfig := &sqlrpcv1.DatabaseConfig{}
	if err := protojson.Unmarshal([]byte(existingAuthConfig.Settings), currentConfig); err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to parse existing config: %w", err))
	}

	// 3. Update attachments
	found := false
	newAttachments := make([]*sqlrpcv1.Attachment, 0, len(currentConfig.Attachments))
	for _, adb := range currentConfig.Attachments {
		if adb.Alias == alias {
			found = true
			continue
		}
		newAttachments = append(newAttachments, adb)
	}
	if !found {
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("attachment alias '%s' not found", alias))
	}
	currentConfig.Attachments = newAttachments

	// 4. Validate/Reload in memory first
	if err := s.dbManager.DetachDatabase(name, alias); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// 5. Persist to store
	jsonBytes, err := protojson.Marshal(currentConfig)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to marshal config: %w", err))
	}
	if err := s.store.UpsertDatabaseConfig(ctx, name, existingAuthConfig.Path, existingAuthConfig.IsManaged, string(jsonBytes)); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&sqlrpcv1.DetachDatabaseResponse{
		Success: true,
		Message: "Database detached successfully",
	}), nil
}
