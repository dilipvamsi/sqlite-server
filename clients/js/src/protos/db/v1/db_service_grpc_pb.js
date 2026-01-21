// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// *
// @file db/v1/database.proto
// @description The definitive gRPC contract for the sqlite-server service.
// 
// ARCHITECTURAL DESIGN:
// 
// 1. DUAL TRANSACTION MODELS:
//    - Streaming (Bidirectional): Best for short, interactive sessions where
// the connection lifespan equals the transaction lifespan. Automatic rollback
// on disconnect.
//    - Unary (ID-Based): Best for stateless HTTP clients or long-running
// workflows where holding a TCP connection open is brittle. Requires manual
// 'Begin'/'Commit' and relies on server-side Timeouts (TTL) to clean up
// "Zombie" transactions.
// 
// 2. TYPE SAFETY (SPARSE HINTS):
//    Since JSON/Protobuf lacks native support for some SQLite types (like BLOBs
// or large Integers), we use a "Hint" system. The client sends data as standard
// JSON types but provides a mapping (e.g., "param 0 is a BLOB") so the server
// knows to decode Base64 before hitting the DB.
// 
// 3. ERROR FIDELITY:
//    We map native C SQLite result codes to a Proto Enum (`SqliteCode`). This
// allows clients to programmatically react to specific errors (e.g., retrying
// on SQLITE_BUSY) without parsing error string messages.
//
'use strict';
var grpc = require('@grpc/grpc-js');
var db_v1_db_service_pb = require('../../db/v1/db_service_pb.js');
var buf_validate_validate_pb = require('../../buf/validate/validate_pb.js');
var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');

function serialize_db_v1_BackupDatabaseRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.BackupDatabaseRequest)) {
    throw new Error('Expected argument of type db.v1.BackupDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_BackupDatabaseRequest(buffer_arg) {
  return db_v1_db_service_pb.BackupDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_BackupDatabaseResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.BackupDatabaseResponse)) {
    throw new Error('Expected argument of type db.v1.BackupDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_BackupDatabaseResponse(buffer_arg) {
  return db_v1_db_service_pb.BackupDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

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

function serialize_db_v1_CreateApiKeyRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.CreateApiKeyRequest)) {
    throw new Error('Expected argument of type db.v1.CreateApiKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_CreateApiKeyRequest(buffer_arg) {
  return db_v1_db_service_pb.CreateApiKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_CreateApiKeyResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.CreateApiKeyResponse)) {
    throw new Error('Expected argument of type db.v1.CreateApiKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_CreateApiKeyResponse(buffer_arg) {
  return db_v1_db_service_pb.CreateApiKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_CreateUserRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.CreateUserRequest)) {
    throw new Error('Expected argument of type db.v1.CreateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_CreateUserRequest(buffer_arg) {
  return db_v1_db_service_pb.CreateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_CreateUserResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.CreateUserResponse)) {
    throw new Error('Expected argument of type db.v1.CreateUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_CreateUserResponse(buffer_arg) {
  return db_v1_db_service_pb.CreateUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_DeleteUserRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.DeleteUserRequest)) {
    throw new Error('Expected argument of type db.v1.DeleteUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_DeleteUserRequest(buffer_arg) {
  return db_v1_db_service_pb.DeleteUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_DeleteUserResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.DeleteUserResponse)) {
    throw new Error('Expected argument of type db.v1.DeleteUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_DeleteUserResponse(buffer_arg) {
  return db_v1_db_service_pb.DeleteUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_ListApiKeysRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ListApiKeysRequest)) {
    throw new Error('Expected argument of type db.v1.ListApiKeysRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ListApiKeysRequest(buffer_arg) {
  return db_v1_db_service_pb.ListApiKeysRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_ListApiKeysResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ListApiKeysResponse)) {
    throw new Error('Expected argument of type db.v1.ListApiKeysResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ListApiKeysResponse(buffer_arg) {
  return db_v1_db_service_pb.ListApiKeysResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_RestoreDatabaseRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.RestoreDatabaseRequest)) {
    throw new Error('Expected argument of type db.v1.RestoreDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_RestoreDatabaseRequest(buffer_arg) {
  return db_v1_db_service_pb.RestoreDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_RestoreDatabaseResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.RestoreDatabaseResponse)) {
    throw new Error('Expected argument of type db.v1.RestoreDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_RestoreDatabaseResponse(buffer_arg) {
  return db_v1_db_service_pb.RestoreDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_RevokeApiKeyRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.RevokeApiKeyRequest)) {
    throw new Error('Expected argument of type db.v1.RevokeApiKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_RevokeApiKeyRequest(buffer_arg) {
  return db_v1_db_service_pb.RevokeApiKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_RevokeApiKeyResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.RevokeApiKeyResponse)) {
    throw new Error('Expected argument of type db.v1.RevokeApiKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_RevokeApiKeyResponse(buffer_arg) {
  return db_v1_db_service_pb.RevokeApiKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_UpdatePasswordRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.UpdatePasswordRequest)) {
    throw new Error('Expected argument of type db.v1.UpdatePasswordRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_UpdatePasswordRequest(buffer_arg) {
  return db_v1_db_service_pb.UpdatePasswordRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_UpdatePasswordResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.UpdatePasswordResponse)) {
    throw new Error('Expected argument of type db.v1.UpdatePasswordResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_UpdatePasswordResponse(buffer_arg) {
  return db_v1_db_service_pb.UpdatePasswordResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
// WARNING: The server enforces a hard limit on row count (e.g., 1000) for
// this RPC. For larger datasets, use `QueryStream`.
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
// Starts a new transaction context on the server and returns a
// 'transaction_id'. The server holds the connection open in memory until
// Commit, Rollback, or Timeout.
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
// Commits the transaction associated with the ID and releases server
// resources.
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
// Rolls back the transaction associated with the ID and releases server
// resources.
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
// *
// AdminService handles restricted operations for user management and system
// maintenance. Access to this service MUST be restricted to the 'admin' role.
var AdminServiceService = exports.AdminServiceService = {
  // *
// Creates a new user with specific role-based access.
// Requires admin privileges.
createUser: {
    path: '/db.v1.AdminService/CreateUser',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.CreateUserRequest,
    responseType: db_v1_db_service_pb.CreateUserResponse,
    requestSerialize: serialize_db_v1_CreateUserRequest,
    requestDeserialize: deserialize_db_v1_CreateUserRequest,
    responseSerialize: serialize_db_v1_CreateUserResponse,
    responseDeserialize: deserialize_db_v1_CreateUserResponse,
  },
  // *
// Permanently removes a user from the system.
// Existing connections for this user may be terminated.
deleteUser: {
    path: '/db.v1.AdminService/DeleteUser',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.DeleteUserRequest,
    responseType: db_v1_db_service_pb.DeleteUserResponse,
    requestSerialize: serialize_db_v1_DeleteUserRequest,
    requestDeserialize: deserialize_db_v1_DeleteUserRequest,
    responseSerialize: serialize_db_v1_DeleteUserResponse,
    responseDeserialize: deserialize_db_v1_DeleteUserResponse,
  },
  // *
// Rotates the password for a specific user.
// The new password takes effect immediately for new connections.
updatePassword: {
    path: '/db.v1.AdminService/UpdatePassword',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.UpdatePasswordRequest,
    responseType: db_v1_db_service_pb.UpdatePasswordResponse,
    requestSerialize: serialize_db_v1_UpdatePasswordRequest,
    requestDeserialize: deserialize_db_v1_UpdatePasswordRequest,
    responseSerialize: serialize_db_v1_UpdatePasswordResponse,
    responseDeserialize: deserialize_db_v1_UpdatePasswordResponse,
  },
  // --- API Key Management ---
//
// *
// Generates a long-lived API key for a specific user.
// The key is only returned once in the response.
createApiKey: {
    path: '/db.v1.AdminService/CreateApiKey',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.CreateApiKeyRequest,
    responseType: db_v1_db_service_pb.CreateApiKeyResponse,
    requestSerialize: serialize_db_v1_CreateApiKeyRequest,
    requestDeserialize: deserialize_db_v1_CreateApiKeyRequest,
    responseSerialize: serialize_db_v1_CreateApiKeyResponse,
    responseDeserialize: deserialize_db_v1_CreateApiKeyResponse,
  },
  // *
// Retrieves all active API keys for a specific user.
// Returns metadata (name, prefix) but not the full key secrets.
listApiKeys: {
    path: '/db.v1.AdminService/ListApiKeys',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.ListApiKeysRequest,
    responseType: db_v1_db_service_pb.ListApiKeysResponse,
    requestSerialize: serialize_db_v1_ListApiKeysRequest,
    requestDeserialize: deserialize_db_v1_ListApiKeysRequest,
    responseSerialize: serialize_db_v1_ListApiKeysResponse,
    responseDeserialize: deserialize_db_v1_ListApiKeysResponse,
  },
  // *
// Revokes (deletes) a specific API key immediately.
revokeApiKey: {
    path: '/db.v1.AdminService/RevokeApiKey',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.RevokeApiKeyRequest,
    responseType: db_v1_db_service_pb.RevokeApiKeyResponse,
    requestSerialize: serialize_db_v1_RevokeApiKeyRequest,
    requestDeserialize: deserialize_db_v1_RevokeApiKeyRequest,
    responseSerialize: serialize_db_v1_RevokeApiKeyResponse,
    responseDeserialize: deserialize_db_v1_RevokeApiKeyResponse,
  },
  // --- Disaster Recovery ---
//
// *
// Streams a binary backup of the specified database file.
// The stream delivers the file in 4MB chunks.
backupDatabase: {
    path: '/db.v1.AdminService/BackupDatabase',
    requestStream: false,
    responseStream: true,
    requestType: db_v1_db_service_pb.BackupDatabaseRequest,
    responseType: db_v1_db_service_pb.BackupDatabaseResponse,
    requestSerialize: serialize_db_v1_BackupDatabaseRequest,
    requestDeserialize: deserialize_db_v1_BackupDatabaseRequest,
    responseSerialize: serialize_db_v1_BackupDatabaseResponse,
    responseDeserialize: deserialize_db_v1_BackupDatabaseResponse,
  },
  // *
// Restores a database from a backup stream.
// This overwrites the existing database file.
// Protocol: [Metadata] -> [Chunk] -> [Chunk]...
restoreDatabase: {
    path: '/db.v1.AdminService/RestoreDatabase',
    requestStream: true,
    responseStream: false,
    requestType: db_v1_db_service_pb.RestoreDatabaseRequest,
    responseType: db_v1_db_service_pb.RestoreDatabaseResponse,
    requestSerialize: serialize_db_v1_RestoreDatabaseRequest,
    requestDeserialize: deserialize_db_v1_RestoreDatabaseRequest,
    responseSerialize: serialize_db_v1_RestoreDatabaseResponse,
    responseDeserialize: deserialize_db_v1_RestoreDatabaseResponse,
  },
};

exports.AdminServiceClient = grpc.makeGenericClientConstructor(AdminServiceService, 'AdminService');
// --- User Management ---
