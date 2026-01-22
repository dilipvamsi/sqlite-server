package servicesv1

import (
	"context"
	"errors"
	"fmt"
	"time"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"

	"sqlite-server/internal/sqldrivers"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// AdminServer implements the AdminService gRPC handler
type AdminServer struct {
	dbv1connect.UnimplementedAdminServiceHandler
	store     *auth.MetaStore
	dbConfigs []sqldrivers.DBConfig
}

// NewAdminServer creates a new AdminServer instance
func NewAdminServer(store *auth.MetaStore, dbConfigs []sqldrivers.DBConfig) *AdminServer {
	return &AdminServer{
		store:     store,
		dbConfigs: dbConfigs,
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

	var databases []string
	for _, config := range s.dbConfigs {
		databases = append(databases, config.Name)
	}

	return connect.NewResponse(&dbv1.ListDatabasesResponse{
		Databases: databases,
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
	if user.Role != auth.RoleAdmin {
		return nil, connect.NewError(connect.CodePermissionDenied, errors.New("admin access required"))
	}

	// 3. Determine session duration
	duration := 7 * 24 * time.Hour // Default 7 days
	if req.Msg.SessionDuration != nil && req.Msg.SessionDuration.AsDuration() > 0 {
		duration = req.Msg.SessionDuration.AsDuration()
	}

	expiresAt := time.Now().Add(duration)

	// 4. Generate API Key
	apiKey, _, err := s.store.CreateApiKey(ctx, user.UserID, fmt.Sprintf("studio_session_%d", time.Now().Unix()), &expiresAt)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to generate session key: %w", err))
	}

	return connect.NewResponse(&dbv1.LoginResponse{
		ApiKey:    apiKey,
		ExpiresAt: timestamppb.New(expiresAt),
		User: &dbv1.User{
			Id:       user.UserID,
			Username: user.Username,
			Role:     string(user.Role),
		},
	}), nil
}

// BackupDatabase and RestoreDatabase are not implemented yet
// They will use the UnimplementedAdminServiceHandler defaults
