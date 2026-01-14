package servicesv1

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
)

// ExecuteTransaction handles the unary `ExecuteTransaction` RPC.
//
// USE CASE:
// Atomic scripts (e.g., "Migration V1", "Seeding Data").
//
// BEHAVIOR:
// 1. Opens a Transaction.
// 2. Executes a list of commands sequentially.
// 3. Atomicity: If ANY command fails, the ENTIRE transaction is rolled back.
// 4. Returns a list of results, one for each command.
//
// TRACING:
// Uses Request ID from headers or generates one.
func (s *DbServer) ExecuteTransaction(ctx context.Context, req *connect.Request[dbv1.ExecuteTransactionRequest]) (*connect.Response[dbv1.ExecuteTransactionResponse], error) {
	reqID := ensureRequestID(req.Header())

	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed: %v", reqID, err)
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	requests := req.Msg.Requests
	if len(requests) == 0 {
		return connect.NewResponse(&dbv1.ExecuteTransactionResponse{}), nil
	}

	var tx *sql.Tx
	var allResponses []*dbv1.TransactionResponse

	// Safety: Ensure rollback on failure
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	// Sequential Execution Loop
	for _, request := range requests {

		// 1. Handle BEGIN (Must be first)
		if beginCmd := request.GetBegin(); beginCmd != nil {
			if tx != nil {
				return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("transaction already begun"))
			}
			db, ok := s.Dbs[beginCmd.Database]
			if !ok {
				return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", beginCmd.Database))
			}

			// Configure Locking Mode
			// SQLite "IMMEDIATE" and "EXCLUSIVE" help avoid busy loops in write-heavy scenarios.
			txOpts := &sql.TxOptions{ReadOnly: false}
			// Map the proto mode to the SQL driver
			if beginCmd.Mode == dbv1.TransactionMode_TRANSACTION_MODE_IMMEDIATE ||
				beginCmd.Mode == dbv1.TransactionMode_TRANSACTION_MODE_EXCLUSIVE {
				// This is a common trick for mattn/go-sqlite3 to trigger IMMEDIATE/EXCLUSIVE
				txOpts.Isolation = sql.LevelSerializable
			}

			var err error
			tx, err = db.BeginTx(ctx, txOpts) // Use BeginTx instead of Begin
			if err != nil {
				log.Printf("[%s] Failed to begin transaction: %v", reqID, err)
				return nil, connect.NewError(connect.CodeInternal, err)
			}

			// For scripts, we return the RequestID as the TransactionID for consistency
			allResponses = append(allResponses, &dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_Begin{
					Begin: &dbv1.BeginResponse{
						Success:       true,
						TransactionId: reqID,
					},
				},
			})
			continue
		}

		if tx == nil {
			return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("first command must be 'begin'"))
		}

		// 2. Handle QUERY
		if queryCmd := request.GetQuery(); queryCmd != nil {
			// Helper executes query and buffers result into a simulation of the streaming response
			result, err := executeQueryAndBuffer(ctx, tx, queryCmd.Sql, queryCmd.Parameters)
			if err != nil {
				log.Printf("[%s] Script Query failed: %v", reqID, err)
				// Append Error and return immediately. Defer will rollback.
				allResponses = append(allResponses, &dbv1.TransactionResponse{
					Response: &dbv1.TransactionResponse_Error{Error: &dbv1.ErrorResponse{Message: err.Error(), FailedSql: queryCmd.Sql}},
				})
				return connect.NewResponse(&dbv1.ExecuteTransactionResponse{Responses: allResponses}), nil
			}
			allResponses = append(allResponses, &dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_QueryResult{
					QueryResult: result,
				},
			})
			continue
		}

		if queryStreamCmd := request.GetQueryStream(); queryStreamCmd != nil {
			// Helper executes query and buffers result into a simulation of the streaming response
			result, err := executeQueryAndBuffer(ctx, tx, queryStreamCmd.Sql, queryStreamCmd.Parameters)
			if err != nil {
				log.Printf("[%s] Script Query failed: %v", reqID, err)
				// Append Error and return immediately. Defer will rollback.
				allResponses = append(allResponses, &dbv1.TransactionResponse{
					Response: &dbv1.TransactionResponse_Error{Error: &dbv1.ErrorResponse{Message: err.Error(), FailedSql: queryStreamCmd.Sql}},
				})
				return connect.NewResponse(&dbv1.ExecuteTransactionResponse{Responses: allResponses}), nil
			}
			allResponses = append(allResponses, &dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_QueryResult{
					QueryResult: result,
				},
			})
			continue
		}

		// 3. Handle COMMIT
		if request.GetCommit() != nil {
			if err := tx.Commit(); err != nil {
				return nil, connect.NewError(connect.CodeInternal, err)
			}
			tx = nil // Prevent defer rollback
			allResponses = append(allResponses, &dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_Commit{Commit: &dbv1.CommitResponse{Success: true}},
			})
			continue
		}

		// 4. Handle ROLLBACK
		if request.GetRollback() != nil {
			_ = tx.Rollback()
			tx = nil // Prevent defer rollback
			allResponses = append(allResponses, &dbv1.TransactionResponse{
				Response: &dbv1.TransactionResponse_Rollback{Rollback: &dbv1.RollbackResponse{Success: true}},
			})
			continue
		}
	}

	res := connect.NewResponse(&dbv1.ExecuteTransactionResponse{Responses: allResponses})
	res.Header().Set(headerRequestID, reqID)
	return res, nil
}
