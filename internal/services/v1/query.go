package servicesv1

import (
	"context"
	"fmt"
	"log"
	dbv1 "sqlite-server/internal/protos/db/v1"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
)

// --- StreamWriter Concrete Implementations ---

// statelessStreamWriter adapts a `QueryStream` (ServerStream).
type statelessStreamWriter struct {
	stream *connect.ServerStream[dbv1.QueryResponse]
}

func (w *statelessStreamWriter) SendHeader(h *dbv1.QueryResultHeader) error {
	return w.stream.Send(&dbv1.QueryResponse{Response: &dbv1.QueryResponse_Header{Header: h}})
}
func (w *statelessStreamWriter) SendRowBatch(b *dbv1.QueryResultRowBatch) error {
	return w.stream.Send(&dbv1.QueryResponse{Response: &dbv1.QueryResponse_Batch{Batch: b}})
}
func (w *statelessStreamWriter) SendDMLResult(r *dbv1.DMLResult) error {
	return w.stream.Send(&dbv1.QueryResponse{Response: &dbv1.QueryResponse_Dml{Dml: r}})
}
func (w *statelessStreamWriter) SendComplete(s *dbv1.ExecutionStats) error {
	return w.stream.Send(&dbv1.QueryResponse{Response: &dbv1.QueryResponse_Complete{Complete: &dbv1.QueryComplete{Stats: s}}})
}

// Query handles the unary `Query` RPC.
//
// USE CASE:
// Ideal for "Point Lookups" (e.g., GetUserByID) where the result is known to be small.
//
// BEHAVIOR:
// 1. Traceability: Ensures an X-Request-Id exists (generating one if missing).
// 2. Validation: Checks input constraints (SQL length, DB name format).
// 3. Execution: Buffers ALL results into memory.
// 4. Response: Returns the complete result set and echoes the Request ID in headers.
//
// WARNING:
// Do not use for "SELECT * FROM LargeTable". It will cause high memory pressure.
func (s *DbServer) Query(ctx context.Context, req *connect.Request[dbv1.QueryRequest]) (*connect.Response[dbv1.QueryResult], error) {
	// 1. Traceability: Extract or Generate Request ID
	reqID := ensureRequestID(req.Header())

	// 2. Validation: Strict Proto constraints
	if err := protovalidate.Validate(req.Msg); err != nil {
		log.Printf("[%s] Validation failed for Query: %v", reqID, err)
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	msg := req.Msg

	// 3. Routing: Find the correct DB pool
	db, ok := s.Dbs[msg.Database]
	if !ok {
		// CodeNotFound (404) indicates client error (wrong DB name).
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", msg.Database))
	}

	// 4. Execution (Buffered)
	result, err := executeQueryAndBuffer(ctx, db, msg.Sql, msg.Parameters)
	if err != nil {
		log.Printf("[%s] Query execution failed: %v", reqID, err)
		return nil, makeUnaryError(err, msg.Sql)
	}

	// 5. Response Construction
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
// This handler operates in O(1) memory space relative to the result size.
func (s *DbServer) QueryStream(ctx context.Context, req *connect.Request[dbv1.QueryRequest], stream *connect.ServerStream[dbv1.QueryResponse]) error {
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

	msg := req.Msg
	db, ok := s.Dbs[msg.Database]
	if !ok {
		return connect.NewError(connect.CodeNotFound, fmt.Errorf("database '%s' not found", msg.Database))
	}

	// 3. Setup Adapter: Wrap the specific ServerStream in our generic interface.
	writer := &statelessStreamWriter{stream: stream}

	// 4. Execution (Streaming)
	// This blocks until the query finishes or the client disconnects.
	err := streamQueryResults(ctx, db, msg.Sql, msg.Parameters, writer)
	if err != nil {
		log.Printf("[%s] Stream failed: %v", reqID, err)

		// Instead of returning a gRPC error (which kills the stream with headers),

		// 1. Create the proto error message
		errResp := makeStreamError(err, msg.Sql)

		// 2. Send it
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
