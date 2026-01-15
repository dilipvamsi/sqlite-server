// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// *
// @file db/v1/database.proto
// @description The definitive gRPC contract for the sqlite-server service.
// 
// ARCHITECTURAL DESIGN:
// 
// 1. DUAL TRANSACTION MODELS:
//    - Streaming (Bidirectional): Best for short, interactive sessions where the
//      connection lifespan equals the transaction lifespan. Automatic rollback on disconnect.
//    - Unary (ID-Based): Best for stateless HTTP clients or long-running workflows where
//      holding a TCP connection open is brittle. Requires manual 'Begin'/'Commit' and
//      relies on server-side Timeouts (TTL) to clean up "Zombie" transactions.
// 
// 2. TYPE SAFETY (SPARSE HINTS):
//    Since JSON/Protobuf lacks native support for some SQLite types (like BLOBs or
//    large Integers), we use a "Hint" system. The client sends data as standard JSON
//    types but provides a mapping (e.g., "param 0 is a BLOB") so the server knows
//    to decode Base64 before hitting the DB.
// 
// 3. ERROR FIDELITY:
//    We map native C SQLite result codes to a Proto Enum (`SqliteCode`). This allows
//    clients to programmatically react to specific errors (e.g., retrying on SQLITE_BUSY)
//    without parsing error string messages.
//
'use strict';
var grpc = require('@grpc/grpc-js');
var db_v1_db_service_pb = require('../../db/v1/db_service_pb.js');
var buf_validate_validate_pb = require('../../buf/validate/validate_pb.js');
var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');

function serialize_db_v1_BeginTransactionRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.BeginTransactionRequest)) {
    throw new Error('Expected argument of type db.v1.BeginTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_BeginTransactionRequest(buffer_arg) {
  return db_v1_db_service_pb.BeginTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_BeginTransactionResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.BeginTransactionResponse)) {
    throw new Error('Expected argument of type db.v1.BeginTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_BeginTransactionResponse(buffer_arg) {
  return db_v1_db_service_pb.BeginTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_ExecuteTransactionRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ExecuteTransactionRequest)) {
    throw new Error('Expected argument of type db.v1.ExecuteTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ExecuteTransactionRequest(buffer_arg) {
  return db_v1_db_service_pb.ExecuteTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_ExecuteTransactionResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ExecuteTransactionResponse)) {
    throw new Error('Expected argument of type db.v1.ExecuteTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ExecuteTransactionResponse(buffer_arg) {
  return db_v1_db_service_pb.ExecuteTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_QueryRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.QueryRequest)) {
    throw new Error('Expected argument of type db.v1.QueryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_QueryRequest(buffer_arg) {
  return db_v1_db_service_pb.QueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_QueryResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.QueryResponse)) {
    throw new Error('Expected argument of type db.v1.QueryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_QueryResponse(buffer_arg) {
  return db_v1_db_service_pb.QueryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_QueryResult(arg) {
  if (!(arg instanceof db_v1_db_service_pb.QueryResult)) {
    throw new Error('Expected argument of type db.v1.QueryResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_QueryResult(buffer_arg) {
  return db_v1_db_service_pb.QueryResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_SavepointResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.SavepointResponse)) {
    throw new Error('Expected argument of type db.v1.SavepointResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_SavepointResponse(buffer_arg) {
  return db_v1_db_service_pb.SavepointResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_TransactionControlRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TransactionControlRequest)) {
    throw new Error('Expected argument of type db.v1.TransactionControlRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TransactionControlRequest(buffer_arg) {
  return db_v1_db_service_pb.TransactionControlRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_TransactionControlResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TransactionControlResponse)) {
    throw new Error('Expected argument of type db.v1.TransactionControlResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TransactionControlResponse(buffer_arg) {
  return db_v1_db_service_pb.TransactionControlResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_TransactionQueryRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TransactionQueryRequest)) {
    throw new Error('Expected argument of type db.v1.TransactionQueryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TransactionQueryRequest(buffer_arg) {
  return db_v1_db_service_pb.TransactionQueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_TransactionRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TransactionRequest)) {
    throw new Error('Expected argument of type db.v1.TransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TransactionRequest(buffer_arg) {
  return db_v1_db_service_pb.TransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_TransactionResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TransactionResponse)) {
    throw new Error('Expected argument of type db.v1.TransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TransactionResponse(buffer_arg) {
  return db_v1_db_service_pb.TransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_TransactionSavepointRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TransactionSavepointRequest)) {
    throw new Error('Expected argument of type db.v1.TransactionSavepointRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TransactionSavepointRequest(buffer_arg) {
  return db_v1_db_service_pb.TransactionSavepointRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// -----------------------------------------------------------------------------
// Service Definition
// -----------------------------------------------------------------------------
//
// *
// DatabaseService defines the API for interacting with SQLite databases.
// It provides stateless, streaming, and transactional access patterns.
//
// buf:lint:ignore RPC_REQUEST_RESPONSE_UNIQUE
// buf:lint:ignore RPC_REQUEST_STANDARD_NAME
// buf:lint:ignore RPC_RESPONSE_STANDARD_NAME
var DatabaseServiceService = exports.DatabaseServiceService = {
  // *
// Executes a single stateless query and returns the entire result.
// Best for point-lookups (SELECT ... WHERE id=?).
// 
// WARNING: The server enforces a hard limit on row count (e.g., 1000) for this RPC.
// For larger datasets, use `QueryStream`.
query: {
    path: '/db.v1.DatabaseService/Query',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.QueryRequest,
    responseType: db_v1_db_service_pb.QueryResult,
    requestSerialize: serialize_db_v1_QueryRequest,
    requestDeserialize: deserialize_db_v1_QueryRequest,
    responseSerialize: serialize_db_v1_QueryResult,
    responseDeserialize: deserialize_db_v1_QueryResult,
  },
  // *
// Executes a stateless query and streams results.
// Safe for large exports or reporting queries.
// Protocol: Header -> Batch... -> Batch... -> Complete
queryStream: {
    path: '/db.v1.DatabaseService/QueryStream',
    requestStream: false,
    responseStream: true,
    requestType: db_v1_db_service_pb.QueryRequest,
    responseType: db_v1_db_service_pb.QueryResponse,
    requestSerialize: serialize_db_v1_QueryRequest,
    requestDeserialize: deserialize_db_v1_QueryRequest,
    responseSerialize: serialize_db_v1_QueryResponse,
    responseDeserialize: deserialize_db_v1_QueryResponse,
  },
  // --- Stateful Operations (Model A: Bidirectional Stream) ---
//
// *
// Opens a stateful bidirectional stream for transactions.
// 
// Flow:
// 1. Client sends `BeginRequest`
// 2. Client sends multiple `TransactionalQueryRequest`
// 3. Client sends `Commit` or `Rollback`
transaction: {
    path: '/db.v1.DatabaseService/Transaction',
    requestStream: true,
    responseStream: true,
    requestType: db_v1_db_service_pb.TransactionRequest,
    responseType: db_v1_db_service_pb.TransactionResponse,
    requestSerialize: serialize_db_v1_TransactionRequest,
    requestDeserialize: deserialize_db_v1_TransactionRequest,
    responseSerialize: serialize_db_v1_TransactionResponse,
    responseDeserialize: deserialize_db_v1_TransactionResponse,
  },
  // --- Stateful Operations (Model B: Unary ID-Based) ---
//
// *
// Starts a new transaction context on the server and returns a 'transaction_id'.
// The server holds the connection open in memory until Commit, Rollback, or Timeout.
beginTransaction: {
    path: '/db.v1.DatabaseService/BeginTransaction',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.BeginTransactionRequest,
    responseType: db_v1_db_service_pb.BeginTransactionResponse,
    requestSerialize: serialize_db_v1_BeginTransactionRequest,
    requestDeserialize: deserialize_db_v1_BeginTransactionRequest,
    responseSerialize: serialize_db_v1_BeginTransactionResponse,
    responseDeserialize: deserialize_db_v1_BeginTransactionResponse,
  },
  // *
// Executes a query inside the context of an existing 'transaction_id'.
// If the ID is invalid or timed out, returns NOT_FOUND.
transactionQuery: {
    path: '/db.v1.DatabaseService/TransactionQuery',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.TransactionQueryRequest,
    responseType: db_v1_db_service_pb.QueryResult,
    requestSerialize: serialize_db_v1_TransactionQueryRequest,
    requestDeserialize: deserialize_db_v1_TransactionQueryRequest,
    responseSerialize: serialize_db_v1_QueryResult,
    responseDeserialize: deserialize_db_v1_QueryResult,
  },
  // *
// Executes a query inside the context of an existing 'transaction_id'.
// The server will stream the results back to the client.
// If the ID is invalid or timed out, returns NOT_FOUND.
transactionQueryStream: {
    path: '/db.v1.DatabaseService/TransactionQueryStream',
    requestStream: false,
    responseStream: true,
    requestType: db_v1_db_service_pb.TransactionQueryRequest,
    responseType: db_v1_db_service_pb.QueryResponse,
    requestSerialize: serialize_db_v1_TransactionQueryRequest,
    requestDeserialize: deserialize_db_v1_TransactionQueryRequest,
    responseSerialize: serialize_db_v1_QueryResponse,
    responseDeserialize: deserialize_db_v1_QueryResponse,
  },
  // *
// Manages a savepoint (nested transaction) within an existing transaction ID.
// If the ID is invalid or timed out, returns NOT_FOUND.
transactionSavepoint: {
    path: '/db.v1.DatabaseService/TransactionSavepoint',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.TransactionSavepointRequest,
    responseType: db_v1_db_service_pb.SavepointResponse,
    requestSerialize: serialize_db_v1_TransactionSavepointRequest,
    requestDeserialize: deserialize_db_v1_TransactionSavepointRequest,
    responseSerialize: serialize_db_v1_SavepointResponse,
    responseDeserialize: deserialize_db_v1_SavepointResponse,
  },
  // *
// Commits the transaction associated with the ID and releases server resources.
commitTransaction: {
    path: '/db.v1.DatabaseService/CommitTransaction',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.TransactionControlRequest,
    responseType: db_v1_db_service_pb.TransactionControlResponse,
    requestSerialize: serialize_db_v1_TransactionControlRequest,
    requestDeserialize: deserialize_db_v1_TransactionControlRequest,
    responseSerialize: serialize_db_v1_TransactionControlResponse,
    responseDeserialize: deserialize_db_v1_TransactionControlResponse,
  },
  // *
// Rolls back the transaction associated with the ID and releases server resources.
rollbackTransaction: {
    path: '/db.v1.DatabaseService/RollbackTransaction',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.TransactionControlRequest,
    responseType: db_v1_db_service_pb.TransactionControlResponse,
    requestSerialize: serialize_db_v1_TransactionControlRequest,
    requestDeserialize: deserialize_db_v1_TransactionControlRequest,
    responseSerialize: serialize_db_v1_TransactionControlResponse,
    responseDeserialize: deserialize_db_v1_TransactionControlResponse,
  },
  // --- Utility Operations ---
//
// *
// Executes a predefined script of commands atomically.
// Useful for migrations or testing where interactivity is not required.
executeTransaction: {
    path: '/db.v1.DatabaseService/ExecuteTransaction',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.ExecuteTransactionRequest,
    responseType: db_v1_db_service_pb.ExecuteTransactionResponse,
    requestSerialize: serialize_db_v1_ExecuteTransactionRequest,
    requestDeserialize: deserialize_db_v1_ExecuteTransactionRequest,
    responseSerialize: serialize_db_v1_ExecuteTransactionResponse,
    responseDeserialize: deserialize_db_v1_ExecuteTransactionResponse,
  },
};

exports.DatabaseServiceClient = grpc.makeGenericClientConstructor(DatabaseServiceService, 'DatabaseService');
// --- Stateless Operations ---
