package servicesv1

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"

	"sqlite-server/internal/auth"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
)

// ExecuteTransaction handles the unary `ExecuteTransaction` RPC.
//
// ARCHITECTURAL DESIGN:
//
//  1. ATOMICITY: This RPC executes a sequence of commands as a single unit of work.
//     If any command fails, the loop exits immediately and the `defer` block
//     triggers a database ROLLBACK.
//
//  2. UNARY STREAMING MAPPING: While the proto allows `query_stream` inside the script,
//     since this is a Unary RPC, the server MUST buffer those results and return
//     them in a single response. For real-time streaming, use the `Transaction` RPC.
//
//  3. ISOLATION: Supports standard SQLite BEGIN modes (DEFERRED, IMMEDIATE, EXCLUSIVE)
//     to manage lock contention during script execution.
func (s *DbServer) ExecuteTransaction(ctx context.Context, req *connect.Request[sqlrpcv1.ExecuteTransactionRequest]) (*connect.Response[sqlrpcv1.ExecuteTransactionResponse], error) {
	reqID := ensureRequestID(req.Header())

	// 1. Fail-Fast Validation
	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed: %v", reqID, err)
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	requests := req.Msg.Requests
	if len(requests) == 0 {
		return connect.NewResponse(&sqlrpcv1.ExecuteTransactionResponse{}), nil
	}

	var tx *sql.Tx
	var allResponses []*sqlrpcv1.TransactionResponse

	// CRITICAL SAFETY: The defer block ensures that if the loop exits via 'return'
	// (due to an error) or a panic, the transaction is rolled back, preventing
	// the connection pool from being left in a "dirty" state.
	defer func() {
		if tx != nil {
			log.Printf("[%s] Script interrupted or failed; rolling back transaction.", reqID)
			// Use Background() for rollback to ensure it completes even if the
			// request context is already timed out.
			_ = tx.Rollback()
		}
	}()

	// Sequential Execution Loop
	for i, request := range requests {
		// CHECK FOR TIMEOUT/CANCELLATION
		// Ensure we don't keep processing if the client disconnected or timed out.
		if err := ctx.Err(); err != nil {
			return nil, connect.NewError(connect.CodeDeadlineExceeded, fmt.Errorf("script execution timed out at step %d: %w", i, err))
		}

		// Use a Type Switch to handle the 'oneof' command
		switch cmd := request.Command.(type) {

		case *sqlrpcv1.TransactionRequest_Begin:
			// --- Handle BEGIN ---
			if tx != nil {
				return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("protocol violation: transaction already active"))
			}

			mode := ModeRW
			if auth.IsReadOnly(ctx) {
				mode = ModeRO
			}
			dbVal, errConn := s.dbManager.GetConnection(ctx, cmd.Begin.Database, mode)
			if errConn != nil {
				return nil, connect.NewError(connect.CodeNotFound, errConn)
			}
			db := dbVal

			// Configure Locking Mode
			txOpts := &sql.TxOptions{ReadOnly: false}
			if cmd.Begin.Mode == sqlrpcv1.TransactionLockMode_TRANSACTION_LOCK_MODE_IMMEDIATE ||
				cmd.Begin.Mode == sqlrpcv1.TransactionLockMode_TRANSACTION_LOCK_MODE_EXCLUSIVE {
				// Standard Go SQL trick: LevelSerializable triggers an IMMEDIATE/EXCLUSIVE lock in sqlite3 driver
				txOpts.Isolation = sql.LevelSerializable
			}

			var err error
			tx, err = db.BeginTx(ctx, txOpts)
			if err != nil {
				return nil, connect.NewError(connect.CodeInternal, err)
			}

			allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_Begin{
					Begin: &sqlrpcv1.BeginResponse{Success: true, TransactionId: reqID},
				},
			})

		case *sqlrpcv1.TransactionRequest_Query, *sqlrpcv1.TransactionRequest_QueryStream:
			// --- Handle QUERY & QUERY_STREAM ---
			// Note: Both are treated as buffered queries in a Unary script execution.
			if tx == nil {
				return nil, connect.NewError(connect.CodeFailedPrecondition, errors.New("no active transaction; first command must be 'begin'"))
			}

			// Extract SQL and Params regardless of which query type was used
			var sqlStr string
			var params *sqlrpcv1.Parameters
			if q := request.GetQuery(); q != nil {
				sqlStr, params = q.Sql, q.Parameters
			} else {
				qs := request.GetQueryStream()
				sqlStr, params = qs.Sql, qs.Parameters
			}

			// SECURITY CHECK:
			// Ensure the SQL string doesn't contain manual BEGIN/COMMIT/ROLLBACK.
			// In an atomic script, users MUST use the structured 'commit' or 'rollback' fields.
			if err := ValidateStatelessQuery(sqlStr); err != nil {
				log.Printf("[%s] Blocked manual transaction control in script query: %s", reqID, sqlStr)
				return nil, err // Return immediate protocol error
			}

			result, err := executeQueryAndBuffer(ctx, tx, sqlStr, params)
			if err != nil {
				// We append the error to the response list so the client knows exactly which step (i) failed.
				allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
					Response: &sqlrpcv1.TransactionResponse_Error{
						Error: makeStreamError(err, sqlStr),
					},
				})
				// Return the collected responses and exit. Defer will handle the Rollback.
				return connect.NewResponse(&sqlrpcv1.ExecuteTransactionResponse{Responses: allResponses}), nil
			}

			allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_QueryResult{QueryResult: result},
			})

		case *sqlrpcv1.TransactionRequest_TypedQuery, *sqlrpcv1.TransactionRequest_TypedQueryStream:
			// --- Handle TYPED QUERY & TYPED QUERY_STREAM ---
			if tx == nil {
				return nil, connect.NewError(connect.CodeFailedPrecondition, errors.New("no active transaction; first command must be 'begin'"))
			}

			var sqlStr string
			var params *sqlrpcv1.TypedParameters
			if q := request.GetTypedQuery(); q != nil {
				sqlStr, params = q.Sql, q.Parameters
			} else {
				qs := request.GetTypedQueryStream()
				sqlStr, params = qs.Sql, qs.Parameters
			}

			if err := ValidateStatelessQuery(sqlStr); err != nil {
				log.Printf("[%s] Blocked manual transaction control in script query: %s", reqID, sqlStr)
				return nil, err
			}

			result, err := typedExecuteQueryAndBuffer(ctx, tx, sqlStr, params)
			if err != nil {
				allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
					Response: &sqlrpcv1.TransactionResponse_Error{
						Error: makeStreamError(err, sqlStr),
					},
				})
				return connect.NewResponse(&sqlrpcv1.ExecuteTransactionResponse{Responses: allResponses}), nil
			}

			allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_TypedQueryResult{TypedQueryResult: result},
			})

		case *sqlrpcv1.TransactionRequest_Exec:
			if tx == nil {
				return nil, connect.NewError(connect.CodeFailedPrecondition, errors.New("no active transaction; first command must be 'begin'"))
			}

			sqlStr, params := cmd.Exec.Sql, cmd.Exec.Parameters

			if err := ValidateStatelessQuery(sqlStr); err != nil {
				log.Printf("[%s] Blocked manual transaction control in script exec: %s", reqID, sqlStr)
				return nil, err
			}

			result, err := executeExecAndBuffer(ctx, tx, sqlStr, params)
			if err != nil {
				allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
					Response: &sqlrpcv1.TransactionResponse_Error{Error: makeStreamError(err, sqlStr)},
				})
				return connect.NewResponse(&sqlrpcv1.ExecuteTransactionResponse{Responses: allResponses}), nil
			}

			allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_ExecResult{ExecResult: result},
			})

		case *sqlrpcv1.TransactionRequest_TypedExec:
			if tx == nil {
				return nil, connect.NewError(connect.CodeFailedPrecondition, errors.New("no active transaction; first command must be 'begin'"))
			}

			sqlStr, params := cmd.TypedExec.Sql, cmd.TypedExec.Parameters

			if err := ValidateStatelessQuery(sqlStr); err != nil {
				log.Printf("[%s] Blocked manual transaction control in script exec: %s", reqID, sqlStr)
				return nil, err
			}

			result, err := typedExecuteExecAndBuffer(ctx, tx, sqlStr, params)
			if err != nil {
				allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
					Response: &sqlrpcv1.TransactionResponse_Error{Error: makeStreamError(err, sqlStr)},
				})
				return connect.NewResponse(&sqlrpcv1.ExecuteTransactionResponse{Responses: allResponses}), nil
			}

			allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_ExecResult{ExecResult: result},
			})

		case *sqlrpcv1.TransactionRequest_Savepoint:
			// --- Handle SAVEPOINT (Nested Transactions) ---
			if tx == nil {
				return nil, connect.NewError(connect.CodeFailedPrecondition, errors.New("no active transaction for savepoint"))
			}

			sqlStr, err := generateSavepointSQL(cmd.Savepoint)
			if err != nil {
				return nil, connect.NewError(connect.CodeInvalidArgument, err)
			}

			if _, err := tx.ExecContext(ctx, sqlStr); err != nil {
				allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
					Response: &sqlrpcv1.TransactionResponse_Error{Error: makeStreamError(err, sqlStr)},
				})
				return connect.NewResponse(&sqlrpcv1.ExecuteTransactionResponse{Responses: allResponses}), nil
			}

			allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_Savepoint{
					Savepoint: &sqlrpcv1.SavepointResponse{
						Success: true,
						Name:    cmd.Savepoint.Name,
						Action:  cmd.Savepoint.Action,
					},
				},
			})

		case *sqlrpcv1.TransactionRequest_Commit:
			// --- Handle COMMIT ---
			if tx == nil {
				return nil, connect.NewError(connect.CodeFailedPrecondition, errors.New("no active transaction to commit"))
			}
			if err := tx.Commit(); err != nil {
				return nil, connect.NewError(connect.CodeInternal, err)
			}
			tx = nil // Successfully committed, disable defer rollback
			allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_Commit{Commit: &sqlrpcv1.CommitResponse{Success: true}},
			})

		case *sqlrpcv1.TransactionRequest_Rollback:
			// --- Handle ROLLBACK ---
			if tx != nil {
				_ = tx.Rollback()
				tx = nil // Manually rolled back, disable defer rollback
			}
			allResponses = append(allResponses, &sqlrpcv1.TransactionResponse{
				Response: &sqlrpcv1.TransactionResponse_Rollback{Rollback: &sqlrpcv1.RollbackResponse{Success: true}},
			})

		default:
			log.Printf("[%s] Received unimplemented command type in script at index %d", reqID, i)
		}
	}

	// At the very end of the function, after the loop:
	if tx != nil {
		_ = tx.Rollback()
		return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("script ended without an explicit COMMIT or ROLLBACK"))
	}

	res := connect.NewResponse(&sqlrpcv1.ExecuteTransactionResponse{Responses: allResponses})
	res.Header().Set(headerRequestID, reqID)
	return res, nil
}
