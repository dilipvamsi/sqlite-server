package servicesv1

import (
	"context"

	"sqlite-server/internal/auth"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"connectrpc.com/connect"
)

type testAuthInterceptor struct{}

func (i *testAuthInterceptor) WrapUnary(next connect.UnaryFunc) connect.UnaryFunc {
	return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "admin",
			Role:     dbv1.Role_ROLE_ADMIN,
		}
		ctx = auth.NewContext(ctx, claims)
		return next(ctx, req)
	}
}

func (i *testAuthInterceptor) WrapStreamingClient(next connect.StreamingClientFunc) connect.StreamingClientFunc {
	return next
}

func (i *testAuthInterceptor) WrapStreamingHandler(next connect.StreamingHandlerFunc) connect.StreamingHandlerFunc {
	return func(ctx context.Context, conn connect.StreamingHandlerConn) error {
		claims := &auth.UserClaims{
			UserID:   1,
			Username: "admin",
			Role:     dbv1.Role_ROLE_ADMIN,
		}
		ctx = auth.NewContext(ctx, claims)
		return next(ctx, conn)
	}
}
