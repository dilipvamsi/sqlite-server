package servicesv1

import (
	"context"
	"time"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/protos/db/v1/dbv1connect"

	"connectrpc.com/connect"
)

// AdminServer implements the AdminService gRPC handler
type AdminServer struct {
	dbv1connect.UnimplementedAdminServiceHandler
	store *auth.MetaStore
}

// NewAdminServer creates a new AdminServer instance
func NewAdminServer(store *auth.MetaStore) *AdminServer {
	return &AdminServer{store: store}
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
		CreatedAt: time.Now().Format(time.RFC3339),
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
	if req.Msg.ExpiresAt != "" {
		t, err := time.Parse(time.RFC3339, req.Msg.ExpiresAt)
		if err != nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
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
			CreatedAt: k.CreatedAt.Format(time.RFC3339),
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

// BackupDatabase and RestoreDatabase are not implemented yet
// They will use the UnimplementedAdminServiceHandler defaults
