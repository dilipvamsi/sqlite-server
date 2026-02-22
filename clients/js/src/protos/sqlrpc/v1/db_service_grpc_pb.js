// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var sqlrpc_v1_db_service_pb = require('../../sqlrpc/v1/db_service_pb.js');
var buf_validate_validate_pb = require('../../buf/validate/validate_pb.js');
var google_protobuf_duration_pb = require('google-protobuf/google/protobuf/duration_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var sqlrpc_v1_enums_pb = require('../../sqlrpc/v1/enums_pb.js');
var sqlrpc_v1_types_pb = require('../../sqlrpc/v1/types_pb.js');

function serialize_sqlrpc_v1_AttachDatabaseRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.AttachDatabaseRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.AttachDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_AttachDatabaseRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.AttachDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_AttachDatabaseResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.AttachDatabaseResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.AttachDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_AttachDatabaseResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.AttachDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_BeginTransactionRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.BeginTransactionRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.BeginTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_BeginTransactionRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.BeginTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_BeginTransactionResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.BeginTransactionResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.BeginTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_BeginTransactionResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.BeginTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_CheckpointRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.CheckpointRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.CheckpointRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_CheckpointRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.CheckpointRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_CheckpointResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.CheckpointResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.CheckpointResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_CheckpointResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.CheckpointResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_DatabaseSchema(arg) {
  if (!(arg instanceof sqlrpc_v1_types_pb.DatabaseSchema)) {
    throw new Error('Expected argument of type sqlrpc.v1.DatabaseSchema');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_DatabaseSchema(buffer_arg) {
  return sqlrpc_v1_types_pb.DatabaseSchema.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_DetachDatabaseRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.DetachDatabaseRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.DetachDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_DetachDatabaseRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.DetachDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_DetachDatabaseResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.DetachDatabaseResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.DetachDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_DetachDatabaseResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.DetachDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ExecResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.ExecResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.ExecResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ExecResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.ExecResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ExecuteTransactionRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.ExecuteTransactionRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.ExecuteTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ExecuteTransactionRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.ExecuteTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ExecuteTransactionResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.ExecuteTransactionResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.ExecuteTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ExecuteTransactionResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.ExecuteTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ExplainResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.ExplainResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.ExplainResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ExplainResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.ExplainResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_GetDatabaseSchemaRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.GetDatabaseSchemaRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.GetDatabaseSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_GetDatabaseSchemaRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.GetDatabaseSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_GetTableSchemaRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.GetTableSchemaRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.GetTableSchemaRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_GetTableSchemaRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.GetTableSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_IntegrityCheckRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.IntegrityCheckRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.IntegrityCheckRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_IntegrityCheckRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.IntegrityCheckRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_IntegrityCheckResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.IntegrityCheckResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.IntegrityCheckResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_IntegrityCheckResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.IntegrityCheckResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListExtensionsRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.ListExtensionsRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListExtensionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListExtensionsRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.ListExtensionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListExtensionsResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.ListExtensionsResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListExtensionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListExtensionsResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.ListExtensionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListTablesRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.ListTablesRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListTablesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListTablesRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.ListTablesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListTablesResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.ListTablesResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListTablesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListTablesResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.ListTablesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_LoadExtensionRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.LoadExtensionRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.LoadExtensionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_LoadExtensionRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.LoadExtensionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_LoadExtensionResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.LoadExtensionResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.LoadExtensionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_LoadExtensionResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.LoadExtensionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_QueryRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.QueryRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.QueryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_QueryRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.QueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_QueryResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.QueryResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.QueryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_QueryResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.QueryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_QueryResult(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.QueryResult)) {
    throw new Error('Expected argument of type sqlrpc.v1.QueryResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_QueryResult(buffer_arg) {
  return sqlrpc_v1_db_service_pb.QueryResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_SavepointResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.SavepointResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.SavepointResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_SavepointResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.SavepointResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TableSchema(arg) {
  if (!(arg instanceof sqlrpc_v1_types_pb.TableSchema)) {
    throw new Error('Expected argument of type sqlrpc.v1.TableSchema');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TableSchema(buffer_arg) {
  return sqlrpc_v1_types_pb.TableSchema.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TransactionControlRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TransactionControlRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.TransactionControlRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TransactionControlRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TransactionControlRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TransactionControlResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TransactionControlResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.TransactionControlResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TransactionControlResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TransactionControlResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TransactionQueryRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TransactionQueryRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.TransactionQueryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TransactionQueryRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TransactionQueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TransactionRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TransactionRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.TransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TransactionRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TransactionResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TransactionResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.TransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TransactionResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TransactionSavepointRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TransactionSavepointRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.TransactionSavepointRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TransactionSavepointRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TransactionSavepointRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TypedQueryRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TypedQueryRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.TypedQueryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TypedQueryRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TypedQueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TypedQueryResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TypedQueryResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.TypedQueryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TypedQueryResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TypedQueryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TypedQueryResult(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TypedQueryResult)) {
    throw new Error('Expected argument of type sqlrpc.v1.TypedQueryResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TypedQueryResult(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TypedQueryResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_TypedTransactionQueryRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.TypedTransactionQueryRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.TypedTransactionQueryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_TypedTransactionQueryRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.TypedTransactionQueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_VacuumRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.VacuumRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.VacuumRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_VacuumRequest(buffer_arg) {
  return sqlrpc_v1_db_service_pb.VacuumRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_VacuumResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_db_service_pb.VacuumResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.VacuumResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_VacuumResponse(buffer_arg) {
  return sqlrpc_v1_db_service_pb.VacuumResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// =============================================================================
// DATABASE SERVICE DEFINITION
// =============================================================================
//
// *
// DatabaseService provides the primary data plane for the platform.
// It facilitates isolated, tenant-aware access to individual databases. The
// service automatically handles read/write connection routing and strictly
// enforces read-only connection limits for read-only users.
//
// buf:lint:ignore RPC_REQUEST_RESPONSE_UNIQUE
// buf:lint:ignore RPC_REQUEST_STANDARD_NAME
// buf:lint:ignore RPC_RESPONSE_STANDARD_NAME
var DatabaseServiceService = exports.DatabaseServiceService = {
  // *
// Read Endpoint (Unary).
// Uses the global shared LRU connection pool, routing to a Read-Only
// connection for ROLE_READ_ONLY users.
query: {
    path: '/sqlrpc.v1.DatabaseService/Query',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.QueryRequest,
    responseType: sqlrpc_v1_db_service_pb.QueryResult,
    requestSerialize: serialize_sqlrpc_v1_QueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_QueryRequest,
    responseSerialize: serialize_sqlrpc_v1_QueryResult,
    responseDeserialize: deserialize_sqlrpc_v1_QueryResult,
  },
  // *
// Write Endpoint (Unary DML).
// Uses the global shared LRU connection pool, strictly routing to a
// Read-Write connection. Denied for ROLE_READ_ONLY.
exec: {
    path: '/sqlrpc.v1.DatabaseService/Exec',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.QueryRequest,
    responseType: sqlrpc_v1_db_service_pb.ExecResponse,
    requestSerialize: serialize_sqlrpc_v1_QueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_QueryRequest,
    responseSerialize: serialize_sqlrpc_v1_ExecResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ExecResponse,
  },
  // *
// Read Endpoint (Streaming).
// Routed via the shared LRU pool to a Read-Only connection. Yields chunked
// results.
queryStream: {
    path: '/sqlrpc.v1.DatabaseService/QueryStream',
    requestStream: false,
    responseStream: true,
    requestType: sqlrpc_v1_db_service_pb.QueryRequest,
    responseType: sqlrpc_v1_db_service_pb.QueryResponse,
    requestSerialize: serialize_sqlrpc_v1_QueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_QueryRequest,
    responseSerialize: serialize_sqlrpc_v1_QueryResponse,
    responseDeserialize: deserialize_sqlrpc_v1_QueryResponse,
  },
  // --- Stateful Operations (Model A: Bidirectional Stream) ---
//
// *
// Bidirectional Streaming Transaction.
// Maintains a persistent, multiplexed stream for executing multiple
// statements sequentially under a single transaction, holding the shared LRU
// connection until completion.
transaction: {
    path: '/sqlrpc.v1.DatabaseService/Transaction',
    requestStream: true,
    responseStream: true,
    requestType: sqlrpc_v1_db_service_pb.TransactionRequest,
    responseType: sqlrpc_v1_db_service_pb.TransactionResponse,
    requestSerialize: serialize_sqlrpc_v1_TransactionRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TransactionRequest,
    responseSerialize: serialize_sqlrpc_v1_TransactionResponse,
    responseDeserialize: deserialize_sqlrpc_v1_TransactionResponse,
  },
  // --- Stateful Operations (Model B: Unary ID-Based) ---
//
// *
// Transaction Control.
// Acquires an active connection from the global shared LRU pool based on the
// user's role (RO vs RW).
beginTransaction: {
    path: '/sqlrpc.v1.DatabaseService/BeginTransaction',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.BeginTransactionRequest,
    responseType: sqlrpc_v1_db_service_pb.BeginTransactionResponse,
    requestSerialize: serialize_sqlrpc_v1_BeginTransactionRequest,
    requestDeserialize: deserialize_sqlrpc_v1_BeginTransactionRequest,
    responseSerialize: serialize_sqlrpc_v1_BeginTransactionResponse,
    responseDeserialize: deserialize_sqlrpc_v1_BeginTransactionResponse,
  },
  // *
// Read Endpoint within a Transaction.
// Inherits the active transaction context tied to the shared LRU connection
// pool.
transactionQuery: {
    path: '/sqlrpc.v1.DatabaseService/TransactionQuery',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TransactionQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.QueryResult,
    requestSerialize: serialize_sqlrpc_v1_TransactionQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TransactionQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_QueryResult,
    responseDeserialize: deserialize_sqlrpc_v1_QueryResult,
  },
  // *
// Write Endpoint within a Transaction.
// Fails if the underlying transaction connection is Read-Only.
transactionExec: {
    path: '/sqlrpc.v1.DatabaseService/TransactionExec',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TransactionQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.ExecResponse,
    requestSerialize: serialize_sqlrpc_v1_TransactionQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TransactionQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_ExecResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ExecResponse,
  },
  // *
// Read Endpoint (Streaming) within a Transaction.
transactionQueryStream: {
    path: '/sqlrpc.v1.DatabaseService/TransactionQueryStream',
    requestStream: false,
    responseStream: true,
    requestType: sqlrpc_v1_db_service_pb.TransactionQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.QueryResponse,
    requestSerialize: serialize_sqlrpc_v1_TransactionQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TransactionQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_QueryResponse,
    responseDeserialize: deserialize_sqlrpc_v1_QueryResponse,
  },
  // *
// Savepoint Control within a Transaction.
// Enables nested transaction boundaries (SAVEPOINT, RELEASE, ROLLBACK TO)
// within an active Unary ID-Based transaction.
transactionSavepoint: {
    path: '/sqlrpc.v1.DatabaseService/TransactionSavepoint',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TransactionSavepointRequest,
    responseType: sqlrpc_v1_db_service_pb.SavepointResponse,
    requestSerialize: serialize_sqlrpc_v1_TransactionSavepointRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TransactionSavepointRequest,
    responseSerialize: serialize_sqlrpc_v1_SavepointResponse,
    responseDeserialize: deserialize_sqlrpc_v1_SavepointResponse,
  },
  // *
// Transaction Commit.
// Commits an active Unary ID-Based transaction and releases the connection
// back to the shared LRU pool.
commitTransaction: {
    path: '/sqlrpc.v1.DatabaseService/CommitTransaction',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TransactionControlRequest,
    responseType: sqlrpc_v1_db_service_pb.TransactionControlResponse,
    requestSerialize: serialize_sqlrpc_v1_TransactionControlRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TransactionControlRequest,
    responseSerialize: serialize_sqlrpc_v1_TransactionControlResponse,
    responseDeserialize: deserialize_sqlrpc_v1_TransactionControlResponse,
  },
  // *
// Transaction Rollback.
// Rolls back an active Unary ID-Based transaction and releases the connection
// back to the shared LRU pool.
rollbackTransaction: {
    path: '/sqlrpc.v1.DatabaseService/RollbackTransaction',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TransactionControlRequest,
    responseType: sqlrpc_v1_db_service_pb.TransactionControlResponse,
    requestSerialize: serialize_sqlrpc_v1_TransactionControlRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TransactionControlRequest,
    responseSerialize: serialize_sqlrpc_v1_TransactionControlResponse,
    responseDeserialize: deserialize_sqlrpc_v1_TransactionControlResponse,
  },
  // --- Utility Operations ---
//
// *
// Atomic Script Execution.
// Executes a predefined sequence of queries within a single transaction
// atomically. Handled completely server-side to minimize network latency
// between statements.
executeTransaction: {
    path: '/sqlrpc.v1.DatabaseService/ExecuteTransaction',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.ExecuteTransactionRequest,
    responseType: sqlrpc_v1_db_service_pb.ExecuteTransactionResponse,
    requestSerialize: serialize_sqlrpc_v1_ExecuteTransactionRequest,
    requestDeserialize: deserialize_sqlrpc_v1_ExecuteTransactionRequest,
    responseSerialize: serialize_sqlrpc_v1_ExecuteTransactionResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ExecuteTransactionResponse,
  },
  // *
// Typed Read Endpoint (Unary).
// Automatically routed to a Read-Only replica connection for ROLE_READ_ONLY
// users.
typedQuery: {
    path: '/sqlrpc.v1.DatabaseService/TypedQuery',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TypedQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.TypedQueryResult,
    requestSerialize: serialize_sqlrpc_v1_TypedQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TypedQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_TypedQueryResult,
    responseDeserialize: deserialize_sqlrpc_v1_TypedQueryResult,
  },
  // *
// Typed Write Endpoint (Unary DML).
// Uses the global shared LRU connection pool, strictly routing to a
// Read-Write connection.
typedExec: {
    path: '/sqlrpc.v1.DatabaseService/TypedExec',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TypedQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.ExecResponse,
    requestSerialize: serialize_sqlrpc_v1_TypedQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TypedQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_ExecResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ExecResponse,
  },
  // *
// Typed Read Endpoint (Streaming).
// Routes to the global Read-Only or Read-Write LRU connection depending on
// user role.
typedQueryStream: {
    path: '/sqlrpc.v1.DatabaseService/TypedQueryStream',
    requestStream: false,
    responseStream: true,
    requestType: sqlrpc_v1_db_service_pb.TypedQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.TypedQueryResponse,
    requestSerialize: serialize_sqlrpc_v1_TypedQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TypedQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_TypedQueryResponse,
    responseDeserialize: deserialize_sqlrpc_v1_TypedQueryResponse,
  },
  // --- Typed Stateful Operations (Unary ID-Based) ---
//
// *
// Typed Read Endpoint within a Transaction.
typedTransactionQuery: {
    path: '/sqlrpc.v1.DatabaseService/TypedTransactionQuery',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TypedTransactionQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.TypedQueryResult,
    requestSerialize: serialize_sqlrpc_v1_TypedTransactionQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TypedTransactionQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_TypedQueryResult,
    responseDeserialize: deserialize_sqlrpc_v1_TypedQueryResult,
  },
  // *
// Typed Write Endpoint within a Transaction.
// Denied on Read-Only transactions.
typedTransactionExec: {
    path: '/sqlrpc.v1.DatabaseService/TypedTransactionExec',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TypedTransactionQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.ExecResponse,
    requestSerialize: serialize_sqlrpc_v1_TypedTransactionQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TypedTransactionQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_ExecResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ExecResponse,
  },
  // *
// Streaming Interface.
// Yields partitioned tenant data blocks over a managed stream.
typedTransactionQueryStream: {
    path: '/sqlrpc.v1.DatabaseService/TypedTransactionQueryStream',
    requestStream: false,
    responseStream: true,
    requestType: sqlrpc_v1_db_service_pb.TypedTransactionQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.TypedQueryResponse,
    requestSerialize: serialize_sqlrpc_v1_TypedTransactionQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TypedTransactionQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_TypedQueryResponse,
    responseDeserialize: deserialize_sqlrpc_v1_TypedQueryResponse,
  },
  // *
// Introspection: Query Plan Explanation.
// Returns the EXPLAIN QUERY PLAN breakdown for a given statement without
// running the statement itself.
explain: {
    path: '/sqlrpc.v1.DatabaseService/Explain',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.QueryRequest,
    responseType: sqlrpc_v1_db_service_pb.ExplainResponse,
    requestSerialize: serialize_sqlrpc_v1_QueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_QueryRequest,
    responseSerialize: serialize_sqlrpc_v1_ExplainResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ExplainResponse,
  },
  // *
// Typed Introspection: Query Plan Explanation.
// Provides the EXPLAIN QUERY PLAN breakdown using strictly-typed parameters.
typedExplain: {
    path: '/sqlrpc.v1.DatabaseService/TypedExplain',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.TypedQueryRequest,
    responseType: sqlrpc_v1_db_service_pb.ExplainResponse,
    requestSerialize: serialize_sqlrpc_v1_TypedQueryRequest,
    requestDeserialize: deserialize_sqlrpc_v1_TypedQueryRequest,
    responseSerialize: serialize_sqlrpc_v1_ExplainResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ExplainResponse,
  },
  // *
// Database Introspection: List Tables.
// Returns a list of all table names currently present in the target database.
listTables: {
    path: '/sqlrpc.v1.DatabaseService/ListTables',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.ListTablesRequest,
    responseType: sqlrpc_v1_db_service_pb.ListTablesResponse,
    requestSerialize: serialize_sqlrpc_v1_ListTablesRequest,
    requestDeserialize: deserialize_sqlrpc_v1_ListTablesRequest,
    responseSerialize: serialize_sqlrpc_v1_ListTablesResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ListTablesResponse,
  },
  // *
// Database Introspection: Get Table Schema.
// Returns the structural schema definitions for a specific table.
getTableSchema: {
    path: '/sqlrpc.v1.DatabaseService/GetTableSchema',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.GetTableSchemaRequest,
    responseType: sqlrpc_v1_types_pb.TableSchema,
    requestSerialize: serialize_sqlrpc_v1_GetTableSchemaRequest,
    requestDeserialize: deserialize_sqlrpc_v1_GetTableSchemaRequest,
    responseSerialize: serialize_sqlrpc_v1_TableSchema,
    responseDeserialize: deserialize_sqlrpc_v1_TableSchema,
  },
  // *
// Database Introspection: Get Database Schema.
// Returns the structural schema definitions for the entire underlying
// database.
getDatabaseSchema: {
    path: '/sqlrpc.v1.DatabaseService/GetDatabaseSchema',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.GetDatabaseSchemaRequest,
    responseType: sqlrpc_v1_types_pb.DatabaseSchema,
    requestSerialize: serialize_sqlrpc_v1_GetDatabaseSchemaRequest,
    requestDeserialize: deserialize_sqlrpc_v1_GetDatabaseSchemaRequest,
    responseSerialize: serialize_sqlrpc_v1_DatabaseSchema,
    responseDeserialize: deserialize_sqlrpc_v1_DatabaseSchema,
  },
  // --- Maintenance Operations ---
//
// *
// Maintenance: Vacuum.
// Rebuilds the database file, repacking it into a minimal amount of disk
// space.
vacuum: {
    path: '/sqlrpc.v1.DatabaseService/Vacuum',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.VacuumRequest,
    responseType: sqlrpc_v1_db_service_pb.VacuumResponse,
    requestSerialize: serialize_sqlrpc_v1_VacuumRequest,
    requestDeserialize: deserialize_sqlrpc_v1_VacuumRequest,
    responseSerialize: serialize_sqlrpc_v1_VacuumResponse,
    responseDeserialize: deserialize_sqlrpc_v1_VacuumResponse,
  },
  // *
// Maintenance: Checkpoint.
// Synchronizes the write-ahead log (WAL) with the main database file.
checkpoint: {
    path: '/sqlrpc.v1.DatabaseService/Checkpoint',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.CheckpointRequest,
    responseType: sqlrpc_v1_db_service_pb.CheckpointResponse,
    requestSerialize: serialize_sqlrpc_v1_CheckpointRequest,
    requestDeserialize: deserialize_sqlrpc_v1_CheckpointRequest,
    responseSerialize: serialize_sqlrpc_v1_CheckpointResponse,
    responseDeserialize: deserialize_sqlrpc_v1_CheckpointResponse,
  },
  // *
// Maintenance: Integrity Check.
// Runs PRAGMA integrity_check to scan for out-of-order records, missing
// pages, or corruption.
integrityCheck: {
    path: '/sqlrpc.v1.DatabaseService/IntegrityCheck',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.IntegrityCheckRequest,
    responseType: sqlrpc_v1_db_service_pb.IntegrityCheckResponse,
    requestSerialize: serialize_sqlrpc_v1_IntegrityCheckRequest,
    requestDeserialize: deserialize_sqlrpc_v1_IntegrityCheckRequest,
    responseSerialize: serialize_sqlrpc_v1_IntegrityCheckResponse,
    responseDeserialize: deserialize_sqlrpc_v1_IntegrityCheckResponse,
  },
  // *
// Maintenance: Attach Database.
// Dynamically mounts a secondary database into the current tenant's namespace
// context.
attachDatabase: {
    path: '/sqlrpc.v1.DatabaseService/AttachDatabase',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.AttachDatabaseRequest,
    responseType: sqlrpc_v1_db_service_pb.AttachDatabaseResponse,
    requestSerialize: serialize_sqlrpc_v1_AttachDatabaseRequest,
    requestDeserialize: deserialize_sqlrpc_v1_AttachDatabaseRequest,
    responseSerialize: serialize_sqlrpc_v1_AttachDatabaseResponse,
    responseDeserialize: deserialize_sqlrpc_v1_AttachDatabaseResponse,
  },
  // *
// Maintenance: Detach Database.
// Safely detaches a previously attached secondary database from the active
// context.
detachDatabase: {
    path: '/sqlrpc.v1.DatabaseService/DetachDatabase',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.DetachDatabaseRequest,
    responseType: sqlrpc_v1_db_service_pb.DetachDatabaseResponse,
    requestSerialize: serialize_sqlrpc_v1_DetachDatabaseRequest,
    requestDeserialize: deserialize_sqlrpc_v1_DetachDatabaseRequest,
    responseSerialize: serialize_sqlrpc_v1_DetachDatabaseResponse,
    responseDeserialize: deserialize_sqlrpc_v1_DetachDatabaseResponse,
  },
  // --- Extension Management ---
//
// *
// Extensions: List.
// Returns a catalog of available and loaded SQLite extensions.
listExtensions: {
    path: '/sqlrpc.v1.DatabaseService/ListExtensions',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.ListExtensionsRequest,
    responseType: sqlrpc_v1_db_service_pb.ListExtensionsResponse,
    requestSerialize: serialize_sqlrpc_v1_ListExtensionsRequest,
    requestDeserialize: deserialize_sqlrpc_v1_ListExtensionsRequest,
    responseSerialize: serialize_sqlrpc_v1_ListExtensionsResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ListExtensionsResponse,
  },
  // *
// Extensions: Load.
// Dynamically loads a compatible SQLite extension into the target database.
loadExtension: {
    path: '/sqlrpc.v1.DatabaseService/LoadExtension',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_db_service_pb.LoadExtensionRequest,
    responseType: sqlrpc_v1_db_service_pb.LoadExtensionResponse,
    requestSerialize: serialize_sqlrpc_v1_LoadExtensionRequest,
    requestDeserialize: deserialize_sqlrpc_v1_LoadExtensionRequest,
    responseSerialize: serialize_sqlrpc_v1_LoadExtensionResponse,
    responseDeserialize: deserialize_sqlrpc_v1_LoadExtensionResponse,
  },
};

exports.DatabaseServiceClient = grpc.makeGenericClientConstructor(DatabaseServiceService, 'DatabaseService');
// --- Stateless Operations ---
