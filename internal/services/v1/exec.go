package servicesv1

import (
	"context"
	"log"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"

	"sqlite-server/internal/auth"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
)

// Exec handles the unary `Exec` RPC.
func (s *DbServer) Exec(ctx context.Context, req *connect.Request[sqlrpcv1.QueryRequest]) (*connect.Response[sqlrpcv1.ExecResponse], error) {
	reqID := ensureRequestID(req.Header())

	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed for Exec: %v", reqID, err)
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	if err := ValidateStatelessQuery(req.Msg.Sql); err != nil {
		return nil, err
	}

	mode := ModeRW
	if auth.IsReadOnly(ctx) {
		mode = ModeRO
	}

	db, err := s.dbManager.GetConnection(ctx, req.Msg.Database, mode)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	result, err := executeExecAndBuffer(ctx, db, req.Msg.Sql, req.Msg.Parameters)
	if err != nil {
		log.Printf("[%s] Exec execution failed: %v", reqID, err)
		return nil, makeUnaryError(err, req.Msg.Sql)
	}

	res := connect.NewResponse(result)
	res.Header().Set(headerRequestID, reqID)
	return res, nil
}

// TypedExec handles the unary `TypedExec` RPC.
func (s *DbServer) TypedExec(ctx context.Context, req *connect.Request[sqlrpcv1.TypedQueryRequest]) (*connect.Response[sqlrpcv1.ExecResponse], error) {
	reqID := ensureRequestID(req.Header())

	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed for TypedExec: %v", reqID, err)
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	if err := ValidateStatelessQuery(req.Msg.Sql); err != nil {
		return nil, err
	}

	mode := ModeRW
	if auth.IsReadOnly(ctx) {
		mode = ModeRO
	}

	db, err := s.dbManager.GetConnection(ctx, req.Msg.Database, mode)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	result, err := typedExecuteExecAndBuffer(ctx, db, req.Msg.Sql, req.Msg.Parameters)
	if err != nil {
		log.Printf("[%s] TypedExec execution failed: %v", reqID, err)
		return nil, makeUnaryError(err, req.Msg.Sql)
	}

	res := connect.NewResponse(result)
	res.Header().Set(headerRequestID, reqID)
	return res, nil
}
