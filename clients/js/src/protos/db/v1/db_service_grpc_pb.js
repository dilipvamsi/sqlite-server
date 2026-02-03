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
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var google_protobuf_duration_pb = require('google-protobuf/google/protobuf/duration_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_db_v1_AttachDatabaseRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.AttachDatabaseRequest)) {
    throw new Error('Expected argument of type db.v1.AttachDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_AttachDatabaseRequest(buffer_arg) {
  return db_v1_db_service_pb.AttachDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_AttachDatabaseResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.AttachDatabaseResponse)) {
    throw new Error('Expected argument of type db.v1.AttachDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_AttachDatabaseResponse(buffer_arg) {
  return db_v1_db_service_pb.AttachDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_CheckpointRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.CheckpointRequest)) {
    throw new Error('Expected argument of type db.v1.CheckpointRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_CheckpointRequest(buffer_arg) {
  return db_v1_db_service_pb.CheckpointRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_CheckpointResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.CheckpointResponse)) {
    throw new Error('Expected argument of type db.v1.CheckpointResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_CheckpointResponse(buffer_arg) {
  return db_v1_db_service_pb.CheckpointResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_CreateDatabaseRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.CreateDatabaseRequest)) {
    throw new Error('Expected argument of type db.v1.CreateDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_CreateDatabaseRequest(buffer_arg) {
  return db_v1_db_service_pb.CreateDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_CreateDatabaseResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.CreateDatabaseResponse)) {
    throw new Error('Expected argument of type db.v1.CreateDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_CreateDatabaseResponse(buffer_arg) {
  return db_v1_db_service_pb.CreateDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_DatabaseConfig(arg) {
  if (!(arg instanceof db_v1_db_service_pb.DatabaseConfig)) {
    throw new Error('Expected argument of type db.v1.DatabaseConfig');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_DatabaseConfig(buffer_arg) {
  return db_v1_db_service_pb.DatabaseConfig.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_DatabaseSchema(arg) {
  if (!(arg instanceof db_v1_db_service_pb.DatabaseSchema)) {
    throw new Error('Expected argument of type db.v1.DatabaseSchema');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_DatabaseSchema(buffer_arg) {
  return db_v1_db_service_pb.DatabaseSchema.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_DeleteDatabaseRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.DeleteDatabaseRequest)) {
    throw new Error('Expected argument of type db.v1.DeleteDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_DeleteDatabaseRequest(buffer_arg) {
  return db_v1_db_service_pb.DeleteDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_DeleteDatabaseResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.DeleteDatabaseResponse)) {
    throw new Error('Expected argument of type db.v1.DeleteDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_DeleteDatabaseResponse(buffer_arg) {
  return db_v1_db_service_pb.DeleteDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_DetachDatabaseRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.DetachDatabaseRequest)) {
    throw new Error('Expected argument of type db.v1.DetachDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_DetachDatabaseRequest(buffer_arg) {
  return db_v1_db_service_pb.DetachDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_DetachDatabaseResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.DetachDatabaseResponse)) {
    throw new Error('Expected argument of type db.v1.DetachDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_DetachDatabaseResponse(buffer_arg) {
  return db_v1_db_service_pb.DetachDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_ExplainResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ExplainResponse)) {
    throw new Error('Expected argument of type db.v1.ExplainResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ExplainResponse(buffer_arg) {
  return db_v1_db_service_pb.ExplainResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_GetDatabaseSchemaRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.GetDatabaseSchemaRequest)) {
    throw new Error('Expected argument of type db.v1.GetDatabaseSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_GetDatabaseSchemaRequest(buffer_arg) {
  return db_v1_db_service_pb.GetDatabaseSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_GetTableSchemaRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.GetTableSchemaRequest)) {
    throw new Error('Expected argument of type db.v1.GetTableSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_GetTableSchemaRequest(buffer_arg) {
  return db_v1_db_service_pb.GetTableSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_IntegrityCheckRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.IntegrityCheckRequest)) {
    throw new Error('Expected argument of type db.v1.IntegrityCheckRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_IntegrityCheckRequest(buffer_arg) {
  return db_v1_db_service_pb.IntegrityCheckRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_IntegrityCheckResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.IntegrityCheckResponse)) {
    throw new Error('Expected argument of type db.v1.IntegrityCheckResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_IntegrityCheckResponse(buffer_arg) {
  return db_v1_db_service_pb.IntegrityCheckResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_ListDatabasesRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ListDatabasesRequest)) {
    throw new Error('Expected argument of type db.v1.ListDatabasesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ListDatabasesRequest(buffer_arg) {
  return db_v1_db_service_pb.ListDatabasesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_ListDatabasesResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ListDatabasesResponse)) {
    throw new Error('Expected argument of type db.v1.ListDatabasesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ListDatabasesResponse(buffer_arg) {
  return db_v1_db_service_pb.ListDatabasesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_ListTablesRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ListTablesRequest)) {
    throw new Error('Expected argument of type db.v1.ListTablesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ListTablesRequest(buffer_arg) {
  return db_v1_db_service_pb.ListTablesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_ListTablesResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ListTablesResponse)) {
    throw new Error('Expected argument of type db.v1.ListTablesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ListTablesResponse(buffer_arg) {
  return db_v1_db_service_pb.ListTablesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_ListUsersRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ListUsersRequest)) {
    throw new Error('Expected argument of type db.v1.ListUsersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ListUsersRequest(buffer_arg) {
  return db_v1_db_service_pb.ListUsersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_ListUsersResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.ListUsersResponse)) {
    throw new Error('Expected argument of type db.v1.ListUsersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_ListUsersResponse(buffer_arg) {
  return db_v1_db_service_pb.ListUsersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_LoginRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.LoginRequest)) {
    throw new Error('Expected argument of type db.v1.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_LoginRequest(buffer_arg) {
  return db_v1_db_service_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_LoginResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.LoginResponse)) {
    throw new Error('Expected argument of type db.v1.LoginResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_LoginResponse(buffer_arg) {
  return db_v1_db_service_pb.LoginResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_LogoutRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.LogoutRequest)) {
    throw new Error('Expected argument of type db.v1.LogoutRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_LogoutRequest(buffer_arg) {
  return db_v1_db_service_pb.LogoutRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_LogoutResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.LogoutResponse)) {
    throw new Error('Expected argument of type db.v1.LogoutResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_LogoutResponse(buffer_arg) {
  return db_v1_db_service_pb.LogoutResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_MountDatabaseResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.MountDatabaseResponse)) {
    throw new Error('Expected argument of type db.v1.MountDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_MountDatabaseResponse(buffer_arg) {
  return db_v1_db_service_pb.MountDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_TableSchema(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TableSchema)) {
    throw new Error('Expected argument of type db.v1.TableSchema');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TableSchema(buffer_arg) {
  return db_v1_db_service_pb.TableSchema.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_TypedQueryRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TypedQueryRequest)) {
    throw new Error('Expected argument of type db.v1.TypedQueryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TypedQueryRequest(buffer_arg) {
  return db_v1_db_service_pb.TypedQueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_TypedQueryResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TypedQueryResponse)) {
    throw new Error('Expected argument of type db.v1.TypedQueryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TypedQueryResponse(buffer_arg) {
  return db_v1_db_service_pb.TypedQueryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_TypedQueryResult(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TypedQueryResult)) {
    throw new Error('Expected argument of type db.v1.TypedQueryResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TypedQueryResult(buffer_arg) {
  return db_v1_db_service_pb.TypedQueryResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_TypedTransactionQueryRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.TypedTransactionQueryRequest)) {
    throw new Error('Expected argument of type db.v1.TypedTransactionQueryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_TypedTransactionQueryRequest(buffer_arg) {
  return db_v1_db_service_pb.TypedTransactionQueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_UnMountDatabaseRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.UnMountDatabaseRequest)) {
    throw new Error('Expected argument of type db.v1.UnMountDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_UnMountDatabaseRequest(buffer_arg) {
  return db_v1_db_service_pb.UnMountDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_UnMountDatabaseResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.UnMountDatabaseResponse)) {
    throw new Error('Expected argument of type db.v1.UnMountDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_UnMountDatabaseResponse(buffer_arg) {
  return db_v1_db_service_pb.UnMountDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_UpdateDatabaseRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.UpdateDatabaseRequest)) {
    throw new Error('Expected argument of type db.v1.UpdateDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_UpdateDatabaseRequest(buffer_arg) {
  return db_v1_db_service_pb.UpdateDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_UpdateDatabaseResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.UpdateDatabaseResponse)) {
    throw new Error('Expected argument of type db.v1.UpdateDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_UpdateDatabaseResponse(buffer_arg) {
  return db_v1_db_service_pb.UpdateDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_db_v1_UpdateUserRoleRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.UpdateUserRoleRequest)) {
    throw new Error('Expected argument of type db.v1.UpdateUserRoleRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_UpdateUserRoleRequest(buffer_arg) {
  return db_v1_db_service_pb.UpdateUserRoleRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_UpdateUserRoleResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.UpdateUserRoleResponse)) {
    throw new Error('Expected argument of type db.v1.UpdateUserRoleResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_UpdateUserRoleResponse(buffer_arg) {
  return db_v1_db_service_pb.UpdateUserRoleResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_VacuumRequest(arg) {
  if (!(arg instanceof db_v1_db_service_pb.VacuumRequest)) {
    throw new Error('Expected argument of type db.v1.VacuumRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_VacuumRequest(buffer_arg) {
  return db_v1_db_service_pb.VacuumRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_db_v1_VacuumResponse(arg) {
  if (!(arg instanceof db_v1_db_service_pb.VacuumResponse)) {
    throw new Error('Expected argument of type db.v1.VacuumResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_db_v1_VacuumResponse(buffer_arg) {
  return db_v1_db_service_pb.VacuumResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
  // ---------------------------------------------------------------------------
// TYPED API - Strongly-typed variants using SqlValue instead of ListValue
// These RPCs provide better wire efficiency and eliminate the need for hints.
// ---------------------------------------------------------------------------
//
// *
// Executes a single stateless query and returns the entire result with
// strongly-typed values. Eliminates the need for sparse type hints.
typedQuery: {
    path: '/db.v1.DatabaseService/TypedQuery',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.TypedQueryRequest,
    responseType: db_v1_db_service_pb.TypedQueryResult,
    requestSerialize: serialize_db_v1_TypedQueryRequest,
    requestDeserialize: deserialize_db_v1_TypedQueryRequest,
    responseSerialize: serialize_db_v1_TypedQueryResult,
    responseDeserialize: deserialize_db_v1_TypedQueryResult,
  },
  // *
// Executes a stateless query and streams strongly-typed results.
// Protocol: TypedHeader -> TypedBatch... -> Complete
typedQueryStream: {
    path: '/db.v1.DatabaseService/TypedQueryStream',
    requestStream: false,
    responseStream: true,
    requestType: db_v1_db_service_pb.TypedQueryRequest,
    responseType: db_v1_db_service_pb.TypedQueryResponse,
    requestSerialize: serialize_db_v1_TypedQueryRequest,
    requestDeserialize: deserialize_db_v1_TypedQueryRequest,
    responseSerialize: serialize_db_v1_TypedQueryResponse,
    responseDeserialize: deserialize_db_v1_TypedQueryResponse,
  },
  // --- Typed Stateful Operations (Unary ID-Based) ---
//
// *
// Executes a typed query inside the context of an existing 'transaction_id'.
typedTransactionQuery: {
    path: '/db.v1.DatabaseService/TypedTransactionQuery',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.TypedTransactionQueryRequest,
    responseType: db_v1_db_service_pb.TypedQueryResult,
    requestSerialize: serialize_db_v1_TypedTransactionQueryRequest,
    requestDeserialize: deserialize_db_v1_TypedTransactionQueryRequest,
    responseSerialize: serialize_db_v1_TypedQueryResult,
    responseDeserialize: deserialize_db_v1_TypedQueryResult,
  },
  // *
// Executes a typed query inside the context of an existing 'transaction_id'.
// The server will stream the typed results back to the client.
typedTransactionQueryStream: {
    path: '/db.v1.DatabaseService/TypedTransactionQueryStream',
    requestStream: false,
    responseStream: true,
    requestType: db_v1_db_service_pb.TypedTransactionQueryRequest,
    responseType: db_v1_db_service_pb.TypedQueryResponse,
    requestSerialize: serialize_db_v1_TypedTransactionQueryRequest,
    requestDeserialize: deserialize_db_v1_TypedTransactionQueryRequest,
    responseSerialize: serialize_db_v1_TypedQueryResponse,
    responseDeserialize: deserialize_db_v1_TypedQueryResponse,
  },
  // ---------------------------------------------------------------------------
// Developer Experience & Introspection
// ---------------------------------------------------------------------------
//
// *
// Returns structured EXPLAIN QUERY PLAN output as a tree.
// Helps developers understand index usage and optimization opportunities.
explain: {
    path: '/db.v1.DatabaseService/Explain',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.QueryRequest,
    responseType: db_v1_db_service_pb.ExplainResponse,
    requestSerialize: serialize_db_v1_QueryRequest,
    requestDeserialize: deserialize_db_v1_QueryRequest,
    responseSerialize: serialize_db_v1_ExplainResponse,
    responseDeserialize: deserialize_db_v1_ExplainResponse,
  },
  // *
// Typed variant of Explain using strongly-typed parameters.
// Returns the same structured EXPLAIN QUERY PLAN output.
typedExplain: {
    path: '/db.v1.DatabaseService/TypedExplain',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.TypedQueryRequest,
    responseType: db_v1_db_service_pb.ExplainResponse,
    requestSerialize: serialize_db_v1_TypedQueryRequest,
    requestDeserialize: deserialize_db_v1_TypedQueryRequest,
    responseSerialize: serialize_db_v1_ExplainResponse,
    responseDeserialize: deserialize_db_v1_ExplainResponse,
  },
  // *
// Returns a light listing of all tables in the database.
// Useful for UI dropdowns and quick navigation.
listTables: {
    path: '/db.v1.DatabaseService/ListTables',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.ListTablesRequest,
    responseType: db_v1_db_service_pb.ListTablesResponse,
    requestSerialize: serialize_db_v1_ListTablesRequest,
    requestDeserialize: deserialize_db_v1_ListTablesRequest,
    responseSerialize: serialize_db_v1_ListTablesResponse,
    responseDeserialize: deserialize_db_v1_ListTablesResponse,
  },
  // *
// Returns detailed schema for a single table.
// Includes columns, indexes, foreign keys, and triggers.
getTableSchema: {
    path: '/db.v1.DatabaseService/GetTableSchema',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.GetTableSchemaRequest,
    responseType: db_v1_db_service_pb.TableSchema,
    requestSerialize: serialize_db_v1_GetTableSchemaRequest,
    requestDeserialize: deserialize_db_v1_GetTableSchemaRequest,
    responseSerialize: serialize_db_v1_TableSchema,
    responseDeserialize: deserialize_db_v1_TableSchema,
  },
  // *
// Returns the full database schema for exports/migrations.
// Aggregates all tables with their complete schema information.
getDatabaseSchema: {
    path: '/db.v1.DatabaseService/GetDatabaseSchema',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.GetDatabaseSchemaRequest,
    responseType: db_v1_db_service_pb.DatabaseSchema,
    requestSerialize: serialize_db_v1_GetDatabaseSchemaRequest,
    requestDeserialize: deserialize_db_v1_GetDatabaseSchemaRequest,
    responseSerialize: serialize_db_v1_DatabaseSchema,
    responseDeserialize: deserialize_db_v1_DatabaseSchema,
  },
  // --- Maintenance Operations ---
//
// *
// Triggers a VACUUM command to rebuild the database file.
// Can also perform VACUUM INTO to create a backup/copy.
vacuum: {
    path: '/db.v1.DatabaseService/Vacuum',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.VacuumRequest,
    responseType: db_v1_db_service_pb.VacuumResponse,
    requestSerialize: serialize_db_v1_VacuumRequest,
    requestDeserialize: deserialize_db_v1_VacuumRequest,
    responseSerialize: serialize_db_v1_VacuumResponse,
    responseDeserialize: deserialize_db_v1_VacuumResponse,
  },
  // *
// Manages WAL checkpoints (transferring WAL content to the main DB file).
checkpoint: {
    path: '/db.v1.DatabaseService/Checkpoint',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.CheckpointRequest,
    responseType: db_v1_db_service_pb.CheckpointResponse,
    requestSerialize: serialize_db_v1_CheckpointRequest,
    requestDeserialize: deserialize_db_v1_CheckpointRequest,
    responseSerialize: serialize_db_v1_CheckpointResponse,
    responseDeserialize: deserialize_db_v1_CheckpointResponse,
  },
  // *
// Runs an integrity check on the database.
integrityCheck: {
    path: '/db.v1.DatabaseService/IntegrityCheck',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.IntegrityCheckRequest,
    responseType: db_v1_db_service_pb.IntegrityCheckResponse,
    requestSerialize: serialize_db_v1_IntegrityCheckRequest,
    requestDeserialize: deserialize_db_v1_IntegrityCheckRequest,
    responseSerialize: serialize_db_v1_IntegrityCheckResponse,
    responseDeserialize: deserialize_db_v1_IntegrityCheckResponse,
  },
  // *
// Dynamically attaches a database file to an existing managed database.
// This updates the configuration and reloads the connections.
attachDatabase: {
    path: '/db.v1.DatabaseService/AttachDatabase',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.AttachDatabaseRequest,
    responseType: db_v1_db_service_pb.AttachDatabaseResponse,
    requestSerialize: serialize_db_v1_AttachDatabaseRequest,
    requestDeserialize: deserialize_db_v1_AttachDatabaseRequest,
    responseSerialize: serialize_db_v1_AttachDatabaseResponse,
    responseDeserialize: deserialize_db_v1_AttachDatabaseResponse,
  },
  // *
// Detaches a database from a managed database.
// This updates the configuration and reloads the connections.
detachDatabase: {
    path: '/db.v1.DatabaseService/DetachDatabase',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.DetachDatabaseRequest,
    responseType: db_v1_db_service_pb.DetachDatabaseResponse,
    requestSerialize: serialize_db_v1_DetachDatabaseRequest,
    requestDeserialize: deserialize_db_v1_DetachDatabaseRequest,
    responseSerialize: serialize_db_v1_DetachDatabaseResponse,
    responseDeserialize: deserialize_db_v1_DetachDatabaseResponse,
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
// Retrieves all active users.
// Requires admin privileges.
listUsers: {
    path: '/db.v1.AdminService/ListUsers',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.ListUsersRequest,
    responseType: db_v1_db_service_pb.ListUsersResponse,
    requestSerialize: serialize_db_v1_ListUsersRequest,
    requestDeserialize: deserialize_db_v1_ListUsersRequest,
    responseSerialize: serialize_db_v1_ListUsersResponse,
    responseDeserialize: deserialize_db_v1_ListUsersResponse,
  },
  // *
// Updates the role of a specific user.
// Requires admin privileges.
updateUserRole: {
    path: '/db.v1.AdminService/UpdateUserRole',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.UpdateUserRoleRequest,
    responseType: db_v1_db_service_pb.UpdateUserRoleResponse,
    requestSerialize: serialize_db_v1_UpdateUserRoleRequest,
    requestDeserialize: deserialize_db_v1_UpdateUserRoleRequest,
    responseSerialize: serialize_db_v1_UpdateUserRoleResponse,
    responseDeserialize: deserialize_db_v1_UpdateUserRoleResponse,
  },
  // *
// Lists all available databases.
listDatabases: {
    path: '/db.v1.AdminService/ListDatabases',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.ListDatabasesRequest,
    responseType: db_v1_db_service_pb.ListDatabasesResponse,
    requestSerialize: serialize_db_v1_ListDatabasesRequest,
    requestDeserialize: deserialize_db_v1_ListDatabasesRequest,
    responseSerialize: serialize_db_v1_ListDatabasesResponse,
    responseDeserialize: deserialize_db_v1_ListDatabasesResponse,
  },
  // *
// Authenticates a user and returns a session API key.
// Requires Basic Auth for the initial request.
login: {
    path: '/db.v1.AdminService/Login',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.LoginRequest,
    responseType: db_v1_db_service_pb.LoginResponse,
    requestSerialize: serialize_db_v1_LoginRequest,
    requestDeserialize: deserialize_db_v1_LoginRequest,
    responseSerialize: serialize_db_v1_LoginResponse,
    responseDeserialize: deserialize_db_v1_LoginResponse,
  },
  // *
// Invalidates the current session/API key.
logout: {
    path: '/db.v1.AdminService/Logout',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.LogoutRequest,
    responseType: db_v1_db_service_pb.LogoutResponse,
    requestSerialize: serialize_db_v1_LogoutRequest,
    requestDeserialize: deserialize_db_v1_LogoutRequest,
    responseSerialize: serialize_db_v1_LogoutResponse,
    responseDeserialize: deserialize_db_v1_LogoutResponse,
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
// /**
//  * Streams a binary backup of the specified database file.
//  * The stream delivers the file in 4MB chunks.
//  */
// rpc BackupDatabase(BackupDatabaseRequest)
//     returns (stream BackupDatabaseResponse);
//
// /**
//  * Restores a database from a backup stream.
//  * This overwrites the existing database file.
//  * Protocol: [Metadata] -> [Chunk] -> [Chunk]...
//  */
// rpc RestoreDatabase(stream RestoreDatabaseRequest)
//     returns (RestoreDatabaseResponse);
//
// --- Dynamic Database Management ---
//
// *
// Creates a new managed database.
// The database file is created in the server's managed directory.
createDatabase: {
    path: '/db.v1.AdminService/CreateDatabase',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.CreateDatabaseRequest,
    responseType: db_v1_db_service_pb.CreateDatabaseResponse,
    requestSerialize: serialize_db_v1_CreateDatabaseRequest,
    requestDeserialize: deserialize_db_v1_CreateDatabaseRequest,
    responseSerialize: serialize_db_v1_CreateDatabaseResponse,
    responseDeserialize: deserialize_db_v1_CreateDatabaseResponse,
  },
  // *
// Mounts an existing database file from the filesystem.
// This database is marked as "unmanaged" (cannot be deleted via API).
//
// buf:lint:ignore RPC_REQUEST_STANDARD_NAME
mountDatabase: {
    path: '/db.v1.AdminService/MountDatabase',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.DatabaseConfig,
    responseType: db_v1_db_service_pb.MountDatabaseResponse,
    requestSerialize: serialize_db_v1_DatabaseConfig,
    requestDeserialize: deserialize_db_v1_DatabaseConfig,
    responseSerialize: serialize_db_v1_MountDatabaseResponse,
    responseDeserialize: deserialize_db_v1_MountDatabaseResponse,
  },
  // *
// Unmounts a database, removing it from the active server.
// The file is NOT deleted.
unMountDatabase: {
    path: '/db.v1.AdminService/UnMountDatabase',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.UnMountDatabaseRequest,
    responseType: db_v1_db_service_pb.UnMountDatabaseResponse,
    requestSerialize: serialize_db_v1_UnMountDatabaseRequest,
    requestDeserialize: deserialize_db_v1_UnMountDatabaseRequest,
    responseSerialize: serialize_db_v1_UnMountDatabaseResponse,
    responseDeserialize: deserialize_db_v1_UnMountDatabaseResponse,
  },
  // *
// Deletes a database securely.
// - Managed DBs: Deleted from disk and metadata.
// - Mounted DBs: Returns error (protects external files).
deleteDatabase: {
    path: '/db.v1.AdminService/DeleteDatabase',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.DeleteDatabaseRequest,
    responseType: db_v1_db_service_pb.DeleteDatabaseResponse,
    requestSerialize: serialize_db_v1_DeleteDatabaseRequest,
    requestDeserialize: deserialize_db_v1_DeleteDatabaseRequest,
    responseSerialize: serialize_db_v1_DeleteDatabaseResponse,
    responseDeserialize: deserialize_db_v1_DeleteDatabaseResponse,
  },
  // *
// Updates an existing database configuration.
// Useful for changing settings like init_commands, max_open_conns, etc.
// This operation forces a reload of the database connections.
updateDatabase: {
    path: '/db.v1.AdminService/UpdateDatabase',
    requestStream: false,
    responseStream: false,
    requestType: db_v1_db_service_pb.UpdateDatabaseRequest,
    responseType: db_v1_db_service_pb.UpdateDatabaseResponse,
    requestSerialize: serialize_db_v1_UpdateDatabaseRequest,
    requestDeserialize: deserialize_db_v1_UpdateDatabaseRequest,
    responseSerialize: serialize_db_v1_UpdateDatabaseResponse,
    responseDeserialize: deserialize_db_v1_UpdateDatabaseResponse,
  },
};

exports.AdminServiceClient = grpc.makeGenericClientConstructor(AdminServiceService, 'AdminService');
// --- User Management ---
