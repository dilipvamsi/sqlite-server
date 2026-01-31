package servicesv1

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// AdminServer implements the AdminService gRPC handler
type AdminServer struct {
	dbv1connect.UnimplementedAdminServiceHandler
	store    *auth.MetaStore
	dbServer *DbServer
	cache    AuthCacheInvalidator
}

// NewAdminServer creates a new AdminServer instance
func NewAdminServer(store *auth.MetaStore, dbServer *DbServer, cache AuthCacheInvalidator) *AdminServer {
	return &AdminServer{
		store:    store,
		dbServer: dbServer,
		cache:    cache,
	}
}

// CreateUser creates a new user account
func (s *AdminServer) CreateUser(ctx context.Context, req *connect.Request[dbv1.CreateUserRequest]) (*connect.Response[dbv1.CreateUserResponse], error) {
	// Verify admin role
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	userID, err := s.store.CreateUser(ctx, req.Msg.Username, req.Msg.Password, req.Msg.Role)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// Invalidate cache (new user might try to login immediately)
	if s.cache != nil {
		s.cache.ClearCache()
	}

	return connect.NewResponse(&dbv1.CreateUserResponse{
		UserId:    userID,
		CreatedAt: timestamppb.New(time.Now()),
	}), nil
}

// DeleteUser removes a user account
func (s *AdminServer) DeleteUser(ctx context.Context, req *connect.Request[dbv1.DeleteUserRequest]) (*connect.Response[dbv1.DeleteUserResponse], error) {
	// Verify admin role
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	err := s.store.DeleteUser(ctx, req.Msg.Username)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	// Invalidate cache immediately to revoke access
	if s.cache != nil {
		s.cache.ClearCache()
	}

	return connect.NewResponse(&dbv1.DeleteUserResponse{
		Success: true,
	}), nil
}

// UpdatePassword changes a user's password
func (s *AdminServer) UpdatePassword(ctx context.Context, req *connect.Request[dbv1.UpdatePasswordRequest]) (*connect.Response[dbv1.UpdatePasswordResponse], error) {
	// Verify admin role
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	err := s.store.UpdatePassword(ctx, req.Msg.Username, req.Msg.NewPassword)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	// Invalidate cache to force re-authentication check
	if s.cache != nil {
		s.cache.ClearCache()
	}

	return connect.NewResponse(&dbv1.UpdatePasswordResponse{
		Success: true,
	}), nil
}

// CreateApiKey generates a new API key for a user
func (s *AdminServer) CreateApiKey(ctx context.Context, req *connect.Request[dbv1.CreateApiKeyRequest]) (*connect.Response[dbv1.CreateApiKeyResponse], error) {
	// Verify admin role
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	var expiresAt *time.Time
	if req.Msg.ExpiresAt != nil {
		if err := req.Msg.ExpiresAt.CheckValid(); err != nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		t := req.Msg.ExpiresAt.AsTime()
		expiresAt = &t
	}

	rawKey, keyID, err := s.store.CreateApiKey(ctx, req.Msg.UserId, req.Msg.Name, expiresAt)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&dbv1.CreateApiKeyResponse{
		ApiKey: rawKey,
		KeyId:  keyID,
	}), nil
}

// ListApiKeys returns all API keys for a user
func (s *AdminServer) ListApiKeys(ctx context.Context, req *connect.Request[dbv1.ListApiKeysRequest]) (*connect.Response[dbv1.ListApiKeysResponse], error) {
	// Verify admin role
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	keys, err := s.store.ListApiKeys(ctx, req.Msg.UserId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	var summaries []*dbv1.ListApiKeysResponse_ApiKeySummary
	for _, k := range keys {
		summaries = append(summaries, &dbv1.ListApiKeysResponse_ApiKeySummary{
			Id:        k.ID,
			Name:      k.Name,
			Prefix:    k.KeyPrefix,
			CreatedAt: timestamppb.New(k.CreatedAt),
		})
	}

	return connect.NewResponse(&dbv1.ListApiKeysResponse{
		Keys: summaries,
	}), nil
}

// RevokeApiKey deletes an API key
func (s *AdminServer) RevokeApiKey(ctx context.Context, req *connect.Request[dbv1.RevokeApiKeyRequest]) (*connect.Response[dbv1.RevokeApiKeyResponse], error) {
	// Verify admin role
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	err := s.store.RevokeApiKey(ctx, req.Msg.KeyId)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	return connect.NewResponse(&dbv1.RevokeApiKeyResponse{
		Success: true,
	}), nil
}

// ListDatabases returns all available databases
func (s *AdminServer) ListDatabases(ctx context.Context, req *connect.Request[dbv1.ListDatabasesRequest]) (*connect.Response[dbv1.ListDatabasesResponse], error) {
	// Verify admin role
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	configs, err := s.store.ListDatabaseConfigs(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	infos := make([]*dbv1.DatabaseInfo, len(configs))
	for i, cfg := range configs {
		infos[i] = &dbv1.DatabaseInfo{
			Name:      cfg.Name,
			Path:      cfg.Path,
			IsManaged: cfg.IsManaged,
		}
	}

	return connect.NewResponse(&dbv1.ListDatabasesResponse{
		Databases: infos,
	}), nil
}

// CreateDatabase creates a new managed database
func (s *AdminServer) CreateDatabase(ctx context.Context, req *connect.Request[dbv1.CreateDatabaseRequest]) (*connect.Response[dbv1.CreateDatabaseResponse], error) {
	// Verify Admin Role
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	name := req.Msg.Name
	dbPath := filepath.Join("databases", name+".db")

	// Build DatabaseConfig from inline request fields
	config := &dbv1.DatabaseConfig{
		Name:              name,
		DbPath:            dbPath,
		IsEncrypted:       req.Msg.IsEncrypted,
		Key:               req.Msg.Key,
		ReadOnly:          false, // Can't create a read-only database
		Extensions:        req.Msg.Extensions,
		Pragmas:           req.Msg.Pragmas,
		MaxOpenConns:      req.Msg.MaxOpenConns,
		MaxIdleConns:      req.Msg.MaxIdleConns,
		ConnMaxLifetimeMs: req.Msg.ConnMaxLifetimeMs,
	}

	// Ensure directory exists
	if err := os.MkdirAll("databases", 0755); err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to create directory: %w", err))
	}

	// 1. Persist config
	// We store the full config as JSON
	jsonBytes, err := protojson.Marshal(config)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to marshal config: %w", err))
	}
	if err := s.store.UpsertDatabaseConfig(ctx, name, dbPath, true, string(jsonBytes)); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// 2. Mount database
	if err := s.dbServer.MountDatabase(config); err != nil {
		// Rollback persistent config? For now just return error
		_ = s.store.RemoveDatabaseConfig(ctx, name)
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// 3. Log success
	log.Printf("Created database '%s' at '%s'", name, dbPath)

	return connect.NewResponse(&dbv1.CreateDatabaseResponse{
		Success: true,
		Message: fmt.Sprintf("Database '%s' created successfully", name),
	}), nil
}

// MountDatabase mounts an existing unmanaged database
func (s *AdminServer) MountDatabase(ctx context.Context, req *connect.Request[dbv1.DatabaseConfig]) (*connect.Response[dbv1.MountDatabaseResponse], error) {
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	config := req.Msg
	name := config.Name
	path := config.DbPath

	// Verify file existence
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, connect.NewError(connect.CodeNotFound, errors.New("database file not found"))
	}

	// 1. Persist config (is_managed=false)
	jsonBytes, err := protojson.Marshal(config)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to marshal config: %w", err))
	}
	if err := s.store.UpsertDatabaseConfig(ctx, name, path, false, string(jsonBytes)); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// 2. Mount database
	if err := s.dbServer.MountDatabase(config); err != nil {
		_ = s.store.RemoveDatabaseConfig(ctx, name)
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// 3. Log success
	log.Printf("Mounted database '%s' at '%s'", name, path)

	return connect.NewResponse(&dbv1.MountDatabaseResponse{
		Success: true,
		Message: fmt.Sprintf("Database '%s' mounted successfully", name),
	}), nil
}

// UnMountDatabase unmounts a database but keeps the file
func (s *AdminServer) UnMountDatabase(ctx context.Context, req *connect.Request[dbv1.UnMountDatabaseRequest]) (*connect.Response[dbv1.UnMountDatabaseResponse], error) {
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	name := req.Msg.Name

	// 1. Unmount from server
	if err := s.dbServer.UnmountDatabase(name); err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	// 2. Remove from persistent storage
	if err := s.store.RemoveDatabaseConfig(ctx, name); err != nil {
		// Log error but success for client since unmount happened
		fmt.Printf("Warning: failed to remove database config for '%s': %v\n", name, err)
	}

	// 3. Log success
	log.Printf("Unmounted database '%s'", name)

	return connect.NewResponse(&dbv1.UnMountDatabaseResponse{
		Success: true,
		Message: fmt.Sprintf("Database '%s' unmounted", name),
	}), nil
}

// DeleteDatabase deletes a managed database permanently
func (s *AdminServer) DeleteDatabase(ctx context.Context, req *connect.Request[dbv1.DeleteDatabaseRequest]) (*connect.Response[dbv1.DeleteDatabaseResponse], error) {
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	name := req.Msg.Name

	// 1. Check if managed
	config, err := s.store.GetDatabaseConfig(ctx, name)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if config == nil {
		return nil, connect.NewError(connect.CodeNotFound, errors.New("database config not found"))
	}
	if !config.IsManaged {
		return nil, connect.NewError(connect.CodeFailedPrecondition, errors.New("cannot delete mounted database (unmount instead)"))
	}

	// 2. Unmount
	if err := s.dbServer.UnmountDatabase(name); err != nil {
		// If fails, maybe already unmounted? Continue to deletion
		fmt.Printf("Warning: failed to unmount database '%s' during deletion: %v\n", name, err)
	}

	// 3. Remove file
	if err := os.Remove(config.Path); err != nil && !os.IsNotExist(err) {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to delete database file: %w", err))
	}

	// 4. Remove config
	if err := s.store.RemoveDatabaseConfig(ctx, name); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// 5. Log success
	log.Printf("Deleted database '%s' at '%s'", name, config.Path)

	return connect.NewResponse(&dbv1.DeleteDatabaseResponse{
		Success: true,
		Message: fmt.Sprintf("Database '%s' deleted successfully", name),
	}), nil
}

// Login authenticates a user and returns a session API key.
func (s *AdminServer) Login(ctx context.Context, req *connect.Request[dbv1.LoginRequest]) (*connect.Response[dbv1.LoginResponse], error) {
	// 1. Verify credentials from request body
	user, err := s.store.ValidateUser(ctx, req.Msg.Username, req.Msg.Password)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if user == nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("invalid credentials"))
	}

	// 2. Ensure user has admin access (or allowed role)
	if user.Role != dbv1.Role_ROLE_ADMIN {
		return nil, connect.NewError(connect.CodePermissionDenied, errors.New("admin access required"))
	}

	// 3. Determine session duration
	duration := 7 * 24 * time.Hour // Default 7 days
	if req.Msg.SessionDuration != nil && req.Msg.SessionDuration.AsDuration() > 0 {
		duration = req.Msg.SessionDuration.AsDuration()
	}

	expiresAt := time.Now().Add(duration)

	// 4. Generate API Key
	apiKey, keyID, err := s.store.CreateApiKey(ctx, user.UserID, fmt.Sprintf("studio_session_%d", time.Now().Unix()), &expiresAt)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to generate session key: %w", err))
	}

	return connect.NewResponse(&dbv1.LoginResponse{
		ApiKey:    apiKey,
		KeyId:     keyID,
		ExpiresAt: timestamppb.New(expiresAt),
		User: &dbv1.User{
			Id:       user.UserID,
			Username: user.Username,
			Role:     user.Role,
		},
	}), nil
}

// Logout invalidates the provided session key.
func (s *AdminServer) Logout(ctx context.Context, req *connect.Request[dbv1.LogoutRequest]) (*connect.Response[dbv1.LogoutResponse], error) {
	// 1. Verify admin role (or at least valid authentication)
	// Theoretically any user can logout their own key, but for now we reuse AuthorizeAdmin
	// because only admins have keys anyway in this system currently.
	if err := AuthorizeAdmin(ctx); err != nil {
		return nil, err
	}

	// 2. Revoke the key
	if err := s.store.RevokeApiKey(ctx, req.Msg.KeyId); err != nil {
		// Even if not found, we return success for idempotency security
		// But let's log it
		log.Printf("Warning: failed to revoke key %s during logout: %v", req.Msg.KeyId, err)
	} else {
		log.Printf("Logged out session key %s", req.Msg.KeyId)
	}

	return connect.NewResponse(&dbv1.LogoutResponse{
		Success: true,
	}), nil
}

// BackupDatabase and RestoreDatabase are not implemented yet
// They will use the UnimplementedAdminServiceHandler defaults
