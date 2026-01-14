package servicesv1

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	dbv1 "sqlite-server/internal/protos/db/v1"
	"time"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
)

// ===================================================================================
// Unary (ID-Based) Transaction RPCs
// ===================================================================================

/**
 * BeginTransaction starts a stateful transaction session.
 *
 * RPC FLOW:
 * 1. Validates the request and ensures the DB exists.
 * 2. Opens a `sql.Tx` with the requested Isolation Level (Deferred/Immediate/Exclusive).
 * 3. Generates a secure random Session ID (UUIDv7).
 * 4. Stores the Tx in `txRegistry` with a Timeout.
 * 5. Returns the ID to the client.
 */
func (s *DbServer) BeginTransaction(ctx context.Context, req *connect.Request[dbv1.BeginTransactionRequest]) (*connect.Response[dbv1.BeginTransactionResponse], error) {
	reqID := ensureRequestID(req.Header())
	msg := req.Msg

	if err := protovalidate.Validate(msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	db, ok := s.Dbs[msg.Database]
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", msg.Database))
	}

	// 1. Parse Timeout (Defaults to 30s if invalid/empty)
	timeout := defaultTxTimeout
	if msg.Timeout != "" {
		if d, err := time.ParseDuration(msg.Timeout); err == nil {
			timeout = d
		}
	}

	// Configure Locking Mode
	// SQLite "IMMEDIATE" and "EXCLUSIVE" help avoid busy loops in write-heavy scenarios.
	txOpts := &sql.TxOptions{ReadOnly: false}
	// Map the proto mode to the SQL driver
	if msg.Mode == dbv1.TransactionMode_TRANSACTION_MODE_IMMEDIATE ||
		msg.Mode == dbv1.TransactionMode_TRANSACTION_MODE_EXCLUSIVE {
		// This is a common trick for mattn/go-sqlite3 to trigger IMMEDIATE/EXCLUSIVE
		txOpts.Isolation = sql.LevelSerializable
	}

	var err error
	tx, err := db.BeginTx(ctx, txOpts) // Use BeginTx instead of Begin
	if err != nil {
		log.Printf("[%s] BeginTransaction failed: %v", reqID, err)
		return nil, makeUnaryError(err, "BEGIN")
	}

	// 4. Register Session in Memory
	txID := genRequestID()
	expiry := time.Now().Add(timeout)

	s.txMu.Lock()
	s.txRegistry[txID] = &TxSession{
		Tx:        tx,
		Expiry:    expiry,
		DBName:    msg.Database,
		CreatedAt: time.Now(),
	}
	s.txMu.Unlock()

	log.Printf("[%s] Started transaction session %s (timeout: %s)", reqID, txID, timeout)

	return connect.NewResponse(&dbv1.BeginTransactionResponse{
		TransactionId:   txID,
		ExpiresAtUnixMs: expiry.UnixMilli(),
	}), nil
}

/**
 * TransactionQuery executes a SQL statement within an existing transaction context.
 *
 * HEARTBEAT MECHANISM:
 * Every successful call to this RPC extends the transaction's TTL by `defaultTxTimeout`.
 * This allows long-running workflows to stay alive as long as they are active.
 *
 * ERROR HANDLING:
 * If a SQL error occurs (e.g., Syntax Error), we return the error details but
 * **DO NOT** automatically rollback the transaction. This gives the client the choice
 * to retry or manually rollback, mirroring standard SQL behavior.
 */
func (s *DbServer) TransactionalQuery(ctx context.Context, req *connect.Request[dbv1.TransactionQueryRequest]) (*connect.Response[dbv1.QueryResult], error) {
	reqID := ensureRequestID(req.Header())
	msg := req.Msg

	if err := protovalidate.Validate(msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	// 1. Registry Lookup
	s.txMu.Lock()
	session, exists := s.txRegistry[msg.TransactionId]
	if !exists {
		s.txMu.Unlock()
		return nil, connect.NewError(connect.CodeNotFound, errors.New("transaction id not found or expired"))
	}

	// 2. Lazy Expiry Check
	// Even if the reaper hasn't run yet, we enforce timeout strictly here.
	if time.Now().After(session.Expiry) {
		delete(s.txRegistry, msg.TransactionId)
		s.txMu.Unlock()
		_ = session.Tx.Rollback()
		return nil, connect.NewError(connect.CodeAborted, errors.New("transaction timed out"))
	}

	// 3. Heartbeat: Extend the session life
	session.Expiry = time.Now().Add(defaultTxTimeout)
	tx := session.Tx
	s.txMu.Unlock()

	// 4. Execution
	result, err := executeQueryAndBuffer(ctx, tx, msg.Sql, msg.Parameters)
	if err != nil {
		log.Printf("[%s] TransactionQuery failed: %v", reqID, err)
		// Return error logic (mapped to SqliteCode Enum)
		return nil, makeUnaryError(err, msg.Sql)
	}

	res := connect.NewResponse(result)
	res.Header().Set(headerRequestID, reqID)
	return res, nil
}

/**
 * TransactionQueryStream executes a SQL statement within an existing transaction context.
 *
 * HEARTBEAT MECHANISM:
 * Every successful call to this RPC extends the transaction's TTL by `defaultTxTimeout`.
 * This allows long-running workflows to stay alive as long as they are active.
 *
 * ERROR HANDLING:
 * If a SQL error occurs (e.g., Syntax Error), we return the error details but
 * **DO NOT** automatically rollback the transaction. This gives the client the choice
 * to retry or manually rollback, mirroring standard SQL behavior.
 */
func (s *DbServer) TransactionQueryStream(
	ctx context.Context,
	req *connect.Request[dbv1.TransactionQueryRequest],
	stream *connect.ServerStream[dbv1.QueryResponse],
) error {
	reqID := ensureRequestID(req.Header())
	// Send the ID in headers immediately. Even if the stream fails later,
	// the client has the ID to debug.
	stream.ResponseHeader().Set(headerRequestID, reqID)

	if err := protovalidate.Validate(req.Msg); err != nil {
		return connect.NewError(connect.CodeInvalidArgument, err)
	}

	// 1. Registry Lookup
	s.txMu.Lock()
	session, exists := s.txRegistry[req.Msg.TransactionId]
	if !exists {
		s.txMu.Unlock()
		return connect.NewError(connect.CodeNotFound, errors.New("transaction id not found or expired"))
	}

	// 2. Lazy Expiry Check
	// Even if the reaper hasn't run yet, we enforce timeout strictly here.
	if time.Now().After(session.Expiry) {
		delete(s.txRegistry, req.Msg.TransactionId)
		s.txMu.Unlock()
		_ = session.Tx.Rollback()
		return connect.NewError(connect.CodeAborted, errors.New("transaction timed out"))
	}

	// 3. Heartbeat: Extend the session life
	session.Expiry = time.Now().Add(defaultTxTimeout)
	tx := session.Tx
	s.txMu.Unlock()

	// 4. Execution (Streaming)
	// This blocks until the query finishes or the client disconnects.
	writer := &statelessStreamWriter{stream: stream}
	err := streamQueryResults(ctx, tx, req.Msg.Sql, req.Msg.Parameters, writer)
	if err != nil {
		log.Printf("[%s] Stream failed: %v", reqID, err)

		// Instead of returning a gRPC error (which kills the stream with headers),
		// 1. Create the proto error message and send it
		errResp := makeStreamError(err, req.Msg.Sql)
		sendErr := stream.Send(&dbv1.QueryResponse{
			Response: &dbv1.QueryResponse_Error{Error: errResp},
		})

		if sendErr != nil {
			// If we can't send the error message, fallback to connection error
			return connect.NewError(connect.CodeInternal, sendErr)
		}

		// 3. Return nil to close the stream gracefully.
		return nil
	}

	return nil
}

/**
 * CommitTransaction finalizes the transaction and releases resources.
 *
 * MEMORY SAFETY:
 * Regardless of whether the DB Commit succeeds or fails, the session is
 * removed from `txRegistry`. A failed commit means the transaction is broken
 * and cannot be reused.
 */
func (s *DbServer) CommitTransaction(ctx context.Context, req *connect.Request[dbv1.TransactionControlRequest]) (*connect.Response[dbv1.TransactionControlResponse], error) {
	msg := req.Msg
	if err := protovalidate.Validate(msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	s.txMu.Lock()
	session, exists := s.txRegistry[msg.TransactionId]
	if !exists {
		s.txMu.Unlock()
		return nil, connect.NewError(connect.CodeNotFound, errors.New("transaction id not found or expired"))
	}

	// CRITICAL: Always remove from registry to prevent memory leaks.
	// Once we attempt to commit, this session ID is consumed.
	delete(s.txRegistry, msg.TransactionId)
	s.txMu.Unlock()

	// Perform DB Commit
	if err := session.Tx.Commit(); err != nil {
		log.Printf("Commit failed for session %s: %v", msg.TransactionId, err)
		return nil, makeUnaryError(err, "COMMIT")
	}

	return connect.NewResponse(&dbv1.TransactionControlResponse{Success: true}), nil
}

/**
 * RollbackTransaction aborts the transaction.
 *
 * IDEMPOTENCY:
 * If the transaction ID is already gone (e.g., reaped by timeout or already rolled back),
 * this function returns `Success: true`. This prevents client errors when racing against timeouts.
 */
func (s *DbServer) RollbackTransaction(ctx context.Context, req *connect.Request[dbv1.TransactionControlRequest]) (*connect.Response[dbv1.TransactionControlResponse], error) {
	msg := req.Msg
	if err := protovalidate.Validate(msg); err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	s.txMu.Lock()
	session, exists := s.txRegistry[msg.TransactionId]
	if exists {
		// Clean up memory and DB connection
		delete(s.txRegistry, msg.TransactionId)
		_ = session.Tx.Rollback()
	}
	s.txMu.Unlock()

	return connect.NewResponse(&dbv1.TransactionControlResponse{Success: true}), nil
}
