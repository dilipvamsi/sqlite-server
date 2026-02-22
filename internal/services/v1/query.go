package servicesv1

import (
	"context"
	"errors"
	"log"
	"regexp"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"sqlite-server/internal/auth"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
)

// --- StreamWriter Concrete Implementations ---

// statelessStreamWriter adapts a `QueryStream` (ServerStream).
type statelessStreamWriter struct {
	stream *connect.ServerStream[sqlrpcv1.QueryResponse]
}

func (w *statelessStreamWriter) SendHeader(h *sqlrpcv1.QueryResultHeader) error {
	return w.stream.Send(&sqlrpcv1.QueryResponse{Response: &sqlrpcv1.QueryResponse_Header{Header: h}})
}
func (w *statelessStreamWriter) SendRowBatch(b *sqlrpcv1.QueryResultRowBatch) error {
	return w.stream.Send(&sqlrpcv1.QueryResponse{Response: &sqlrpcv1.QueryResponse_Batch{Batch: b}})
}
func (w *statelessStreamWriter) SendDMLResult(r *sqlrpcv1.ExecResponse) error {
	return connect.NewError(connect.CodeInvalidArgument, errors.New("DML operations are not supported in stream queries"))
}
func (w *statelessStreamWriter) SendComplete(s *sqlrpcv1.ExecutionStats) error {
	return w.stream.Send(&sqlrpcv1.QueryResponse{Response: &sqlrpcv1.QueryResponse_Complete{Complete: &sqlrpcv1.QueryComplete{Stats: s}}})
}

// Matches BEGIN, COMMIT, ROLLBACK, END, SAVEPOINT, RELEASE at the start of the string.
// We use \b to ensure we don't match words like "BEGINNER".
var txControlRegex = regexp.MustCompile(`(?i)^\s*(BEGIN|COMMIT|ROLLBACK|END|SAVEPOINT|RELEASE)\b`)

// IsTransactionControl checks if the SQL string contains manual transaction management.
func IsTransactionControl(sql string) bool {
	return txControlRegex.MatchString(sql)
}

// ValidateStatelessQuery ensures that manual transaction commands are not
// present in stateless RPC calls.
func ValidateStatelessQuery(sql string) error {
	if IsTransactionControl(sql) {
		return connect.NewError(
			connect.CodeInvalidArgument,
			errors.New("manual transaction control (BEGIN/COMMIT/ROLLBACK) is not allowed in stateless Query/QueryStream. Use the Transaction RPCs instead."),
		)
	}
	return nil
}

// Query handles the unary `Query` RPC.
//
// USE CASE:
// Ideal for "Point Lookups" (e.g., GetUserByID) where the result is known to be small.
//
// BEHAVIOR:
//
//  1. Traceability: Ensures an X-Request-Id exists (generating one if missing).
//  2. Validation: Checks input constraints (SQL length, DB name format).
//  3. Execution: Buffers ALL results into memory.
//  4. Response: Returns the complete result set and echoes the Request ID in headers.
//
// WARNING:
// Do not use for "SELECT * FROM LargeTable". It will cause high memory pressure.
func (s *DbServer) Query(ctx context.Context, req *connect.Request[sqlrpcv1.QueryRequest]) (*connect.Response[sqlrpcv1.QueryResult], error) {
	// 1. Traceability: Extract or Generate Request ID
	reqID := ensureRequestID(req.Header())

	// 2. Validation: Strict Proto constraints
	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed for Query: %v", reqID, err)
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	if err := ValidateStatelessQuery(req.Msg.Sql); err != nil {
		return nil, err
	}

	msg := req.Msg

	// 4. Routing: Find the correct DB pool

	mode := ModeRW
	if auth.IsReadOnly(ctx) {
		mode = ModeRO
	}
	db, err := s.dbManager.GetConnection(ctx, msg.Database, mode)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	// 5. Execution (Buffered)
	result, err := executeQueryAndBuffer(ctx, db, msg.Sql, msg.Parameters)
	if err != nil {
		log.Printf("[%s] Query execution failed: %v", reqID, err)
		return nil, makeUnaryError(err, msg.Sql)
	}

	// 6. Response Construction
	res := connect.NewResponse(result)
	// Crucial: Return the ID so the client can correlate logs.
	res.Header().Set(headerRequestID, reqID)

	return res, nil
}

// QueryStream handles the server-streaming `QueryStream` RPC.
//
// USE CASE:
// The default, safe choice for general queries, reports, and exports.
//
// BEHAVIOR:
//  1. Traceability: Ensures Request ID exists.
//  2. Execution: Delegates to `streamQueryResults`, which uses a `StreamWriter` to
//     send data in chunks (Header -> Batch... -> Complete).
//
// MEMORY SAFETY:
//
// This handler operates in O(1) memory space relative to the result size.
func (s *DbServer) QueryStream(ctx context.Context, req *connect.Request[sqlrpcv1.QueryRequest], stream *connect.ServerStream[sqlrpcv1.QueryResponse]) error {
	// 1. Traceability
	reqID := ensureRequestID(req.Header())
	// Send the ID in headers immediately. Even if the stream fails later,
	// the client has the ID to debug.
	stream.ResponseHeader().Set(headerRequestID, reqID)

	// 2. Validation
	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed for QueryStream: %v", reqID, err)
		return connect.NewError(connect.CodeInvalidArgument, err)
	}
	if err := ValidateStatelessQuery(req.Msg.Sql); err != nil {
		return err
	}

	// 3. Authorization Check
	isWrite := IsWriteQuery(req.Msg.Sql)
	if isWrite {
		if err := AuthorizeWrite(ctx); err != nil {
			return connect.NewError(connect.CodePermissionDenied, err)
		}
	}

	reqMsg := req.Msg

	mode := ModeRW
	if auth.IsReadOnly(ctx) {
		mode = ModeRO
	}
	db, err := s.dbManager.GetConnection(ctx, reqMsg.Database, mode)
	if err != nil {
		return connect.NewError(connect.CodeNotFound, err)
	}

	// 4. Setup Adapter: Wrap the specific ServerStream in our generic interface.
	writer := &statelessStreamWriter{stream: stream}

	// 5. Execution (Streaming)
	// This blocks until the query finishes or the client disconnects.
	err = streamQueryResults(ctx, db, reqMsg.Sql, reqMsg.Parameters, writer)
	if err != nil {
		log.Printf("[%s] Stream failed: %v", reqID, err)

		// Instead of returning a gRPC error (which kills the stream with headers),

		// 1. Create the proto error message
		errResp := makeStreamError(err, reqMsg.Sql)

		// 2. Send it
		sendErr := stream.Send(&sqlrpcv1.QueryResponse{
			Response: &sqlrpcv1.QueryResponse_Error{Error: errResp},
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

// =============================================================================
// TYPED QUERY HANDLERS
// =============================================================================
// These use SqlValue/SqlRow for explicit typing instead of ListValue.

// typedStatelessStreamWriter adapts a TypedQueryStream ServerStream.
type typedStatelessStreamWriter struct {
	stream *connect.ServerStream[sqlrpcv1.TypedQueryResponse]
}

func (w *typedStatelessStreamWriter) SendHeader(h *sqlrpcv1.TypedQueryResultHeader) error {
	return w.stream.Send(&sqlrpcv1.TypedQueryResponse{Response: &sqlrpcv1.TypedQueryResponse_Header{Header: h}})
}
func (w *typedStatelessStreamWriter) SendRowBatch(b *sqlrpcv1.TypedQueryResultRowBatch) error {
	return w.stream.Send(&sqlrpcv1.TypedQueryResponse{Response: &sqlrpcv1.TypedQueryResponse_Batch{Batch: b}})
}
func (w *typedStatelessStreamWriter) SendDMLResult(r *sqlrpcv1.ExecResponse) error {
	return connect.NewError(connect.CodeInvalidArgument, errors.New("DML operations are not supported in typed stream queries"))
}
func (w *typedStatelessStreamWriter) SendComplete(s *sqlrpcv1.ExecutionStats) error {
	return w.stream.Send(&sqlrpcv1.TypedQueryResponse{Response: &sqlrpcv1.TypedQueryResponse_Complete{Complete: &sqlrpcv1.QueryComplete{Stats: s}}})
}

// TypedQuery handles the unary `TypedQuery` RPC.
//
// This is the typed variant of Query. It uses SqlValue/SqlRow for results
// instead of ListValue, providing better type safety and wire efficiency.
func (s *DbServer) TypedQuery(ctx context.Context, req *connect.Request[sqlrpcv1.TypedQueryRequest]) (*connect.Response[sqlrpcv1.TypedQueryResult], error) {
	reqID := ensureRequestID(req.Header())

	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed for TypedQuery: %v", reqID, err)
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	if err := ValidateStatelessQuery(req.Msg.Sql); err != nil {
		return nil, err
	}

	msg := req.Msg

	mode := ModeRW
	if auth.IsReadOnly(ctx) {
		mode = ModeRO
	}
	db, err := s.dbManager.GetConnection(ctx, msg.Database, mode)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	result, err := typedExecuteQueryAndBuffer(ctx, db, msg.Sql, msg.Parameters)
	if err != nil {
		log.Printf("[%s] TypedQuery execution failed: %v", reqID, err)
		return nil, makeUnaryError(err, msg.Sql)
	}

	res := connect.NewResponse(result)
	res.Header().Set(headerRequestID, reqID)
	return res, nil
}

// TypedQueryStream handles the server-streaming `TypedQueryStream` RPC.
//
// This is the typed variant of QueryStream. It uses SqlValue/SqlRow for results.
func (s *DbServer) TypedQueryStream(ctx context.Context, req *connect.Request[sqlrpcv1.TypedQueryRequest], stream *connect.ServerStream[sqlrpcv1.TypedQueryResponse]) error {
	reqID := ensureRequestID(req.Header())
	stream.ResponseHeader().Set(headerRequestID, reqID)

	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed for TypedQueryStream: %v", reqID, err)
		return connect.NewError(connect.CodeInvalidArgument, err)
	}
	if err := ValidateStatelessQuery(req.Msg.Sql); err != nil {
		return err
	}

	// 3. Authorization Check
	isWrite := IsWriteQuery(req.Msg.Sql)
	if isWrite {
		if err := AuthorizeWrite(ctx); err != nil {
			return connect.NewError(connect.CodePermissionDenied, err)
		}
	}

	msg := req.Msg

	mode := ModeRW
	if auth.IsReadOnly(ctx) {
		mode = ModeRO
	}
	db, err := s.dbManager.GetConnection(ctx, msg.Database, mode)
	if err != nil {
		return connect.NewError(connect.CodeNotFound, err)
	}

	writer := &typedStatelessStreamWriter{stream: stream}

	err = typedStreamQueryResults(ctx, db, msg.Sql, msg.Parameters, writer)
	if err != nil {
		log.Printf("[%s] TypedStream failed: %v", reqID, err)

		errResp := makeStreamError(err, msg.Sql)
		sendErr := stream.Send(&sqlrpcv1.TypedQueryResponse{
			Response: &sqlrpcv1.TypedQueryResponse_Error{Error: errResp},
		})

		if sendErr != nil {
			return connect.NewError(connect.CodeInternal, sendErr)
		}
		return nil
	}

	return nil
}
