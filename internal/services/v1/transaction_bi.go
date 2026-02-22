package servicesv1

import (
	"context"
	"database/sql"
	"errors"
	"io"
	"log"
	"sqlite-server/internal/auth"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"time"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
)

// transactionalStreamWriter adapts a `Transaction` (BidiStream).
type transactionalStreamWriter struct {
	stream *connect.BidiStream[sqlrpcv1.TransactionRequest, sqlrpcv1.TransactionResponse]
}

func (w *transactionalStreamWriter) SendHeader(header *sqlrpcv1.QueryResultHeader) error {
	return w.stream.Send(&sqlrpcv1.TransactionResponse{Response: &sqlrpcv1.TransactionResponse_StreamResult{
		StreamResult: &sqlrpcv1.QueryResponse{
			Response: &sqlrpcv1.QueryResponse_Header{
				Header: header,
			},
		},
	}})
}

func (w *transactionalStreamWriter) SendRowBatch(b *sqlrpcv1.QueryResultRowBatch) error {
	return w.stream.Send(&sqlrpcv1.TransactionResponse{Response: &sqlrpcv1.TransactionResponse_StreamResult{
		StreamResult: &sqlrpcv1.QueryResponse{
			Response: &sqlrpcv1.QueryResponse_Batch{
				Batch: b,
			},
		},
	}})
}

func (w *transactionalStreamWriter) SendDMLResult(r *sqlrpcv1.ExecResponse) error {
	return connect.NewError(connect.CodeInvalidArgument, errors.New("DML operations are not supported in stream queries"))
}

func (w *transactionalStreamWriter) SendComplete(s *sqlrpcv1.ExecutionStats) error {
	return w.stream.Send(&sqlrpcv1.TransactionResponse{Response: &sqlrpcv1.TransactionResponse_StreamResult{
		StreamResult: &sqlrpcv1.QueryResponse{
			Response: &sqlrpcv1.QueryResponse_Complete{
				Complete: &sqlrpcv1.QueryComplete{Stats: s},
			},
		},
	}})
}

// typedTransactionalStreamWriter adapts a `Transaction` (BidiStream) for typed queries.
type typedTransactionalStreamWriter struct {
	stream *connect.BidiStream[sqlrpcv1.TransactionRequest, sqlrpcv1.TransactionResponse]
}

func (w *typedTransactionalStreamWriter) SendHeader(header *sqlrpcv1.TypedQueryResultHeader) error {
	return w.stream.Send(&sqlrpcv1.TransactionResponse{Response: &sqlrpcv1.TransactionResponse_TypedStreamResult{
		TypedStreamResult: &sqlrpcv1.TypedQueryResponse{
			Response: &sqlrpcv1.TypedQueryResponse_Header{
				Header: header,
			},
		},
	}})
}

func (w *typedTransactionalStreamWriter) SendRowBatch(b *sqlrpcv1.TypedQueryResultRowBatch) error {
	return w.stream.Send(&sqlrpcv1.TransactionResponse{Response: &sqlrpcv1.TransactionResponse_TypedStreamResult{
		TypedStreamResult: &sqlrpcv1.TypedQueryResponse{
			Response: &sqlrpcv1.TypedQueryResponse_Batch{
				Batch: b,
			},
		},
	}})
}

func (w *typedTransactionalStreamWriter) SendDMLResult(r *sqlrpcv1.ExecResponse) error {
	return connect.NewError(connect.CodeInvalidArgument, errors.New("DML operations are not supported in typed stream queries"))
}

func (w *typedTransactionalStreamWriter) SendComplete(s *sqlrpcv1.ExecutionStats) error {
	return w.stream.Send(&sqlrpcv1.TransactionResponse{Response: &sqlrpcv1.TransactionResponse_TypedStreamResult{
		TypedStreamResult: &sqlrpcv1.TypedQueryResponse{
			Response: &sqlrpcv1.TypedQueryResponse_Complete{
				Complete: &sqlrpcv1.QueryComplete{Stats: s},
			},
		},
	}})
}

// Transaction handles the bidirectional `Transaction` stream.
// USE CASE:
// Interactive workflows needing ACID guarantees (e.g., "Read balance, Calculate, Update balance").
//
// ARCHITECTURE - SESSION MANAGEMENT:
//
//	Unlike unary calls, a stream is a long-lived session.
//	1. Connection: We generate a specific `traceID` (Session ID) immediately.
//	2. Logging: All server logs use this ID.
//	3. Handshake: When the client sends `Begin`, we return this ID in `BeginResponse.transaction_id`.
//
// ARCHITECTURE - STATE MACHINE:
//
//	The handler implements a strict loop:
//	- State: `tx` (active transaction).
//	- Transitions: `Begin` (nil -> tx), `Commit`/`Rollback` (tx -> nil).
//
// SAFETY - AUTOMATIC ROLLBACK:
//
//	A `defer` block guarantees that `tx.Rollback()` is called when the function exits.
//	This handles:
//	- Client disconnects (io.EOF).
//	- Network errors.
//	- Application Panics.
//	- Logic Errors.
//	- Timeout Errors.
//
// This prevents "Zombie Transactions" from locking the SQLite file indefinitely.
func (s *DbServer) Transaction(ctx context.Context, stream *connect.BidiStream[sqlrpcv1.TransactionRequest, sqlrpcv1.TransactionResponse]) error {
	// 1. Generate Session Trace ID
	// We favor a server-generated ID here to uniquely identify this specific socket connection.
	traceID := genRequestID()
	log.Printf("[%s] Transaction stream connected", traceID)

	// 1. Create a cancelable context for this stream session.
	// This allows the heartbeat monitor to force-close the stream.
	streamCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	var tx *sql.Tx
	var transactionDB string

	// 2. Heartbeat/Idle Timeout Logic
	// We use a timer to track inactivity.
	heartbeatTimer := time.NewTimer(defaultTxTimeout)
	defer heartbeatTimer.Stop()

	// This goroutine waits for the timer to expire or the context to end.
	go func() {
		select {
		case <-heartbeatTimer.C:
			log.Printf("[%s] Idle timeout: No activity for %v. Closing stream.", traceID, defaultTxTimeout)
			cancel() // This will cause stream.Receive() to return an error
		case <-streamCtx.Done():
			// Stream finished normally or via error
			return
		}
	}()

	// Function to reset the heartbeat whenever a message is received
	resetHeartbeat := func() {
		if !heartbeatTimer.Stop() {
			select {
			case <-heartbeatTimer.C:
			default:
			}
		}
		heartbeatTimer.Reset(defaultTxTimeout)
	}

	// CRITICAL SAFETY NET:
	// Ensures the DB lock is released no matter how the function exits.
	defer func() {
		if tx != nil {
			log.Printf("[%s] Stream closing with active transaction, performing emergency rollback.", traceID)
			_ = tx.Rollback()
		}
	}()

	// Event Loop
	for {
		// Read next message from client
		req, err := stream.Receive()
		if err != nil {
			if errors.Is(err, io.EOF) {
				// Client closed connection cleanly.
				return nil
			}
			log.Printf("[%s] Stream receive error: %v", traceID, err)
			return err
		}

		// Check if we timed out while waiting for this message
		if streamCtx.Err() != nil {
			log.Printf("[%s] Stream context canceled (likely timeout). rejecting message.", traceID)
			return streamCtx.Err()
		}

		// HEARTBEAT: Reset the timer on every successful message received
		resetHeartbeat()

		// Validate payload
		if err := protovalidate.Validate(req); err != nil {
			log.Printf("[%s] Validation failed: %v", traceID, err)
			return connect.NewError(connect.CodeInvalidArgument, err)
		}

		// Dispatch Command
		switch cmd := req.Command.(type) {

		// --- BEGIN COMMAND ---
		case *sqlrpcv1.TransactionRequest_Begin:
			if tx != nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: transaction already active"))
			}
			transactionDB = cmd.Begin.Database

			mode := ModeRW
			if auth.IsReadOnly(ctx) {
				mode = ModeRO
			}
			dbVal, errConn := s.dbManager.GetConnection(ctx, transactionDB, mode)
			if errConn != nil {
				return connect.NewError(connect.CodeNotFound, errConn)
			}
			// Variable renaming to avoid shadowing if necessary, but 'db' usage follows.
			// The original code used 'db, ok := ...'.
			// We can use 'db := dbVal'.
			db := dbVal

			// Configure Locking Mode
			// SQLite "IMMEDIATE" and "EXCLUSIVE" help avoid busy loops in write-heavy scenarios.
			txOpts := &sql.TxOptions{ReadOnly: false}
			// Map the proto mode to the SQL driver
			if cmd.Begin.Mode == sqlrpcv1.TransactionLockMode_TRANSACTION_LOCK_MODE_IMMEDIATE ||
				cmd.Begin.Mode == sqlrpcv1.TransactionLockMode_TRANSACTION_LOCK_MODE_EXCLUSIVE {
				// This is a common trick for mattn/go-sqlite3 to trigger IMMEDIATE/EXCLUSIVE
				txOpts.Isolation = sql.LevelSerializable
			}

			var err error
			tx, err = db.BeginTx(ctx, txOpts) // Use BeginTx instead of Begin
			if err != nil {
				log.Printf("[%s] Failed to begin transaction: %v", traceID, err)
				return connect.NewError(connect.CodeInternal, err)
			}

			// Send Success + Session ID
			// The client can now use `traceID` to debug server-side logs.
			_ = stream.Send(&sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_Begin{
					Begin: &sqlrpcv1.BeginResponse{
						Success:       true,
						TransactionId: traceID,
					},
				},
			})
			continue

		// --- QUERY COMMAND ---
		case *sqlrpcv1.TransactionRequest_Query:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: no active transaction"))
			}

			// SECURITY CHECK:
			// Ensure the SQL string doesn't contain manual BEGIN/COMMIT/ROLLBACK.
			// In an atomic script, users MUST use the structured 'commit' or 'rollback' fields.
			if err := ValidateStatelessQuery(cmd.Query.Sql); err != nil {
				log.Printf("[%s] Blocked manual transaction control in script query: %s", traceID, cmd.Query.Sql)
				return err // Return immediate protocol error
			}

			// Execute Query
			// Note: We do NOT return the error here. If a query fails (e.g., syntax error),
			// we send an application-level error message and keep the stream/transaction alive.
			// The client decides whether to fix the query or Rollback.
			result, err := executeQueryAndBuffer(ctx, tx, cmd.Query.Sql, cmd.Query.Parameters)
			if err != nil {
				log.Printf("[%s] Query error: %v", traceID, err)
				sendAppError(stream, traceID, err, cmd.Query.Sql)
			} else {
				_ = stream.Send(&sqlrpcv1.TransactionResponse{
					Response: &sqlrpcv1.TransactionResponse_QueryResult{
						QueryResult: result,
					},
				})
			}
			continue

		// --- QUERY COMMAND ---
		case *sqlrpcv1.TransactionRequest_QueryStream:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: no active transaction"))
			}

			// SECURITY CHECK:
			// Ensure the SQL string doesn't contain manual BEGIN/COMMIT/ROLLBACK.
			// In an atomic script, users MUST use the structured 'commit' or 'rollback' fields.
			if err := ValidateStatelessQuery(cmd.QueryStream.Sql); err != nil {
				log.Printf("[%s] Blocked manual transaction control in script query: %s", traceID, cmd.QueryStream.Sql)
				return err // Return immediate protocol error
			}

			// Use the transactional writer adapter
			writer := &transactionalStreamWriter{stream: stream}

			// Execute Query
			// Note: We do NOT return the error here. If a query fails (e.g., syntax error),
			// we send an application-level error message and keep the stream/transaction alive.
			// The client decides whether to fix the query or Rollback.
			err := streamQueryResults(ctx, tx, cmd.QueryStream.Sql, cmd.QueryStream.Parameters, writer)
			if err != nil {
				log.Printf("[%s] Query error: %v", traceID, err)
				sendAppError(stream, traceID, err, cmd.QueryStream.Sql)
			}
			continue

			// Inside Transaction event loop switch...

		case *sqlrpcv1.TransactionRequest_Exec:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: no active transaction"))
			}
			if err := ValidateStatelessQuery(cmd.Exec.Sql); err != nil {
				return err
			}
			result, err := executeExecAndBuffer(ctx, tx, cmd.Exec.Sql, cmd.Exec.Parameters)
			if err != nil {
				sendAppError(stream, traceID, err, cmd.Exec.Sql)
			} else {
				_ = stream.Send(&sqlrpcv1.TransactionResponse{
					Response: &sqlrpcv1.TransactionResponse_ExecResult{ExecResult: result},
				})
			}
			continue

		case *sqlrpcv1.TransactionRequest_TypedExec:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: no active transaction"))
			}
			if err := ValidateStatelessQuery(cmd.TypedExec.Sql); err != nil {
				return err
			}
			result, err := typedExecuteExecAndBuffer(ctx, tx, cmd.TypedExec.Sql, cmd.TypedExec.Parameters)
			if err != nil {
				sendAppError(stream, traceID, err, cmd.TypedExec.Sql)
			} else {
				_ = stream.Send(&sqlrpcv1.TransactionResponse{
					Response: &sqlrpcv1.TransactionResponse_ExecResult{ExecResult: result},
				})
			}
			continue

		case *sqlrpcv1.TransactionRequest_Savepoint:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("no active transaction"))
			}

			sql, err := generateSavepointSQL(cmd.Savepoint)
			if err != nil {
				sendAppError(stream, traceID, err, "SAVEPOINT_GEN")
				continue
			}

			if _, err := tx.ExecContext(ctx, sql); err != nil {
				// Sends ErrorResponse as a stream message
				sendAppError(stream, traceID, err, sql)
				continue
			}

			// Success response
			_ = stream.Send(&sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_Savepoint{
					Savepoint: &sqlrpcv1.SavepointResponse{
						Success: true,
						Name:    cmd.Savepoint.Name,
						Action:  cmd.Savepoint.Action,
					},
				},
			})

		// --- COMMIT COMMAND ---
		// Replaces: case *sqlrpcv1.TransactionRequest_Commit:
		case *sqlrpcv1.TransactionRequest_Commit:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: no active transaction"))
			}

			// Attempt to persist changes to disk
			if err := tx.Commit(); err != nil {
				tx = nil // Mark nil so defer doesn't try to rollback
				log.Printf("[%s] Commit failed (disk I/O or constraint): %v", traceID, err)
				return connect.NewError(connect.CodeInternal, err)
			}

			tx = nil // Successfully committed
			log.Printf("[%s] Transaction committed successfully", traceID)

			_ = stream.Send(&sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_Commit{Commit: &sqlrpcv1.CommitResponse{Success: true}},
			})
			return nil // End of workflow

		// --- ROLLBACK COMMAND ---
		// Replaces: case *sqlrpcv1.TransactionRequest_Rollback:
		case *sqlrpcv1.TransactionRequest_Rollback:
			if tx != nil {
				_ = tx.Rollback()
				tx = nil
			}
			log.Printf("[%s] Client requested rollback", traceID)
			_ = stream.Send(&sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_Rollback{Rollback: &sqlrpcv1.RollbackResponse{Success: true}},
			})
			return nil // End of workflow

		// --- TYPED QUERY COMMAND ---
		case *sqlrpcv1.TransactionRequest_TypedQuery:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: no active transaction"))
			}

			if err := ValidateStatelessQuery(cmd.TypedQuery.Sql); err != nil {
				log.Printf("[%s] Blocked manual transaction control in typed query: %s", traceID, cmd.TypedQuery.Sql)
				return err
			}

			result, err := typedExecuteQueryAndBuffer(ctx, tx, cmd.TypedQuery.Sql, cmd.TypedQuery.Parameters)
			if err != nil {
				log.Printf("[%s] Typed query error: %v", traceID, err)
				sendAppError(stream, traceID, err, cmd.TypedQuery.Sql)
			} else {
				_ = stream.Send(&sqlrpcv1.TransactionResponse{
					Response: &sqlrpcv1.TransactionResponse_TypedQueryResult{
						TypedQueryResult: result,
					},
				})
			}
			continue

		// --- TYPED QUERY STREAM COMMAND ---
		case *sqlrpcv1.TransactionRequest_TypedQueryStream:
			if tx == nil {
				return connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: no active transaction"))
			}

			if err := ValidateStatelessQuery(cmd.TypedQueryStream.Sql); err != nil {
				log.Printf("[%s] Blocked manual transaction control in typed stream query: %s", traceID, cmd.TypedQueryStream.Sql)
				return err
			}

			// Use the typed transactional writer adapter
			typedWriter := &typedTransactionalStreamWriter{stream: stream}

			err := typedStreamQueryResults(ctx, tx, cmd.TypedQueryStream.Sql, cmd.TypedQueryStream.Parameters, typedWriter)
			if err != nil {
				log.Printf("[%s] Typed stream query error: %v", traceID, err)
				sendAppError(stream, traceID, err, cmd.TypedQueryStream.Sql)
			}
			continue

		default:
			log.Printf("[%s] Unknown command type", traceID)
			return connect.NewError(connect.CodeInvalidArgument, errors.New("unknown command"))
		}
	}
}
