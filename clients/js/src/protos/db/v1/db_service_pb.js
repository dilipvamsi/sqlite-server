// source: db/v1/db_service.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = globalThis;

var buf_validate_validate_pb = require('../../buf/validate/validate_pb.js');
goog.object.extend(proto, buf_validate_validate_pb);
var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');
goog.object.extend(proto, google_protobuf_struct_pb);
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
goog.object.extend(proto, google_protobuf_timestamp_pb);
var google_protobuf_duration_pb = require('google-protobuf/google/protobuf/duration_pb.js');
goog.object.extend(proto, google_protobuf_duration_pb);
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
goog.object.extend(proto, google_protobuf_empty_pb);
goog.exportSymbol('proto.db.v1.AttachDatabaseRequest', null, global);
goog.exportSymbol('proto.db.v1.AttachDatabaseResponse', null, global);
goog.exportSymbol('proto.db.v1.Attachment', null, global);
goog.exportSymbol('proto.db.v1.AttachmentList', null, global);
goog.exportSymbol('proto.db.v1.BackupDatabaseRequest', null, global);
goog.exportSymbol('proto.db.v1.BackupDatabaseResponse', null, global);
goog.exportSymbol('proto.db.v1.BeginRequest', null, global);
goog.exportSymbol('proto.db.v1.BeginResponse', null, global);
goog.exportSymbol('proto.db.v1.BeginTransactionRequest', null, global);
goog.exportSymbol('proto.db.v1.BeginTransactionResponse', null, global);
goog.exportSymbol('proto.db.v1.CheckpointMode', null, global);
goog.exportSymbol('proto.db.v1.CheckpointRequest', null, global);
goog.exportSymbol('proto.db.v1.CheckpointResponse', null, global);
goog.exportSymbol('proto.db.v1.ColumnAffinity', null, global);
goog.exportSymbol('proto.db.v1.ColumnSchema', null, global);
goog.exportSymbol('proto.db.v1.CommitResponse', null, global);
goog.exportSymbol('proto.db.v1.CreateApiKeyRequest', null, global);
goog.exportSymbol('proto.db.v1.CreateApiKeyResponse', null, global);
goog.exportSymbol('proto.db.v1.CreateDatabaseRequest', null, global);
goog.exportSymbol('proto.db.v1.CreateDatabaseResponse', null, global);
goog.exportSymbol('proto.db.v1.CreateUserRequest', null, global);
goog.exportSymbol('proto.db.v1.CreateUserResponse', null, global);
goog.exportSymbol('proto.db.v1.DMLResult', null, global);
goog.exportSymbol('proto.db.v1.DatabaseConfig', null, global);
goog.exportSymbol('proto.db.v1.DatabaseInfo', null, global);
goog.exportSymbol('proto.db.v1.DatabaseSchema', null, global);
goog.exportSymbol('proto.db.v1.DeclaredType', null, global);
goog.exportSymbol('proto.db.v1.DeleteDatabaseRequest', null, global);
goog.exportSymbol('proto.db.v1.DeleteDatabaseResponse', null, global);
goog.exportSymbol('proto.db.v1.DeleteUserRequest', null, global);
goog.exportSymbol('proto.db.v1.DeleteUserResponse', null, global);
goog.exportSymbol('proto.db.v1.DetachDatabaseRequest', null, global);
goog.exportSymbol('proto.db.v1.DetachDatabaseResponse', null, global);
goog.exportSymbol('proto.db.v1.ErrorResponse', null, global);
goog.exportSymbol('proto.db.v1.ExecuteTransactionRequest', null, global);
goog.exportSymbol('proto.db.v1.ExecuteTransactionResponse', null, global);
goog.exportSymbol('proto.db.v1.ExecutionStats', null, global);
goog.exportSymbol('proto.db.v1.ExplainResponse', null, global);
goog.exportSymbol('proto.db.v1.ExtensionList', null, global);
goog.exportSymbol('proto.db.v1.ForeignKeySchema', null, global);
goog.exportSymbol('proto.db.v1.GetDatabaseSchemaRequest', null, global);
goog.exportSymbol('proto.db.v1.GetTableSchemaRequest', null, global);
goog.exportSymbol('proto.db.v1.IndexSchema', null, global);
goog.exportSymbol('proto.db.v1.InitCommandList', null, global);
goog.exportSymbol('proto.db.v1.IntegrityCheckRequest', null, global);
goog.exportSymbol('proto.db.v1.IntegrityCheckResponse', null, global);
goog.exportSymbol('proto.db.v1.ListApiKeysRequest', null, global);
goog.exportSymbol('proto.db.v1.ListApiKeysResponse', null, global);
goog.exportSymbol('proto.db.v1.ListApiKeysResponse.ApiKeySummary', null, global);
goog.exportSymbol('proto.db.v1.ListDatabasesRequest', null, global);
goog.exportSymbol('proto.db.v1.ListDatabasesResponse', null, global);
goog.exportSymbol('proto.db.v1.ListTablesRequest', null, global);
goog.exportSymbol('proto.db.v1.ListTablesResponse', null, global);
goog.exportSymbol('proto.db.v1.ListUsersRequest', null, global);
goog.exportSymbol('proto.db.v1.ListUsersResponse', null, global);
goog.exportSymbol('proto.db.v1.LoginRequest', null, global);
goog.exportSymbol('proto.db.v1.LoginResponse', null, global);
goog.exportSymbol('proto.db.v1.LogoutRequest', null, global);
goog.exportSymbol('proto.db.v1.LogoutResponse', null, global);
goog.exportSymbol('proto.db.v1.MountDatabaseResponse', null, global);
goog.exportSymbol('proto.db.v1.Parameters', null, global);
goog.exportSymbol('proto.db.v1.PragmaMap', null, global);
goog.exportSymbol('proto.db.v1.QueryComplete', null, global);
goog.exportSymbol('proto.db.v1.QueryPlanNode', null, global);
goog.exportSymbol('proto.db.v1.QueryRequest', null, global);
goog.exportSymbol('proto.db.v1.QueryResponse', null, global);
goog.exportSymbol('proto.db.v1.QueryResponse.ResponseCase', null, global);
goog.exportSymbol('proto.db.v1.QueryResult', null, global);
goog.exportSymbol('proto.db.v1.QueryResult.ResultCase', null, global);
goog.exportSymbol('proto.db.v1.QueryResultHeader', null, global);
goog.exportSymbol('proto.db.v1.QueryResultRowBatch', null, global);
goog.exportSymbol('proto.db.v1.QueryType', null, global);
goog.exportSymbol('proto.db.v1.RestoreDatabaseRequest', null, global);
goog.exportSymbol('proto.db.v1.RestoreDatabaseRequest.PayloadCase', null, global);
goog.exportSymbol('proto.db.v1.RestoreDatabaseResponse', null, global);
goog.exportSymbol('proto.db.v1.RevokeApiKeyRequest', null, global);
goog.exportSymbol('proto.db.v1.RevokeApiKeyResponse', null, global);
goog.exportSymbol('proto.db.v1.Role', null, global);
goog.exportSymbol('proto.db.v1.RollbackResponse', null, global);
goog.exportSymbol('proto.db.v1.SavepointAction', null, global);
goog.exportSymbol('proto.db.v1.SavepointRequest', null, global);
goog.exportSymbol('proto.db.v1.SavepointResponse', null, global);
goog.exportSymbol('proto.db.v1.SelectResult', null, global);
goog.exportSymbol('proto.db.v1.SqlRow', null, global);
goog.exportSymbol('proto.db.v1.SqlValue', null, global);
goog.exportSymbol('proto.db.v1.SqlValue.ValueCase', null, global);
goog.exportSymbol('proto.db.v1.SqliteCode', null, global);
goog.exportSymbol('proto.db.v1.TableSchema', null, global);
goog.exportSymbol('proto.db.v1.TransactionControlRequest', null, global);
goog.exportSymbol('proto.db.v1.TransactionControlResponse', null, global);
goog.exportSymbol('proto.db.v1.TransactionMode', null, global);
goog.exportSymbol('proto.db.v1.TransactionQueryRequest', null, global);
goog.exportSymbol('proto.db.v1.TransactionRequest', null, global);
goog.exportSymbol('proto.db.v1.TransactionRequest.CommandCase', null, global);
goog.exportSymbol('proto.db.v1.TransactionResponse', null, global);
goog.exportSymbol('proto.db.v1.TransactionResponse.ResponseCase', null, global);
goog.exportSymbol('proto.db.v1.TransactionSavepointRequest', null, global);
goog.exportSymbol('proto.db.v1.TransactionalQueryRequest', null, global);
goog.exportSymbol('proto.db.v1.TriggerSchema', null, global);
goog.exportSymbol('proto.db.v1.TypedParameters', null, global);
goog.exportSymbol('proto.db.v1.TypedQueryRequest', null, global);
goog.exportSymbol('proto.db.v1.TypedQueryResponse', null, global);
goog.exportSymbol('proto.db.v1.TypedQueryResponse.ResponseCase', null, global);
goog.exportSymbol('proto.db.v1.TypedQueryResult', null, global);
goog.exportSymbol('proto.db.v1.TypedQueryResult.ResultCase', null, global);
goog.exportSymbol('proto.db.v1.TypedQueryResultHeader', null, global);
goog.exportSymbol('proto.db.v1.TypedQueryResultRowBatch', null, global);
goog.exportSymbol('proto.db.v1.TypedSelectResult', null, global);
goog.exportSymbol('proto.db.v1.TypedTransactionQueryRequest', null, global);
goog.exportSymbol('proto.db.v1.TypedTransactionalQueryRequest', null, global);
goog.exportSymbol('proto.db.v1.UnMountDatabaseRequest', null, global);
goog.exportSymbol('proto.db.v1.UnMountDatabaseResponse', null, global);
goog.exportSymbol('proto.db.v1.UpdateDatabaseConfig', null, global);
goog.exportSymbol('proto.db.v1.UpdateDatabaseRequest', null, global);
goog.exportSymbol('proto.db.v1.UpdateDatabaseResponse', null, global);
goog.exportSymbol('proto.db.v1.UpdatePasswordRequest', null, global);
goog.exportSymbol('proto.db.v1.UpdatePasswordResponse', null, global);
goog.exportSymbol('proto.db.v1.UpdateUserRoleRequest', null, global);
goog.exportSymbol('proto.db.v1.UpdateUserRoleResponse', null, global);
goog.exportSymbol('proto.db.v1.User', null, global);
goog.exportSymbol('proto.db.v1.VacuumRequest', null, global);
goog.exportSymbol('proto.db.v1.VacuumResponse', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.VacuumRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.VacuumRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.VacuumRequest.displayName = 'proto.db.v1.VacuumRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.VacuumResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.VacuumResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.VacuumResponse.displayName = 'proto.db.v1.VacuumResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.CheckpointRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.CheckpointRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.CheckpointRequest.displayName = 'proto.db.v1.CheckpointRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.CheckpointResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.CheckpointResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.CheckpointResponse.displayName = 'proto.db.v1.CheckpointResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.IntegrityCheckRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.IntegrityCheckRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.IntegrityCheckRequest.displayName = 'proto.db.v1.IntegrityCheckRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.IntegrityCheckResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.IntegrityCheckResponse.repeatedFields_, null);
};
goog.inherits(proto.db.v1.IntegrityCheckResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.IntegrityCheckResponse.displayName = 'proto.db.v1.IntegrityCheckResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.CreateUserRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.CreateUserRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.CreateUserRequest.displayName = 'proto.db.v1.CreateUserRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.CreateUserResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.CreateUserResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.CreateUserResponse.displayName = 'proto.db.v1.CreateUserResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DeleteUserRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.DeleteUserRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DeleteUserRequest.displayName = 'proto.db.v1.DeleteUserRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DeleteUserResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.DeleteUserResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DeleteUserResponse.displayName = 'proto.db.v1.DeleteUserResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.UpdatePasswordRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.UpdatePasswordRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.UpdatePasswordRequest.displayName = 'proto.db.v1.UpdatePasswordRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.UpdatePasswordResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.UpdatePasswordResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.UpdatePasswordResponse.displayName = 'proto.db.v1.UpdatePasswordResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ListUsersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.ListUsersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ListUsersRequest.displayName = 'proto.db.v1.ListUsersRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ListUsersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.ListUsersResponse.repeatedFields_, null);
};
goog.inherits(proto.db.v1.ListUsersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ListUsersResponse.displayName = 'proto.db.v1.ListUsersResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.UpdateUserRoleRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.UpdateUserRoleRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.UpdateUserRoleRequest.displayName = 'proto.db.v1.UpdateUserRoleRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.UpdateUserRoleResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.UpdateUserRoleResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.UpdateUserRoleResponse.displayName = 'proto.db.v1.UpdateUserRoleResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.CreateApiKeyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.CreateApiKeyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.CreateApiKeyRequest.displayName = 'proto.db.v1.CreateApiKeyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.CreateApiKeyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.CreateApiKeyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.CreateApiKeyResponse.displayName = 'proto.db.v1.CreateApiKeyResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ListApiKeysRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.ListApiKeysRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ListApiKeysRequest.displayName = 'proto.db.v1.ListApiKeysRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ListApiKeysResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.ListApiKeysResponse.repeatedFields_, null);
};
goog.inherits(proto.db.v1.ListApiKeysResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ListApiKeysResponse.displayName = 'proto.db.v1.ListApiKeysResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.ListApiKeysResponse.ApiKeySummary, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ListApiKeysResponse.ApiKeySummary.displayName = 'proto.db.v1.ListApiKeysResponse.ApiKeySummary';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ListDatabasesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.ListDatabasesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ListDatabasesRequest.displayName = 'proto.db.v1.ListDatabasesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ListDatabasesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.ListDatabasesResponse.repeatedFields_, null);
};
goog.inherits(proto.db.v1.ListDatabasesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ListDatabasesResponse.displayName = 'proto.db.v1.ListDatabasesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DatabaseInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.DatabaseInfo.repeatedFields_, null);
};
goog.inherits(proto.db.v1.DatabaseInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DatabaseInfo.displayName = 'proto.db.v1.DatabaseInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.LoginRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.LoginRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.LoginRequest.displayName = 'proto.db.v1.LoginRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.LoginResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.LoginResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.LoginResponse.displayName = 'proto.db.v1.LoginResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.LogoutRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.LogoutRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.LogoutRequest.displayName = 'proto.db.v1.LogoutRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.LogoutResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.LogoutResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.LogoutResponse.displayName = 'proto.db.v1.LogoutResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.User = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.User, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.User.displayName = 'proto.db.v1.User';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.RevokeApiKeyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.RevokeApiKeyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.RevokeApiKeyRequest.displayName = 'proto.db.v1.RevokeApiKeyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.RevokeApiKeyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.RevokeApiKeyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.RevokeApiKeyResponse.displayName = 'proto.db.v1.RevokeApiKeyResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.BackupDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.BackupDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.BackupDatabaseRequest.displayName = 'proto.db.v1.BackupDatabaseRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.BackupDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.BackupDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.BackupDatabaseResponse.displayName = 'proto.db.v1.BackupDatabaseResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.RestoreDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.db.v1.RestoreDatabaseRequest.oneofGroups_);
};
goog.inherits(proto.db.v1.RestoreDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.RestoreDatabaseRequest.displayName = 'proto.db.v1.RestoreDatabaseRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.RestoreDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.RestoreDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.RestoreDatabaseResponse.displayName = 'proto.db.v1.RestoreDatabaseResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.CreateDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.CreateDatabaseRequest.repeatedFields_, null);
};
goog.inherits(proto.db.v1.CreateDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.CreateDatabaseRequest.displayName = 'proto.db.v1.CreateDatabaseRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.CreateDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.CreateDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.CreateDatabaseResponse.displayName = 'proto.db.v1.CreateDatabaseResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.MountDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.MountDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.MountDatabaseResponse.displayName = 'proto.db.v1.MountDatabaseResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.UnMountDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.UnMountDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.UnMountDatabaseRequest.displayName = 'proto.db.v1.UnMountDatabaseRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.UnMountDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.UnMountDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.UnMountDatabaseResponse.displayName = 'proto.db.v1.UnMountDatabaseResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DeleteDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.DeleteDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DeleteDatabaseRequest.displayName = 'proto.db.v1.DeleteDatabaseRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DeleteDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.DeleteDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DeleteDatabaseResponse.displayName = 'proto.db.v1.DeleteDatabaseResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.QueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.QueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.QueryRequest.displayName = 'proto.db.v1.QueryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.Parameters = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.Parameters, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.Parameters.displayName = 'proto.db.v1.Parameters';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.BeginTransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.BeginTransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.BeginTransactionRequest.displayName = 'proto.db.v1.BeginTransactionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.BeginTransactionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.BeginTransactionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.BeginTransactionResponse.displayName = 'proto.db.v1.BeginTransactionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TransactionQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.TransactionQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TransactionQueryRequest.displayName = 'proto.db.v1.TransactionQueryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TransactionSavepointRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.TransactionSavepointRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TransactionSavepointRequest.displayName = 'proto.db.v1.TransactionSavepointRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TransactionControlRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.TransactionControlRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TransactionControlRequest.displayName = 'proto.db.v1.TransactionControlRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TransactionControlResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.TransactionControlResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TransactionControlResponse.displayName = 'proto.db.v1.TransactionControlResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.db.v1.TransactionRequest.oneofGroups_);
};
goog.inherits(proto.db.v1.TransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TransactionRequest.displayName = 'proto.db.v1.TransactionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.BeginRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.BeginRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.BeginRequest.displayName = 'proto.db.v1.BeginRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TransactionalQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.TransactionalQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TransactionalQueryRequest.displayName = 'proto.db.v1.TransactionalQueryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.SavepointRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.SavepointRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.SavepointRequest.displayName = 'proto.db.v1.SavepointRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ExecuteTransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.ExecuteTransactionRequest.repeatedFields_, null);
};
goog.inherits(proto.db.v1.ExecuteTransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ExecuteTransactionRequest.displayName = 'proto.db.v1.ExecuteTransactionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.QueryResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.db.v1.QueryResult.oneofGroups_);
};
goog.inherits(proto.db.v1.QueryResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.QueryResult.displayName = 'proto.db.v1.QueryResult';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.QueryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.db.v1.QueryResponse.oneofGroups_);
};
goog.inherits(proto.db.v1.QueryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.QueryResponse.displayName = 'proto.db.v1.QueryResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TransactionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.db.v1.TransactionResponse.oneofGroups_);
};
goog.inherits(proto.db.v1.TransactionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TransactionResponse.displayName = 'proto.db.v1.TransactionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.SavepointResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.SavepointResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.SavepointResponse.displayName = 'proto.db.v1.SavepointResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ExecuteTransactionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.ExecuteTransactionResponse.repeatedFields_, null);
};
goog.inherits(proto.db.v1.ExecuteTransactionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ExecuteTransactionResponse.displayName = 'proto.db.v1.ExecuteTransactionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.SelectResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.SelectResult.repeatedFields_, null);
};
goog.inherits(proto.db.v1.SelectResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.SelectResult.displayName = 'proto.db.v1.SelectResult';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DMLResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.DMLResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DMLResult.displayName = 'proto.db.v1.DMLResult';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.QueryResultHeader = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.QueryResultHeader.repeatedFields_, null);
};
goog.inherits(proto.db.v1.QueryResultHeader, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.QueryResultHeader.displayName = 'proto.db.v1.QueryResultHeader';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.QueryResultRowBatch = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.QueryResultRowBatch.repeatedFields_, null);
};
goog.inherits(proto.db.v1.QueryResultRowBatch, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.QueryResultRowBatch.displayName = 'proto.db.v1.QueryResultRowBatch';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.QueryComplete = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.QueryComplete, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.QueryComplete.displayName = 'proto.db.v1.QueryComplete';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ExecutionStats = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.ExecutionStats, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ExecutionStats.displayName = 'proto.db.v1.ExecutionStats';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.BeginResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.BeginResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.BeginResponse.displayName = 'proto.db.v1.BeginResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.CommitResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.CommitResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.CommitResponse.displayName = 'proto.db.v1.CommitResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.RollbackResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.RollbackResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.RollbackResponse.displayName = 'proto.db.v1.RollbackResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ErrorResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.ErrorResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ErrorResponse.displayName = 'proto.db.v1.ErrorResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.SqlValue = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.db.v1.SqlValue.oneofGroups_);
};
goog.inherits(proto.db.v1.SqlValue, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.SqlValue.displayName = 'proto.db.v1.SqlValue';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.SqlRow = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.SqlRow.repeatedFields_, null);
};
goog.inherits(proto.db.v1.SqlRow, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.SqlRow.displayName = 'proto.db.v1.SqlRow';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TypedParameters = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.TypedParameters.repeatedFields_, null);
};
goog.inherits(proto.db.v1.TypedParameters, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TypedParameters.displayName = 'proto.db.v1.TypedParameters';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TypedQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.TypedQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TypedQueryRequest.displayName = 'proto.db.v1.TypedQueryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TypedTransactionQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.TypedTransactionQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TypedTransactionQueryRequest.displayName = 'proto.db.v1.TypedTransactionQueryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TypedTransactionalQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.TypedTransactionalQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TypedTransactionalQueryRequest.displayName = 'proto.db.v1.TypedTransactionalQueryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TypedSelectResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.TypedSelectResult.repeatedFields_, null);
};
goog.inherits(proto.db.v1.TypedSelectResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TypedSelectResult.displayName = 'proto.db.v1.TypedSelectResult';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TypedQueryResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.db.v1.TypedQueryResult.oneofGroups_);
};
goog.inherits(proto.db.v1.TypedQueryResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TypedQueryResult.displayName = 'proto.db.v1.TypedQueryResult';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TypedQueryResultHeader = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.TypedQueryResultHeader.repeatedFields_, null);
};
goog.inherits(proto.db.v1.TypedQueryResultHeader, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TypedQueryResultHeader.displayName = 'proto.db.v1.TypedQueryResultHeader';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TypedQueryResultRowBatch = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.TypedQueryResultRowBatch.repeatedFields_, null);
};
goog.inherits(proto.db.v1.TypedQueryResultRowBatch, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TypedQueryResultRowBatch.displayName = 'proto.db.v1.TypedQueryResultRowBatch';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TypedQueryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.db.v1.TypedQueryResponse.oneofGroups_);
};
goog.inherits(proto.db.v1.TypedQueryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TypedQueryResponse.displayName = 'proto.db.v1.TypedQueryResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DatabaseConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.DatabaseConfig.repeatedFields_, null);
};
goog.inherits(proto.db.v1.DatabaseConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DatabaseConfig.displayName = 'proto.db.v1.DatabaseConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.Attachment = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.Attachment, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.Attachment.displayName = 'proto.db.v1.Attachment';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ExplainResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.ExplainResponse.repeatedFields_, null);
};
goog.inherits(proto.db.v1.ExplainResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ExplainResponse.displayName = 'proto.db.v1.ExplainResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.QueryPlanNode = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.QueryPlanNode, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.QueryPlanNode.displayName = 'proto.db.v1.QueryPlanNode';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ListTablesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.ListTablesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ListTablesRequest.displayName = 'proto.db.v1.ListTablesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ListTablesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.ListTablesResponse.repeatedFields_, null);
};
goog.inherits(proto.db.v1.ListTablesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ListTablesResponse.displayName = 'proto.db.v1.ListTablesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.GetTableSchemaRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.GetTableSchemaRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.GetTableSchemaRequest.displayName = 'proto.db.v1.GetTableSchemaRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.GetDatabaseSchemaRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.GetDatabaseSchemaRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.GetDatabaseSchemaRequest.displayName = 'proto.db.v1.GetDatabaseSchemaRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TableSchema = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.TableSchema.repeatedFields_, null);
};
goog.inherits(proto.db.v1.TableSchema, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TableSchema.displayName = 'proto.db.v1.TableSchema';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ColumnSchema = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.ColumnSchema, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ColumnSchema.displayName = 'proto.db.v1.ColumnSchema';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.IndexSchema = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.IndexSchema.repeatedFields_, null);
};
goog.inherits(proto.db.v1.IndexSchema, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.IndexSchema.displayName = 'proto.db.v1.IndexSchema';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ForeignKeySchema = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.ForeignKeySchema, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ForeignKeySchema.displayName = 'proto.db.v1.ForeignKeySchema';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.TriggerSchema = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.TriggerSchema, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.TriggerSchema.displayName = 'proto.db.v1.TriggerSchema';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DatabaseSchema = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.DatabaseSchema.repeatedFields_, null);
};
goog.inherits(proto.db.v1.DatabaseSchema, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DatabaseSchema.displayName = 'proto.db.v1.DatabaseSchema';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.UpdateDatabaseConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.UpdateDatabaseConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.UpdateDatabaseConfig.displayName = 'proto.db.v1.UpdateDatabaseConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.AttachmentList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.AttachmentList.repeatedFields_, null);
};
goog.inherits(proto.db.v1.AttachmentList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.AttachmentList.displayName = 'proto.db.v1.AttachmentList';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.ExtensionList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.ExtensionList.repeatedFields_, null);
};
goog.inherits(proto.db.v1.ExtensionList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.ExtensionList.displayName = 'proto.db.v1.ExtensionList';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.PragmaMap = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.PragmaMap, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.PragmaMap.displayName = 'proto.db.v1.PragmaMap';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.InitCommandList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.db.v1.InitCommandList.repeatedFields_, null);
};
goog.inherits(proto.db.v1.InitCommandList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.InitCommandList.displayName = 'proto.db.v1.InitCommandList';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.UpdateDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.UpdateDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.UpdateDatabaseRequest.displayName = 'proto.db.v1.UpdateDatabaseRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.UpdateDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.UpdateDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.UpdateDatabaseResponse.displayName = 'proto.db.v1.UpdateDatabaseResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.AttachDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.AttachDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.AttachDatabaseRequest.displayName = 'proto.db.v1.AttachDatabaseRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.AttachDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.AttachDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.AttachDatabaseResponse.displayName = 'proto.db.v1.AttachDatabaseResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DetachDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.DetachDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DetachDatabaseRequest.displayName = 'proto.db.v1.DetachDatabaseRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.db.v1.DetachDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.db.v1.DetachDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.db.v1.DetachDatabaseResponse.displayName = 'proto.db.v1.DetachDatabaseResponse';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.VacuumRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.VacuumRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.VacuumRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.VacuumRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
intoFile: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.VacuumRequest}
 */
proto.db.v1.VacuumRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.VacuumRequest;
  return proto.db.v1.VacuumRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.VacuumRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.VacuumRequest}
 */
proto.db.v1.VacuumRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setIntoFile(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.VacuumRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.VacuumRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.VacuumRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.VacuumRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.VacuumRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.VacuumRequest} returns this
 */
proto.db.v1.VacuumRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string into_file = 2;
 * @return {string}
 */
proto.db.v1.VacuumRequest.prototype.getIntoFile = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.VacuumRequest} returns this
 */
proto.db.v1.VacuumRequest.prototype.setIntoFile = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.VacuumRequest} returns this
 */
proto.db.v1.VacuumRequest.prototype.clearIntoFile = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.VacuumRequest.prototype.hasIntoFile = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.VacuumResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.VacuumResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.VacuumResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.VacuumResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.VacuumResponse}
 */
proto.db.v1.VacuumResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.VacuumResponse;
  return proto.db.v1.VacuumResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.VacuumResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.VacuumResponse}
 */
proto.db.v1.VacuumResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.VacuumResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.VacuumResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.VacuumResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.VacuumResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.VacuumResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.VacuumResponse} returns this
 */
proto.db.v1.VacuumResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.VacuumResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.VacuumResponse} returns this
 */
proto.db.v1.VacuumResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.CheckpointRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.CheckpointRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.CheckpointRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CheckpointRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
mode: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.CheckpointRequest}
 */
proto.db.v1.CheckpointRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.CheckpointRequest;
  return proto.db.v1.CheckpointRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.CheckpointRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.CheckpointRequest}
 */
proto.db.v1.CheckpointRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    case 2:
      var value = /** @type {!proto.db.v1.CheckpointMode} */ (reader.readEnum());
      msg.setMode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.CheckpointRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.CheckpointRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.CheckpointRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CheckpointRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getMode();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.CheckpointRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CheckpointRequest} returns this
 */
proto.db.v1.CheckpointRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional CheckpointMode mode = 2;
 * @return {!proto.db.v1.CheckpointMode}
 */
proto.db.v1.CheckpointRequest.prototype.getMode = function() {
  return /** @type {!proto.db.v1.CheckpointMode} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.db.v1.CheckpointMode} value
 * @return {!proto.db.v1.CheckpointRequest} returns this
 */
proto.db.v1.CheckpointRequest.prototype.setMode = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.CheckpointResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.CheckpointResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.CheckpointResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CheckpointResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, ""),
busyCheckpoints: jspb.Message.getFieldWithDefault(msg, 3, 0),
logCheckpoints: jspb.Message.getFieldWithDefault(msg, 4, 0),
checkpointedPages: jspb.Message.getFieldWithDefault(msg, 5, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.CheckpointResponse}
 */
proto.db.v1.CheckpointResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.CheckpointResponse;
  return proto.db.v1.CheckpointResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.CheckpointResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.CheckpointResponse}
 */
proto.db.v1.CheckpointResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setBusyCheckpoints(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLogCheckpoints(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCheckpointedPages(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.CheckpointResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.CheckpointResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.CheckpointResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CheckpointResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getBusyCheckpoints();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = message.getLogCheckpoints();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = message.getCheckpointedPages();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.CheckpointResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.CheckpointResponse} returns this
 */
proto.db.v1.CheckpointResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.CheckpointResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CheckpointResponse} returns this
 */
proto.db.v1.CheckpointResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int64 busy_checkpoints = 3;
 * @return {number}
 */
proto.db.v1.CheckpointResponse.prototype.getBusyCheckpoints = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.CheckpointResponse} returns this
 */
proto.db.v1.CheckpointResponse.prototype.setBusyCheckpoints = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional int64 log_checkpoints = 4;
 * @return {number}
 */
proto.db.v1.CheckpointResponse.prototype.getLogCheckpoints = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.CheckpointResponse} returns this
 */
proto.db.v1.CheckpointResponse.prototype.setLogCheckpoints = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional int64 checkpointed_pages = 5;
 * @return {number}
 */
proto.db.v1.CheckpointResponse.prototype.getCheckpointedPages = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.CheckpointResponse} returns this
 */
proto.db.v1.CheckpointResponse.prototype.setCheckpointedPages = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.IntegrityCheckRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.IntegrityCheckRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.IntegrityCheckRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.IntegrityCheckRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
maxErrors: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.IntegrityCheckRequest}
 */
proto.db.v1.IntegrityCheckRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.IntegrityCheckRequest;
  return proto.db.v1.IntegrityCheckRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.IntegrityCheckRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.IntegrityCheckRequest}
 */
proto.db.v1.IntegrityCheckRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxErrors(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.IntegrityCheckRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.IntegrityCheckRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.IntegrityCheckRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.IntegrityCheckRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.IntegrityCheckRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.IntegrityCheckRequest} returns this
 */
proto.db.v1.IntegrityCheckRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int32 max_errors = 2;
 * @return {number}
 */
proto.db.v1.IntegrityCheckRequest.prototype.getMaxErrors = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.IntegrityCheckRequest} returns this
 */
proto.db.v1.IntegrityCheckRequest.prototype.setMaxErrors = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.IntegrityCheckRequest} returns this
 */
proto.db.v1.IntegrityCheckRequest.prototype.clearMaxErrors = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.IntegrityCheckRequest.prototype.hasMaxErrors = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.IntegrityCheckResponse.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.IntegrityCheckResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.IntegrityCheckResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.IntegrityCheckResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.IntegrityCheckResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, ""),
errorsList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.IntegrityCheckResponse}
 */
proto.db.v1.IntegrityCheckResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.IntegrityCheckResponse;
  return proto.db.v1.IntegrityCheckResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.IntegrityCheckResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.IntegrityCheckResponse}
 */
proto.db.v1.IntegrityCheckResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addErrors(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.IntegrityCheckResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.IntegrityCheckResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.IntegrityCheckResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.IntegrityCheckResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getErrorsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.IntegrityCheckResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.IntegrityCheckResponse} returns this
 */
proto.db.v1.IntegrityCheckResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.IntegrityCheckResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.IntegrityCheckResponse} returns this
 */
proto.db.v1.IntegrityCheckResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated string errors = 3;
 * @return {!Array<string>}
 */
proto.db.v1.IntegrityCheckResponse.prototype.getErrorsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.IntegrityCheckResponse} returns this
 */
proto.db.v1.IntegrityCheckResponse.prototype.setErrorsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.IntegrityCheckResponse} returns this
 */
proto.db.v1.IntegrityCheckResponse.prototype.addErrors = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.IntegrityCheckResponse} returns this
 */
proto.db.v1.IntegrityCheckResponse.prototype.clearErrorsList = function() {
  return this.setErrorsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.CreateUserRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.CreateUserRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.CreateUserRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateUserRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
username: jspb.Message.getFieldWithDefault(msg, 1, ""),
password: jspb.Message.getFieldWithDefault(msg, 2, ""),
role: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.CreateUserRequest}
 */
proto.db.v1.CreateUserRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.CreateUserRequest;
  return proto.db.v1.CreateUserRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.CreateUserRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.CreateUserRequest}
 */
proto.db.v1.CreateUserRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setPassword(value);
      break;
    case 3:
      var value = /** @type {!proto.db.v1.Role} */ (reader.readEnum());
      msg.setRole(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.CreateUserRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.CreateUserRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.CreateUserRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateUserRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPassword();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getRole();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional string username = 1;
 * @return {string}
 */
proto.db.v1.CreateUserRequest.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateUserRequest} returns this
 */
proto.db.v1.CreateUserRequest.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string password = 2;
 * @return {string}
 */
proto.db.v1.CreateUserRequest.prototype.getPassword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateUserRequest} returns this
 */
proto.db.v1.CreateUserRequest.prototype.setPassword = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional Role role = 3;
 * @return {!proto.db.v1.Role}
 */
proto.db.v1.CreateUserRequest.prototype.getRole = function() {
  return /** @type {!proto.db.v1.Role} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.db.v1.Role} value
 * @return {!proto.db.v1.CreateUserRequest} returns this
 */
proto.db.v1.CreateUserRequest.prototype.setRole = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.CreateUserResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.CreateUserResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.CreateUserResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateUserResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
userId: jspb.Message.getFieldWithDefault(msg, 1, 0),
createdAt: (f = msg.getCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
username: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.CreateUserResponse}
 */
proto.db.v1.CreateUserResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.CreateUserResponse;
  return proto.db.v1.CreateUserResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.CreateUserResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.CreateUserResponse}
 */
proto.db.v1.CreateUserResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setUserId(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedAt(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.CreateUserResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.CreateUserResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.CreateUserResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateUserResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUserId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getCreatedAt();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional int64 user_id = 1;
 * @return {number}
 */
proto.db.v1.CreateUserResponse.prototype.getUserId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.CreateUserResponse} returns this
 */
proto.db.v1.CreateUserResponse.prototype.setUserId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp created_at = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.db.v1.CreateUserResponse.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.db.v1.CreateUserResponse} returns this
*/
proto.db.v1.CreateUserResponse.prototype.setCreatedAt = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.CreateUserResponse} returns this
 */
proto.db.v1.CreateUserResponse.prototype.clearCreatedAt = function() {
  return this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.CreateUserResponse.prototype.hasCreatedAt = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string username = 3;
 * @return {string}
 */
proto.db.v1.CreateUserResponse.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateUserResponse} returns this
 */
proto.db.v1.CreateUserResponse.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DeleteUserRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DeleteUserRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DeleteUserRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DeleteUserRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
username: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DeleteUserRequest}
 */
proto.db.v1.DeleteUserRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DeleteUserRequest;
  return proto.db.v1.DeleteUserRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DeleteUserRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DeleteUserRequest}
 */
proto.db.v1.DeleteUserRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DeleteUserRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DeleteUserRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DeleteUserRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DeleteUserRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string username = 1;
 * @return {string}
 */
proto.db.v1.DeleteUserRequest.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DeleteUserRequest} returns this
 */
proto.db.v1.DeleteUserRequest.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DeleteUserResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DeleteUserResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DeleteUserResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DeleteUserResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DeleteUserResponse}
 */
proto.db.v1.DeleteUserResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DeleteUserResponse;
  return proto.db.v1.DeleteUserResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DeleteUserResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DeleteUserResponse}
 */
proto.db.v1.DeleteUserResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DeleteUserResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DeleteUserResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DeleteUserResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DeleteUserResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.DeleteUserResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.DeleteUserResponse} returns this
 */
proto.db.v1.DeleteUserResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.UpdatePasswordRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.UpdatePasswordRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.UpdatePasswordRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdatePasswordRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
username: jspb.Message.getFieldWithDefault(msg, 1, ""),
newPassword: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.UpdatePasswordRequest}
 */
proto.db.v1.UpdatePasswordRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.UpdatePasswordRequest;
  return proto.db.v1.UpdatePasswordRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.UpdatePasswordRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.UpdatePasswordRequest}
 */
proto.db.v1.UpdatePasswordRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setNewPassword(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.UpdatePasswordRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.UpdatePasswordRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.UpdatePasswordRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdatePasswordRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getNewPassword();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string username = 1;
 * @return {string}
 */
proto.db.v1.UpdatePasswordRequest.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.UpdatePasswordRequest} returns this
 */
proto.db.v1.UpdatePasswordRequest.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string new_password = 2;
 * @return {string}
 */
proto.db.v1.UpdatePasswordRequest.prototype.getNewPassword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.UpdatePasswordRequest} returns this
 */
proto.db.v1.UpdatePasswordRequest.prototype.setNewPassword = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.UpdatePasswordResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.UpdatePasswordResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.UpdatePasswordResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdatePasswordResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.UpdatePasswordResponse}
 */
proto.db.v1.UpdatePasswordResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.UpdatePasswordResponse;
  return proto.db.v1.UpdatePasswordResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.UpdatePasswordResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.UpdatePasswordResponse}
 */
proto.db.v1.UpdatePasswordResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.UpdatePasswordResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.UpdatePasswordResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.UpdatePasswordResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdatePasswordResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.UpdatePasswordResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.UpdatePasswordResponse} returns this
 */
proto.db.v1.UpdatePasswordResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ListUsersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ListUsersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ListUsersRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListUsersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ListUsersRequest}
 */
proto.db.v1.ListUsersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ListUsersRequest;
  return proto.db.v1.ListUsersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ListUsersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ListUsersRequest}
 */
proto.db.v1.ListUsersRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ListUsersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ListUsersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ListUsersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListUsersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.ListUsersResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ListUsersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ListUsersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ListUsersResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListUsersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
usersList: jspb.Message.toObjectList(msg.getUsersList(),
    proto.db.v1.User.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ListUsersResponse}
 */
proto.db.v1.ListUsersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ListUsersResponse;
  return proto.db.v1.ListUsersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ListUsersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ListUsersResponse}
 */
proto.db.v1.ListUsersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.User;
      reader.readMessage(value,proto.db.v1.User.deserializeBinaryFromReader);
      msg.addUsers(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ListUsersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ListUsersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ListUsersResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListUsersResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.User.serializeBinaryToWriter
    );
  }
};


/**
 * repeated User users = 1;
 * @return {!Array<!proto.db.v1.User>}
 */
proto.db.v1.ListUsersResponse.prototype.getUsersList = function() {
  return /** @type{!Array<!proto.db.v1.User>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.User, 1));
};


/**
 * @param {!Array<!proto.db.v1.User>} value
 * @return {!proto.db.v1.ListUsersResponse} returns this
*/
proto.db.v1.ListUsersResponse.prototype.setUsersList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.User=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.User}
 */
proto.db.v1.ListUsersResponse.prototype.addUsers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.User, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.ListUsersResponse} returns this
 */
proto.db.v1.ListUsersResponse.prototype.clearUsersList = function() {
  return this.setUsersList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.UpdateUserRoleRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.UpdateUserRoleRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.UpdateUserRoleRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateUserRoleRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
username: jspb.Message.getFieldWithDefault(msg, 1, ""),
role: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.UpdateUserRoleRequest}
 */
proto.db.v1.UpdateUserRoleRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.UpdateUserRoleRequest;
  return proto.db.v1.UpdateUserRoleRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.UpdateUserRoleRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.UpdateUserRoleRequest}
 */
proto.db.v1.UpdateUserRoleRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    case 2:
      var value = /** @type {!proto.db.v1.Role} */ (reader.readEnum());
      msg.setRole(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.UpdateUserRoleRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.UpdateUserRoleRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.UpdateUserRoleRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateUserRoleRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRole();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional string username = 1;
 * @return {string}
 */
proto.db.v1.UpdateUserRoleRequest.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.UpdateUserRoleRequest} returns this
 */
proto.db.v1.UpdateUserRoleRequest.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional Role role = 2;
 * @return {!proto.db.v1.Role}
 */
proto.db.v1.UpdateUserRoleRequest.prototype.getRole = function() {
  return /** @type {!proto.db.v1.Role} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.db.v1.Role} value
 * @return {!proto.db.v1.UpdateUserRoleRequest} returns this
 */
proto.db.v1.UpdateUserRoleRequest.prototype.setRole = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.UpdateUserRoleResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.UpdateUserRoleResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.UpdateUserRoleResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateUserRoleResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.UpdateUserRoleResponse}
 */
proto.db.v1.UpdateUserRoleResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.UpdateUserRoleResponse;
  return proto.db.v1.UpdateUserRoleResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.UpdateUserRoleResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.UpdateUserRoleResponse}
 */
proto.db.v1.UpdateUserRoleResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.UpdateUserRoleResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.UpdateUserRoleResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.UpdateUserRoleResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateUserRoleResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.UpdateUserRoleResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.UpdateUserRoleResponse} returns this
 */
proto.db.v1.UpdateUserRoleResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.CreateApiKeyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.CreateApiKeyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.CreateApiKeyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateApiKeyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
username: jspb.Message.getFieldWithDefault(msg, 1, ""),
name: jspb.Message.getFieldWithDefault(msg, 2, ""),
expiresAt: (f = msg.getExpiresAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.CreateApiKeyRequest}
 */
proto.db.v1.CreateApiKeyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.CreateApiKeyRequest;
  return proto.db.v1.CreateApiKeyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.CreateApiKeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.CreateApiKeyRequest}
 */
proto.db.v1.CreateApiKeyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 3:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setExpiresAt(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.CreateApiKeyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.CreateApiKeyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.CreateApiKeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateApiKeyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getExpiresAt();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional string username = 1;
 * @return {string}
 */
proto.db.v1.CreateApiKeyRequest.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateApiKeyRequest} returns this
 */
proto.db.v1.CreateApiKeyRequest.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.db.v1.CreateApiKeyRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateApiKeyRequest} returns this
 */
proto.db.v1.CreateApiKeyRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.Timestamp expires_at = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.db.v1.CreateApiKeyRequest.prototype.getExpiresAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.db.v1.CreateApiKeyRequest} returns this
*/
proto.db.v1.CreateApiKeyRequest.prototype.setExpiresAt = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.CreateApiKeyRequest} returns this
 */
proto.db.v1.CreateApiKeyRequest.prototype.clearExpiresAt = function() {
  return this.setExpiresAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.CreateApiKeyRequest.prototype.hasExpiresAt = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.CreateApiKeyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.CreateApiKeyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.CreateApiKeyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateApiKeyResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
apiKey: jspb.Message.getFieldWithDefault(msg, 1, ""),
keyId: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.CreateApiKeyResponse}
 */
proto.db.v1.CreateApiKeyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.CreateApiKeyResponse;
  return proto.db.v1.CreateApiKeyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.CreateApiKeyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.CreateApiKeyResponse}
 */
proto.db.v1.CreateApiKeyResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setApiKey(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setKeyId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.CreateApiKeyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.CreateApiKeyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.CreateApiKeyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateApiKeyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getApiKey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKeyId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string api_key = 1;
 * @return {string}
 */
proto.db.v1.CreateApiKeyResponse.prototype.getApiKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateApiKeyResponse} returns this
 */
proto.db.v1.CreateApiKeyResponse.prototype.setApiKey = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string key_id = 2;
 * @return {string}
 */
proto.db.v1.CreateApiKeyResponse.prototype.getKeyId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateApiKeyResponse} returns this
 */
proto.db.v1.CreateApiKeyResponse.prototype.setKeyId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ListApiKeysRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ListApiKeysRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ListApiKeysRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListApiKeysRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
username: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ListApiKeysRequest}
 */
proto.db.v1.ListApiKeysRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ListApiKeysRequest;
  return proto.db.v1.ListApiKeysRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ListApiKeysRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ListApiKeysRequest}
 */
proto.db.v1.ListApiKeysRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ListApiKeysRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ListApiKeysRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ListApiKeysRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListApiKeysRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string username = 1;
 * @return {string}
 */
proto.db.v1.ListApiKeysRequest.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ListApiKeysRequest} returns this
 */
proto.db.v1.ListApiKeysRequest.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.ListApiKeysResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ListApiKeysResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ListApiKeysResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ListApiKeysResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListApiKeysResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
keysList: jspb.Message.toObjectList(msg.getKeysList(),
    proto.db.v1.ListApiKeysResponse.ApiKeySummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ListApiKeysResponse}
 */
proto.db.v1.ListApiKeysResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ListApiKeysResponse;
  return proto.db.v1.ListApiKeysResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ListApiKeysResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ListApiKeysResponse}
 */
proto.db.v1.ListApiKeysResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.ListApiKeysResponse.ApiKeySummary;
      reader.readMessage(value,proto.db.v1.ListApiKeysResponse.ApiKeySummary.deserializeBinaryFromReader);
      msg.addKeys(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ListApiKeysResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ListApiKeysResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ListApiKeysResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListApiKeysResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getKeysList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.ListApiKeysResponse.ApiKeySummary.serializeBinaryToWriter
    );
  }
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ListApiKeysResponse.ApiKeySummary.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ListApiKeysResponse.ApiKeySummary} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, ""),
name: jspb.Message.getFieldWithDefault(msg, 2, ""),
prefix: jspb.Message.getFieldWithDefault(msg, 3, ""),
createdAt: (f = msg.getCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ListApiKeysResponse.ApiKeySummary}
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ListApiKeysResponse.ApiKeySummary;
  return proto.db.v1.ListApiKeysResponse.ApiKeySummary.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ListApiKeysResponse.ApiKeySummary} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ListApiKeysResponse.ApiKeySummary}
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setPrefix(value);
      break;
    case 4:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedAt(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ListApiKeysResponse.ApiKeySummary.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ListApiKeysResponse.ApiKeySummary} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getPrefix();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getCreatedAt();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ListApiKeysResponse.ApiKeySummary} returns this
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ListApiKeysResponse.ApiKeySummary} returns this
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string prefix = 3;
 * @return {string}
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.getPrefix = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ListApiKeysResponse.ApiKeySummary} returns this
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.setPrefix = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional google.protobuf.Timestamp created_at = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 4));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.db.v1.ListApiKeysResponse.ApiKeySummary} returns this
*/
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.setCreatedAt = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.ListApiKeysResponse.ApiKeySummary} returns this
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.clearCreatedAt = function() {
  return this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.ListApiKeysResponse.ApiKeySummary.prototype.hasCreatedAt = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * repeated ApiKeySummary keys = 1;
 * @return {!Array<!proto.db.v1.ListApiKeysResponse.ApiKeySummary>}
 */
proto.db.v1.ListApiKeysResponse.prototype.getKeysList = function() {
  return /** @type{!Array<!proto.db.v1.ListApiKeysResponse.ApiKeySummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.ListApiKeysResponse.ApiKeySummary, 1));
};


/**
 * @param {!Array<!proto.db.v1.ListApiKeysResponse.ApiKeySummary>} value
 * @return {!proto.db.v1.ListApiKeysResponse} returns this
*/
proto.db.v1.ListApiKeysResponse.prototype.setKeysList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.ListApiKeysResponse.ApiKeySummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.ListApiKeysResponse.ApiKeySummary}
 */
proto.db.v1.ListApiKeysResponse.prototype.addKeys = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.ListApiKeysResponse.ApiKeySummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.ListApiKeysResponse} returns this
 */
proto.db.v1.ListApiKeysResponse.prototype.clearKeysList = function() {
  return this.setKeysList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ListDatabasesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ListDatabasesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ListDatabasesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListDatabasesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ListDatabasesRequest}
 */
proto.db.v1.ListDatabasesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ListDatabasesRequest;
  return proto.db.v1.ListDatabasesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ListDatabasesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ListDatabasesRequest}
 */
proto.db.v1.ListDatabasesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ListDatabasesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ListDatabasesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ListDatabasesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListDatabasesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.ListDatabasesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ListDatabasesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ListDatabasesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ListDatabasesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListDatabasesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
databasesList: jspb.Message.toObjectList(msg.getDatabasesList(),
    proto.db.v1.DatabaseInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ListDatabasesResponse}
 */
proto.db.v1.ListDatabasesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ListDatabasesResponse;
  return proto.db.v1.ListDatabasesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ListDatabasesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ListDatabasesResponse}
 */
proto.db.v1.ListDatabasesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.DatabaseInfo;
      reader.readMessage(value,proto.db.v1.DatabaseInfo.deserializeBinaryFromReader);
      msg.addDatabases(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ListDatabasesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ListDatabasesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ListDatabasesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListDatabasesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabasesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.DatabaseInfo.serializeBinaryToWriter
    );
  }
};


/**
 * repeated DatabaseInfo databases = 1;
 * @return {!Array<!proto.db.v1.DatabaseInfo>}
 */
proto.db.v1.ListDatabasesResponse.prototype.getDatabasesList = function() {
  return /** @type{!Array<!proto.db.v1.DatabaseInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.DatabaseInfo, 1));
};


/**
 * @param {!Array<!proto.db.v1.DatabaseInfo>} value
 * @return {!proto.db.v1.ListDatabasesResponse} returns this
*/
proto.db.v1.ListDatabasesResponse.prototype.setDatabasesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.DatabaseInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.DatabaseInfo}
 */
proto.db.v1.ListDatabasesResponse.prototype.addDatabases = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.DatabaseInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.ListDatabasesResponse} returns this
 */
proto.db.v1.ListDatabasesResponse.prototype.clearDatabasesList = function() {
  return this.setDatabasesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.DatabaseInfo.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DatabaseInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DatabaseInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DatabaseInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DatabaseInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
path: jspb.Message.getFieldWithDefault(msg, 2, ""),
isManaged: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
currentAttachmentsList: jspb.Message.toObjectList(msg.getCurrentAttachmentsList(),
    proto.db.v1.Attachment.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DatabaseInfo}
 */
proto.db.v1.DatabaseInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DatabaseInfo;
  return proto.db.v1.DatabaseInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DatabaseInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DatabaseInfo}
 */
proto.db.v1.DatabaseInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setPath(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsManaged(value);
      break;
    case 4:
      var value = new proto.db.v1.Attachment;
      reader.readMessage(value,proto.db.v1.Attachment.deserializeBinaryFromReader);
      msg.addCurrentAttachments(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DatabaseInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DatabaseInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DatabaseInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DatabaseInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPath();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getIsManaged();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getCurrentAttachmentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.db.v1.Attachment.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.DatabaseInfo.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DatabaseInfo} returns this
 */
proto.db.v1.DatabaseInfo.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string path = 2;
 * @return {string}
 */
proto.db.v1.DatabaseInfo.prototype.getPath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DatabaseInfo} returns this
 */
proto.db.v1.DatabaseInfo.prototype.setPath = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool is_managed = 3;
 * @return {boolean}
 */
proto.db.v1.DatabaseInfo.prototype.getIsManaged = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.DatabaseInfo} returns this
 */
proto.db.v1.DatabaseInfo.prototype.setIsManaged = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * repeated Attachment current_attachments = 4;
 * @return {!Array<!proto.db.v1.Attachment>}
 */
proto.db.v1.DatabaseInfo.prototype.getCurrentAttachmentsList = function() {
  return /** @type{!Array<!proto.db.v1.Attachment>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.Attachment, 4));
};


/**
 * @param {!Array<!proto.db.v1.Attachment>} value
 * @return {!proto.db.v1.DatabaseInfo} returns this
*/
proto.db.v1.DatabaseInfo.prototype.setCurrentAttachmentsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.db.v1.Attachment=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.Attachment}
 */
proto.db.v1.DatabaseInfo.prototype.addCurrentAttachments = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.db.v1.Attachment, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.DatabaseInfo} returns this
 */
proto.db.v1.DatabaseInfo.prototype.clearCurrentAttachmentsList = function() {
  return this.setCurrentAttachmentsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.LoginRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.LoginRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.LoginRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.LoginRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
username: jspb.Message.getFieldWithDefault(msg, 1, ""),
password: jspb.Message.getFieldWithDefault(msg, 2, ""),
sessionDuration: (f = msg.getSessionDuration()) && google_protobuf_duration_pb.Duration.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.LoginRequest}
 */
proto.db.v1.LoginRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.LoginRequest;
  return proto.db.v1.LoginRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.LoginRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.LoginRequest}
 */
proto.db.v1.LoginRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setPassword(value);
      break;
    case 3:
      var value = new google_protobuf_duration_pb.Duration;
      reader.readMessage(value,google_protobuf_duration_pb.Duration.deserializeBinaryFromReader);
      msg.setSessionDuration(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.LoginRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.LoginRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.LoginRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.LoginRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPassword();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSessionDuration();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_duration_pb.Duration.serializeBinaryToWriter
    );
  }
};


/**
 * optional string username = 1;
 * @return {string}
 */
proto.db.v1.LoginRequest.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.LoginRequest} returns this
 */
proto.db.v1.LoginRequest.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string password = 2;
 * @return {string}
 */
proto.db.v1.LoginRequest.prototype.getPassword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.LoginRequest} returns this
 */
proto.db.v1.LoginRequest.prototype.setPassword = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.Duration session_duration = 3;
 * @return {?proto.google.protobuf.Duration}
 */
proto.db.v1.LoginRequest.prototype.getSessionDuration = function() {
  return /** @type{?proto.google.protobuf.Duration} */ (
    jspb.Message.getWrapperField(this, google_protobuf_duration_pb.Duration, 3));
};


/**
 * @param {?proto.google.protobuf.Duration|undefined} value
 * @return {!proto.db.v1.LoginRequest} returns this
*/
proto.db.v1.LoginRequest.prototype.setSessionDuration = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.LoginRequest} returns this
 */
proto.db.v1.LoginRequest.prototype.clearSessionDuration = function() {
  return this.setSessionDuration(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.LoginRequest.prototype.hasSessionDuration = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.LoginResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.LoginResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.LoginResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.LoginResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
apiKey: jspb.Message.getFieldWithDefault(msg, 1, ""),
expiresAt: (f = msg.getExpiresAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
user: (f = msg.getUser()) && proto.db.v1.User.toObject(includeInstance, f),
keyId: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.LoginResponse}
 */
proto.db.v1.LoginResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.LoginResponse;
  return proto.db.v1.LoginResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.LoginResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.LoginResponse}
 */
proto.db.v1.LoginResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setApiKey(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setExpiresAt(value);
      break;
    case 3:
      var value = new proto.db.v1.User;
      reader.readMessage(value,proto.db.v1.User.deserializeBinaryFromReader);
      msg.setUser(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setKeyId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.LoginResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.LoginResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.LoginResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.LoginResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getApiKey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getExpiresAt();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getUser();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.User.serializeBinaryToWriter
    );
  }
  f = message.getKeyId();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string api_key = 1;
 * @return {string}
 */
proto.db.v1.LoginResponse.prototype.getApiKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.LoginResponse} returns this
 */
proto.db.v1.LoginResponse.prototype.setApiKey = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp expires_at = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.db.v1.LoginResponse.prototype.getExpiresAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.db.v1.LoginResponse} returns this
*/
proto.db.v1.LoginResponse.prototype.setExpiresAt = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.LoginResponse} returns this
 */
proto.db.v1.LoginResponse.prototype.clearExpiresAt = function() {
  return this.setExpiresAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.LoginResponse.prototype.hasExpiresAt = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional User user = 3;
 * @return {?proto.db.v1.User}
 */
proto.db.v1.LoginResponse.prototype.getUser = function() {
  return /** @type{?proto.db.v1.User} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.User, 3));
};


/**
 * @param {?proto.db.v1.User|undefined} value
 * @return {!proto.db.v1.LoginResponse} returns this
*/
proto.db.v1.LoginResponse.prototype.setUser = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.LoginResponse} returns this
 */
proto.db.v1.LoginResponse.prototype.clearUser = function() {
  return this.setUser(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.LoginResponse.prototype.hasUser = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string key_id = 4;
 * @return {string}
 */
proto.db.v1.LoginResponse.prototype.getKeyId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.LoginResponse} returns this
 */
proto.db.v1.LoginResponse.prototype.setKeyId = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.LogoutRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.LogoutRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.LogoutRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.LogoutRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
keyId: jspb.Message.getFieldWithDefault(msg, 1, ""),
username: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.LogoutRequest}
 */
proto.db.v1.LogoutRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.LogoutRequest;
  return proto.db.v1.LogoutRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.LogoutRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.LogoutRequest}
 */
proto.db.v1.LogoutRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setKeyId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.LogoutRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.LogoutRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.LogoutRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.LogoutRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getKeyId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string key_id = 1;
 * @return {string}
 */
proto.db.v1.LogoutRequest.prototype.getKeyId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.LogoutRequest} returns this
 */
proto.db.v1.LogoutRequest.prototype.setKeyId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string username = 2;
 * @return {string}
 */
proto.db.v1.LogoutRequest.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.LogoutRequest} returns this
 */
proto.db.v1.LogoutRequest.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.LogoutResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.LogoutResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.LogoutResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.LogoutResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.LogoutResponse}
 */
proto.db.v1.LogoutResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.LogoutResponse;
  return proto.db.v1.LogoutResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.LogoutResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.LogoutResponse}
 */
proto.db.v1.LogoutResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.LogoutResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.LogoutResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.LogoutResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.LogoutResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.LogoutResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.LogoutResponse} returns this
 */
proto.db.v1.LogoutResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.User.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.User.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.User} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.User.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
username: jspb.Message.getFieldWithDefault(msg, 2, ""),
role: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.User}
 */
proto.db.v1.User.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.User;
  return proto.db.v1.User.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.User} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.User}
 */
proto.db.v1.User.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    case 3:
      var value = /** @type {!proto.db.v1.Role} */ (reader.readEnum());
      msg.setRole(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.User.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.User.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.User} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.User.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getRole();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional int64 id = 1;
 * @return {number}
 */
proto.db.v1.User.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.User} returns this
 */
proto.db.v1.User.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string username = 2;
 * @return {string}
 */
proto.db.v1.User.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.User} returns this
 */
proto.db.v1.User.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional Role role = 3;
 * @return {!proto.db.v1.Role}
 */
proto.db.v1.User.prototype.getRole = function() {
  return /** @type {!proto.db.v1.Role} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.db.v1.Role} value
 * @return {!proto.db.v1.User} returns this
 */
proto.db.v1.User.prototype.setRole = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.RevokeApiKeyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.RevokeApiKeyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.RevokeApiKeyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RevokeApiKeyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
keyId: jspb.Message.getFieldWithDefault(msg, 1, ""),
username: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.RevokeApiKeyRequest}
 */
proto.db.v1.RevokeApiKeyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.RevokeApiKeyRequest;
  return proto.db.v1.RevokeApiKeyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.RevokeApiKeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.RevokeApiKeyRequest}
 */
proto.db.v1.RevokeApiKeyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setKeyId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setUsername(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.RevokeApiKeyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.RevokeApiKeyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.RevokeApiKeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RevokeApiKeyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getKeyId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getUsername();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string key_id = 1;
 * @return {string}
 */
proto.db.v1.RevokeApiKeyRequest.prototype.getKeyId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.RevokeApiKeyRequest} returns this
 */
proto.db.v1.RevokeApiKeyRequest.prototype.setKeyId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string username = 2;
 * @return {string}
 */
proto.db.v1.RevokeApiKeyRequest.prototype.getUsername = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.RevokeApiKeyRequest} returns this
 */
proto.db.v1.RevokeApiKeyRequest.prototype.setUsername = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.RevokeApiKeyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.RevokeApiKeyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.RevokeApiKeyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RevokeApiKeyResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.RevokeApiKeyResponse}
 */
proto.db.v1.RevokeApiKeyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.RevokeApiKeyResponse;
  return proto.db.v1.RevokeApiKeyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.RevokeApiKeyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.RevokeApiKeyResponse}
 */
proto.db.v1.RevokeApiKeyResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.RevokeApiKeyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.RevokeApiKeyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.RevokeApiKeyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RevokeApiKeyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.RevokeApiKeyResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.RevokeApiKeyResponse} returns this
 */
proto.db.v1.RevokeApiKeyResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.BackupDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.BackupDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.BackupDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BackupDatabaseRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.BackupDatabaseRequest}
 */
proto.db.v1.BackupDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.BackupDatabaseRequest;
  return proto.db.v1.BackupDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.BackupDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.BackupDatabaseRequest}
 */
proto.db.v1.BackupDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.BackupDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.BackupDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.BackupDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BackupDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.BackupDatabaseRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.BackupDatabaseRequest} returns this
 */
proto.db.v1.BackupDatabaseRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.BackupDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.BackupDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.BackupDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BackupDatabaseResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
chunk: msg.getChunk_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.BackupDatabaseResponse}
 */
proto.db.v1.BackupDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.BackupDatabaseResponse;
  return proto.db.v1.BackupDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.BackupDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.BackupDatabaseResponse}
 */
proto.db.v1.BackupDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setChunk(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.BackupDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.BackupDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.BackupDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BackupDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChunk_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes chunk = 1;
 * @return {!(string|Uint8Array)}
 */
proto.db.v1.BackupDatabaseResponse.prototype.getChunk = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes chunk = 1;
 * This is a type-conversion wrapper around `getChunk()`
 * @return {string}
 */
proto.db.v1.BackupDatabaseResponse.prototype.getChunk_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getChunk()));
};


/**
 * optional bytes chunk = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getChunk()`
 * @return {!Uint8Array}
 */
proto.db.v1.BackupDatabaseResponse.prototype.getChunk_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getChunk()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.db.v1.BackupDatabaseResponse} returns this
 */
proto.db.v1.BackupDatabaseResponse.prototype.setChunk = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.db.v1.RestoreDatabaseRequest.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.db.v1.RestoreDatabaseRequest.PayloadCase = {
  PAYLOAD_NOT_SET: 0,
  DATABASE_NAME: 1,
  CHUNK: 2
};

/**
 * @return {proto.db.v1.RestoreDatabaseRequest.PayloadCase}
 */
proto.db.v1.RestoreDatabaseRequest.prototype.getPayloadCase = function() {
  return /** @type {proto.db.v1.RestoreDatabaseRequest.PayloadCase} */(jspb.Message.computeOneofCase(this, proto.db.v1.RestoreDatabaseRequest.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.RestoreDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.RestoreDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.RestoreDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RestoreDatabaseRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
databaseName: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
chunk: msg.getChunk_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.RestoreDatabaseRequest}
 */
proto.db.v1.RestoreDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.RestoreDatabaseRequest;
  return proto.db.v1.RestoreDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.RestoreDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.RestoreDatabaseRequest}
 */
proto.db.v1.RestoreDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabaseName(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setChunk(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.RestoreDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.RestoreDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.RestoreDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RestoreDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional string database_name = 1;
 * @return {string}
 */
proto.db.v1.RestoreDatabaseRequest.prototype.getDatabaseName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.RestoreDatabaseRequest} returns this
 */
proto.db.v1.RestoreDatabaseRequest.prototype.setDatabaseName = function(value) {
  return jspb.Message.setOneofField(this, 1, proto.db.v1.RestoreDatabaseRequest.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.RestoreDatabaseRequest} returns this
 */
proto.db.v1.RestoreDatabaseRequest.prototype.clearDatabaseName = function() {
  return jspb.Message.setOneofField(this, 1, proto.db.v1.RestoreDatabaseRequest.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.RestoreDatabaseRequest.prototype.hasDatabaseName = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bytes chunk = 2;
 * @return {!(string|Uint8Array)}
 */
proto.db.v1.RestoreDatabaseRequest.prototype.getChunk = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes chunk = 2;
 * This is a type-conversion wrapper around `getChunk()`
 * @return {string}
 */
proto.db.v1.RestoreDatabaseRequest.prototype.getChunk_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getChunk()));
};


/**
 * optional bytes chunk = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getChunk()`
 * @return {!Uint8Array}
 */
proto.db.v1.RestoreDatabaseRequest.prototype.getChunk_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getChunk()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.db.v1.RestoreDatabaseRequest} returns this
 */
proto.db.v1.RestoreDatabaseRequest.prototype.setChunk = function(value) {
  return jspb.Message.setOneofField(this, 2, proto.db.v1.RestoreDatabaseRequest.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.RestoreDatabaseRequest} returns this
 */
proto.db.v1.RestoreDatabaseRequest.prototype.clearChunk = function() {
  return jspb.Message.setOneofField(this, 2, proto.db.v1.RestoreDatabaseRequest.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.RestoreDatabaseRequest.prototype.hasChunk = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.RestoreDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.RestoreDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.RestoreDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RestoreDatabaseResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
bytesWritten: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.RestoreDatabaseResponse}
 */
proto.db.v1.RestoreDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.RestoreDatabaseResponse;
  return proto.db.v1.RestoreDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.RestoreDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.RestoreDatabaseResponse}
 */
proto.db.v1.RestoreDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setBytesWritten(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.RestoreDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.RestoreDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.RestoreDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RestoreDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getBytesWritten();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.RestoreDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.RestoreDatabaseResponse} returns this
 */
proto.db.v1.RestoreDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional int64 bytes_written = 2;
 * @return {number}
 */
proto.db.v1.RestoreDatabaseResponse.prototype.getBytesWritten = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.RestoreDatabaseResponse} returns this
 */
proto.db.v1.RestoreDatabaseResponse.prototype.setBytesWritten = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.CreateDatabaseRequest.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.CreateDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.CreateDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.CreateDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateDatabaseRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
isEncrypted: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
key: jspb.Message.getFieldWithDefault(msg, 3, ""),
extensionsList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
pragmasMap: (f = msg.getPragmasMap()) ? f.toObject(includeInstance, undefined) : [],
maxOpenConns: jspb.Message.getFieldWithDefault(msg, 6, 0),
maxIdleConns: jspb.Message.getFieldWithDefault(msg, 7, 0),
connMaxLifetimeMs: jspb.Message.getFieldWithDefault(msg, 8, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.CreateDatabaseRequest}
 */
proto.db.v1.CreateDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.CreateDatabaseRequest;
  return proto.db.v1.CreateDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.CreateDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.CreateDatabaseRequest}
 */
proto.db.v1.CreateDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsEncrypted(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setKey(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addExtensions(value);
      break;
    case 5:
      var value = msg.getPragmasMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readStringRequireUtf8, jspb.BinaryReader.prototype.readStringRequireUtf8, null, "", "");
         });
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxOpenConns(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxIdleConns(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setConnMaxLifetimeMs(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.CreateDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.CreateDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.CreateDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getIsEncrypted();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getExtensionsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
  f = message.getPragmasMap(true);
  if (f && f.getLength() > 0) {
jspb.internal.public_for_gencode.serializeMapToBinary(
    message.getPragmasMap(true),
    5,
    writer,
    jspb.BinaryWriter.prototype.writeString,
    jspb.BinaryWriter.prototype.writeString);
  }
  f = message.getMaxOpenConns();
  if (f !== 0) {
    writer.writeInt32(
      6,
      f
    );
  }
  f = message.getMaxIdleConns();
  if (f !== 0) {
    writer.writeInt32(
      7,
      f
    );
  }
  f = message.getConnMaxLifetimeMs();
  if (f !== 0) {
    writer.writeInt32(
      8,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.CreateDatabaseRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool is_encrypted = 2;
 * @return {boolean}
 */
proto.db.v1.CreateDatabaseRequest.prototype.getIsEncrypted = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.setIsEncrypted = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional string key = 3;
 * @return {string}
 */
proto.db.v1.CreateDatabaseRequest.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * repeated string extensions = 4;
 * @return {!Array<string>}
 */
proto.db.v1.CreateDatabaseRequest.prototype.getExtensionsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.setExtensionsList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.addExtensions = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.clearExtensionsList = function() {
  return this.setExtensionsList([]);
};


/**
 * map<string, string> pragmas = 5;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.db.v1.CreateDatabaseRequest.prototype.getPragmasMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 5, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.clearPragmasMap = function() {
  this.getPragmasMap().clear();
  return this;
};


/**
 * optional int32 max_open_conns = 6;
 * @return {number}
 */
proto.db.v1.CreateDatabaseRequest.prototype.getMaxOpenConns = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.setMaxOpenConns = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional int32 max_idle_conns = 7;
 * @return {number}
 */
proto.db.v1.CreateDatabaseRequest.prototype.getMaxIdleConns = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.setMaxIdleConns = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * optional int32 conn_max_lifetime_ms = 8;
 * @return {number}
 */
proto.db.v1.CreateDatabaseRequest.prototype.getConnMaxLifetimeMs = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.CreateDatabaseRequest} returns this
 */
proto.db.v1.CreateDatabaseRequest.prototype.setConnMaxLifetimeMs = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.CreateDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.CreateDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.CreateDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateDatabaseResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.CreateDatabaseResponse}
 */
proto.db.v1.CreateDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.CreateDatabaseResponse;
  return proto.db.v1.CreateDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.CreateDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.CreateDatabaseResponse}
 */
proto.db.v1.CreateDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.CreateDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.CreateDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.CreateDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CreateDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.CreateDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.CreateDatabaseResponse} returns this
 */
proto.db.v1.CreateDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.CreateDatabaseResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.CreateDatabaseResponse} returns this
 */
proto.db.v1.CreateDatabaseResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.MountDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.MountDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.MountDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.MountDatabaseResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.MountDatabaseResponse}
 */
proto.db.v1.MountDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.MountDatabaseResponse;
  return proto.db.v1.MountDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.MountDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.MountDatabaseResponse}
 */
proto.db.v1.MountDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.MountDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.MountDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.MountDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.MountDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.MountDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.MountDatabaseResponse} returns this
 */
proto.db.v1.MountDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.MountDatabaseResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.MountDatabaseResponse} returns this
 */
proto.db.v1.MountDatabaseResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.UnMountDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.UnMountDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.UnMountDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UnMountDatabaseRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.UnMountDatabaseRequest}
 */
proto.db.v1.UnMountDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.UnMountDatabaseRequest;
  return proto.db.v1.UnMountDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.UnMountDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.UnMountDatabaseRequest}
 */
proto.db.v1.UnMountDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.UnMountDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.UnMountDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.UnMountDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UnMountDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.UnMountDatabaseRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.UnMountDatabaseRequest} returns this
 */
proto.db.v1.UnMountDatabaseRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.UnMountDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.UnMountDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.UnMountDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UnMountDatabaseResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.UnMountDatabaseResponse}
 */
proto.db.v1.UnMountDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.UnMountDatabaseResponse;
  return proto.db.v1.UnMountDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.UnMountDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.UnMountDatabaseResponse}
 */
proto.db.v1.UnMountDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.UnMountDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.UnMountDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.UnMountDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UnMountDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.UnMountDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.UnMountDatabaseResponse} returns this
 */
proto.db.v1.UnMountDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.UnMountDatabaseResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.UnMountDatabaseResponse} returns this
 */
proto.db.v1.UnMountDatabaseResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DeleteDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DeleteDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DeleteDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DeleteDatabaseRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DeleteDatabaseRequest}
 */
proto.db.v1.DeleteDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DeleteDatabaseRequest;
  return proto.db.v1.DeleteDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DeleteDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DeleteDatabaseRequest}
 */
proto.db.v1.DeleteDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DeleteDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DeleteDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DeleteDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DeleteDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.DeleteDatabaseRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DeleteDatabaseRequest} returns this
 */
proto.db.v1.DeleteDatabaseRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DeleteDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DeleteDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DeleteDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DeleteDatabaseResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DeleteDatabaseResponse}
 */
proto.db.v1.DeleteDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DeleteDatabaseResponse;
  return proto.db.v1.DeleteDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DeleteDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DeleteDatabaseResponse}
 */
proto.db.v1.DeleteDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DeleteDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DeleteDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DeleteDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DeleteDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.DeleteDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.DeleteDatabaseResponse} returns this
 */
proto.db.v1.DeleteDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.DeleteDatabaseResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DeleteDatabaseResponse} returns this
 */
proto.db.v1.DeleteDatabaseResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.QueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.QueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.QueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, ""),
type: jspb.Message.getFieldWithDefault(msg, 3, 0),
parameters: (f = msg.getParameters()) && proto.db.v1.Parameters.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.QueryRequest}
 */
proto.db.v1.QueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.QueryRequest;
  return proto.db.v1.QueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.QueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.QueryRequest}
 */
proto.db.v1.QueryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setSql(value);
      break;
    case 3:
      var value = /** @type {!proto.db.v1.QueryType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 4:
      var value = new proto.db.v1.Parameters;
      reader.readMessage(value,proto.db.v1.Parameters.deserializeBinaryFromReader);
      msg.setParameters(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.QueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.QueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.QueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSql();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getParameters();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.db.v1.Parameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.QueryRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.QueryRequest} returns this
 */
proto.db.v1.QueryRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.db.v1.QueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.QueryRequest} returns this
 */
proto.db.v1.QueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional QueryType type = 3;
 * @return {!proto.db.v1.QueryType}
 */
proto.db.v1.QueryRequest.prototype.getType = function() {
  return /** @type {!proto.db.v1.QueryType} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.db.v1.QueryType} value
 * @return {!proto.db.v1.QueryRequest} returns this
 */
proto.db.v1.QueryRequest.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * optional Parameters parameters = 4;
 * @return {?proto.db.v1.Parameters}
 */
proto.db.v1.QueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.db.v1.Parameters} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.Parameters, 4));
};


/**
 * @param {?proto.db.v1.Parameters|undefined} value
 * @return {!proto.db.v1.QueryRequest} returns this
*/
proto.db.v1.QueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryRequest} returns this
 */
proto.db.v1.QueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryRequest.prototype.hasParameters = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.Parameters.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.Parameters.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.Parameters} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.Parameters.toObject = function(includeInstance, msg) {
  var f, obj = {
positional: (f = msg.getPositional()) && google_protobuf_struct_pb.ListValue.toObject(includeInstance, f),
named: (f = msg.getNamed()) && google_protobuf_struct_pb.Struct.toObject(includeInstance, f),
positionalHintsMap: (f = msg.getPositionalHintsMap()) ? f.toObject(includeInstance, undefined) : [],
namedHintsMap: (f = msg.getNamedHintsMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.Parameters}
 */
proto.db.v1.Parameters.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.Parameters;
  return proto.db.v1.Parameters.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.Parameters} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.Parameters}
 */
proto.db.v1.Parameters.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_struct_pb.ListValue;
      reader.readMessage(value,google_protobuf_struct_pb.ListValue.deserializeBinaryFromReader);
      msg.setPositional(value);
      break;
    case 2:
      var value = new google_protobuf_struct_pb.Struct;
      reader.readMessage(value,google_protobuf_struct_pb.Struct.deserializeBinaryFromReader);
      msg.setNamed(value);
      break;
    case 3:
      var value = msg.getPositionalHintsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readInt32, jspb.BinaryReader.prototype.readEnum, null, 0, 0);
         });
      break;
    case 4:
      var value = msg.getNamedHintsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readStringRequireUtf8, jspb.BinaryReader.prototype.readEnum, null, "", 0);
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.Parameters.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.Parameters.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.Parameters} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.Parameters.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPositional();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_struct_pb.ListValue.serializeBinaryToWriter
    );
  }
  f = message.getNamed();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_struct_pb.Struct.serializeBinaryToWriter
    );
  }
  f = message.getPositionalHintsMap(true);
  if (f && f.getLength() > 0) {
jspb.internal.public_for_gencode.serializeMapToBinary(
    message.getPositionalHintsMap(true),
    3,
    writer,
    jspb.BinaryWriter.prototype.writeInt32,
    jspb.BinaryWriter.prototype.writeEnum);
  }
  f = message.getNamedHintsMap(true);
  if (f && f.getLength() > 0) {
jspb.internal.public_for_gencode.serializeMapToBinary(
    message.getNamedHintsMap(true),
    4,
    writer,
    jspb.BinaryWriter.prototype.writeString,
    jspb.BinaryWriter.prototype.writeEnum);
  }
};


/**
 * optional google.protobuf.ListValue positional = 1;
 * @return {?proto.google.protobuf.ListValue}
 */
proto.db.v1.Parameters.prototype.getPositional = function() {
  return /** @type{?proto.google.protobuf.ListValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_struct_pb.ListValue, 1));
};


/**
 * @param {?proto.google.protobuf.ListValue|undefined} value
 * @return {!proto.db.v1.Parameters} returns this
*/
proto.db.v1.Parameters.prototype.setPositional = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.Parameters} returns this
 */
proto.db.v1.Parameters.prototype.clearPositional = function() {
  return this.setPositional(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.Parameters.prototype.hasPositional = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional google.protobuf.Struct named = 2;
 * @return {?proto.google.protobuf.Struct}
 */
proto.db.v1.Parameters.prototype.getNamed = function() {
  return /** @type{?proto.google.protobuf.Struct} */ (
    jspb.Message.getWrapperField(this, google_protobuf_struct_pb.Struct, 2));
};


/**
 * @param {?proto.google.protobuf.Struct|undefined} value
 * @return {!proto.db.v1.Parameters} returns this
*/
proto.db.v1.Parameters.prototype.setNamed = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.Parameters} returns this
 */
proto.db.v1.Parameters.prototype.clearNamed = function() {
  return this.setNamed(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.Parameters.prototype.hasNamed = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * map<int32, ColumnAffinity> positional_hints = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,!proto.db.v1.ColumnAffinity>}
 */
proto.db.v1.Parameters.prototype.getPositionalHintsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<number,!proto.db.v1.ColumnAffinity>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.db.v1.Parameters} returns this
 */
proto.db.v1.Parameters.prototype.clearPositionalHintsMap = function() {
  this.getPositionalHintsMap().clear();
  return this;
};


/**
 * map<string, ColumnAffinity> named_hints = 4;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.db.v1.ColumnAffinity>}
 */
proto.db.v1.Parameters.prototype.getNamedHintsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.db.v1.ColumnAffinity>} */ (
      jspb.Message.getMapField(this, 4, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.db.v1.Parameters} returns this
 */
proto.db.v1.Parameters.prototype.clearNamedHintsMap = function() {
  this.getNamedHintsMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.BeginTransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.BeginTransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.BeginTransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BeginTransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
timeout: (f = msg.getTimeout()) && google_protobuf_duration_pb.Duration.toObject(includeInstance, f),
mode: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.BeginTransactionRequest}
 */
proto.db.v1.BeginTransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.BeginTransactionRequest;
  return proto.db.v1.BeginTransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.BeginTransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.BeginTransactionRequest}
 */
proto.db.v1.BeginTransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    case 2:
      var value = new google_protobuf_duration_pb.Duration;
      reader.readMessage(value,google_protobuf_duration_pb.Duration.deserializeBinaryFromReader);
      msg.setTimeout(value);
      break;
    case 3:
      var value = /** @type {!proto.db.v1.TransactionMode} */ (reader.readEnum());
      msg.setMode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.BeginTransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.BeginTransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.BeginTransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BeginTransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTimeout();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_duration_pb.Duration.serializeBinaryToWriter
    );
  }
  f = message.getMode();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.BeginTransactionRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.BeginTransactionRequest} returns this
 */
proto.db.v1.BeginTransactionRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.Duration timeout = 2;
 * @return {?proto.google.protobuf.Duration}
 */
proto.db.v1.BeginTransactionRequest.prototype.getTimeout = function() {
  return /** @type{?proto.google.protobuf.Duration} */ (
    jspb.Message.getWrapperField(this, google_protobuf_duration_pb.Duration, 2));
};


/**
 * @param {?proto.google.protobuf.Duration|undefined} value
 * @return {!proto.db.v1.BeginTransactionRequest} returns this
*/
proto.db.v1.BeginTransactionRequest.prototype.setTimeout = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.BeginTransactionRequest} returns this
 */
proto.db.v1.BeginTransactionRequest.prototype.clearTimeout = function() {
  return this.setTimeout(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.BeginTransactionRequest.prototype.hasTimeout = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional TransactionMode mode = 3;
 * @return {!proto.db.v1.TransactionMode}
 */
proto.db.v1.BeginTransactionRequest.prototype.getMode = function() {
  return /** @type {!proto.db.v1.TransactionMode} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.db.v1.TransactionMode} value
 * @return {!proto.db.v1.BeginTransactionRequest} returns this
 */
proto.db.v1.BeginTransactionRequest.prototype.setMode = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.BeginTransactionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.BeginTransactionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.BeginTransactionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BeginTransactionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
transactionId: jspb.Message.getFieldWithDefault(msg, 1, ""),
expiresAt: (f = msg.getExpiresAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.BeginTransactionResponse}
 */
proto.db.v1.BeginTransactionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.BeginTransactionResponse;
  return proto.db.v1.BeginTransactionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.BeginTransactionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.BeginTransactionResponse}
 */
proto.db.v1.BeginTransactionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTransactionId(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setExpiresAt(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.BeginTransactionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.BeginTransactionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.BeginTransactionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BeginTransactionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransactionId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getExpiresAt();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional string transaction_id = 1;
 * @return {string}
 */
proto.db.v1.BeginTransactionResponse.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.BeginTransactionResponse} returns this
 */
proto.db.v1.BeginTransactionResponse.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp expires_at = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.db.v1.BeginTransactionResponse.prototype.getExpiresAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.db.v1.BeginTransactionResponse} returns this
*/
proto.db.v1.BeginTransactionResponse.prototype.setExpiresAt = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.BeginTransactionResponse} returns this
 */
proto.db.v1.BeginTransactionResponse.prototype.clearExpiresAt = function() {
  return this.setExpiresAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.BeginTransactionResponse.prototype.hasExpiresAt = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TransactionQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TransactionQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TransactionQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
transactionId: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, ""),
parameters: (f = msg.getParameters()) && proto.db.v1.Parameters.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TransactionQueryRequest}
 */
proto.db.v1.TransactionQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TransactionQueryRequest;
  return proto.db.v1.TransactionQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TransactionQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TransactionQueryRequest}
 */
proto.db.v1.TransactionQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTransactionId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setSql(value);
      break;
    case 3:
      var value = new proto.db.v1.Parameters;
      reader.readMessage(value,proto.db.v1.Parameters.deserializeBinaryFromReader);
      msg.setParameters(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TransactionQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TransactionQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TransactionQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionQueryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransactionId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSql();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getParameters();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.Parameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string transaction_id = 1;
 * @return {string}
 */
proto.db.v1.TransactionQueryRequest.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TransactionQueryRequest} returns this
 */
proto.db.v1.TransactionQueryRequest.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.db.v1.TransactionQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TransactionQueryRequest} returns this
 */
proto.db.v1.TransactionQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional Parameters parameters = 3;
 * @return {?proto.db.v1.Parameters}
 */
proto.db.v1.TransactionQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.db.v1.Parameters} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.Parameters, 3));
};


/**
 * @param {?proto.db.v1.Parameters|undefined} value
 * @return {!proto.db.v1.TransactionQueryRequest} returns this
*/
proto.db.v1.TransactionQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionQueryRequest} returns this
 */
proto.db.v1.TransactionQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionQueryRequest.prototype.hasParameters = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TransactionSavepointRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TransactionSavepointRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TransactionSavepointRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionSavepointRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
transactionId: jspb.Message.getFieldWithDefault(msg, 1, ""),
savepoint: (f = msg.getSavepoint()) && proto.db.v1.SavepointRequest.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TransactionSavepointRequest}
 */
proto.db.v1.TransactionSavepointRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TransactionSavepointRequest;
  return proto.db.v1.TransactionSavepointRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TransactionSavepointRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TransactionSavepointRequest}
 */
proto.db.v1.TransactionSavepointRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTransactionId(value);
      break;
    case 2:
      var value = new proto.db.v1.SavepointRequest;
      reader.readMessage(value,proto.db.v1.SavepointRequest.deserializeBinaryFromReader);
      msg.setSavepoint(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TransactionSavepointRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TransactionSavepointRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TransactionSavepointRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionSavepointRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransactionId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSavepoint();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.SavepointRequest.serializeBinaryToWriter
    );
  }
};


/**
 * optional string transaction_id = 1;
 * @return {string}
 */
proto.db.v1.TransactionSavepointRequest.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TransactionSavepointRequest} returns this
 */
proto.db.v1.TransactionSavepointRequest.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional SavepointRequest savepoint = 2;
 * @return {?proto.db.v1.SavepointRequest}
 */
proto.db.v1.TransactionSavepointRequest.prototype.getSavepoint = function() {
  return /** @type{?proto.db.v1.SavepointRequest} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.SavepointRequest, 2));
};


/**
 * @param {?proto.db.v1.SavepointRequest|undefined} value
 * @return {!proto.db.v1.TransactionSavepointRequest} returns this
*/
proto.db.v1.TransactionSavepointRequest.prototype.setSavepoint = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionSavepointRequest} returns this
 */
proto.db.v1.TransactionSavepointRequest.prototype.clearSavepoint = function() {
  return this.setSavepoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionSavepointRequest.prototype.hasSavepoint = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TransactionControlRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TransactionControlRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TransactionControlRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionControlRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
transactionId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TransactionControlRequest}
 */
proto.db.v1.TransactionControlRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TransactionControlRequest;
  return proto.db.v1.TransactionControlRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TransactionControlRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TransactionControlRequest}
 */
proto.db.v1.TransactionControlRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTransactionId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TransactionControlRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TransactionControlRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TransactionControlRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionControlRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransactionId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string transaction_id = 1;
 * @return {string}
 */
proto.db.v1.TransactionControlRequest.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TransactionControlRequest} returns this
 */
proto.db.v1.TransactionControlRequest.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TransactionControlResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TransactionControlResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TransactionControlResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionControlResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TransactionControlResponse}
 */
proto.db.v1.TransactionControlResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TransactionControlResponse;
  return proto.db.v1.TransactionControlResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TransactionControlResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TransactionControlResponse}
 */
proto.db.v1.TransactionControlResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TransactionControlResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TransactionControlResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TransactionControlResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionControlResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.TransactionControlResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.TransactionControlResponse} returns this
 */
proto.db.v1.TransactionControlResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.db.v1.TransactionRequest.oneofGroups_ = [[1,2,3,4,5,7,8,9]];

/**
 * @enum {number}
 */
proto.db.v1.TransactionRequest.CommandCase = {
  COMMAND_NOT_SET: 0,
  BEGIN: 1,
  QUERY: 2,
  QUERY_STREAM: 3,
  TYPED_QUERY: 4,
  TYPED_QUERY_STREAM: 5,
  SAVEPOINT: 7,
  COMMIT: 8,
  ROLLBACK: 9
};

/**
 * @return {proto.db.v1.TransactionRequest.CommandCase}
 */
proto.db.v1.TransactionRequest.prototype.getCommandCase = function() {
  return /** @type {proto.db.v1.TransactionRequest.CommandCase} */(jspb.Message.computeOneofCase(this, proto.db.v1.TransactionRequest.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
begin: (f = msg.getBegin()) && proto.db.v1.BeginRequest.toObject(includeInstance, f),
query: (f = msg.getQuery()) && proto.db.v1.TransactionalQueryRequest.toObject(includeInstance, f),
queryStream: (f = msg.getQueryStream()) && proto.db.v1.TransactionalQueryRequest.toObject(includeInstance, f),
typedQuery: (f = msg.getTypedQuery()) && proto.db.v1.TypedTransactionalQueryRequest.toObject(includeInstance, f),
typedQueryStream: (f = msg.getTypedQueryStream()) && proto.db.v1.TypedTransactionalQueryRequest.toObject(includeInstance, f),
savepoint: (f = msg.getSavepoint()) && proto.db.v1.SavepointRequest.toObject(includeInstance, f),
commit: (f = msg.getCommit()) && google_protobuf_empty_pb.Empty.toObject(includeInstance, f),
rollback: (f = msg.getRollback()) && google_protobuf_empty_pb.Empty.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TransactionRequest}
 */
proto.db.v1.TransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TransactionRequest;
  return proto.db.v1.TransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TransactionRequest}
 */
proto.db.v1.TransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.BeginRequest;
      reader.readMessage(value,proto.db.v1.BeginRequest.deserializeBinaryFromReader);
      msg.setBegin(value);
      break;
    case 2:
      var value = new proto.db.v1.TransactionalQueryRequest;
      reader.readMessage(value,proto.db.v1.TransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setQuery(value);
      break;
    case 3:
      var value = new proto.db.v1.TransactionalQueryRequest;
      reader.readMessage(value,proto.db.v1.TransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setQueryStream(value);
      break;
    case 4:
      var value = new proto.db.v1.TypedTransactionalQueryRequest;
      reader.readMessage(value,proto.db.v1.TypedTransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setTypedQuery(value);
      break;
    case 5:
      var value = new proto.db.v1.TypedTransactionalQueryRequest;
      reader.readMessage(value,proto.db.v1.TypedTransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setTypedQueryStream(value);
      break;
    case 7:
      var value = new proto.db.v1.SavepointRequest;
      reader.readMessage(value,proto.db.v1.SavepointRequest.deserializeBinaryFromReader);
      msg.setSavepoint(value);
      break;
    case 8:
      var value = new google_protobuf_empty_pb.Empty;
      reader.readMessage(value,google_protobuf_empty_pb.Empty.deserializeBinaryFromReader);
      msg.setCommit(value);
      break;
    case 9:
      var value = new google_protobuf_empty_pb.Empty;
      reader.readMessage(value,google_protobuf_empty_pb.Empty.deserializeBinaryFromReader);
      msg.setRollback(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBegin();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.db.v1.BeginRequest.serializeBinaryToWriter
    );
  }
  f = message.getQuery();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.TransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getQueryStream();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.TransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getTypedQuery();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.db.v1.TypedTransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getTypedQueryStream();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.db.v1.TypedTransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getSavepoint();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.db.v1.SavepointRequest.serializeBinaryToWriter
    );
  }
  f = message.getCommit();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      google_protobuf_empty_pb.Empty.serializeBinaryToWriter
    );
  }
  f = message.getRollback();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      google_protobuf_empty_pb.Empty.serializeBinaryToWriter
    );
  }
};


/**
 * optional BeginRequest begin = 1;
 * @return {?proto.db.v1.BeginRequest}
 */
proto.db.v1.TransactionRequest.prototype.getBegin = function() {
  return /** @type{?proto.db.v1.BeginRequest} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.BeginRequest, 1));
};


/**
 * @param {?proto.db.v1.BeginRequest|undefined} value
 * @return {!proto.db.v1.TransactionRequest} returns this
*/
proto.db.v1.TransactionRequest.prototype.setBegin = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.db.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionRequest} returns this
 */
proto.db.v1.TransactionRequest.prototype.clearBegin = function() {
  return this.setBegin(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionRequest.prototype.hasBegin = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional TransactionalQueryRequest query = 2;
 * @return {?proto.db.v1.TransactionalQueryRequest}
 */
proto.db.v1.TransactionRequest.prototype.getQuery = function() {
  return /** @type{?proto.db.v1.TransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TransactionalQueryRequest, 2));
};


/**
 * @param {?proto.db.v1.TransactionalQueryRequest|undefined} value
 * @return {!proto.db.v1.TransactionRequest} returns this
*/
proto.db.v1.TransactionRequest.prototype.setQuery = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.db.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionRequest} returns this
 */
proto.db.v1.TransactionRequest.prototype.clearQuery = function() {
  return this.setQuery(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionRequest.prototype.hasQuery = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional TransactionalQueryRequest query_stream = 3;
 * @return {?proto.db.v1.TransactionalQueryRequest}
 */
proto.db.v1.TransactionRequest.prototype.getQueryStream = function() {
  return /** @type{?proto.db.v1.TransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TransactionalQueryRequest, 3));
};


/**
 * @param {?proto.db.v1.TransactionalQueryRequest|undefined} value
 * @return {!proto.db.v1.TransactionRequest} returns this
*/
proto.db.v1.TransactionRequest.prototype.setQueryStream = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.db.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionRequest} returns this
 */
proto.db.v1.TransactionRequest.prototype.clearQueryStream = function() {
  return this.setQueryStream(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionRequest.prototype.hasQueryStream = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional TypedTransactionalQueryRequest typed_query = 4;
 * @return {?proto.db.v1.TypedTransactionalQueryRequest}
 */
proto.db.v1.TransactionRequest.prototype.getTypedQuery = function() {
  return /** @type{?proto.db.v1.TypedTransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedTransactionalQueryRequest, 4));
};


/**
 * @param {?proto.db.v1.TypedTransactionalQueryRequest|undefined} value
 * @return {!proto.db.v1.TransactionRequest} returns this
*/
proto.db.v1.TransactionRequest.prototype.setTypedQuery = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.db.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionRequest} returns this
 */
proto.db.v1.TransactionRequest.prototype.clearTypedQuery = function() {
  return this.setTypedQuery(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionRequest.prototype.hasTypedQuery = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional TypedTransactionalQueryRequest typed_query_stream = 5;
 * @return {?proto.db.v1.TypedTransactionalQueryRequest}
 */
proto.db.v1.TransactionRequest.prototype.getTypedQueryStream = function() {
  return /** @type{?proto.db.v1.TypedTransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedTransactionalQueryRequest, 5));
};


/**
 * @param {?proto.db.v1.TypedTransactionalQueryRequest|undefined} value
 * @return {!proto.db.v1.TransactionRequest} returns this
*/
proto.db.v1.TransactionRequest.prototype.setTypedQueryStream = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.db.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionRequest} returns this
 */
proto.db.v1.TransactionRequest.prototype.clearTypedQueryStream = function() {
  return this.setTypedQueryStream(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionRequest.prototype.hasTypedQueryStream = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional SavepointRequest savepoint = 7;
 * @return {?proto.db.v1.SavepointRequest}
 */
proto.db.v1.TransactionRequest.prototype.getSavepoint = function() {
  return /** @type{?proto.db.v1.SavepointRequest} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.SavepointRequest, 7));
};


/**
 * @param {?proto.db.v1.SavepointRequest|undefined} value
 * @return {!proto.db.v1.TransactionRequest} returns this
*/
proto.db.v1.TransactionRequest.prototype.setSavepoint = function(value) {
  return jspb.Message.setOneofWrapperField(this, 7, proto.db.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionRequest} returns this
 */
proto.db.v1.TransactionRequest.prototype.clearSavepoint = function() {
  return this.setSavepoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionRequest.prototype.hasSavepoint = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional google.protobuf.Empty commit = 8;
 * @return {?proto.google.protobuf.Empty}
 */
proto.db.v1.TransactionRequest.prototype.getCommit = function() {
  return /** @type{?proto.google.protobuf.Empty} */ (
    jspb.Message.getWrapperField(this, google_protobuf_empty_pb.Empty, 8));
};


/**
 * @param {?proto.google.protobuf.Empty|undefined} value
 * @return {!proto.db.v1.TransactionRequest} returns this
*/
proto.db.v1.TransactionRequest.prototype.setCommit = function(value) {
  return jspb.Message.setOneofWrapperField(this, 8, proto.db.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionRequest} returns this
 */
proto.db.v1.TransactionRequest.prototype.clearCommit = function() {
  return this.setCommit(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionRequest.prototype.hasCommit = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional google.protobuf.Empty rollback = 9;
 * @return {?proto.google.protobuf.Empty}
 */
proto.db.v1.TransactionRequest.prototype.getRollback = function() {
  return /** @type{?proto.google.protobuf.Empty} */ (
    jspb.Message.getWrapperField(this, google_protobuf_empty_pb.Empty, 9));
};


/**
 * @param {?proto.google.protobuf.Empty|undefined} value
 * @return {!proto.db.v1.TransactionRequest} returns this
*/
proto.db.v1.TransactionRequest.prototype.setRollback = function(value) {
  return jspb.Message.setOneofWrapperField(this, 9, proto.db.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionRequest} returns this
 */
proto.db.v1.TransactionRequest.prototype.clearRollback = function() {
  return this.setRollback(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionRequest.prototype.hasRollback = function() {
  return jspb.Message.getField(this, 9) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.BeginRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.BeginRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.BeginRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BeginRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
mode: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.BeginRequest}
 */
proto.db.v1.BeginRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.BeginRequest;
  return proto.db.v1.BeginRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.BeginRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.BeginRequest}
 */
proto.db.v1.BeginRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    case 2:
      var value = /** @type {!proto.db.v1.TransactionMode} */ (reader.readEnum());
      msg.setMode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.BeginRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.BeginRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.BeginRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BeginRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getMode();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.BeginRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.BeginRequest} returns this
 */
proto.db.v1.BeginRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional TransactionMode mode = 2;
 * @return {!proto.db.v1.TransactionMode}
 */
proto.db.v1.BeginRequest.prototype.getMode = function() {
  return /** @type {!proto.db.v1.TransactionMode} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.db.v1.TransactionMode} value
 * @return {!proto.db.v1.BeginRequest} returns this
 */
proto.db.v1.BeginRequest.prototype.setMode = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TransactionalQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TransactionalQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TransactionalQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionalQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
sql: jspb.Message.getFieldWithDefault(msg, 1, ""),
parameters: (f = msg.getParameters()) && proto.db.v1.Parameters.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TransactionalQueryRequest}
 */
proto.db.v1.TransactionalQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TransactionalQueryRequest;
  return proto.db.v1.TransactionalQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TransactionalQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TransactionalQueryRequest}
 */
proto.db.v1.TransactionalQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setSql(value);
      break;
    case 2:
      var value = new proto.db.v1.Parameters;
      reader.readMessage(value,proto.db.v1.Parameters.deserializeBinaryFromReader);
      msg.setParameters(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TransactionalQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TransactionalQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TransactionalQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionalQueryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSql();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getParameters();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.Parameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string sql = 1;
 * @return {string}
 */
proto.db.v1.TransactionalQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TransactionalQueryRequest} returns this
 */
proto.db.v1.TransactionalQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional Parameters parameters = 2;
 * @return {?proto.db.v1.Parameters}
 */
proto.db.v1.TransactionalQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.db.v1.Parameters} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.Parameters, 2));
};


/**
 * @param {?proto.db.v1.Parameters|undefined} value
 * @return {!proto.db.v1.TransactionalQueryRequest} returns this
*/
proto.db.v1.TransactionalQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionalQueryRequest} returns this
 */
proto.db.v1.TransactionalQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionalQueryRequest.prototype.hasParameters = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.SavepointRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.SavepointRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.SavepointRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SavepointRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
action: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.SavepointRequest}
 */
proto.db.v1.SavepointRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.SavepointRequest;
  return proto.db.v1.SavepointRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.SavepointRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.SavepointRequest}
 */
proto.db.v1.SavepointRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {!proto.db.v1.SavepointAction} */ (reader.readEnum());
      msg.setAction(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.SavepointRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.SavepointRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.SavepointRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SavepointRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAction();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.SavepointRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.SavepointRequest} returns this
 */
proto.db.v1.SavepointRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional SavepointAction action = 2;
 * @return {!proto.db.v1.SavepointAction}
 */
proto.db.v1.SavepointRequest.prototype.getAction = function() {
  return /** @type {!proto.db.v1.SavepointAction} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.db.v1.SavepointAction} value
 * @return {!proto.db.v1.SavepointRequest} returns this
 */
proto.db.v1.SavepointRequest.prototype.setAction = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.ExecuteTransactionRequest.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ExecuteTransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ExecuteTransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ExecuteTransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExecuteTransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
requestsList: jspb.Message.toObjectList(msg.getRequestsList(),
    proto.db.v1.TransactionRequest.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ExecuteTransactionRequest}
 */
proto.db.v1.ExecuteTransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ExecuteTransactionRequest;
  return proto.db.v1.ExecuteTransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ExecuteTransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ExecuteTransactionRequest}
 */
proto.db.v1.ExecuteTransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.TransactionRequest;
      reader.readMessage(value,proto.db.v1.TransactionRequest.deserializeBinaryFromReader);
      msg.addRequests(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ExecuteTransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ExecuteTransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ExecuteTransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExecuteTransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRequestsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.TransactionRequest.serializeBinaryToWriter
    );
  }
};


/**
 * repeated TransactionRequest requests = 1;
 * @return {!Array<!proto.db.v1.TransactionRequest>}
 */
proto.db.v1.ExecuteTransactionRequest.prototype.getRequestsList = function() {
  return /** @type{!Array<!proto.db.v1.TransactionRequest>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.TransactionRequest, 1));
};


/**
 * @param {!Array<!proto.db.v1.TransactionRequest>} value
 * @return {!proto.db.v1.ExecuteTransactionRequest} returns this
*/
proto.db.v1.ExecuteTransactionRequest.prototype.setRequestsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.TransactionRequest=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TransactionRequest}
 */
proto.db.v1.ExecuteTransactionRequest.prototype.addRequests = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.TransactionRequest, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.ExecuteTransactionRequest} returns this
 */
proto.db.v1.ExecuteTransactionRequest.prototype.clearRequestsList = function() {
  return this.setRequestsList([]);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.db.v1.QueryResult.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.db.v1.QueryResult.ResultCase = {
  RESULT_NOT_SET: 0,
  SELECT: 1,
  DML: 2
};

/**
 * @return {proto.db.v1.QueryResult.ResultCase}
 */
proto.db.v1.QueryResult.prototype.getResultCase = function() {
  return /** @type {proto.db.v1.QueryResult.ResultCase} */(jspb.Message.computeOneofCase(this, proto.db.v1.QueryResult.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.QueryResult.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.QueryResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.QueryResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryResult.toObject = function(includeInstance, msg) {
  var f, obj = {
select: (f = msg.getSelect()) && proto.db.v1.SelectResult.toObject(includeInstance, f),
dml: (f = msg.getDml()) && proto.db.v1.DMLResult.toObject(includeInstance, f),
stats: (f = msg.getStats()) && proto.db.v1.ExecutionStats.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.QueryResult}
 */
proto.db.v1.QueryResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.QueryResult;
  return proto.db.v1.QueryResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.QueryResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.QueryResult}
 */
proto.db.v1.QueryResult.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.SelectResult;
      reader.readMessage(value,proto.db.v1.SelectResult.deserializeBinaryFromReader);
      msg.setSelect(value);
      break;
    case 2:
      var value = new proto.db.v1.DMLResult;
      reader.readMessage(value,proto.db.v1.DMLResult.deserializeBinaryFromReader);
      msg.setDml(value);
      break;
    case 3:
      var value = new proto.db.v1.ExecutionStats;
      reader.readMessage(value,proto.db.v1.ExecutionStats.deserializeBinaryFromReader);
      msg.setStats(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.QueryResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.QueryResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.QueryResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryResult.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSelect();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.db.v1.SelectResult.serializeBinaryToWriter
    );
  }
  f = message.getDml();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.DMLResult.serializeBinaryToWriter
    );
  }
  f = message.getStats();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.ExecutionStats.serializeBinaryToWriter
    );
  }
};


/**
 * optional SelectResult select = 1;
 * @return {?proto.db.v1.SelectResult}
 */
proto.db.v1.QueryResult.prototype.getSelect = function() {
  return /** @type{?proto.db.v1.SelectResult} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.SelectResult, 1));
};


/**
 * @param {?proto.db.v1.SelectResult|undefined} value
 * @return {!proto.db.v1.QueryResult} returns this
*/
proto.db.v1.QueryResult.prototype.setSelect = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.db.v1.QueryResult.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryResult} returns this
 */
proto.db.v1.QueryResult.prototype.clearSelect = function() {
  return this.setSelect(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryResult.prototype.hasSelect = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional DMLResult dml = 2;
 * @return {?proto.db.v1.DMLResult}
 */
proto.db.v1.QueryResult.prototype.getDml = function() {
  return /** @type{?proto.db.v1.DMLResult} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.DMLResult, 2));
};


/**
 * @param {?proto.db.v1.DMLResult|undefined} value
 * @return {!proto.db.v1.QueryResult} returns this
*/
proto.db.v1.QueryResult.prototype.setDml = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.db.v1.QueryResult.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryResult} returns this
 */
proto.db.v1.QueryResult.prototype.clearDml = function() {
  return this.setDml(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryResult.prototype.hasDml = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional ExecutionStats stats = 3;
 * @return {?proto.db.v1.ExecutionStats}
 */
proto.db.v1.QueryResult.prototype.getStats = function() {
  return /** @type{?proto.db.v1.ExecutionStats} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.ExecutionStats, 3));
};


/**
 * @param {?proto.db.v1.ExecutionStats|undefined} value
 * @return {!proto.db.v1.QueryResult} returns this
*/
proto.db.v1.QueryResult.prototype.setStats = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryResult} returns this
 */
proto.db.v1.QueryResult.prototype.clearStats = function() {
  return this.setStats(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryResult.prototype.hasStats = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.db.v1.QueryResponse.oneofGroups_ = [[1,2,3,4,5]];

/**
 * @enum {number}
 */
proto.db.v1.QueryResponse.ResponseCase = {
  RESPONSE_NOT_SET: 0,
  HEADER: 1,
  BATCH: 2,
  COMPLETE: 3,
  DML: 4,
  ERROR: 5
};

/**
 * @return {proto.db.v1.QueryResponse.ResponseCase}
 */
proto.db.v1.QueryResponse.prototype.getResponseCase = function() {
  return /** @type {proto.db.v1.QueryResponse.ResponseCase} */(jspb.Message.computeOneofCase(this, proto.db.v1.QueryResponse.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.QueryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.QueryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.QueryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
header: (f = msg.getHeader()) && proto.db.v1.QueryResultHeader.toObject(includeInstance, f),
batch: (f = msg.getBatch()) && proto.db.v1.QueryResultRowBatch.toObject(includeInstance, f),
complete: (f = msg.getComplete()) && proto.db.v1.QueryComplete.toObject(includeInstance, f),
dml: (f = msg.getDml()) && proto.db.v1.DMLResult.toObject(includeInstance, f),
error: (f = msg.getError()) && proto.db.v1.ErrorResponse.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.QueryResponse}
 */
proto.db.v1.QueryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.QueryResponse;
  return proto.db.v1.QueryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.QueryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.QueryResponse}
 */
proto.db.v1.QueryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.QueryResultHeader;
      reader.readMessage(value,proto.db.v1.QueryResultHeader.deserializeBinaryFromReader);
      msg.setHeader(value);
      break;
    case 2:
      var value = new proto.db.v1.QueryResultRowBatch;
      reader.readMessage(value,proto.db.v1.QueryResultRowBatch.deserializeBinaryFromReader);
      msg.setBatch(value);
      break;
    case 3:
      var value = new proto.db.v1.QueryComplete;
      reader.readMessage(value,proto.db.v1.QueryComplete.deserializeBinaryFromReader);
      msg.setComplete(value);
      break;
    case 4:
      var value = new proto.db.v1.DMLResult;
      reader.readMessage(value,proto.db.v1.DMLResult.deserializeBinaryFromReader);
      msg.setDml(value);
      break;
    case 5:
      var value = new proto.db.v1.ErrorResponse;
      reader.readMessage(value,proto.db.v1.ErrorResponse.deserializeBinaryFromReader);
      msg.setError(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.QueryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.QueryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.QueryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHeader();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.db.v1.QueryResultHeader.serializeBinaryToWriter
    );
  }
  f = message.getBatch();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.QueryResultRowBatch.serializeBinaryToWriter
    );
  }
  f = message.getComplete();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.QueryComplete.serializeBinaryToWriter
    );
  }
  f = message.getDml();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.db.v1.DMLResult.serializeBinaryToWriter
    );
  }
  f = message.getError();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.db.v1.ErrorResponse.serializeBinaryToWriter
    );
  }
};


/**
 * optional QueryResultHeader header = 1;
 * @return {?proto.db.v1.QueryResultHeader}
 */
proto.db.v1.QueryResponse.prototype.getHeader = function() {
  return /** @type{?proto.db.v1.QueryResultHeader} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.QueryResultHeader, 1));
};


/**
 * @param {?proto.db.v1.QueryResultHeader|undefined} value
 * @return {!proto.db.v1.QueryResponse} returns this
*/
proto.db.v1.QueryResponse.prototype.setHeader = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.db.v1.QueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryResponse} returns this
 */
proto.db.v1.QueryResponse.prototype.clearHeader = function() {
  return this.setHeader(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryResponse.prototype.hasHeader = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional QueryResultRowBatch batch = 2;
 * @return {?proto.db.v1.QueryResultRowBatch}
 */
proto.db.v1.QueryResponse.prototype.getBatch = function() {
  return /** @type{?proto.db.v1.QueryResultRowBatch} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.QueryResultRowBatch, 2));
};


/**
 * @param {?proto.db.v1.QueryResultRowBatch|undefined} value
 * @return {!proto.db.v1.QueryResponse} returns this
*/
proto.db.v1.QueryResponse.prototype.setBatch = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.db.v1.QueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryResponse} returns this
 */
proto.db.v1.QueryResponse.prototype.clearBatch = function() {
  return this.setBatch(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryResponse.prototype.hasBatch = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional QueryComplete complete = 3;
 * @return {?proto.db.v1.QueryComplete}
 */
proto.db.v1.QueryResponse.prototype.getComplete = function() {
  return /** @type{?proto.db.v1.QueryComplete} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.QueryComplete, 3));
};


/**
 * @param {?proto.db.v1.QueryComplete|undefined} value
 * @return {!proto.db.v1.QueryResponse} returns this
*/
proto.db.v1.QueryResponse.prototype.setComplete = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.db.v1.QueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryResponse} returns this
 */
proto.db.v1.QueryResponse.prototype.clearComplete = function() {
  return this.setComplete(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryResponse.prototype.hasComplete = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional DMLResult dml = 4;
 * @return {?proto.db.v1.DMLResult}
 */
proto.db.v1.QueryResponse.prototype.getDml = function() {
  return /** @type{?proto.db.v1.DMLResult} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.DMLResult, 4));
};


/**
 * @param {?proto.db.v1.DMLResult|undefined} value
 * @return {!proto.db.v1.QueryResponse} returns this
*/
proto.db.v1.QueryResponse.prototype.setDml = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.db.v1.QueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryResponse} returns this
 */
proto.db.v1.QueryResponse.prototype.clearDml = function() {
  return this.setDml(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryResponse.prototype.hasDml = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional ErrorResponse error = 5;
 * @return {?proto.db.v1.ErrorResponse}
 */
proto.db.v1.QueryResponse.prototype.getError = function() {
  return /** @type{?proto.db.v1.ErrorResponse} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.ErrorResponse, 5));
};


/**
 * @param {?proto.db.v1.ErrorResponse|undefined} value
 * @return {!proto.db.v1.QueryResponse} returns this
*/
proto.db.v1.QueryResponse.prototype.setError = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.db.v1.QueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryResponse} returns this
 */
proto.db.v1.QueryResponse.prototype.clearError = function() {
  return this.setError(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryResponse.prototype.hasError = function() {
  return jspb.Message.getField(this, 5) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.db.v1.TransactionResponse.oneofGroups_ = [[1,2,3,4,5,7,8,9,10]];

/**
 * @enum {number}
 */
proto.db.v1.TransactionResponse.ResponseCase = {
  RESPONSE_NOT_SET: 0,
  BEGIN: 1,
  QUERY_RESULT: 2,
  STREAM_RESULT: 3,
  TYPED_QUERY_RESULT: 4,
  TYPED_STREAM_RESULT: 5,
  SAVEPOINT: 7,
  COMMIT: 8,
  ROLLBACK: 9,
  ERROR: 10
};

/**
 * @return {proto.db.v1.TransactionResponse.ResponseCase}
 */
proto.db.v1.TransactionResponse.prototype.getResponseCase = function() {
  return /** @type {proto.db.v1.TransactionResponse.ResponseCase} */(jspb.Message.computeOneofCase(this, proto.db.v1.TransactionResponse.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TransactionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TransactionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TransactionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
begin: (f = msg.getBegin()) && proto.db.v1.BeginResponse.toObject(includeInstance, f),
queryResult: (f = msg.getQueryResult()) && proto.db.v1.QueryResult.toObject(includeInstance, f),
streamResult: (f = msg.getStreamResult()) && proto.db.v1.QueryResponse.toObject(includeInstance, f),
typedQueryResult: (f = msg.getTypedQueryResult()) && proto.db.v1.TypedQueryResult.toObject(includeInstance, f),
typedStreamResult: (f = msg.getTypedStreamResult()) && proto.db.v1.TypedQueryResponse.toObject(includeInstance, f),
savepoint: (f = msg.getSavepoint()) && proto.db.v1.SavepointResponse.toObject(includeInstance, f),
commit: (f = msg.getCommit()) && proto.db.v1.CommitResponse.toObject(includeInstance, f),
rollback: (f = msg.getRollback()) && proto.db.v1.RollbackResponse.toObject(includeInstance, f),
error: (f = msg.getError()) && proto.db.v1.ErrorResponse.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TransactionResponse}
 */
proto.db.v1.TransactionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TransactionResponse;
  return proto.db.v1.TransactionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TransactionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TransactionResponse}
 */
proto.db.v1.TransactionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.BeginResponse;
      reader.readMessage(value,proto.db.v1.BeginResponse.deserializeBinaryFromReader);
      msg.setBegin(value);
      break;
    case 2:
      var value = new proto.db.v1.QueryResult;
      reader.readMessage(value,proto.db.v1.QueryResult.deserializeBinaryFromReader);
      msg.setQueryResult(value);
      break;
    case 3:
      var value = new proto.db.v1.QueryResponse;
      reader.readMessage(value,proto.db.v1.QueryResponse.deserializeBinaryFromReader);
      msg.setStreamResult(value);
      break;
    case 4:
      var value = new proto.db.v1.TypedQueryResult;
      reader.readMessage(value,proto.db.v1.TypedQueryResult.deserializeBinaryFromReader);
      msg.setTypedQueryResult(value);
      break;
    case 5:
      var value = new proto.db.v1.TypedQueryResponse;
      reader.readMessage(value,proto.db.v1.TypedQueryResponse.deserializeBinaryFromReader);
      msg.setTypedStreamResult(value);
      break;
    case 7:
      var value = new proto.db.v1.SavepointResponse;
      reader.readMessage(value,proto.db.v1.SavepointResponse.deserializeBinaryFromReader);
      msg.setSavepoint(value);
      break;
    case 8:
      var value = new proto.db.v1.CommitResponse;
      reader.readMessage(value,proto.db.v1.CommitResponse.deserializeBinaryFromReader);
      msg.setCommit(value);
      break;
    case 9:
      var value = new proto.db.v1.RollbackResponse;
      reader.readMessage(value,proto.db.v1.RollbackResponse.deserializeBinaryFromReader);
      msg.setRollback(value);
      break;
    case 10:
      var value = new proto.db.v1.ErrorResponse;
      reader.readMessage(value,proto.db.v1.ErrorResponse.deserializeBinaryFromReader);
      msg.setError(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TransactionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TransactionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TransactionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TransactionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBegin();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.db.v1.BeginResponse.serializeBinaryToWriter
    );
  }
  f = message.getQueryResult();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.QueryResult.serializeBinaryToWriter
    );
  }
  f = message.getStreamResult();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.QueryResponse.serializeBinaryToWriter
    );
  }
  f = message.getTypedQueryResult();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.db.v1.TypedQueryResult.serializeBinaryToWriter
    );
  }
  f = message.getTypedStreamResult();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.db.v1.TypedQueryResponse.serializeBinaryToWriter
    );
  }
  f = message.getSavepoint();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.db.v1.SavepointResponse.serializeBinaryToWriter
    );
  }
  f = message.getCommit();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.db.v1.CommitResponse.serializeBinaryToWriter
    );
  }
  f = message.getRollback();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      proto.db.v1.RollbackResponse.serializeBinaryToWriter
    );
  }
  f = message.getError();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      proto.db.v1.ErrorResponse.serializeBinaryToWriter
    );
  }
};


/**
 * optional BeginResponse begin = 1;
 * @return {?proto.db.v1.BeginResponse}
 */
proto.db.v1.TransactionResponse.prototype.getBegin = function() {
  return /** @type{?proto.db.v1.BeginResponse} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.BeginResponse, 1));
};


/**
 * @param {?proto.db.v1.BeginResponse|undefined} value
 * @return {!proto.db.v1.TransactionResponse} returns this
*/
proto.db.v1.TransactionResponse.prototype.setBegin = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.db.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionResponse} returns this
 */
proto.db.v1.TransactionResponse.prototype.clearBegin = function() {
  return this.setBegin(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionResponse.prototype.hasBegin = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional QueryResult query_result = 2;
 * @return {?proto.db.v1.QueryResult}
 */
proto.db.v1.TransactionResponse.prototype.getQueryResult = function() {
  return /** @type{?proto.db.v1.QueryResult} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.QueryResult, 2));
};


/**
 * @param {?proto.db.v1.QueryResult|undefined} value
 * @return {!proto.db.v1.TransactionResponse} returns this
*/
proto.db.v1.TransactionResponse.prototype.setQueryResult = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.db.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionResponse} returns this
 */
proto.db.v1.TransactionResponse.prototype.clearQueryResult = function() {
  return this.setQueryResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionResponse.prototype.hasQueryResult = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional QueryResponse stream_result = 3;
 * @return {?proto.db.v1.QueryResponse}
 */
proto.db.v1.TransactionResponse.prototype.getStreamResult = function() {
  return /** @type{?proto.db.v1.QueryResponse} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.QueryResponse, 3));
};


/**
 * @param {?proto.db.v1.QueryResponse|undefined} value
 * @return {!proto.db.v1.TransactionResponse} returns this
*/
proto.db.v1.TransactionResponse.prototype.setStreamResult = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.db.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionResponse} returns this
 */
proto.db.v1.TransactionResponse.prototype.clearStreamResult = function() {
  return this.setStreamResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionResponse.prototype.hasStreamResult = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional TypedQueryResult typed_query_result = 4;
 * @return {?proto.db.v1.TypedQueryResult}
 */
proto.db.v1.TransactionResponse.prototype.getTypedQueryResult = function() {
  return /** @type{?proto.db.v1.TypedQueryResult} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedQueryResult, 4));
};


/**
 * @param {?proto.db.v1.TypedQueryResult|undefined} value
 * @return {!proto.db.v1.TransactionResponse} returns this
*/
proto.db.v1.TransactionResponse.prototype.setTypedQueryResult = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.db.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionResponse} returns this
 */
proto.db.v1.TransactionResponse.prototype.clearTypedQueryResult = function() {
  return this.setTypedQueryResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionResponse.prototype.hasTypedQueryResult = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional TypedQueryResponse typed_stream_result = 5;
 * @return {?proto.db.v1.TypedQueryResponse}
 */
proto.db.v1.TransactionResponse.prototype.getTypedStreamResult = function() {
  return /** @type{?proto.db.v1.TypedQueryResponse} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedQueryResponse, 5));
};


/**
 * @param {?proto.db.v1.TypedQueryResponse|undefined} value
 * @return {!proto.db.v1.TransactionResponse} returns this
*/
proto.db.v1.TransactionResponse.prototype.setTypedStreamResult = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.db.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionResponse} returns this
 */
proto.db.v1.TransactionResponse.prototype.clearTypedStreamResult = function() {
  return this.setTypedStreamResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionResponse.prototype.hasTypedStreamResult = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional SavepointResponse savepoint = 7;
 * @return {?proto.db.v1.SavepointResponse}
 */
proto.db.v1.TransactionResponse.prototype.getSavepoint = function() {
  return /** @type{?proto.db.v1.SavepointResponse} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.SavepointResponse, 7));
};


/**
 * @param {?proto.db.v1.SavepointResponse|undefined} value
 * @return {!proto.db.v1.TransactionResponse} returns this
*/
proto.db.v1.TransactionResponse.prototype.setSavepoint = function(value) {
  return jspb.Message.setOneofWrapperField(this, 7, proto.db.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionResponse} returns this
 */
proto.db.v1.TransactionResponse.prototype.clearSavepoint = function() {
  return this.setSavepoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionResponse.prototype.hasSavepoint = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional CommitResponse commit = 8;
 * @return {?proto.db.v1.CommitResponse}
 */
proto.db.v1.TransactionResponse.prototype.getCommit = function() {
  return /** @type{?proto.db.v1.CommitResponse} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.CommitResponse, 8));
};


/**
 * @param {?proto.db.v1.CommitResponse|undefined} value
 * @return {!proto.db.v1.TransactionResponse} returns this
*/
proto.db.v1.TransactionResponse.prototype.setCommit = function(value) {
  return jspb.Message.setOneofWrapperField(this, 8, proto.db.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionResponse} returns this
 */
proto.db.v1.TransactionResponse.prototype.clearCommit = function() {
  return this.setCommit(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionResponse.prototype.hasCommit = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional RollbackResponse rollback = 9;
 * @return {?proto.db.v1.RollbackResponse}
 */
proto.db.v1.TransactionResponse.prototype.getRollback = function() {
  return /** @type{?proto.db.v1.RollbackResponse} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.RollbackResponse, 9));
};


/**
 * @param {?proto.db.v1.RollbackResponse|undefined} value
 * @return {!proto.db.v1.TransactionResponse} returns this
*/
proto.db.v1.TransactionResponse.prototype.setRollback = function(value) {
  return jspb.Message.setOneofWrapperField(this, 9, proto.db.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionResponse} returns this
 */
proto.db.v1.TransactionResponse.prototype.clearRollback = function() {
  return this.setRollback(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionResponse.prototype.hasRollback = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional ErrorResponse error = 10;
 * @return {?proto.db.v1.ErrorResponse}
 */
proto.db.v1.TransactionResponse.prototype.getError = function() {
  return /** @type{?proto.db.v1.ErrorResponse} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.ErrorResponse, 10));
};


/**
 * @param {?proto.db.v1.ErrorResponse|undefined} value
 * @return {!proto.db.v1.TransactionResponse} returns this
*/
proto.db.v1.TransactionResponse.prototype.setError = function(value) {
  return jspb.Message.setOneofWrapperField(this, 10, proto.db.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TransactionResponse} returns this
 */
proto.db.v1.TransactionResponse.prototype.clearError = function() {
  return this.setError(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TransactionResponse.prototype.hasError = function() {
  return jspb.Message.getField(this, 10) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.SavepointResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.SavepointResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.SavepointResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SavepointResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
name: jspb.Message.getFieldWithDefault(msg, 2, ""),
action: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.SavepointResponse}
 */
proto.db.v1.SavepointResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.SavepointResponse;
  return proto.db.v1.SavepointResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.SavepointResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.SavepointResponse}
 */
proto.db.v1.SavepointResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {!proto.db.v1.SavepointAction} */ (reader.readEnum());
      msg.setAction(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.SavepointResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.SavepointResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.SavepointResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SavepointResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAction();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.SavepointResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.SavepointResponse} returns this
 */
proto.db.v1.SavepointResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.db.v1.SavepointResponse.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.SavepointResponse} returns this
 */
proto.db.v1.SavepointResponse.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional SavepointAction action = 3;
 * @return {!proto.db.v1.SavepointAction}
 */
proto.db.v1.SavepointResponse.prototype.getAction = function() {
  return /** @type {!proto.db.v1.SavepointAction} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.db.v1.SavepointAction} value
 * @return {!proto.db.v1.SavepointResponse} returns this
 */
proto.db.v1.SavepointResponse.prototype.setAction = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.ExecuteTransactionResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ExecuteTransactionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ExecuteTransactionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ExecuteTransactionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExecuteTransactionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
responsesList: jspb.Message.toObjectList(msg.getResponsesList(),
    proto.db.v1.TransactionResponse.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ExecuteTransactionResponse}
 */
proto.db.v1.ExecuteTransactionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ExecuteTransactionResponse;
  return proto.db.v1.ExecuteTransactionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ExecuteTransactionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ExecuteTransactionResponse}
 */
proto.db.v1.ExecuteTransactionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.TransactionResponse;
      reader.readMessage(value,proto.db.v1.TransactionResponse.deserializeBinaryFromReader);
      msg.addResponses(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ExecuteTransactionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ExecuteTransactionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ExecuteTransactionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExecuteTransactionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResponsesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.TransactionResponse.serializeBinaryToWriter
    );
  }
};


/**
 * repeated TransactionResponse responses = 1;
 * @return {!Array<!proto.db.v1.TransactionResponse>}
 */
proto.db.v1.ExecuteTransactionResponse.prototype.getResponsesList = function() {
  return /** @type{!Array<!proto.db.v1.TransactionResponse>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.TransactionResponse, 1));
};


/**
 * @param {!Array<!proto.db.v1.TransactionResponse>} value
 * @return {!proto.db.v1.ExecuteTransactionResponse} returns this
*/
proto.db.v1.ExecuteTransactionResponse.prototype.setResponsesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.TransactionResponse=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TransactionResponse}
 */
proto.db.v1.ExecuteTransactionResponse.prototype.addResponses = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.TransactionResponse, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.ExecuteTransactionResponse} returns this
 */
proto.db.v1.ExecuteTransactionResponse.prototype.clearResponsesList = function() {
  return this.setResponsesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.SelectResult.repeatedFields_ = [1,2,3,4,5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.SelectResult.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.SelectResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.SelectResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SelectResult.toObject = function(includeInstance, msg) {
  var f, obj = {
columnsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
columnAffinitiesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
columnDeclaredTypesList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
columnRawTypesList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
rowsList: jspb.Message.toObjectList(msg.getRowsList(),
    google_protobuf_struct_pb.ListValue.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.SelectResult}
 */
proto.db.v1.SelectResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.SelectResult;
  return proto.db.v1.SelectResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.SelectResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.SelectResult}
 */
proto.db.v1.SelectResult.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addColumns(value);
      break;
    case 2:
      reader.readPackableEnumInto(msg.getColumnAffinitiesList());
      break;
    case 3:
      reader.readPackableEnumInto(msg.getColumnDeclaredTypesList());
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addColumnRawTypes(value);
      break;
    case 5:
      var value = new google_protobuf_struct_pb.ListValue;
      reader.readMessage(value,google_protobuf_struct_pb.ListValue.deserializeBinaryFromReader);
      msg.addRows(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.SelectResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.SelectResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.SelectResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SelectResult.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getColumnsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getColumnAffinitiesList();
  if (f.length > 0) {
    writer.writePackedEnum(
      2,
      f
    );
  }
  f = message.getColumnDeclaredTypesList();
  if (f.length > 0) {
    writer.writePackedEnum(
      3,
      f
    );
  }
  f = message.getColumnRawTypesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
  f = message.getRowsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      google_protobuf_struct_pb.ListValue.serializeBinaryToWriter
    );
  }
};


/**
 * repeated string columns = 1;
 * @return {!Array<string>}
 */
proto.db.v1.SelectResult.prototype.getColumnsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.setColumnsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.addColumns = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * repeated ColumnAffinity column_affinities = 2;
 * @return {!Array<!proto.db.v1.ColumnAffinity>}
 */
proto.db.v1.SelectResult.prototype.getColumnAffinitiesList = function() {
  return /** @type {!Array<!proto.db.v1.ColumnAffinity>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.db.v1.ColumnAffinity>} value
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.setColumnAffinitiesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.db.v1.ColumnAffinity} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.addColumnAffinities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.clearColumnAffinitiesList = function() {
  return this.setColumnAffinitiesList([]);
};


/**
 * repeated DeclaredType column_declared_types = 3;
 * @return {!Array<!proto.db.v1.DeclaredType>}
 */
proto.db.v1.SelectResult.prototype.getColumnDeclaredTypesList = function() {
  return /** @type {!Array<!proto.db.v1.DeclaredType>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<!proto.db.v1.DeclaredType>} value
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.setColumnDeclaredTypesList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!proto.db.v1.DeclaredType} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.addColumnDeclaredTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.clearColumnDeclaredTypesList = function() {
  return this.setColumnDeclaredTypesList([]);
};


/**
 * repeated string column_raw_types = 4;
 * @return {!Array<string>}
 */
proto.db.v1.SelectResult.prototype.getColumnRawTypesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.setColumnRawTypesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.addColumnRawTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.clearColumnRawTypesList = function() {
  return this.setColumnRawTypesList([]);
};


/**
 * repeated google.protobuf.ListValue rows = 5;
 * @return {!Array<!proto.google.protobuf.ListValue>}
 */
proto.db.v1.SelectResult.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.google.protobuf.ListValue>} */ (
    jspb.Message.getRepeatedWrapperField(this, google_protobuf_struct_pb.ListValue, 5));
};


/**
 * @param {!Array<!proto.google.protobuf.ListValue>} value
 * @return {!proto.db.v1.SelectResult} returns this
*/
proto.db.v1.SelectResult.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.google.protobuf.ListValue=} opt_value
 * @param {number=} opt_index
 * @return {!proto.google.protobuf.ListValue}
 */
proto.db.v1.SelectResult.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.google.protobuf.ListValue, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.SelectResult} returns this
 */
proto.db.v1.SelectResult.prototype.clearRowsList = function() {
  return this.setRowsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DMLResult.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DMLResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DMLResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DMLResult.toObject = function(includeInstance, msg) {
  var f, obj = {
rowsAffected: jspb.Message.getFieldWithDefault(msg, 1, 0),
lastInsertId: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DMLResult}
 */
proto.db.v1.DMLResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DMLResult;
  return proto.db.v1.DMLResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DMLResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DMLResult}
 */
proto.db.v1.DMLResult.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setRowsAffected(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLastInsertId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DMLResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DMLResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DMLResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DMLResult.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRowsAffected();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getLastInsertId();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
};


/**
 * optional int64 rows_affected = 1;
 * @return {number}
 */
proto.db.v1.DMLResult.prototype.getRowsAffected = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.DMLResult} returns this
 */
proto.db.v1.DMLResult.prototype.setRowsAffected = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int64 last_insert_id = 2;
 * @return {number}
 */
proto.db.v1.DMLResult.prototype.getLastInsertId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.DMLResult} returns this
 */
proto.db.v1.DMLResult.prototype.setLastInsertId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.QueryResultHeader.repeatedFields_ = [1,2,3,4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.QueryResultHeader.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.QueryResultHeader.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.QueryResultHeader} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryResultHeader.toObject = function(includeInstance, msg) {
  var f, obj = {
columnsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
columnAffinitiesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
columnDeclaredTypesList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
columnRawTypesList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.QueryResultHeader}
 */
proto.db.v1.QueryResultHeader.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.QueryResultHeader;
  return proto.db.v1.QueryResultHeader.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.QueryResultHeader} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.QueryResultHeader}
 */
proto.db.v1.QueryResultHeader.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addColumns(value);
      break;
    case 2:
      reader.readPackableEnumInto(msg.getColumnAffinitiesList());
      break;
    case 3:
      reader.readPackableEnumInto(msg.getColumnDeclaredTypesList());
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addColumnRawTypes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.QueryResultHeader.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.QueryResultHeader.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.QueryResultHeader} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryResultHeader.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getColumnsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getColumnAffinitiesList();
  if (f.length > 0) {
    writer.writePackedEnum(
      2,
      f
    );
  }
  f = message.getColumnDeclaredTypesList();
  if (f.length > 0) {
    writer.writePackedEnum(
      3,
      f
    );
  }
  f = message.getColumnRawTypesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
};


/**
 * repeated string columns = 1;
 * @return {!Array<string>}
 */
proto.db.v1.QueryResultHeader.prototype.getColumnsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.setColumnsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.addColumns = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * repeated ColumnAffinity column_affinities = 2;
 * @return {!Array<!proto.db.v1.ColumnAffinity>}
 */
proto.db.v1.QueryResultHeader.prototype.getColumnAffinitiesList = function() {
  return /** @type {!Array<!proto.db.v1.ColumnAffinity>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.db.v1.ColumnAffinity>} value
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.setColumnAffinitiesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.db.v1.ColumnAffinity} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.addColumnAffinities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.clearColumnAffinitiesList = function() {
  return this.setColumnAffinitiesList([]);
};


/**
 * repeated DeclaredType column_declared_types = 3;
 * @return {!Array<!proto.db.v1.DeclaredType>}
 */
proto.db.v1.QueryResultHeader.prototype.getColumnDeclaredTypesList = function() {
  return /** @type {!Array<!proto.db.v1.DeclaredType>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<!proto.db.v1.DeclaredType>} value
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.setColumnDeclaredTypesList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!proto.db.v1.DeclaredType} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.addColumnDeclaredTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.clearColumnDeclaredTypesList = function() {
  return this.setColumnDeclaredTypesList([]);
};


/**
 * repeated string column_raw_types = 4;
 * @return {!Array<string>}
 */
proto.db.v1.QueryResultHeader.prototype.getColumnRawTypesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.setColumnRawTypesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.addColumnRawTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.QueryResultHeader} returns this
 */
proto.db.v1.QueryResultHeader.prototype.clearColumnRawTypesList = function() {
  return this.setColumnRawTypesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.QueryResultRowBatch.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.QueryResultRowBatch.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.QueryResultRowBatch.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.QueryResultRowBatch} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryResultRowBatch.toObject = function(includeInstance, msg) {
  var f, obj = {
rowsList: jspb.Message.toObjectList(msg.getRowsList(),
    google_protobuf_struct_pb.ListValue.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.QueryResultRowBatch}
 */
proto.db.v1.QueryResultRowBatch.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.QueryResultRowBatch;
  return proto.db.v1.QueryResultRowBatch.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.QueryResultRowBatch} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.QueryResultRowBatch}
 */
proto.db.v1.QueryResultRowBatch.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_struct_pb.ListValue;
      reader.readMessage(value,google_protobuf_struct_pb.ListValue.deserializeBinaryFromReader);
      msg.addRows(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.QueryResultRowBatch.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.QueryResultRowBatch.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.QueryResultRowBatch} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryResultRowBatch.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRowsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      google_protobuf_struct_pb.ListValue.serializeBinaryToWriter
    );
  }
};


/**
 * repeated google.protobuf.ListValue rows = 1;
 * @return {!Array<!proto.google.protobuf.ListValue>}
 */
proto.db.v1.QueryResultRowBatch.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.google.protobuf.ListValue>} */ (
    jspb.Message.getRepeatedWrapperField(this, google_protobuf_struct_pb.ListValue, 1));
};


/**
 * @param {!Array<!proto.google.protobuf.ListValue>} value
 * @return {!proto.db.v1.QueryResultRowBatch} returns this
*/
proto.db.v1.QueryResultRowBatch.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.google.protobuf.ListValue=} opt_value
 * @param {number=} opt_index
 * @return {!proto.google.protobuf.ListValue}
 */
proto.db.v1.QueryResultRowBatch.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.google.protobuf.ListValue, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.QueryResultRowBatch} returns this
 */
proto.db.v1.QueryResultRowBatch.prototype.clearRowsList = function() {
  return this.setRowsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.QueryComplete.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.QueryComplete.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.QueryComplete} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryComplete.toObject = function(includeInstance, msg) {
  var f, obj = {
stats: (f = msg.getStats()) && proto.db.v1.ExecutionStats.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.QueryComplete}
 */
proto.db.v1.QueryComplete.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.QueryComplete;
  return proto.db.v1.QueryComplete.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.QueryComplete} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.QueryComplete}
 */
proto.db.v1.QueryComplete.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.ExecutionStats;
      reader.readMessage(value,proto.db.v1.ExecutionStats.deserializeBinaryFromReader);
      msg.setStats(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.QueryComplete.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.QueryComplete.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.QueryComplete} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryComplete.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStats();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.db.v1.ExecutionStats.serializeBinaryToWriter
    );
  }
};


/**
 * optional ExecutionStats stats = 1;
 * @return {?proto.db.v1.ExecutionStats}
 */
proto.db.v1.QueryComplete.prototype.getStats = function() {
  return /** @type{?proto.db.v1.ExecutionStats} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.ExecutionStats, 1));
};


/**
 * @param {?proto.db.v1.ExecutionStats|undefined} value
 * @return {!proto.db.v1.QueryComplete} returns this
*/
proto.db.v1.QueryComplete.prototype.setStats = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.QueryComplete} returns this
 */
proto.db.v1.QueryComplete.prototype.clearStats = function() {
  return this.setStats(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.QueryComplete.prototype.hasStats = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ExecutionStats.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ExecutionStats.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ExecutionStats} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExecutionStats.toObject = function(includeInstance, msg) {
  var f, obj = {
durationMs: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
rowsRead: jspb.Message.getFieldWithDefault(msg, 2, 0),
rowsWritten: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ExecutionStats}
 */
proto.db.v1.ExecutionStats.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ExecutionStats;
  return proto.db.v1.ExecutionStats.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ExecutionStats} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ExecutionStats}
 */
proto.db.v1.ExecutionStats.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setDurationMs(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setRowsRead(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setRowsWritten(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ExecutionStats.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ExecutionStats.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ExecutionStats} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExecutionStats.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDurationMs();
  if (f !== 0.0) {
    writer.writeDouble(
      1,
      f
    );
  }
  f = message.getRowsRead();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = message.getRowsWritten();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
};


/**
 * optional double duration_ms = 1;
 * @return {number}
 */
proto.db.v1.ExecutionStats.prototype.getDurationMs = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.ExecutionStats} returns this
 */
proto.db.v1.ExecutionStats.prototype.setDurationMs = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional int64 rows_read = 2;
 * @return {number}
 */
proto.db.v1.ExecutionStats.prototype.getRowsRead = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.ExecutionStats} returns this
 */
proto.db.v1.ExecutionStats.prototype.setRowsRead = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional int64 rows_written = 3;
 * @return {number}
 */
proto.db.v1.ExecutionStats.prototype.getRowsWritten = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.ExecutionStats} returns this
 */
proto.db.v1.ExecutionStats.prototype.setRowsWritten = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.BeginResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.BeginResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.BeginResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BeginResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
transactionId: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.BeginResponse}
 */
proto.db.v1.BeginResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.BeginResponse;
  return proto.db.v1.BeginResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.BeginResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.BeginResponse}
 */
proto.db.v1.BeginResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTransactionId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.BeginResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.BeginResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.BeginResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.BeginResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getTransactionId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.BeginResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.BeginResponse} returns this
 */
proto.db.v1.BeginResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string transaction_id = 2;
 * @return {string}
 */
proto.db.v1.BeginResponse.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.BeginResponse} returns this
 */
proto.db.v1.BeginResponse.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.CommitResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.CommitResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.CommitResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CommitResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.CommitResponse}
 */
proto.db.v1.CommitResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.CommitResponse;
  return proto.db.v1.CommitResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.CommitResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.CommitResponse}
 */
proto.db.v1.CommitResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.CommitResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.CommitResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.CommitResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.CommitResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.CommitResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.CommitResponse} returns this
 */
proto.db.v1.CommitResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.RollbackResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.RollbackResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.RollbackResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RollbackResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.RollbackResponse}
 */
proto.db.v1.RollbackResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.RollbackResponse;
  return proto.db.v1.RollbackResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.RollbackResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.RollbackResponse}
 */
proto.db.v1.RollbackResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.RollbackResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.RollbackResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.RollbackResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.RollbackResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.RollbackResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.RollbackResponse} returns this
 */
proto.db.v1.RollbackResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ErrorResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ErrorResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ErrorResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ErrorResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
message: jspb.Message.getFieldWithDefault(msg, 1, ""),
failedSql: jspb.Message.getFieldWithDefault(msg, 2, ""),
sqliteErrorCode: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ErrorResponse}
 */
proto.db.v1.ErrorResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ErrorResponse;
  return proto.db.v1.ErrorResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ErrorResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ErrorResponse}
 */
proto.db.v1.ErrorResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setFailedSql(value);
      break;
    case 3:
      var value = /** @type {!proto.db.v1.SqliteCode} */ (reader.readEnum());
      msg.setSqliteErrorCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ErrorResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ErrorResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ErrorResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ErrorResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getFailedSql();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSqliteErrorCode();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional string message = 1;
 * @return {string}
 */
proto.db.v1.ErrorResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ErrorResponse} returns this
 */
proto.db.v1.ErrorResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string failed_sql = 2;
 * @return {string}
 */
proto.db.v1.ErrorResponse.prototype.getFailedSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ErrorResponse} returns this
 */
proto.db.v1.ErrorResponse.prototype.setFailedSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional SqliteCode sqlite_error_code = 3;
 * @return {!proto.db.v1.SqliteCode}
 */
proto.db.v1.ErrorResponse.prototype.getSqliteErrorCode = function() {
  return /** @type {!proto.db.v1.SqliteCode} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.db.v1.SqliteCode} value
 * @return {!proto.db.v1.ErrorResponse} returns this
 */
proto.db.v1.ErrorResponse.prototype.setSqliteErrorCode = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.db.v1.SqlValue.oneofGroups_ = [[1,2,3,4,5]];

/**
 * @enum {number}
 */
proto.db.v1.SqlValue.ValueCase = {
  VALUE_NOT_SET: 0,
  INTEGER_VALUE: 1,
  REAL_VALUE: 2,
  TEXT_VALUE: 3,
  BLOB_VALUE: 4,
  NULL_VALUE: 5
};

/**
 * @return {proto.db.v1.SqlValue.ValueCase}
 */
proto.db.v1.SqlValue.prototype.getValueCase = function() {
  return /** @type {proto.db.v1.SqlValue.ValueCase} */(jspb.Message.computeOneofCase(this, proto.db.v1.SqlValue.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.SqlValue.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.SqlValue.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.SqlValue} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SqlValue.toObject = function(includeInstance, msg) {
  var f, obj = {
integerValue: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
realValue: (f = jspb.Message.getOptionalFloatingPointField(msg, 2)) == null ? undefined : f,
textValue: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f,
blobValue: msg.getBlobValue_asB64(),
nullValue: (f = jspb.Message.getBooleanField(msg, 5)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.SqlValue}
 */
proto.db.v1.SqlValue.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.SqlValue;
  return proto.db.v1.SqlValue.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.SqlValue} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.SqlValue}
 */
proto.db.v1.SqlValue.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setIntegerValue(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setRealValue(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTextValue(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlobValue(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setNullValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.SqlValue.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.SqlValue.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.SqlValue} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SqlValue.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {number} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeDouble(
      2,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeString(
      3,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeBytes(
      4,
      f
    );
  }
  f = /** @type {boolean} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeBool(
      5,
      f
    );
  }
};


/**
 * optional int64 integer_value = 1;
 * @return {number}
 */
proto.db.v1.SqlValue.prototype.getIntegerValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.setIntegerValue = function(value) {
  return jspb.Message.setOneofField(this, 1, proto.db.v1.SqlValue.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.clearIntegerValue = function() {
  return jspb.Message.setOneofField(this, 1, proto.db.v1.SqlValue.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.SqlValue.prototype.hasIntegerValue = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional double real_value = 2;
 * @return {number}
 */
proto.db.v1.SqlValue.prototype.getRealValue = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.setRealValue = function(value) {
  return jspb.Message.setOneofField(this, 2, proto.db.v1.SqlValue.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.clearRealValue = function() {
  return jspb.Message.setOneofField(this, 2, proto.db.v1.SqlValue.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.SqlValue.prototype.hasRealValue = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string text_value = 3;
 * @return {string}
 */
proto.db.v1.SqlValue.prototype.getTextValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.setTextValue = function(value) {
  return jspb.Message.setOneofField(this, 3, proto.db.v1.SqlValue.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.clearTextValue = function() {
  return jspb.Message.setOneofField(this, 3, proto.db.v1.SqlValue.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.SqlValue.prototype.hasTextValue = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional bytes blob_value = 4;
 * @return {!(string|Uint8Array)}
 */
proto.db.v1.SqlValue.prototype.getBlobValue = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes blob_value = 4;
 * This is a type-conversion wrapper around `getBlobValue()`
 * @return {string}
 */
proto.db.v1.SqlValue.prototype.getBlobValue_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlobValue()));
};


/**
 * optional bytes blob_value = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlobValue()`
 * @return {!Uint8Array}
 */
proto.db.v1.SqlValue.prototype.getBlobValue_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlobValue()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.setBlobValue = function(value) {
  return jspb.Message.setOneofField(this, 4, proto.db.v1.SqlValue.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.clearBlobValue = function() {
  return jspb.Message.setOneofField(this, 4, proto.db.v1.SqlValue.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.SqlValue.prototype.hasBlobValue = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional bool null_value = 5;
 * @return {boolean}
 */
proto.db.v1.SqlValue.prototype.getNullValue = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.setNullValue = function(value) {
  return jspb.Message.setOneofField(this, 5, proto.db.v1.SqlValue.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.SqlValue} returns this
 */
proto.db.v1.SqlValue.prototype.clearNullValue = function() {
  return jspb.Message.setOneofField(this, 5, proto.db.v1.SqlValue.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.SqlValue.prototype.hasNullValue = function() {
  return jspb.Message.getField(this, 5) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.SqlRow.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.SqlRow.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.SqlRow.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.SqlRow} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SqlRow.toObject = function(includeInstance, msg) {
  var f, obj = {
valuesList: jspb.Message.toObjectList(msg.getValuesList(),
    proto.db.v1.SqlValue.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.SqlRow}
 */
proto.db.v1.SqlRow.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.SqlRow;
  return proto.db.v1.SqlRow.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.SqlRow} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.SqlRow}
 */
proto.db.v1.SqlRow.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.SqlValue;
      reader.readMessage(value,proto.db.v1.SqlValue.deserializeBinaryFromReader);
      msg.addValues(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.SqlRow.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.SqlRow.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.SqlRow} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.SqlRow.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValuesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.SqlValue.serializeBinaryToWriter
    );
  }
};


/**
 * repeated SqlValue values = 1;
 * @return {!Array<!proto.db.v1.SqlValue>}
 */
proto.db.v1.SqlRow.prototype.getValuesList = function() {
  return /** @type{!Array<!proto.db.v1.SqlValue>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.SqlValue, 1));
};


/**
 * @param {!Array<!proto.db.v1.SqlValue>} value
 * @return {!proto.db.v1.SqlRow} returns this
*/
proto.db.v1.SqlRow.prototype.setValuesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.SqlValue=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.SqlValue}
 */
proto.db.v1.SqlRow.prototype.addValues = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.SqlValue, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.SqlRow} returns this
 */
proto.db.v1.SqlRow.prototype.clearValuesList = function() {
  return this.setValuesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.TypedParameters.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TypedParameters.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TypedParameters.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TypedParameters} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedParameters.toObject = function(includeInstance, msg) {
  var f, obj = {
positionalList: jspb.Message.toObjectList(msg.getPositionalList(),
    proto.db.v1.SqlValue.toObject, includeInstance),
namedMap: (f = msg.getNamedMap()) ? f.toObject(includeInstance, proto.db.v1.SqlValue.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TypedParameters}
 */
proto.db.v1.TypedParameters.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TypedParameters;
  return proto.db.v1.TypedParameters.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TypedParameters} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TypedParameters}
 */
proto.db.v1.TypedParameters.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.SqlValue;
      reader.readMessage(value,proto.db.v1.SqlValue.deserializeBinaryFromReader);
      msg.addPositional(value);
      break;
    case 2:
      var value = msg.getNamedMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readStringRequireUtf8, jspb.BinaryReader.prototype.readMessage, proto.db.v1.SqlValue.deserializeBinaryFromReader, "", new proto.db.v1.SqlValue());
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TypedParameters.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TypedParameters.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TypedParameters} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedParameters.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPositionalList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.SqlValue.serializeBinaryToWriter
    );
  }
  f = message.getNamedMap(true);
  if (f && f.getLength() > 0) {
jspb.internal.public_for_gencode.serializeMapToBinary(
    message.getNamedMap(true),
    2,
    writer,
    jspb.BinaryWriter.prototype.writeString,
    jspb.BinaryWriter.prototype.writeMessage,
    proto.db.v1.SqlValue.serializeBinaryToWriter);
  }
};


/**
 * repeated SqlValue positional = 1;
 * @return {!Array<!proto.db.v1.SqlValue>}
 */
proto.db.v1.TypedParameters.prototype.getPositionalList = function() {
  return /** @type{!Array<!proto.db.v1.SqlValue>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.SqlValue, 1));
};


/**
 * @param {!Array<!proto.db.v1.SqlValue>} value
 * @return {!proto.db.v1.TypedParameters} returns this
*/
proto.db.v1.TypedParameters.prototype.setPositionalList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.SqlValue=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.SqlValue}
 */
proto.db.v1.TypedParameters.prototype.addPositional = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.SqlValue, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedParameters} returns this
 */
proto.db.v1.TypedParameters.prototype.clearPositionalList = function() {
  return this.setPositionalList([]);
};


/**
 * map<string, SqlValue> named = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.db.v1.SqlValue>}
 */
proto.db.v1.TypedParameters.prototype.getNamedMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.db.v1.SqlValue>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      proto.db.v1.SqlValue));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.db.v1.TypedParameters} returns this
 */
proto.db.v1.TypedParameters.prototype.clearNamedMap = function() {
  this.getNamedMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TypedQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TypedQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TypedQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, ""),
type: jspb.Message.getFieldWithDefault(msg, 3, 0),
parameters: (f = msg.getParameters()) && proto.db.v1.TypedParameters.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TypedQueryRequest}
 */
proto.db.v1.TypedQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TypedQueryRequest;
  return proto.db.v1.TypedQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TypedQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TypedQueryRequest}
 */
proto.db.v1.TypedQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setSql(value);
      break;
    case 3:
      var value = /** @type {!proto.db.v1.QueryType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 4:
      var value = new proto.db.v1.TypedParameters;
      reader.readMessage(value,proto.db.v1.TypedParameters.deserializeBinaryFromReader);
      msg.setParameters(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TypedQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TypedQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TypedQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSql();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getParameters();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.db.v1.TypedParameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.TypedQueryRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TypedQueryRequest} returns this
 */
proto.db.v1.TypedQueryRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.db.v1.TypedQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TypedQueryRequest} returns this
 */
proto.db.v1.TypedQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional QueryType type = 3;
 * @return {!proto.db.v1.QueryType}
 */
proto.db.v1.TypedQueryRequest.prototype.getType = function() {
  return /** @type {!proto.db.v1.QueryType} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.db.v1.QueryType} value
 * @return {!proto.db.v1.TypedQueryRequest} returns this
 */
proto.db.v1.TypedQueryRequest.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * optional TypedParameters parameters = 4;
 * @return {?proto.db.v1.TypedParameters}
 */
proto.db.v1.TypedQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.db.v1.TypedParameters} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedParameters, 4));
};


/**
 * @param {?proto.db.v1.TypedParameters|undefined} value
 * @return {!proto.db.v1.TypedQueryRequest} returns this
*/
proto.db.v1.TypedQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedQueryRequest} returns this
 */
proto.db.v1.TypedQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedQueryRequest.prototype.hasParameters = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TypedTransactionQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TypedTransactionQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TypedTransactionQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedTransactionQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
transactionId: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, ""),
parameters: (f = msg.getParameters()) && proto.db.v1.TypedParameters.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TypedTransactionQueryRequest}
 */
proto.db.v1.TypedTransactionQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TypedTransactionQueryRequest;
  return proto.db.v1.TypedTransactionQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TypedTransactionQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TypedTransactionQueryRequest}
 */
proto.db.v1.TypedTransactionQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTransactionId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setSql(value);
      break;
    case 3:
      var value = new proto.db.v1.TypedParameters;
      reader.readMessage(value,proto.db.v1.TypedParameters.deserializeBinaryFromReader);
      msg.setParameters(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TypedTransactionQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TypedTransactionQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TypedTransactionQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedTransactionQueryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransactionId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSql();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getParameters();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.TypedParameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string transaction_id = 1;
 * @return {string}
 */
proto.db.v1.TypedTransactionQueryRequest.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TypedTransactionQueryRequest} returns this
 */
proto.db.v1.TypedTransactionQueryRequest.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.db.v1.TypedTransactionQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TypedTransactionQueryRequest} returns this
 */
proto.db.v1.TypedTransactionQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional TypedParameters parameters = 3;
 * @return {?proto.db.v1.TypedParameters}
 */
proto.db.v1.TypedTransactionQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.db.v1.TypedParameters} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedParameters, 3));
};


/**
 * @param {?proto.db.v1.TypedParameters|undefined} value
 * @return {!proto.db.v1.TypedTransactionQueryRequest} returns this
*/
proto.db.v1.TypedTransactionQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedTransactionQueryRequest} returns this
 */
proto.db.v1.TypedTransactionQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedTransactionQueryRequest.prototype.hasParameters = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TypedTransactionalQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TypedTransactionalQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TypedTransactionalQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedTransactionalQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
sql: jspb.Message.getFieldWithDefault(msg, 1, ""),
parameters: (f = msg.getParameters()) && proto.db.v1.TypedParameters.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TypedTransactionalQueryRequest}
 */
proto.db.v1.TypedTransactionalQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TypedTransactionalQueryRequest;
  return proto.db.v1.TypedTransactionalQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TypedTransactionalQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TypedTransactionalQueryRequest}
 */
proto.db.v1.TypedTransactionalQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setSql(value);
      break;
    case 2:
      var value = new proto.db.v1.TypedParameters;
      reader.readMessage(value,proto.db.v1.TypedParameters.deserializeBinaryFromReader);
      msg.setParameters(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TypedTransactionalQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TypedTransactionalQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TypedTransactionalQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedTransactionalQueryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSql();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getParameters();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.TypedParameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string sql = 1;
 * @return {string}
 */
proto.db.v1.TypedTransactionalQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TypedTransactionalQueryRequest} returns this
 */
proto.db.v1.TypedTransactionalQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional TypedParameters parameters = 2;
 * @return {?proto.db.v1.TypedParameters}
 */
proto.db.v1.TypedTransactionalQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.db.v1.TypedParameters} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedParameters, 2));
};


/**
 * @param {?proto.db.v1.TypedParameters|undefined} value
 * @return {!proto.db.v1.TypedTransactionalQueryRequest} returns this
*/
proto.db.v1.TypedTransactionalQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedTransactionalQueryRequest} returns this
 */
proto.db.v1.TypedTransactionalQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedTransactionalQueryRequest.prototype.hasParameters = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.TypedSelectResult.repeatedFields_ = [1,2,3,4,5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TypedSelectResult.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TypedSelectResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TypedSelectResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedSelectResult.toObject = function(includeInstance, msg) {
  var f, obj = {
columnsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
columnAffinitiesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
columnDeclaredTypesList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
columnRawTypesList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
rowsList: jspb.Message.toObjectList(msg.getRowsList(),
    proto.db.v1.SqlRow.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TypedSelectResult}
 */
proto.db.v1.TypedSelectResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TypedSelectResult;
  return proto.db.v1.TypedSelectResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TypedSelectResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TypedSelectResult}
 */
proto.db.v1.TypedSelectResult.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addColumns(value);
      break;
    case 2:
      reader.readPackableEnumInto(msg.getColumnAffinitiesList());
      break;
    case 3:
      reader.readPackableEnumInto(msg.getColumnDeclaredTypesList());
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addColumnRawTypes(value);
      break;
    case 5:
      var value = new proto.db.v1.SqlRow;
      reader.readMessage(value,proto.db.v1.SqlRow.deserializeBinaryFromReader);
      msg.addRows(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TypedSelectResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TypedSelectResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TypedSelectResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedSelectResult.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getColumnsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getColumnAffinitiesList();
  if (f.length > 0) {
    writer.writePackedEnum(
      2,
      f
    );
  }
  f = message.getColumnDeclaredTypesList();
  if (f.length > 0) {
    writer.writePackedEnum(
      3,
      f
    );
  }
  f = message.getColumnRawTypesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
  f = message.getRowsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.db.v1.SqlRow.serializeBinaryToWriter
    );
  }
};


/**
 * repeated string columns = 1;
 * @return {!Array<string>}
 */
proto.db.v1.TypedSelectResult.prototype.getColumnsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.setColumnsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.addColumns = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * repeated ColumnAffinity column_affinities = 2;
 * @return {!Array<!proto.db.v1.ColumnAffinity>}
 */
proto.db.v1.TypedSelectResult.prototype.getColumnAffinitiesList = function() {
  return /** @type {!Array<!proto.db.v1.ColumnAffinity>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.db.v1.ColumnAffinity>} value
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.setColumnAffinitiesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.db.v1.ColumnAffinity} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.addColumnAffinities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.clearColumnAffinitiesList = function() {
  return this.setColumnAffinitiesList([]);
};


/**
 * repeated DeclaredType column_declared_types = 3;
 * @return {!Array<!proto.db.v1.DeclaredType>}
 */
proto.db.v1.TypedSelectResult.prototype.getColumnDeclaredTypesList = function() {
  return /** @type {!Array<!proto.db.v1.DeclaredType>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<!proto.db.v1.DeclaredType>} value
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.setColumnDeclaredTypesList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!proto.db.v1.DeclaredType} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.addColumnDeclaredTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.clearColumnDeclaredTypesList = function() {
  return this.setColumnDeclaredTypesList([]);
};


/**
 * repeated string column_raw_types = 4;
 * @return {!Array<string>}
 */
proto.db.v1.TypedSelectResult.prototype.getColumnRawTypesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.setColumnRawTypesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.addColumnRawTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.clearColumnRawTypesList = function() {
  return this.setColumnRawTypesList([]);
};


/**
 * repeated SqlRow rows = 5;
 * @return {!Array<!proto.db.v1.SqlRow>}
 */
proto.db.v1.TypedSelectResult.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.db.v1.SqlRow>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.SqlRow, 5));
};


/**
 * @param {!Array<!proto.db.v1.SqlRow>} value
 * @return {!proto.db.v1.TypedSelectResult} returns this
*/
proto.db.v1.TypedSelectResult.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.db.v1.SqlRow=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.SqlRow}
 */
proto.db.v1.TypedSelectResult.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.db.v1.SqlRow, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedSelectResult} returns this
 */
proto.db.v1.TypedSelectResult.prototype.clearRowsList = function() {
  return this.setRowsList([]);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.db.v1.TypedQueryResult.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.db.v1.TypedQueryResult.ResultCase = {
  RESULT_NOT_SET: 0,
  SELECT: 1,
  DML: 2
};

/**
 * @return {proto.db.v1.TypedQueryResult.ResultCase}
 */
proto.db.v1.TypedQueryResult.prototype.getResultCase = function() {
  return /** @type {proto.db.v1.TypedQueryResult.ResultCase} */(jspb.Message.computeOneofCase(this, proto.db.v1.TypedQueryResult.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TypedQueryResult.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TypedQueryResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TypedQueryResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryResult.toObject = function(includeInstance, msg) {
  var f, obj = {
select: (f = msg.getSelect()) && proto.db.v1.TypedSelectResult.toObject(includeInstance, f),
dml: (f = msg.getDml()) && proto.db.v1.DMLResult.toObject(includeInstance, f),
stats: (f = msg.getStats()) && proto.db.v1.ExecutionStats.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TypedQueryResult}
 */
proto.db.v1.TypedQueryResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TypedQueryResult;
  return proto.db.v1.TypedQueryResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TypedQueryResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TypedQueryResult}
 */
proto.db.v1.TypedQueryResult.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.TypedSelectResult;
      reader.readMessage(value,proto.db.v1.TypedSelectResult.deserializeBinaryFromReader);
      msg.setSelect(value);
      break;
    case 2:
      var value = new proto.db.v1.DMLResult;
      reader.readMessage(value,proto.db.v1.DMLResult.deserializeBinaryFromReader);
      msg.setDml(value);
      break;
    case 3:
      var value = new proto.db.v1.ExecutionStats;
      reader.readMessage(value,proto.db.v1.ExecutionStats.deserializeBinaryFromReader);
      msg.setStats(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TypedQueryResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TypedQueryResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TypedQueryResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryResult.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSelect();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.db.v1.TypedSelectResult.serializeBinaryToWriter
    );
  }
  f = message.getDml();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.DMLResult.serializeBinaryToWriter
    );
  }
  f = message.getStats();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.ExecutionStats.serializeBinaryToWriter
    );
  }
};


/**
 * optional TypedSelectResult select = 1;
 * @return {?proto.db.v1.TypedSelectResult}
 */
proto.db.v1.TypedQueryResult.prototype.getSelect = function() {
  return /** @type{?proto.db.v1.TypedSelectResult} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedSelectResult, 1));
};


/**
 * @param {?proto.db.v1.TypedSelectResult|undefined} value
 * @return {!proto.db.v1.TypedQueryResult} returns this
*/
proto.db.v1.TypedQueryResult.prototype.setSelect = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.db.v1.TypedQueryResult.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedQueryResult} returns this
 */
proto.db.v1.TypedQueryResult.prototype.clearSelect = function() {
  return this.setSelect(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedQueryResult.prototype.hasSelect = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional DMLResult dml = 2;
 * @return {?proto.db.v1.DMLResult}
 */
proto.db.v1.TypedQueryResult.prototype.getDml = function() {
  return /** @type{?proto.db.v1.DMLResult} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.DMLResult, 2));
};


/**
 * @param {?proto.db.v1.DMLResult|undefined} value
 * @return {!proto.db.v1.TypedQueryResult} returns this
*/
proto.db.v1.TypedQueryResult.prototype.setDml = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.db.v1.TypedQueryResult.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedQueryResult} returns this
 */
proto.db.v1.TypedQueryResult.prototype.clearDml = function() {
  return this.setDml(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedQueryResult.prototype.hasDml = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional ExecutionStats stats = 3;
 * @return {?proto.db.v1.ExecutionStats}
 */
proto.db.v1.TypedQueryResult.prototype.getStats = function() {
  return /** @type{?proto.db.v1.ExecutionStats} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.ExecutionStats, 3));
};


/**
 * @param {?proto.db.v1.ExecutionStats|undefined} value
 * @return {!proto.db.v1.TypedQueryResult} returns this
*/
proto.db.v1.TypedQueryResult.prototype.setStats = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedQueryResult} returns this
 */
proto.db.v1.TypedQueryResult.prototype.clearStats = function() {
  return this.setStats(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedQueryResult.prototype.hasStats = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.TypedQueryResultHeader.repeatedFields_ = [1,2,3,4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TypedQueryResultHeader.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TypedQueryResultHeader.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TypedQueryResultHeader} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryResultHeader.toObject = function(includeInstance, msg) {
  var f, obj = {
columnsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
columnAffinitiesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
columnDeclaredTypesList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
columnRawTypesList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TypedQueryResultHeader}
 */
proto.db.v1.TypedQueryResultHeader.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TypedQueryResultHeader;
  return proto.db.v1.TypedQueryResultHeader.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TypedQueryResultHeader} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TypedQueryResultHeader}
 */
proto.db.v1.TypedQueryResultHeader.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addColumns(value);
      break;
    case 2:
      reader.readPackableEnumInto(msg.getColumnAffinitiesList());
      break;
    case 3:
      reader.readPackableEnumInto(msg.getColumnDeclaredTypesList());
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addColumnRawTypes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TypedQueryResultHeader.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TypedQueryResultHeader.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TypedQueryResultHeader} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryResultHeader.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getColumnsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getColumnAffinitiesList();
  if (f.length > 0) {
    writer.writePackedEnum(
      2,
      f
    );
  }
  f = message.getColumnDeclaredTypesList();
  if (f.length > 0) {
    writer.writePackedEnum(
      3,
      f
    );
  }
  f = message.getColumnRawTypesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
};


/**
 * repeated string columns = 1;
 * @return {!Array<string>}
 */
proto.db.v1.TypedQueryResultHeader.prototype.getColumnsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.setColumnsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.addColumns = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * repeated ColumnAffinity column_affinities = 2;
 * @return {!Array<!proto.db.v1.ColumnAffinity>}
 */
proto.db.v1.TypedQueryResultHeader.prototype.getColumnAffinitiesList = function() {
  return /** @type {!Array<!proto.db.v1.ColumnAffinity>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.db.v1.ColumnAffinity>} value
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.setColumnAffinitiesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.db.v1.ColumnAffinity} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.addColumnAffinities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.clearColumnAffinitiesList = function() {
  return this.setColumnAffinitiesList([]);
};


/**
 * repeated DeclaredType column_declared_types = 3;
 * @return {!Array<!proto.db.v1.DeclaredType>}
 */
proto.db.v1.TypedQueryResultHeader.prototype.getColumnDeclaredTypesList = function() {
  return /** @type {!Array<!proto.db.v1.DeclaredType>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<!proto.db.v1.DeclaredType>} value
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.setColumnDeclaredTypesList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!proto.db.v1.DeclaredType} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.addColumnDeclaredTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.clearColumnDeclaredTypesList = function() {
  return this.setColumnDeclaredTypesList([]);
};


/**
 * repeated string column_raw_types = 4;
 * @return {!Array<string>}
 */
proto.db.v1.TypedQueryResultHeader.prototype.getColumnRawTypesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.setColumnRawTypesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.addColumnRawTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedQueryResultHeader} returns this
 */
proto.db.v1.TypedQueryResultHeader.prototype.clearColumnRawTypesList = function() {
  return this.setColumnRawTypesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.TypedQueryResultRowBatch.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TypedQueryResultRowBatch.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TypedQueryResultRowBatch.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TypedQueryResultRowBatch} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryResultRowBatch.toObject = function(includeInstance, msg) {
  var f, obj = {
rowsList: jspb.Message.toObjectList(msg.getRowsList(),
    proto.db.v1.SqlRow.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TypedQueryResultRowBatch}
 */
proto.db.v1.TypedQueryResultRowBatch.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TypedQueryResultRowBatch;
  return proto.db.v1.TypedQueryResultRowBatch.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TypedQueryResultRowBatch} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TypedQueryResultRowBatch}
 */
proto.db.v1.TypedQueryResultRowBatch.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.SqlRow;
      reader.readMessage(value,proto.db.v1.SqlRow.deserializeBinaryFromReader);
      msg.addRows(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TypedQueryResultRowBatch.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TypedQueryResultRowBatch.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TypedQueryResultRowBatch} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryResultRowBatch.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRowsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.SqlRow.serializeBinaryToWriter
    );
  }
};


/**
 * repeated SqlRow rows = 1;
 * @return {!Array<!proto.db.v1.SqlRow>}
 */
proto.db.v1.TypedQueryResultRowBatch.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.db.v1.SqlRow>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.SqlRow, 1));
};


/**
 * @param {!Array<!proto.db.v1.SqlRow>} value
 * @return {!proto.db.v1.TypedQueryResultRowBatch} returns this
*/
proto.db.v1.TypedQueryResultRowBatch.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.SqlRow=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.SqlRow}
 */
proto.db.v1.TypedQueryResultRowBatch.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.SqlRow, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TypedQueryResultRowBatch} returns this
 */
proto.db.v1.TypedQueryResultRowBatch.prototype.clearRowsList = function() {
  return this.setRowsList([]);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.db.v1.TypedQueryResponse.oneofGroups_ = [[1,2,3,4,5]];

/**
 * @enum {number}
 */
proto.db.v1.TypedQueryResponse.ResponseCase = {
  RESPONSE_NOT_SET: 0,
  HEADER: 1,
  BATCH: 2,
  COMPLETE: 3,
  DML: 4,
  ERROR: 5
};

/**
 * @return {proto.db.v1.TypedQueryResponse.ResponseCase}
 */
proto.db.v1.TypedQueryResponse.prototype.getResponseCase = function() {
  return /** @type {proto.db.v1.TypedQueryResponse.ResponseCase} */(jspb.Message.computeOneofCase(this, proto.db.v1.TypedQueryResponse.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TypedQueryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TypedQueryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TypedQueryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
header: (f = msg.getHeader()) && proto.db.v1.TypedQueryResultHeader.toObject(includeInstance, f),
batch: (f = msg.getBatch()) && proto.db.v1.TypedQueryResultRowBatch.toObject(includeInstance, f),
complete: (f = msg.getComplete()) && proto.db.v1.QueryComplete.toObject(includeInstance, f),
dml: (f = msg.getDml()) && proto.db.v1.DMLResult.toObject(includeInstance, f),
error: (f = msg.getError()) && proto.db.v1.ErrorResponse.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TypedQueryResponse}
 */
proto.db.v1.TypedQueryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TypedQueryResponse;
  return proto.db.v1.TypedQueryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TypedQueryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TypedQueryResponse}
 */
proto.db.v1.TypedQueryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.TypedQueryResultHeader;
      reader.readMessage(value,proto.db.v1.TypedQueryResultHeader.deserializeBinaryFromReader);
      msg.setHeader(value);
      break;
    case 2:
      var value = new proto.db.v1.TypedQueryResultRowBatch;
      reader.readMessage(value,proto.db.v1.TypedQueryResultRowBatch.deserializeBinaryFromReader);
      msg.setBatch(value);
      break;
    case 3:
      var value = new proto.db.v1.QueryComplete;
      reader.readMessage(value,proto.db.v1.QueryComplete.deserializeBinaryFromReader);
      msg.setComplete(value);
      break;
    case 4:
      var value = new proto.db.v1.DMLResult;
      reader.readMessage(value,proto.db.v1.DMLResult.deserializeBinaryFromReader);
      msg.setDml(value);
      break;
    case 5:
      var value = new proto.db.v1.ErrorResponse;
      reader.readMessage(value,proto.db.v1.ErrorResponse.deserializeBinaryFromReader);
      msg.setError(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TypedQueryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TypedQueryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TypedQueryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TypedQueryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHeader();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.db.v1.TypedQueryResultHeader.serializeBinaryToWriter
    );
  }
  f = message.getBatch();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.TypedQueryResultRowBatch.serializeBinaryToWriter
    );
  }
  f = message.getComplete();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.QueryComplete.serializeBinaryToWriter
    );
  }
  f = message.getDml();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.db.v1.DMLResult.serializeBinaryToWriter
    );
  }
  f = message.getError();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.db.v1.ErrorResponse.serializeBinaryToWriter
    );
  }
};


/**
 * optional TypedQueryResultHeader header = 1;
 * @return {?proto.db.v1.TypedQueryResultHeader}
 */
proto.db.v1.TypedQueryResponse.prototype.getHeader = function() {
  return /** @type{?proto.db.v1.TypedQueryResultHeader} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedQueryResultHeader, 1));
};


/**
 * @param {?proto.db.v1.TypedQueryResultHeader|undefined} value
 * @return {!proto.db.v1.TypedQueryResponse} returns this
*/
proto.db.v1.TypedQueryResponse.prototype.setHeader = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.db.v1.TypedQueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedQueryResponse} returns this
 */
proto.db.v1.TypedQueryResponse.prototype.clearHeader = function() {
  return this.setHeader(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedQueryResponse.prototype.hasHeader = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional TypedQueryResultRowBatch batch = 2;
 * @return {?proto.db.v1.TypedQueryResultRowBatch}
 */
proto.db.v1.TypedQueryResponse.prototype.getBatch = function() {
  return /** @type{?proto.db.v1.TypedQueryResultRowBatch} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.TypedQueryResultRowBatch, 2));
};


/**
 * @param {?proto.db.v1.TypedQueryResultRowBatch|undefined} value
 * @return {!proto.db.v1.TypedQueryResponse} returns this
*/
proto.db.v1.TypedQueryResponse.prototype.setBatch = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.db.v1.TypedQueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedQueryResponse} returns this
 */
proto.db.v1.TypedQueryResponse.prototype.clearBatch = function() {
  return this.setBatch(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedQueryResponse.prototype.hasBatch = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional QueryComplete complete = 3;
 * @return {?proto.db.v1.QueryComplete}
 */
proto.db.v1.TypedQueryResponse.prototype.getComplete = function() {
  return /** @type{?proto.db.v1.QueryComplete} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.QueryComplete, 3));
};


/**
 * @param {?proto.db.v1.QueryComplete|undefined} value
 * @return {!proto.db.v1.TypedQueryResponse} returns this
*/
proto.db.v1.TypedQueryResponse.prototype.setComplete = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.db.v1.TypedQueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedQueryResponse} returns this
 */
proto.db.v1.TypedQueryResponse.prototype.clearComplete = function() {
  return this.setComplete(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedQueryResponse.prototype.hasComplete = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional DMLResult dml = 4;
 * @return {?proto.db.v1.DMLResult}
 */
proto.db.v1.TypedQueryResponse.prototype.getDml = function() {
  return /** @type{?proto.db.v1.DMLResult} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.DMLResult, 4));
};


/**
 * @param {?proto.db.v1.DMLResult|undefined} value
 * @return {!proto.db.v1.TypedQueryResponse} returns this
*/
proto.db.v1.TypedQueryResponse.prototype.setDml = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.db.v1.TypedQueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedQueryResponse} returns this
 */
proto.db.v1.TypedQueryResponse.prototype.clearDml = function() {
  return this.setDml(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedQueryResponse.prototype.hasDml = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional ErrorResponse error = 5;
 * @return {?proto.db.v1.ErrorResponse}
 */
proto.db.v1.TypedQueryResponse.prototype.getError = function() {
  return /** @type{?proto.db.v1.ErrorResponse} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.ErrorResponse, 5));
};


/**
 * @param {?proto.db.v1.ErrorResponse|undefined} value
 * @return {!proto.db.v1.TypedQueryResponse} returns this
*/
proto.db.v1.TypedQueryResponse.prototype.setError = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.db.v1.TypedQueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.TypedQueryResponse} returns this
 */
proto.db.v1.TypedQueryResponse.prototype.clearError = function() {
  return this.setError(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.TypedQueryResponse.prototype.hasError = function() {
  return jspb.Message.getField(this, 5) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.DatabaseConfig.repeatedFields_ = [6,11,12];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DatabaseConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DatabaseConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DatabaseConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DatabaseConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
dbPath: jspb.Message.getFieldWithDefault(msg, 2, ""),
isEncrypted: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
key: jspb.Message.getFieldWithDefault(msg, 4, ""),
readOnly: jspb.Message.getBooleanFieldWithDefault(msg, 5, false),
extensionsList: (f = jspb.Message.getRepeatedField(msg, 6)) == null ? undefined : f,
pragmasMap: (f = msg.getPragmasMap()) ? f.toObject(includeInstance, undefined) : [],
maxOpenConns: jspb.Message.getFieldWithDefault(msg, 8, 0),
maxIdleConns: jspb.Message.getFieldWithDefault(msg, 9, 0),
connMaxLifetimeMs: jspb.Message.getFieldWithDefault(msg, 10, 0),
initCommandsList: (f = jspb.Message.getRepeatedField(msg, 11)) == null ? undefined : f,
attachmentsList: jspb.Message.toObjectList(msg.getAttachmentsList(),
    proto.db.v1.Attachment.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DatabaseConfig}
 */
proto.db.v1.DatabaseConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DatabaseConfig;
  return proto.db.v1.DatabaseConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DatabaseConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DatabaseConfig}
 */
proto.db.v1.DatabaseConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDbPath(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsEncrypted(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setKey(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setReadOnly(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addExtensions(value);
      break;
    case 7:
      var value = msg.getPragmasMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readStringRequireUtf8, jspb.BinaryReader.prototype.readStringRequireUtf8, null, "", "");
         });
      break;
    case 8:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxOpenConns(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxIdleConns(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setConnMaxLifetimeMs(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addInitCommands(value);
      break;
    case 12:
      var value = new proto.db.v1.Attachment;
      reader.readMessage(value,proto.db.v1.Attachment.deserializeBinaryFromReader);
      msg.addAttachments(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DatabaseConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DatabaseConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DatabaseConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DatabaseConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDbPath();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getIsEncrypted();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getReadOnly();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
  f = message.getExtensionsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      6,
      f
    );
  }
  f = message.getPragmasMap(true);
  if (f && f.getLength() > 0) {
jspb.internal.public_for_gencode.serializeMapToBinary(
    message.getPragmasMap(true),
    7,
    writer,
    jspb.BinaryWriter.prototype.writeString,
    jspb.BinaryWriter.prototype.writeString);
  }
  f = message.getMaxOpenConns();
  if (f !== 0) {
    writer.writeInt32(
      8,
      f
    );
  }
  f = message.getMaxIdleConns();
  if (f !== 0) {
    writer.writeInt32(
      9,
      f
    );
  }
  f = message.getConnMaxLifetimeMs();
  if (f !== 0) {
    writer.writeInt32(
      10,
      f
    );
  }
  f = message.getInitCommandsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      11,
      f
    );
  }
  f = message.getAttachmentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      12,
      f,
      proto.db.v1.Attachment.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.DatabaseConfig.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string db_path = 2;
 * @return {string}
 */
proto.db.v1.DatabaseConfig.prototype.getDbPath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setDbPath = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool is_encrypted = 3;
 * @return {boolean}
 */
proto.db.v1.DatabaseConfig.prototype.getIsEncrypted = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setIsEncrypted = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * optional string key = 4;
 * @return {string}
 */
proto.db.v1.DatabaseConfig.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bool read_only = 5;
 * @return {boolean}
 */
proto.db.v1.DatabaseConfig.prototype.getReadOnly = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setReadOnly = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};


/**
 * repeated string extensions = 6;
 * @return {!Array<string>}
 */
proto.db.v1.DatabaseConfig.prototype.getExtensionsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 6));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setExtensionsList = function(value) {
  return jspb.Message.setField(this, 6, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.addExtensions = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 6, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.clearExtensionsList = function() {
  return this.setExtensionsList([]);
};


/**
 * map<string, string> pragmas = 7;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.db.v1.DatabaseConfig.prototype.getPragmasMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 7, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.clearPragmasMap = function() {
  this.getPragmasMap().clear();
  return this;
};


/**
 * optional int32 max_open_conns = 8;
 * @return {number}
 */
proto.db.v1.DatabaseConfig.prototype.getMaxOpenConns = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setMaxOpenConns = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};


/**
 * optional int32 max_idle_conns = 9;
 * @return {number}
 */
proto.db.v1.DatabaseConfig.prototype.getMaxIdleConns = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setMaxIdleConns = function(value) {
  return jspb.Message.setProto3IntField(this, 9, value);
};


/**
 * optional int32 conn_max_lifetime_ms = 10;
 * @return {number}
 */
proto.db.v1.DatabaseConfig.prototype.getConnMaxLifetimeMs = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setConnMaxLifetimeMs = function(value) {
  return jspb.Message.setProto3IntField(this, 10, value);
};


/**
 * repeated string init_commands = 11;
 * @return {!Array<string>}
 */
proto.db.v1.DatabaseConfig.prototype.getInitCommandsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 11));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.setInitCommandsList = function(value) {
  return jspb.Message.setField(this, 11, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.addInitCommands = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 11, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.clearInitCommandsList = function() {
  return this.setInitCommandsList([]);
};


/**
 * repeated Attachment attachments = 12;
 * @return {!Array<!proto.db.v1.Attachment>}
 */
proto.db.v1.DatabaseConfig.prototype.getAttachmentsList = function() {
  return /** @type{!Array<!proto.db.v1.Attachment>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.Attachment, 12));
};


/**
 * @param {!Array<!proto.db.v1.Attachment>} value
 * @return {!proto.db.v1.DatabaseConfig} returns this
*/
proto.db.v1.DatabaseConfig.prototype.setAttachmentsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 12, value);
};


/**
 * @param {!proto.db.v1.Attachment=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.Attachment}
 */
proto.db.v1.DatabaseConfig.prototype.addAttachments = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 12, opt_value, proto.db.v1.Attachment, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.DatabaseConfig} returns this
 */
proto.db.v1.DatabaseConfig.prototype.clearAttachmentsList = function() {
  return this.setAttachmentsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.Attachment.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.Attachment.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.Attachment} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.Attachment.toObject = function(includeInstance, msg) {
  var f, obj = {
targetDatabaseName: jspb.Message.getFieldWithDefault(msg, 1, ""),
alias: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.Attachment}
 */
proto.db.v1.Attachment.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.Attachment;
  return proto.db.v1.Attachment.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.Attachment} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.Attachment}
 */
proto.db.v1.Attachment.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTargetDatabaseName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setAlias(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.Attachment.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.Attachment.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.Attachment} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.Attachment.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTargetDatabaseName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAlias();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string target_database_name = 1;
 * @return {string}
 */
proto.db.v1.Attachment.prototype.getTargetDatabaseName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.Attachment} returns this
 */
proto.db.v1.Attachment.prototype.setTargetDatabaseName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string alias = 2;
 * @return {string}
 */
proto.db.v1.Attachment.prototype.getAlias = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.Attachment} returns this
 */
proto.db.v1.Attachment.prototype.setAlias = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.ExplainResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ExplainResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ExplainResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ExplainResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExplainResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
nodesList: jspb.Message.toObjectList(msg.getNodesList(),
    proto.db.v1.QueryPlanNode.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ExplainResponse}
 */
proto.db.v1.ExplainResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ExplainResponse;
  return proto.db.v1.ExplainResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ExplainResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ExplainResponse}
 */
proto.db.v1.ExplainResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.QueryPlanNode;
      reader.readMessage(value,proto.db.v1.QueryPlanNode.deserializeBinaryFromReader);
      msg.addNodes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ExplainResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ExplainResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ExplainResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExplainResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNodesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.QueryPlanNode.serializeBinaryToWriter
    );
  }
};


/**
 * repeated QueryPlanNode nodes = 1;
 * @return {!Array<!proto.db.v1.QueryPlanNode>}
 */
proto.db.v1.ExplainResponse.prototype.getNodesList = function() {
  return /** @type{!Array<!proto.db.v1.QueryPlanNode>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.QueryPlanNode, 1));
};


/**
 * @param {!Array<!proto.db.v1.QueryPlanNode>} value
 * @return {!proto.db.v1.ExplainResponse} returns this
*/
proto.db.v1.ExplainResponse.prototype.setNodesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.QueryPlanNode=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.QueryPlanNode}
 */
proto.db.v1.ExplainResponse.prototype.addNodes = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.QueryPlanNode, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.ExplainResponse} returns this
 */
proto.db.v1.ExplainResponse.prototype.clearNodesList = function() {
  return this.setNodesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.QueryPlanNode.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.QueryPlanNode.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.QueryPlanNode} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryPlanNode.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
parentId: jspb.Message.getFieldWithDefault(msg, 2, 0),
detail: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.QueryPlanNode}
 */
proto.db.v1.QueryPlanNode.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.QueryPlanNode;
  return proto.db.v1.QueryPlanNode.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.QueryPlanNode} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.QueryPlanNode}
 */
proto.db.v1.QueryPlanNode.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setParentId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDetail(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.QueryPlanNode.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.QueryPlanNode.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.QueryPlanNode} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.QueryPlanNode.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getParentId();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getDetail();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.db.v1.QueryPlanNode.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.QueryPlanNode} returns this
 */
proto.db.v1.QueryPlanNode.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 parent_id = 2;
 * @return {number}
 */
proto.db.v1.QueryPlanNode.prototype.getParentId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.QueryPlanNode} returns this
 */
proto.db.v1.QueryPlanNode.prototype.setParentId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string detail = 3;
 * @return {string}
 */
proto.db.v1.QueryPlanNode.prototype.getDetail = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.QueryPlanNode} returns this
 */
proto.db.v1.QueryPlanNode.prototype.setDetail = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ListTablesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ListTablesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ListTablesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListTablesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ListTablesRequest}
 */
proto.db.v1.ListTablesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ListTablesRequest;
  return proto.db.v1.ListTablesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ListTablesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ListTablesRequest}
 */
proto.db.v1.ListTablesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ListTablesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ListTablesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ListTablesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListTablesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.ListTablesRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ListTablesRequest} returns this
 */
proto.db.v1.ListTablesRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.ListTablesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ListTablesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ListTablesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ListTablesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListTablesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
tableNamesList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ListTablesResponse}
 */
proto.db.v1.ListTablesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ListTablesResponse;
  return proto.db.v1.ListTablesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ListTablesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ListTablesResponse}
 */
proto.db.v1.ListTablesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addTableNames(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ListTablesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ListTablesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ListTablesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ListTablesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTableNamesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
};


/**
 * repeated string table_names = 1;
 * @return {!Array<string>}
 */
proto.db.v1.ListTablesResponse.prototype.getTableNamesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.ListTablesResponse} returns this
 */
proto.db.v1.ListTablesResponse.prototype.setTableNamesList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.ListTablesResponse} returns this
 */
proto.db.v1.ListTablesResponse.prototype.addTableNames = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.ListTablesResponse} returns this
 */
proto.db.v1.ListTablesResponse.prototype.clearTableNamesList = function() {
  return this.setTableNamesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.GetTableSchemaRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.GetTableSchemaRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.GetTableSchemaRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.GetTableSchemaRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
tableName: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.GetTableSchemaRequest}
 */
proto.db.v1.GetTableSchemaRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.GetTableSchemaRequest;
  return proto.db.v1.GetTableSchemaRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.GetTableSchemaRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.GetTableSchemaRequest}
 */
proto.db.v1.GetTableSchemaRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTableName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.GetTableSchemaRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.GetTableSchemaRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.GetTableSchemaRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.GetTableSchemaRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTableName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.GetTableSchemaRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.GetTableSchemaRequest} returns this
 */
proto.db.v1.GetTableSchemaRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string table_name = 2;
 * @return {string}
 */
proto.db.v1.GetTableSchemaRequest.prototype.getTableName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.GetTableSchemaRequest} returns this
 */
proto.db.v1.GetTableSchemaRequest.prototype.setTableName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.GetDatabaseSchemaRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.GetDatabaseSchemaRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.GetDatabaseSchemaRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.GetDatabaseSchemaRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.GetDatabaseSchemaRequest}
 */
proto.db.v1.GetDatabaseSchemaRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.GetDatabaseSchemaRequest;
  return proto.db.v1.GetDatabaseSchemaRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.GetDatabaseSchemaRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.GetDatabaseSchemaRequest}
 */
proto.db.v1.GetDatabaseSchemaRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDatabase(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.GetDatabaseSchemaRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.GetDatabaseSchemaRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.GetDatabaseSchemaRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.GetDatabaseSchemaRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.db.v1.GetDatabaseSchemaRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.GetDatabaseSchemaRequest} returns this
 */
proto.db.v1.GetDatabaseSchemaRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.TableSchema.repeatedFields_ = [3,4,5,6];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TableSchema.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TableSchema.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TableSchema} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TableSchema.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, ""),
columnsList: jspb.Message.toObjectList(msg.getColumnsList(),
    proto.db.v1.ColumnSchema.toObject, includeInstance),
indexesList: jspb.Message.toObjectList(msg.getIndexesList(),
    proto.db.v1.IndexSchema.toObject, includeInstance),
foreignKeysList: jspb.Message.toObjectList(msg.getForeignKeysList(),
    proto.db.v1.ForeignKeySchema.toObject, includeInstance),
triggersList: jspb.Message.toObjectList(msg.getTriggersList(),
    proto.db.v1.TriggerSchema.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TableSchema}
 */
proto.db.v1.TableSchema.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TableSchema;
  return proto.db.v1.TableSchema.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TableSchema} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TableSchema}
 */
proto.db.v1.TableSchema.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setSql(value);
      break;
    case 3:
      var value = new proto.db.v1.ColumnSchema;
      reader.readMessage(value,proto.db.v1.ColumnSchema.deserializeBinaryFromReader);
      msg.addColumns(value);
      break;
    case 4:
      var value = new proto.db.v1.IndexSchema;
      reader.readMessage(value,proto.db.v1.IndexSchema.deserializeBinaryFromReader);
      msg.addIndexes(value);
      break;
    case 5:
      var value = new proto.db.v1.ForeignKeySchema;
      reader.readMessage(value,proto.db.v1.ForeignKeySchema.deserializeBinaryFromReader);
      msg.addForeignKeys(value);
      break;
    case 6:
      var value = new proto.db.v1.TriggerSchema;
      reader.readMessage(value,proto.db.v1.TriggerSchema.deserializeBinaryFromReader);
      msg.addTriggers(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TableSchema.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TableSchema.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TableSchema} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TableSchema.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSql();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getColumnsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.db.v1.ColumnSchema.serializeBinaryToWriter
    );
  }
  f = message.getIndexesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.db.v1.IndexSchema.serializeBinaryToWriter
    );
  }
  f = message.getForeignKeysList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.db.v1.ForeignKeySchema.serializeBinaryToWriter
    );
  }
  f = message.getTriggersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      6,
      f,
      proto.db.v1.TriggerSchema.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.TableSchema.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TableSchema} returns this
 */
proto.db.v1.TableSchema.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.db.v1.TableSchema.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TableSchema} returns this
 */
proto.db.v1.TableSchema.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated ColumnSchema columns = 3;
 * @return {!Array<!proto.db.v1.ColumnSchema>}
 */
proto.db.v1.TableSchema.prototype.getColumnsList = function() {
  return /** @type{!Array<!proto.db.v1.ColumnSchema>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.ColumnSchema, 3));
};


/**
 * @param {!Array<!proto.db.v1.ColumnSchema>} value
 * @return {!proto.db.v1.TableSchema} returns this
*/
proto.db.v1.TableSchema.prototype.setColumnsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.db.v1.ColumnSchema=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.ColumnSchema}
 */
proto.db.v1.TableSchema.prototype.addColumns = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.db.v1.ColumnSchema, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TableSchema} returns this
 */
proto.db.v1.TableSchema.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * repeated IndexSchema indexes = 4;
 * @return {!Array<!proto.db.v1.IndexSchema>}
 */
proto.db.v1.TableSchema.prototype.getIndexesList = function() {
  return /** @type{!Array<!proto.db.v1.IndexSchema>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.IndexSchema, 4));
};


/**
 * @param {!Array<!proto.db.v1.IndexSchema>} value
 * @return {!proto.db.v1.TableSchema} returns this
*/
proto.db.v1.TableSchema.prototype.setIndexesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.db.v1.IndexSchema=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.IndexSchema}
 */
proto.db.v1.TableSchema.prototype.addIndexes = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.db.v1.IndexSchema, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TableSchema} returns this
 */
proto.db.v1.TableSchema.prototype.clearIndexesList = function() {
  return this.setIndexesList([]);
};


/**
 * repeated ForeignKeySchema foreign_keys = 5;
 * @return {!Array<!proto.db.v1.ForeignKeySchema>}
 */
proto.db.v1.TableSchema.prototype.getForeignKeysList = function() {
  return /** @type{!Array<!proto.db.v1.ForeignKeySchema>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.ForeignKeySchema, 5));
};


/**
 * @param {!Array<!proto.db.v1.ForeignKeySchema>} value
 * @return {!proto.db.v1.TableSchema} returns this
*/
proto.db.v1.TableSchema.prototype.setForeignKeysList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.db.v1.ForeignKeySchema=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.ForeignKeySchema}
 */
proto.db.v1.TableSchema.prototype.addForeignKeys = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.db.v1.ForeignKeySchema, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TableSchema} returns this
 */
proto.db.v1.TableSchema.prototype.clearForeignKeysList = function() {
  return this.setForeignKeysList([]);
};


/**
 * repeated TriggerSchema triggers = 6;
 * @return {!Array<!proto.db.v1.TriggerSchema>}
 */
proto.db.v1.TableSchema.prototype.getTriggersList = function() {
  return /** @type{!Array<!proto.db.v1.TriggerSchema>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.TriggerSchema, 6));
};


/**
 * @param {!Array<!proto.db.v1.TriggerSchema>} value
 * @return {!proto.db.v1.TableSchema} returns this
*/
proto.db.v1.TableSchema.prototype.setTriggersList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 6, value);
};


/**
 * @param {!proto.db.v1.TriggerSchema=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TriggerSchema}
 */
proto.db.v1.TableSchema.prototype.addTriggers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 6, opt_value, proto.db.v1.TriggerSchema, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.TableSchema} returns this
 */
proto.db.v1.TableSchema.prototype.clearTriggersList = function() {
  return this.setTriggersList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ColumnSchema.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ColumnSchema.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ColumnSchema} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ColumnSchema.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
type: jspb.Message.getFieldWithDefault(msg, 2, ""),
notNull: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
defaultValue: jspb.Message.getFieldWithDefault(msg, 4, ""),
primaryKey: jspb.Message.getBooleanFieldWithDefault(msg, 5, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ColumnSchema}
 */
proto.db.v1.ColumnSchema.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ColumnSchema;
  return proto.db.v1.ColumnSchema.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ColumnSchema} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ColumnSchema}
 */
proto.db.v1.ColumnSchema.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setType(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setNotNull(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setDefaultValue(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPrimaryKey(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ColumnSchema.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ColumnSchema.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ColumnSchema} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ColumnSchema.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getNotNull();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getDefaultValue();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPrimaryKey();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.ColumnSchema.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ColumnSchema} returns this
 */
proto.db.v1.ColumnSchema.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string type = 2;
 * @return {string}
 */
proto.db.v1.ColumnSchema.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ColumnSchema} returns this
 */
proto.db.v1.ColumnSchema.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool not_null = 3;
 * @return {boolean}
 */
proto.db.v1.ColumnSchema.prototype.getNotNull = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.ColumnSchema} returns this
 */
proto.db.v1.ColumnSchema.prototype.setNotNull = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * optional string default_value = 4;
 * @return {string}
 */
proto.db.v1.ColumnSchema.prototype.getDefaultValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ColumnSchema} returns this
 */
proto.db.v1.ColumnSchema.prototype.setDefaultValue = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bool primary_key = 5;
 * @return {boolean}
 */
proto.db.v1.ColumnSchema.prototype.getPrimaryKey = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.ColumnSchema} returns this
 */
proto.db.v1.ColumnSchema.prototype.setPrimaryKey = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.IndexSchema.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.IndexSchema.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.IndexSchema.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.IndexSchema} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.IndexSchema.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
unique: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
columnsList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
sql: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.IndexSchema}
 */
proto.db.v1.IndexSchema.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.IndexSchema;
  return proto.db.v1.IndexSchema.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.IndexSchema} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.IndexSchema}
 */
proto.db.v1.IndexSchema.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setUnique(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addColumns(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setSql(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.IndexSchema.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.IndexSchema.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.IndexSchema} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.IndexSchema.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getUnique();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getColumnsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
  f = message.getSql();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.IndexSchema.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.IndexSchema} returns this
 */
proto.db.v1.IndexSchema.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool unique = 2;
 * @return {boolean}
 */
proto.db.v1.IndexSchema.prototype.getUnique = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.IndexSchema} returns this
 */
proto.db.v1.IndexSchema.prototype.setUnique = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * repeated string columns = 3;
 * @return {!Array<string>}
 */
proto.db.v1.IndexSchema.prototype.getColumnsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.IndexSchema} returns this
 */
proto.db.v1.IndexSchema.prototype.setColumnsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.IndexSchema} returns this
 */
proto.db.v1.IndexSchema.prototype.addColumns = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.IndexSchema} returns this
 */
proto.db.v1.IndexSchema.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * optional string sql = 4;
 * @return {string}
 */
proto.db.v1.IndexSchema.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.IndexSchema} returns this
 */
proto.db.v1.IndexSchema.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ForeignKeySchema.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ForeignKeySchema.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ForeignKeySchema} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ForeignKeySchema.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
table: jspb.Message.getFieldWithDefault(msg, 2, ""),
fromColumn: jspb.Message.getFieldWithDefault(msg, 3, ""),
toColumn: jspb.Message.getFieldWithDefault(msg, 4, ""),
onUpdate: jspb.Message.getFieldWithDefault(msg, 5, ""),
onDelete: jspb.Message.getFieldWithDefault(msg, 6, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ForeignKeySchema}
 */
proto.db.v1.ForeignKeySchema.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ForeignKeySchema;
  return proto.db.v1.ForeignKeySchema.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ForeignKeySchema} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ForeignKeySchema}
 */
proto.db.v1.ForeignKeySchema.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setTable(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setFromColumn(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setToColumn(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setOnUpdate(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setOnDelete(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ForeignKeySchema.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ForeignKeySchema.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ForeignKeySchema} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ForeignKeySchema.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getTable();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getFromColumn();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getToColumn();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getOnUpdate();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getOnDelete();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.db.v1.ForeignKeySchema.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.ForeignKeySchema} returns this
 */
proto.db.v1.ForeignKeySchema.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string table = 2;
 * @return {string}
 */
proto.db.v1.ForeignKeySchema.prototype.getTable = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ForeignKeySchema} returns this
 */
proto.db.v1.ForeignKeySchema.prototype.setTable = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string from_column = 3;
 * @return {string}
 */
proto.db.v1.ForeignKeySchema.prototype.getFromColumn = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ForeignKeySchema} returns this
 */
proto.db.v1.ForeignKeySchema.prototype.setFromColumn = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string to_column = 4;
 * @return {string}
 */
proto.db.v1.ForeignKeySchema.prototype.getToColumn = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ForeignKeySchema} returns this
 */
proto.db.v1.ForeignKeySchema.prototype.setToColumn = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string on_update = 5;
 * @return {string}
 */
proto.db.v1.ForeignKeySchema.prototype.getOnUpdate = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ForeignKeySchema} returns this
 */
proto.db.v1.ForeignKeySchema.prototype.setOnUpdate = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string on_delete = 6;
 * @return {string}
 */
proto.db.v1.ForeignKeySchema.prototype.getOnDelete = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.ForeignKeySchema} returns this
 */
proto.db.v1.ForeignKeySchema.prototype.setOnDelete = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.TriggerSchema.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.TriggerSchema.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.TriggerSchema} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TriggerSchema.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.TriggerSchema}
 */
proto.db.v1.TriggerSchema.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.TriggerSchema;
  return proto.db.v1.TriggerSchema.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.TriggerSchema} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.TriggerSchema}
 */
proto.db.v1.TriggerSchema.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setSql(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.TriggerSchema.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.TriggerSchema.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.TriggerSchema} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.TriggerSchema.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSql();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.TriggerSchema.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TriggerSchema} returns this
 */
proto.db.v1.TriggerSchema.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.db.v1.TriggerSchema.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.TriggerSchema} returns this
 */
proto.db.v1.TriggerSchema.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.DatabaseSchema.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DatabaseSchema.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DatabaseSchema.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DatabaseSchema} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DatabaseSchema.toObject = function(includeInstance, msg) {
  var f, obj = {
tablesList: jspb.Message.toObjectList(msg.getTablesList(),
    proto.db.v1.TableSchema.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DatabaseSchema}
 */
proto.db.v1.DatabaseSchema.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DatabaseSchema;
  return proto.db.v1.DatabaseSchema.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DatabaseSchema} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DatabaseSchema}
 */
proto.db.v1.DatabaseSchema.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.TableSchema;
      reader.readMessage(value,proto.db.v1.TableSchema.deserializeBinaryFromReader);
      msg.addTables(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DatabaseSchema.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DatabaseSchema.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DatabaseSchema} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DatabaseSchema.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTablesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.TableSchema.serializeBinaryToWriter
    );
  }
};


/**
 * repeated TableSchema tables = 1;
 * @return {!Array<!proto.db.v1.TableSchema>}
 */
proto.db.v1.DatabaseSchema.prototype.getTablesList = function() {
  return /** @type{!Array<!proto.db.v1.TableSchema>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.TableSchema, 1));
};


/**
 * @param {!Array<!proto.db.v1.TableSchema>} value
 * @return {!proto.db.v1.DatabaseSchema} returns this
*/
proto.db.v1.DatabaseSchema.prototype.setTablesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.TableSchema=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.TableSchema}
 */
proto.db.v1.DatabaseSchema.prototype.addTables = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.TableSchema, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.DatabaseSchema} returns this
 */
proto.db.v1.DatabaseSchema.prototype.clearTablesList = function() {
  return this.setTablesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.UpdateDatabaseConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.UpdateDatabaseConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateDatabaseConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
readOnly: (f = jspb.Message.getBooleanField(msg, 1)) == null ? undefined : f,
extensions: (f = msg.getExtensions()) && proto.db.v1.ExtensionList.toObject(includeInstance, f),
pragmas: (f = msg.getPragmas()) && proto.db.v1.PragmaMap.toObject(includeInstance, f),
maxOpenConns: (f = jspb.Message.getField(msg, 4)) == null ? undefined : f,
maxIdleConns: (f = jspb.Message.getField(msg, 5)) == null ? undefined : f,
connMaxLifetimeMs: (f = jspb.Message.getField(msg, 6)) == null ? undefined : f,
initCommands: (f = msg.getInitCommands()) && proto.db.v1.InitCommandList.toObject(includeInstance, f),
attachments: (f = msg.getAttachments()) && proto.db.v1.AttachmentList.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.UpdateDatabaseConfig}
 */
proto.db.v1.UpdateDatabaseConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.UpdateDatabaseConfig;
  return proto.db.v1.UpdateDatabaseConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.UpdateDatabaseConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.UpdateDatabaseConfig}
 */
proto.db.v1.UpdateDatabaseConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setReadOnly(value);
      break;
    case 2:
      var value = new proto.db.v1.ExtensionList;
      reader.readMessage(value,proto.db.v1.ExtensionList.deserializeBinaryFromReader);
      msg.setExtensions(value);
      break;
    case 3:
      var value = new proto.db.v1.PragmaMap;
      reader.readMessage(value,proto.db.v1.PragmaMap.deserializeBinaryFromReader);
      msg.setPragmas(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxOpenConns(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxIdleConns(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setConnMaxLifetimeMs(value);
      break;
    case 7:
      var value = new proto.db.v1.InitCommandList;
      reader.readMessage(value,proto.db.v1.InitCommandList.deserializeBinaryFromReader);
      msg.setInitCommands(value);
      break;
    case 8:
      var value = new proto.db.v1.AttachmentList;
      reader.readMessage(value,proto.db.v1.AttachmentList.deserializeBinaryFromReader);
      msg.setAttachments(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.UpdateDatabaseConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.UpdateDatabaseConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateDatabaseConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {boolean} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getExtensions();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.ExtensionList.serializeBinaryToWriter
    );
  }
  f = message.getPragmas();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.db.v1.PragmaMap.serializeBinaryToWriter
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeInt32(
      4,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeInt32(
      6,
      f
    );
  }
  f = message.getInitCommands();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.db.v1.InitCommandList.serializeBinaryToWriter
    );
  }
  f = message.getAttachments();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.db.v1.AttachmentList.serializeBinaryToWriter
    );
  }
};


/**
 * optional bool read_only = 1;
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.getReadOnly = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.setReadOnly = function(value) {
  return jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.clearReadOnly = function() {
  return jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.hasReadOnly = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ExtensionList extensions = 2;
 * @return {?proto.db.v1.ExtensionList}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.getExtensions = function() {
  return /** @type{?proto.db.v1.ExtensionList} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.ExtensionList, 2));
};


/**
 * @param {?proto.db.v1.ExtensionList|undefined} value
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
*/
proto.db.v1.UpdateDatabaseConfig.prototype.setExtensions = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.clearExtensions = function() {
  return this.setExtensions(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.hasExtensions = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional PragmaMap pragmas = 3;
 * @return {?proto.db.v1.PragmaMap}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.getPragmas = function() {
  return /** @type{?proto.db.v1.PragmaMap} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.PragmaMap, 3));
};


/**
 * @param {?proto.db.v1.PragmaMap|undefined} value
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
*/
proto.db.v1.UpdateDatabaseConfig.prototype.setPragmas = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.clearPragmas = function() {
  return this.setPragmas(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.hasPragmas = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional int32 max_open_conns = 4;
 * @return {number}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.getMaxOpenConns = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.setMaxOpenConns = function(value) {
  return jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.clearMaxOpenConns = function() {
  return jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.hasMaxOpenConns = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional int32 max_idle_conns = 5;
 * @return {number}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.getMaxIdleConns = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.setMaxIdleConns = function(value) {
  return jspb.Message.setField(this, 5, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.clearMaxIdleConns = function() {
  return jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.hasMaxIdleConns = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional int32 conn_max_lifetime_ms = 6;
 * @return {number}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.getConnMaxLifetimeMs = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.setConnMaxLifetimeMs = function(value) {
  return jspb.Message.setField(this, 6, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.clearConnMaxLifetimeMs = function() {
  return jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.hasConnMaxLifetimeMs = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional InitCommandList init_commands = 7;
 * @return {?proto.db.v1.InitCommandList}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.getInitCommands = function() {
  return /** @type{?proto.db.v1.InitCommandList} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.InitCommandList, 7));
};


/**
 * @param {?proto.db.v1.InitCommandList|undefined} value
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
*/
proto.db.v1.UpdateDatabaseConfig.prototype.setInitCommands = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.clearInitCommands = function() {
  return this.setInitCommands(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.hasInitCommands = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional AttachmentList attachments = 8;
 * @return {?proto.db.v1.AttachmentList}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.getAttachments = function() {
  return /** @type{?proto.db.v1.AttachmentList} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.AttachmentList, 8));
};


/**
 * @param {?proto.db.v1.AttachmentList|undefined} value
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
*/
proto.db.v1.UpdateDatabaseConfig.prototype.setAttachments = function(value) {
  return jspb.Message.setWrapperField(this, 8, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.UpdateDatabaseConfig} returns this
 */
proto.db.v1.UpdateDatabaseConfig.prototype.clearAttachments = function() {
  return this.setAttachments(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseConfig.prototype.hasAttachments = function() {
  return jspb.Message.getField(this, 8) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.AttachmentList.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.AttachmentList.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.AttachmentList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.AttachmentList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.AttachmentList.toObject = function(includeInstance, msg) {
  var f, obj = {
valuesList: jspb.Message.toObjectList(msg.getValuesList(),
    proto.db.v1.Attachment.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.AttachmentList}
 */
proto.db.v1.AttachmentList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.AttachmentList;
  return proto.db.v1.AttachmentList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.AttachmentList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.AttachmentList}
 */
proto.db.v1.AttachmentList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.db.v1.Attachment;
      reader.readMessage(value,proto.db.v1.Attachment.deserializeBinaryFromReader);
      msg.addValues(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.AttachmentList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.AttachmentList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.AttachmentList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.AttachmentList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValuesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.db.v1.Attachment.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Attachment values = 1;
 * @return {!Array<!proto.db.v1.Attachment>}
 */
proto.db.v1.AttachmentList.prototype.getValuesList = function() {
  return /** @type{!Array<!proto.db.v1.Attachment>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.db.v1.Attachment, 1));
};


/**
 * @param {!Array<!proto.db.v1.Attachment>} value
 * @return {!proto.db.v1.AttachmentList} returns this
*/
proto.db.v1.AttachmentList.prototype.setValuesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.db.v1.Attachment=} opt_value
 * @param {number=} opt_index
 * @return {!proto.db.v1.Attachment}
 */
proto.db.v1.AttachmentList.prototype.addValues = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.db.v1.Attachment, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.AttachmentList} returns this
 */
proto.db.v1.AttachmentList.prototype.clearValuesList = function() {
  return this.setValuesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.ExtensionList.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.ExtensionList.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.ExtensionList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.ExtensionList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExtensionList.toObject = function(includeInstance, msg) {
  var f, obj = {
valuesList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.ExtensionList}
 */
proto.db.v1.ExtensionList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.ExtensionList;
  return proto.db.v1.ExtensionList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.ExtensionList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.ExtensionList}
 */
proto.db.v1.ExtensionList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addValues(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.ExtensionList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.ExtensionList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.ExtensionList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.ExtensionList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValuesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
};


/**
 * repeated string values = 1;
 * @return {!Array<string>}
 */
proto.db.v1.ExtensionList.prototype.getValuesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.ExtensionList} returns this
 */
proto.db.v1.ExtensionList.prototype.setValuesList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.ExtensionList} returns this
 */
proto.db.v1.ExtensionList.prototype.addValues = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.ExtensionList} returns this
 */
proto.db.v1.ExtensionList.prototype.clearValuesList = function() {
  return this.setValuesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.PragmaMap.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.PragmaMap.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.PragmaMap} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.PragmaMap.toObject = function(includeInstance, msg) {
  var f, obj = {
valuesMap: (f = msg.getValuesMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.PragmaMap}
 */
proto.db.v1.PragmaMap.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.PragmaMap;
  return proto.db.v1.PragmaMap.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.PragmaMap} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.PragmaMap}
 */
proto.db.v1.PragmaMap.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getValuesMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readStringRequireUtf8, jspb.BinaryReader.prototype.readStringRequireUtf8, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.PragmaMap.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.PragmaMap.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.PragmaMap} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.PragmaMap.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValuesMap(true);
  if (f && f.getLength() > 0) {
jspb.internal.public_for_gencode.serializeMapToBinary(
    message.getValuesMap(true),
    1,
    writer,
    jspb.BinaryWriter.prototype.writeString,
    jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * map<string, string> values = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.db.v1.PragmaMap.prototype.getValuesMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.db.v1.PragmaMap} returns this
 */
proto.db.v1.PragmaMap.prototype.clearValuesMap = function() {
  this.getValuesMap().clear();
  return this;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.db.v1.InitCommandList.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.InitCommandList.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.InitCommandList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.InitCommandList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.InitCommandList.toObject = function(includeInstance, msg) {
  var f, obj = {
valuesList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.InitCommandList}
 */
proto.db.v1.InitCommandList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.InitCommandList;
  return proto.db.v1.InitCommandList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.InitCommandList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.InitCommandList}
 */
proto.db.v1.InitCommandList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.addValues(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.InitCommandList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.InitCommandList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.InitCommandList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.InitCommandList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValuesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
};


/**
 * repeated string values = 1;
 * @return {!Array<string>}
 */
proto.db.v1.InitCommandList.prototype.getValuesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.db.v1.InitCommandList} returns this
 */
proto.db.v1.InitCommandList.prototype.setValuesList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.db.v1.InitCommandList} returns this
 */
proto.db.v1.InitCommandList.prototype.addValues = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.db.v1.InitCommandList} returns this
 */
proto.db.v1.InitCommandList.prototype.clearValuesList = function() {
  return this.setValuesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.UpdateDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.UpdateDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.UpdateDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateDatabaseRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
config: (f = msg.getConfig()) && proto.db.v1.UpdateDatabaseConfig.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.UpdateDatabaseRequest}
 */
proto.db.v1.UpdateDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.UpdateDatabaseRequest;
  return proto.db.v1.UpdateDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.UpdateDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.UpdateDatabaseRequest}
 */
proto.db.v1.UpdateDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setName(value);
      break;
    case 2:
      var value = new proto.db.v1.UpdateDatabaseConfig;
      reader.readMessage(value,proto.db.v1.UpdateDatabaseConfig.deserializeBinaryFromReader);
      msg.setConfig(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.UpdateDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.UpdateDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.UpdateDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getConfig();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.UpdateDatabaseConfig.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.db.v1.UpdateDatabaseRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.UpdateDatabaseRequest} returns this
 */
proto.db.v1.UpdateDatabaseRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional UpdateDatabaseConfig config = 2;
 * @return {?proto.db.v1.UpdateDatabaseConfig}
 */
proto.db.v1.UpdateDatabaseRequest.prototype.getConfig = function() {
  return /** @type{?proto.db.v1.UpdateDatabaseConfig} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.UpdateDatabaseConfig, 2));
};


/**
 * @param {?proto.db.v1.UpdateDatabaseConfig|undefined} value
 * @return {!proto.db.v1.UpdateDatabaseRequest} returns this
*/
proto.db.v1.UpdateDatabaseRequest.prototype.setConfig = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.UpdateDatabaseRequest} returns this
 */
proto.db.v1.UpdateDatabaseRequest.prototype.clearConfig = function() {
  return this.setConfig(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseRequest.prototype.hasConfig = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.UpdateDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.UpdateDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.UpdateDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateDatabaseResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.UpdateDatabaseResponse}
 */
proto.db.v1.UpdateDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.UpdateDatabaseResponse;
  return proto.db.v1.UpdateDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.UpdateDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.UpdateDatabaseResponse}
 */
proto.db.v1.UpdateDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.UpdateDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.UpdateDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.UpdateDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.UpdateDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.UpdateDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.UpdateDatabaseResponse} returns this
 */
proto.db.v1.UpdateDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.UpdateDatabaseResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.UpdateDatabaseResponse} returns this
 */
proto.db.v1.UpdateDatabaseResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.AttachDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.AttachDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.AttachDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.AttachDatabaseRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
parentDatabase: jspb.Message.getFieldWithDefault(msg, 1, ""),
attachment: (f = msg.getAttachment()) && proto.db.v1.Attachment.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.AttachDatabaseRequest}
 */
proto.db.v1.AttachDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.AttachDatabaseRequest;
  return proto.db.v1.AttachDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.AttachDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.AttachDatabaseRequest}
 */
proto.db.v1.AttachDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setParentDatabase(value);
      break;
    case 2:
      var value = new proto.db.v1.Attachment;
      reader.readMessage(value,proto.db.v1.Attachment.deserializeBinaryFromReader);
      msg.setAttachment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.AttachDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.AttachDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.AttachDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.AttachDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getParentDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAttachment();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.db.v1.Attachment.serializeBinaryToWriter
    );
  }
};


/**
 * optional string parent_database = 1;
 * @return {string}
 */
proto.db.v1.AttachDatabaseRequest.prototype.getParentDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.AttachDatabaseRequest} returns this
 */
proto.db.v1.AttachDatabaseRequest.prototype.setParentDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional Attachment attachment = 2;
 * @return {?proto.db.v1.Attachment}
 */
proto.db.v1.AttachDatabaseRequest.prototype.getAttachment = function() {
  return /** @type{?proto.db.v1.Attachment} */ (
    jspb.Message.getWrapperField(this, proto.db.v1.Attachment, 2));
};


/**
 * @param {?proto.db.v1.Attachment|undefined} value
 * @return {!proto.db.v1.AttachDatabaseRequest} returns this
*/
proto.db.v1.AttachDatabaseRequest.prototype.setAttachment = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.db.v1.AttachDatabaseRequest} returns this
 */
proto.db.v1.AttachDatabaseRequest.prototype.clearAttachment = function() {
  return this.setAttachment(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.db.v1.AttachDatabaseRequest.prototype.hasAttachment = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.AttachDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.AttachDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.AttachDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.AttachDatabaseResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.AttachDatabaseResponse}
 */
proto.db.v1.AttachDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.AttachDatabaseResponse;
  return proto.db.v1.AttachDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.AttachDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.AttachDatabaseResponse}
 */
proto.db.v1.AttachDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.AttachDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.AttachDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.AttachDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.AttachDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.AttachDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.AttachDatabaseResponse} returns this
 */
proto.db.v1.AttachDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.AttachDatabaseResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.AttachDatabaseResponse} returns this
 */
proto.db.v1.AttachDatabaseResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DetachDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DetachDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DetachDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DetachDatabaseRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
parentDatabase: jspb.Message.getFieldWithDefault(msg, 1, ""),
alias: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DetachDatabaseRequest}
 */
proto.db.v1.DetachDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DetachDatabaseRequest;
  return proto.db.v1.DetachDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DetachDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DetachDatabaseRequest}
 */
proto.db.v1.DetachDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setParentDatabase(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setAlias(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DetachDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DetachDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DetachDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DetachDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getParentDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAlias();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string parent_database = 1;
 * @return {string}
 */
proto.db.v1.DetachDatabaseRequest.prototype.getParentDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DetachDatabaseRequest} returns this
 */
proto.db.v1.DetachDatabaseRequest.prototype.setParentDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string alias = 2;
 * @return {string}
 */
proto.db.v1.DetachDatabaseRequest.prototype.getAlias = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DetachDatabaseRequest} returns this
 */
proto.db.v1.DetachDatabaseRequest.prototype.setAlias = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.db.v1.DetachDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.db.v1.DetachDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.db.v1.DetachDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DetachDatabaseResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.binary.bytesource.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.db.v1.DetachDatabaseResponse}
 */
proto.db.v1.DetachDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.db.v1.DetachDatabaseResponse;
  return proto.db.v1.DetachDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.db.v1.DetachDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.db.v1.DetachDatabaseResponse}
 */
proto.db.v1.DetachDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readStringRequireUtf8());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.db.v1.DetachDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.db.v1.DetachDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.db.v1.DetachDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.db.v1.DetachDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.db.v1.DetachDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.db.v1.DetachDatabaseResponse} returns this
 */
proto.db.v1.DetachDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.db.v1.DetachDatabaseResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.db.v1.DetachDatabaseResponse} returns this
 */
proto.db.v1.DetachDatabaseResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * @enum {number}
 */
proto.db.v1.SqliteCode = {
  SQLITE_CODE_OK: 0,
  SQLITE_CODE_ERROR: 1,
  SQLITE_CODE_INTERNAL: 2,
  SQLITE_CODE_PERM: 3,
  SQLITE_CODE_ABORT: 4,
  SQLITE_CODE_BUSY: 5,
  SQLITE_CODE_LOCKED: 6,
  SQLITE_CODE_NOMEM: 7,
  SQLITE_CODE_READONLY: 8,
  SQLITE_CODE_INTERRUPT: 9,
  SQLITE_CODE_IOERR: 10,
  SQLITE_CODE_CORRUPT: 11,
  SQLITE_CODE_NOTFOUND: 12,
  SQLITE_CODE_FULL: 13,
  SQLITE_CODE_CANTOPEN: 14,
  SQLITE_CODE_PROTOCOL: 15,
  SQLITE_CODE_EMPTY: 16,
  SQLITE_CODE_SCHEMA: 17,
  SQLITE_CODE_TOOBIG: 18,
  SQLITE_CODE_CONSTRAINT: 19,
  SQLITE_CODE_MISMATCH: 20,
  SQLITE_CODE_MISUSE: 21,
  SQLITE_CODE_NOLFS: 22,
  SQLITE_CODE_AUTH: 23,
  SQLITE_CODE_FORMAT: 24,
  SQLITE_CODE_RANGE: 25,
  SQLITE_CODE_NOTADB: 26,
  SQLITE_CODE_NOTICE: 27,
  SQLITE_CODE_WARNING: 28,
  SQLITE_CODE_ROW: 100,
  SQLITE_CODE_DONE: 101
};

/**
 * @enum {number}
 */
proto.db.v1.QueryType = {
  QUERY_TYPE_UNSPECIFIED: 0,
  QUERY_TYPE_READ: 1,
  QUERY_TYPE_WRITE: 2
};

/**
 * @enum {number}
 */
proto.db.v1.TransactionMode = {
  TRANSACTION_MODE_UNSPECIFIED: 0,
  TRANSACTION_MODE_DEFERRED: 1,
  TRANSACTION_MODE_IMMEDIATE: 2,
  TRANSACTION_MODE_EXCLUSIVE: 3
};

/**
 * @enum {number}
 */
proto.db.v1.ColumnAffinity = {
  COLUMN_AFFINITY_UNSPECIFIED: 0,
  COLUMN_AFFINITY_INTEGER: 1,
  COLUMN_AFFINITY_TEXT: 2,
  COLUMN_AFFINITY_BLOB: 3,
  COLUMN_AFFINITY_REAL: 4,
  COLUMN_AFFINITY_NUMERIC: 5
};

/**
 * @enum {number}
 */
proto.db.v1.DeclaredType = {
  DECLARED_TYPE_UNSPECIFIED: 0,
  DECLARED_TYPE_INT: 1,
  DECLARED_TYPE_INTEGER: 2,
  DECLARED_TYPE_TINYINT: 3,
  DECLARED_TYPE_SMALLINT: 4,
  DECLARED_TYPE_MEDIUMINT: 5,
  DECLARED_TYPE_BIGINT: 6,
  DECLARED_TYPE_UNSIGNED_BIG_INT: 7,
  DECLARED_TYPE_INT2: 8,
  DECLARED_TYPE_INT8: 9,
  DECLARED_TYPE_CHARACTER: 10,
  DECLARED_TYPE_VARCHAR: 11,
  DECLARED_TYPE_VARYING_CHARACTER: 12,
  DECLARED_TYPE_NCHAR: 13,
  DECLARED_TYPE_NATIVE_CHARACTER: 14,
  DECLARED_TYPE_NVARCHAR: 15,
  DECLARED_TYPE_TEXT: 16,
  DECLARED_TYPE_CLOB: 17,
  DECLARED_TYPE_BLOB: 18,
  DECLARED_TYPE_REAL: 19,
  DECLARED_TYPE_DOUBLE: 20,
  DECLARED_TYPE_DOUBLE_PRECISION: 21,
  DECLARED_TYPE_FLOAT: 22,
  DECLARED_TYPE_NUMERIC: 23,
  DECLARED_TYPE_DECIMAL: 24,
  DECLARED_TYPE_BOOLEAN: 25,
  DECLARED_TYPE_DATE: 26,
  DECLARED_TYPE_DATETIME: 27,
  DECLARED_TYPE_TIMESTAMP: 28,
  DECLARED_TYPE_JSON: 29,
  DECLARED_TYPE_UUID: 30,
  DECLARED_TYPE_TIME: 31,
  DECLARED_TYPE_YEAR: 32,
  DECLARED_TYPE_CHAR: 33,
  DECLARED_TYPE_XML: 34
};

/**
 * @enum {number}
 */
proto.db.v1.CheckpointMode = {
  CHECKPOINT_MODE_UNSPECIFIED: 0,
  CHECKPOINT_MODE_PASSIVE: 1,
  CHECKPOINT_MODE_FULL: 2,
  CHECKPOINT_MODE_RESTART: 3,
  CHECKPOINT_MODE_TRUNCATE: 4
};

/**
 * @enum {number}
 */
proto.db.v1.Role = {
  ROLE_UNSPECIFIED: 0,
  ROLE_ADMIN: 1,
  ROLE_DATABASE_MANAGER: 4,
  ROLE_READ_WRITE: 2,
  ROLE_READ_ONLY: 3
};

/**
 * @enum {number}
 */
proto.db.v1.SavepointAction = {
  SAVEPOINT_ACTION_UNSPECIFIED: 0,
  SAVEPOINT_ACTION_CREATE: 1,
  SAVEPOINT_ACTION_RELEASE: 2,
  SAVEPOINT_ACTION_ROLLBACK: 3
};

goog.object.extend(exports, proto.db.v1);
