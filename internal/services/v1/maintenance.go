package servicesv1

import (
	"context"
	"fmt"
	"log"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"connectrpc.com/connect"
)

// Vacuum triggers a VACUUM or VACUUM INTO command.
func (s *DbServer) Vacuum(ctx context.Context, req *connect.Request[sqlrpcv1.VacuumRequest]) (*connect.Response[sqlrpcv1.VacuumResponse], error) {
	dbName := req.Msg.Database
	intoFile := req.Msg.IntoFile

	db, err := s.dbManager.GetConnection(ctx, dbName, ModeRW)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	var query string
	var args []any

	if intoFile != nil && *intoFile != "" {
		// VACUUM INTO ?
		query = "VACUUM INTO ?"
		args = append(args, *intoFile)
	} else {
		// VACUUM
		query = "VACUUM"
	}

	log.Printf("[Maintenance] Executing %s on %s", query, dbName)
	if _, err := db.ExecContext(ctx, query, args...); err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("vacuum failed: %w", err))
	}

	return connect.NewResponse(&sqlrpcv1.VacuumResponse{
		Success: true,
		Message: "Vacuum completed successfully",
	}), nil
}

// Checkpoint runs PRAGMA wal_checkpoint.
func (s *DbServer) Checkpoint(ctx context.Context, req *connect.Request[sqlrpcv1.CheckpointRequest]) (*connect.Response[sqlrpcv1.CheckpointResponse], error) {
	dbName := req.Msg.Database
	mode := req.Msg.Mode

	db, err := s.dbManager.GetConnection(ctx, dbName, ModeRW)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	modeStr := "PASSIVE"
	switch mode {
	case sqlrpcv1.CheckpointMode_CHECKPOINT_MODE_FULL:
		modeStr = "FULL"
	case sqlrpcv1.CheckpointMode_CHECKPOINT_MODE_RESTART:
		modeStr = "RESTART"
	case sqlrpcv1.CheckpointMode_CHECKPOINT_MODE_TRUNCATE:
		modeStr = "TRUNCATE"
	}

	query := fmt.Sprintf("PRAGMA wal_checkpoint(%s)", modeStr)
	log.Printf("[Maintenance] Executing %s on %s", query, dbName)

	var busy int64
	var logPages int64
	var checkpointed int64

	// PRAGMA wal_checkpoint returns a single row: (busy, log, checkpointed)
	row := db.QueryRowContext(ctx, query)
	if err := row.Scan(&busy, &logPages, &checkpointed); err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("checkpoint failed: %w", err))
	}

	return connect.NewResponse(&sqlrpcv1.CheckpointResponse{
		Success:           true,
		Message:           fmt.Sprintf("Checkpoint %s completed", modeStr),
		BusyCheckpoints:   busy,
		LogCheckpoints:    logPages,
		CheckpointedPages: checkpointed,
	}), nil
}

// IntegrityCheck runs PRAGMA integrity_check.
func (s *DbServer) IntegrityCheck(ctx context.Context, req *connect.Request[sqlrpcv1.IntegrityCheckRequest]) (*connect.Response[sqlrpcv1.IntegrityCheckResponse], error) {
	dbName := req.Msg.Database
	maxErrors := int32(100)
	if req.Msg.MaxErrors != nil {
		maxErrors = *req.Msg.MaxErrors
	}

	db, err := s.dbManager.GetConnection(ctx, dbName, ModeRW)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	query := fmt.Sprintf("PRAGMA integrity_check(%d)", maxErrors)
	log.Printf("[Maintenance] Executing %s on %s", query, dbName)

	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("integrity check failed: %w", err))
	}
	defer rows.Close()

	var errors []string
	for rows.Next() {
		var msg string
		if err := rows.Scan(&msg); err != nil {
			return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to scan integrity check result: %w", err))
		}
		if msg != "ok" {
			errors = append(errors, msg)
		}
	}

	if err := rows.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("integrity check iteration failed: %w", err))
	}

	success := len(errors) == 0
	message := "Integrity check passed"
	if !success {
		message = fmt.Sprintf("Integrity check failed with %d errors", len(errors))
	}

	return connect.NewResponse(&sqlrpcv1.IntegrityCheckResponse{
		Success: success,
		Message: message,
		Errors:  errors,
	}), nil
}
