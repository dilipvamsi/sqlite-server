// source: sqlrpc/v1/db_service.proto
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
var google_protobuf_duration_pb = require('google-protobuf/google/protobuf/duration_pb.js');
goog.object.extend(proto, google_protobuf_duration_pb);
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
goog.object.extend(proto, google_protobuf_empty_pb);
var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');
goog.object.extend(proto, google_protobuf_struct_pb);
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
goog.object.extend(proto, google_protobuf_timestamp_pb);
var sqlrpc_v1_enums_pb = require('../../sqlrpc/v1/enums_pb.js');
goog.object.extend(proto, sqlrpc_v1_enums_pb);
var sqlrpc_v1_types_pb = require('../../sqlrpc/v1/types_pb.js');
goog.object.extend(proto, sqlrpc_v1_types_pb);
goog.exportSymbol('proto.sqlrpc.v1.AttachDatabaseRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.AttachDatabaseResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.BeginRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.BeginResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.BeginTransactionRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.BeginTransactionResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.CheckpointRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.CheckpointResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.CommitResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.DMLResult', null, global);
goog.exportSymbol('proto.sqlrpc.v1.DetachDatabaseRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.DetachDatabaseResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ErrorResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ExecResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ExecuteTransactionRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ExecuteTransactionResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ExplainResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.GetDatabaseSchemaRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.GetTableSchemaRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.IntegrityCheckRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.IntegrityCheckResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ListExtensionsRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ListExtensionsResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ListTablesRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ListTablesResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.LoadExtensionRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.LoadExtensionResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.QueryComplete', null, global);
goog.exportSymbol('proto.sqlrpc.v1.QueryRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.QueryResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.QueryResponse.ResponseCase', null, global);
goog.exportSymbol('proto.sqlrpc.v1.QueryResult', null, global);
goog.exportSymbol('proto.sqlrpc.v1.QueryResultHeader', null, global);
goog.exportSymbol('proto.sqlrpc.v1.QueryResultRowBatch', null, global);
goog.exportSymbol('proto.sqlrpc.v1.RollbackResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.SavepointAction', null, global);
goog.exportSymbol('proto.sqlrpc.v1.SavepointRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.SavepointResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionControlRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionControlResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionQueryRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionRequest.CommandCase', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionResponse.ResponseCase', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionSavepointRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionalQueryRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TypedQueryRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TypedQueryResponse', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TypedQueryResponse.ResponseCase', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TypedQueryResult', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TypedQueryResultHeader', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TypedQueryResultRowBatch', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TypedTransactionQueryRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TypedTransactionalQueryRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.VacuumRequest', null, global);
goog.exportSymbol('proto.sqlrpc.v1.VacuumResponse', null, global);
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
proto.sqlrpc.v1.QueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.QueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.QueryRequest.displayName = 'proto.sqlrpc.v1.QueryRequest';
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
proto.sqlrpc.v1.QueryResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.QueryResult.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.QueryResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.QueryResult.displayName = 'proto.sqlrpc.v1.QueryResult';
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
proto.sqlrpc.v1.ExecResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.ExecResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.ExecResponse.displayName = 'proto.sqlrpc.v1.ExecResponse';
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
proto.sqlrpc.v1.DMLResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.DMLResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.DMLResult.displayName = 'proto.sqlrpc.v1.DMLResult';
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
proto.sqlrpc.v1.BeginTransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.BeginTransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.BeginTransactionRequest.displayName = 'proto.sqlrpc.v1.BeginTransactionRequest';
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
proto.sqlrpc.v1.BeginTransactionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.BeginTransactionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.BeginTransactionResponse.displayName = 'proto.sqlrpc.v1.BeginTransactionResponse';
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
proto.sqlrpc.v1.TransactionQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.TransactionQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TransactionQueryRequest.displayName = 'proto.sqlrpc.v1.TransactionQueryRequest';
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
proto.sqlrpc.v1.TransactionSavepointRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.TransactionSavepointRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TransactionSavepointRequest.displayName = 'proto.sqlrpc.v1.TransactionSavepointRequest';
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
proto.sqlrpc.v1.SavepointResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.SavepointResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.SavepointResponse.displayName = 'proto.sqlrpc.v1.SavepointResponse';
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
proto.sqlrpc.v1.TransactionControlRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.TransactionControlRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TransactionControlRequest.displayName = 'proto.sqlrpc.v1.TransactionControlRequest';
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
proto.sqlrpc.v1.TransactionControlResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.TransactionControlResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TransactionControlResponse.displayName = 'proto.sqlrpc.v1.TransactionControlResponse';
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
proto.sqlrpc.v1.ExecuteTransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.ExecuteTransactionRequest.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.ExecuteTransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.ExecuteTransactionRequest.displayName = 'proto.sqlrpc.v1.ExecuteTransactionRequest';
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
proto.sqlrpc.v1.ExecuteTransactionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.ExecuteTransactionResponse.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.ExecuteTransactionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.ExecuteTransactionResponse.displayName = 'proto.sqlrpc.v1.ExecuteTransactionResponse';
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
proto.sqlrpc.v1.TypedQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.TypedQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TypedQueryRequest.displayName = 'proto.sqlrpc.v1.TypedQueryRequest';
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
proto.sqlrpc.v1.TypedTransactionQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.TypedTransactionQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TypedTransactionQueryRequest.displayName = 'proto.sqlrpc.v1.TypedTransactionQueryRequest';
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
proto.sqlrpc.v1.TypedQueryResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.TypedQueryResult.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.TypedQueryResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TypedQueryResult.displayName = 'proto.sqlrpc.v1.TypedQueryResult';
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
proto.sqlrpc.v1.QueryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.sqlrpc.v1.QueryResponse.oneofGroups_);
};
goog.inherits(proto.sqlrpc.v1.QueryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.QueryResponse.displayName = 'proto.sqlrpc.v1.QueryResponse';
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
proto.sqlrpc.v1.TypedQueryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.sqlrpc.v1.TypedQueryResponse.oneofGroups_);
};
goog.inherits(proto.sqlrpc.v1.TypedQueryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TypedQueryResponse.displayName = 'proto.sqlrpc.v1.TypedQueryResponse';
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
proto.sqlrpc.v1.QueryResultHeader = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.QueryResultHeader.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.QueryResultHeader, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.QueryResultHeader.displayName = 'proto.sqlrpc.v1.QueryResultHeader';
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
proto.sqlrpc.v1.QueryResultRowBatch = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.QueryResultRowBatch.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.QueryResultRowBatch, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.QueryResultRowBatch.displayName = 'proto.sqlrpc.v1.QueryResultRowBatch';
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
proto.sqlrpc.v1.TypedQueryResultHeader = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.TypedQueryResultHeader.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.TypedQueryResultHeader, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TypedQueryResultHeader.displayName = 'proto.sqlrpc.v1.TypedQueryResultHeader';
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
proto.sqlrpc.v1.TypedQueryResultRowBatch = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.TypedQueryResultRowBatch.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.TypedQueryResultRowBatch, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TypedQueryResultRowBatch.displayName = 'proto.sqlrpc.v1.TypedQueryResultRowBatch';
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
proto.sqlrpc.v1.QueryComplete = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.QueryComplete, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.QueryComplete.displayName = 'proto.sqlrpc.v1.QueryComplete';
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
proto.sqlrpc.v1.ErrorResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.ErrorResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.ErrorResponse.displayName = 'proto.sqlrpc.v1.ErrorResponse';
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
proto.sqlrpc.v1.TransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.sqlrpc.v1.TransactionRequest.oneofGroups_);
};
goog.inherits(proto.sqlrpc.v1.TransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TransactionRequest.displayName = 'proto.sqlrpc.v1.TransactionRequest';
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
proto.sqlrpc.v1.TransactionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.sqlrpc.v1.TransactionResponse.oneofGroups_);
};
goog.inherits(proto.sqlrpc.v1.TransactionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TransactionResponse.displayName = 'proto.sqlrpc.v1.TransactionResponse';
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
proto.sqlrpc.v1.ExplainResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.ExplainResponse.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.ExplainResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.ExplainResponse.displayName = 'proto.sqlrpc.v1.ExplainResponse';
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
proto.sqlrpc.v1.ListTablesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.ListTablesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.ListTablesRequest.displayName = 'proto.sqlrpc.v1.ListTablesRequest';
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
proto.sqlrpc.v1.ListTablesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.ListTablesResponse.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.ListTablesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.ListTablesResponse.displayName = 'proto.sqlrpc.v1.ListTablesResponse';
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
proto.sqlrpc.v1.GetTableSchemaRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.GetTableSchemaRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.GetTableSchemaRequest.displayName = 'proto.sqlrpc.v1.GetTableSchemaRequest';
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
proto.sqlrpc.v1.GetDatabaseSchemaRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.GetDatabaseSchemaRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.GetDatabaseSchemaRequest.displayName = 'proto.sqlrpc.v1.GetDatabaseSchemaRequest';
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
proto.sqlrpc.v1.VacuumRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.VacuumRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.VacuumRequest.displayName = 'proto.sqlrpc.v1.VacuumRequest';
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
proto.sqlrpc.v1.VacuumResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.VacuumResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.VacuumResponse.displayName = 'proto.sqlrpc.v1.VacuumResponse';
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
proto.sqlrpc.v1.CheckpointRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.CheckpointRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.CheckpointRequest.displayName = 'proto.sqlrpc.v1.CheckpointRequest';
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
proto.sqlrpc.v1.CheckpointResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.CheckpointResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.CheckpointResponse.displayName = 'proto.sqlrpc.v1.CheckpointResponse';
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
proto.sqlrpc.v1.IntegrityCheckRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.IntegrityCheckRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.IntegrityCheckRequest.displayName = 'proto.sqlrpc.v1.IntegrityCheckRequest';
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
proto.sqlrpc.v1.IntegrityCheckResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.IntegrityCheckResponse.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.IntegrityCheckResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.IntegrityCheckResponse.displayName = 'proto.sqlrpc.v1.IntegrityCheckResponse';
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
proto.sqlrpc.v1.AttachDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.AttachDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.AttachDatabaseRequest.displayName = 'proto.sqlrpc.v1.AttachDatabaseRequest';
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
proto.sqlrpc.v1.AttachDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.AttachDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.AttachDatabaseResponse.displayName = 'proto.sqlrpc.v1.AttachDatabaseResponse';
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
proto.sqlrpc.v1.DetachDatabaseRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.DetachDatabaseRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.DetachDatabaseRequest.displayName = 'proto.sqlrpc.v1.DetachDatabaseRequest';
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
proto.sqlrpc.v1.DetachDatabaseResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.DetachDatabaseResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.DetachDatabaseResponse.displayName = 'proto.sqlrpc.v1.DetachDatabaseResponse';
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
proto.sqlrpc.v1.BeginRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.BeginRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.BeginRequest.displayName = 'proto.sqlrpc.v1.BeginRequest';
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
proto.sqlrpc.v1.TransactionalQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.TransactionalQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TransactionalQueryRequest.displayName = 'proto.sqlrpc.v1.TransactionalQueryRequest';
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
proto.sqlrpc.v1.SavepointRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.SavepointRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.SavepointRequest.displayName = 'proto.sqlrpc.v1.SavepointRequest';
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
proto.sqlrpc.v1.BeginResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.BeginResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.BeginResponse.displayName = 'proto.sqlrpc.v1.BeginResponse';
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
proto.sqlrpc.v1.CommitResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.CommitResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.CommitResponse.displayName = 'proto.sqlrpc.v1.CommitResponse';
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
proto.sqlrpc.v1.RollbackResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.RollbackResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.RollbackResponse.displayName = 'proto.sqlrpc.v1.RollbackResponse';
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
proto.sqlrpc.v1.TypedTransactionalQueryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.TypedTransactionalQueryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.TypedTransactionalQueryRequest.displayName = 'proto.sqlrpc.v1.TypedTransactionalQueryRequest';
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
proto.sqlrpc.v1.ListExtensionsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.ListExtensionsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.ListExtensionsRequest.displayName = 'proto.sqlrpc.v1.ListExtensionsRequest';
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
proto.sqlrpc.v1.ListExtensionsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sqlrpc.v1.ListExtensionsResponse.repeatedFields_, null);
};
goog.inherits(proto.sqlrpc.v1.ListExtensionsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.ListExtensionsResponse.displayName = 'proto.sqlrpc.v1.ListExtensionsResponse';
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
proto.sqlrpc.v1.LoadExtensionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.LoadExtensionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.LoadExtensionRequest.displayName = 'proto.sqlrpc.v1.LoadExtensionRequest';
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
proto.sqlrpc.v1.LoadExtensionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sqlrpc.v1.LoadExtensionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sqlrpc.v1.LoadExtensionResponse.displayName = 'proto.sqlrpc.v1.LoadExtensionResponse';
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
proto.sqlrpc.v1.QueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.QueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.QueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, ""),
parameters: (f = msg.getParameters()) && sqlrpc_v1_types_pb.Parameters.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.QueryRequest}
 */
proto.sqlrpc.v1.QueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.QueryRequest;
  return proto.sqlrpc.v1.QueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.QueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.QueryRequest}
 */
proto.sqlrpc.v1.QueryRequest.deserializeBinaryFromReader = function(msg, reader) {
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
    case 4:
      var value = new sqlrpc_v1_types_pb.Parameters;
      reader.readMessage(value,sqlrpc_v1_types_pb.Parameters.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.QueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.QueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.QueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryRequest.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getParameters();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      sqlrpc_v1_types_pb.Parameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.sqlrpc.v1.QueryRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.QueryRequest} returns this
 */
proto.sqlrpc.v1.QueryRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.sqlrpc.v1.QueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.QueryRequest} returns this
 */
proto.sqlrpc.v1.QueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional Parameters parameters = 4;
 * @return {?proto.sqlrpc.v1.Parameters}
 */
proto.sqlrpc.v1.QueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.sqlrpc.v1.Parameters} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.Parameters, 4));
};


/**
 * @param {?proto.sqlrpc.v1.Parameters|undefined} value
 * @return {!proto.sqlrpc.v1.QueryRequest} returns this
*/
proto.sqlrpc.v1.QueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.QueryRequest} returns this
 */
proto.sqlrpc.v1.QueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.QueryRequest.prototype.hasParameters = function() {
  return jspb.Message.getField(this, 4) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.QueryResult.repeatedFields_ = [1,2,3,4,5];



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
proto.sqlrpc.v1.QueryResult.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.QueryResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.QueryResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryResult.toObject = function(includeInstance, msg) {
  var f, obj = {
columnsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
columnAffinitiesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
columnDeclaredTypesList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
columnRawTypesList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
rowsList: jspb.Message.toObjectList(msg.getRowsList(),
    google_protobuf_struct_pb.ListValue.toObject, includeInstance),
stats: (f = msg.getStats()) && sqlrpc_v1_types_pb.ExecutionStats.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.QueryResult}
 */
proto.sqlrpc.v1.QueryResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.QueryResult;
  return proto.sqlrpc.v1.QueryResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.QueryResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.QueryResult}
 */
proto.sqlrpc.v1.QueryResult.deserializeBinaryFromReader = function(msg, reader) {
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
    case 6:
      var value = new sqlrpc_v1_types_pb.ExecutionStats;
      reader.readMessage(value,sqlrpc_v1_types_pb.ExecutionStats.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.QueryResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.QueryResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.QueryResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryResult.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getStats();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      sqlrpc_v1_types_pb.ExecutionStats.serializeBinaryToWriter
    );
  }
};


/**
 * repeated string columns = 1;
 * @return {!Array<string>}
 */
proto.sqlrpc.v1.QueryResult.prototype.getColumnsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.setColumnsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.addColumns = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * repeated ColumnAffinity column_affinities = 2;
 * @return {!Array<!proto.sqlrpc.v1.ColumnAffinity>}
 */
proto.sqlrpc.v1.QueryResult.prototype.getColumnAffinitiesList = function() {
  return /** @type {!Array<!proto.sqlrpc.v1.ColumnAffinity>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.ColumnAffinity>} value
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.setColumnAffinitiesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.sqlrpc.v1.ColumnAffinity} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.addColumnAffinities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.clearColumnAffinitiesList = function() {
  return this.setColumnAffinitiesList([]);
};


/**
 * repeated DeclaredType column_declared_types = 3;
 * @return {!Array<!proto.sqlrpc.v1.DeclaredType>}
 */
proto.sqlrpc.v1.QueryResult.prototype.getColumnDeclaredTypesList = function() {
  return /** @type {!Array<!proto.sqlrpc.v1.DeclaredType>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.DeclaredType>} value
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.setColumnDeclaredTypesList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!proto.sqlrpc.v1.DeclaredType} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.addColumnDeclaredTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.clearColumnDeclaredTypesList = function() {
  return this.setColumnDeclaredTypesList([]);
};


/**
 * repeated string column_raw_types = 4;
 * @return {!Array<string>}
 */
proto.sqlrpc.v1.QueryResult.prototype.getColumnRawTypesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.setColumnRawTypesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.addColumnRawTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.clearColumnRawTypesList = function() {
  return this.setColumnRawTypesList([]);
};


/**
 * repeated google.protobuf.ListValue rows = 5;
 * @return {!Array<!proto.google.protobuf.ListValue>}
 */
proto.sqlrpc.v1.QueryResult.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.google.protobuf.ListValue>} */ (
    jspb.Message.getRepeatedWrapperField(this, google_protobuf_struct_pb.ListValue, 5));
};


/**
 * @param {!Array<!proto.google.protobuf.ListValue>} value
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
*/
proto.sqlrpc.v1.QueryResult.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.google.protobuf.ListValue=} opt_value
 * @param {number=} opt_index
 * @return {!proto.google.protobuf.ListValue}
 */
proto.sqlrpc.v1.QueryResult.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.google.protobuf.ListValue, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.clearRowsList = function() {
  return this.setRowsList([]);
};


/**
 * optional ExecutionStats stats = 6;
 * @return {?proto.sqlrpc.v1.ExecutionStats}
 */
proto.sqlrpc.v1.QueryResult.prototype.getStats = function() {
  return /** @type{?proto.sqlrpc.v1.ExecutionStats} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.ExecutionStats, 6));
};


/**
 * @param {?proto.sqlrpc.v1.ExecutionStats|undefined} value
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
*/
proto.sqlrpc.v1.QueryResult.prototype.setStats = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.QueryResult} returns this
 */
proto.sqlrpc.v1.QueryResult.prototype.clearStats = function() {
  return this.setStats(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.QueryResult.prototype.hasStats = function() {
  return jspb.Message.getField(this, 6) != null;
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
proto.sqlrpc.v1.ExecResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.ExecResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.ExecResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ExecResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
dml: (f = msg.getDml()) && proto.sqlrpc.v1.DMLResult.toObject(includeInstance, f),
stats: (f = msg.getStats()) && sqlrpc_v1_types_pb.ExecutionStats.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.ExecResponse}
 */
proto.sqlrpc.v1.ExecResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.ExecResponse;
  return proto.sqlrpc.v1.ExecResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.ExecResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.ExecResponse}
 */
proto.sqlrpc.v1.ExecResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sqlrpc.v1.DMLResult;
      reader.readMessage(value,proto.sqlrpc.v1.DMLResult.deserializeBinaryFromReader);
      msg.setDml(value);
      break;
    case 2:
      var value = new sqlrpc_v1_types_pb.ExecutionStats;
      reader.readMessage(value,sqlrpc_v1_types_pb.ExecutionStats.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.ExecResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.ExecResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.ExecResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ExecResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDml();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sqlrpc.v1.DMLResult.serializeBinaryToWriter
    );
  }
  f = message.getStats();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      sqlrpc_v1_types_pb.ExecutionStats.serializeBinaryToWriter
    );
  }
};


/**
 * optional DMLResult dml = 1;
 * @return {?proto.sqlrpc.v1.DMLResult}
 */
proto.sqlrpc.v1.ExecResponse.prototype.getDml = function() {
  return /** @type{?proto.sqlrpc.v1.DMLResult} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.DMLResult, 1));
};


/**
 * @param {?proto.sqlrpc.v1.DMLResult|undefined} value
 * @return {!proto.sqlrpc.v1.ExecResponse} returns this
*/
proto.sqlrpc.v1.ExecResponse.prototype.setDml = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.ExecResponse} returns this
 */
proto.sqlrpc.v1.ExecResponse.prototype.clearDml = function() {
  return this.setDml(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.ExecResponse.prototype.hasDml = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ExecutionStats stats = 2;
 * @return {?proto.sqlrpc.v1.ExecutionStats}
 */
proto.sqlrpc.v1.ExecResponse.prototype.getStats = function() {
  return /** @type{?proto.sqlrpc.v1.ExecutionStats} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.ExecutionStats, 2));
};


/**
 * @param {?proto.sqlrpc.v1.ExecutionStats|undefined} value
 * @return {!proto.sqlrpc.v1.ExecResponse} returns this
*/
proto.sqlrpc.v1.ExecResponse.prototype.setStats = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.ExecResponse} returns this
 */
proto.sqlrpc.v1.ExecResponse.prototype.clearStats = function() {
  return this.setStats(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.ExecResponse.prototype.hasStats = function() {
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
proto.sqlrpc.v1.DMLResult.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.DMLResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.DMLResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.DMLResult.toObject = function(includeInstance, msg) {
  var f, obj = {
rowsAffected: jspb.Message.getFieldWithDefault(msg, 1, 0),
lastInsertId: jspb.Message.getFieldWithDefault(msg, 2, 0),
stats: (f = msg.getStats()) && sqlrpc_v1_types_pb.ExecutionStats.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.DMLResult}
 */
proto.sqlrpc.v1.DMLResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.DMLResult;
  return proto.sqlrpc.v1.DMLResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.DMLResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.DMLResult}
 */
proto.sqlrpc.v1.DMLResult.deserializeBinaryFromReader = function(msg, reader) {
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
    case 3:
      var value = new sqlrpc_v1_types_pb.ExecutionStats;
      reader.readMessage(value,sqlrpc_v1_types_pb.ExecutionStats.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.DMLResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.DMLResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.DMLResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.DMLResult.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getStats();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      sqlrpc_v1_types_pb.ExecutionStats.serializeBinaryToWriter
    );
  }
};


/**
 * optional int64 rows_affected = 1;
 * @return {number}
 */
proto.sqlrpc.v1.DMLResult.prototype.getRowsAffected = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sqlrpc.v1.DMLResult} returns this
 */
proto.sqlrpc.v1.DMLResult.prototype.setRowsAffected = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int64 last_insert_id = 2;
 * @return {number}
 */
proto.sqlrpc.v1.DMLResult.prototype.getLastInsertId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sqlrpc.v1.DMLResult} returns this
 */
proto.sqlrpc.v1.DMLResult.prototype.setLastInsertId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional ExecutionStats stats = 3;
 * @return {?proto.sqlrpc.v1.ExecutionStats}
 */
proto.sqlrpc.v1.DMLResult.prototype.getStats = function() {
  return /** @type{?proto.sqlrpc.v1.ExecutionStats} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.ExecutionStats, 3));
};


/**
 * @param {?proto.sqlrpc.v1.ExecutionStats|undefined} value
 * @return {!proto.sqlrpc.v1.DMLResult} returns this
*/
proto.sqlrpc.v1.DMLResult.prototype.setStats = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.DMLResult} returns this
 */
proto.sqlrpc.v1.DMLResult.prototype.clearStats = function() {
  return this.setStats(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.DMLResult.prototype.hasStats = function() {
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
proto.sqlrpc.v1.BeginTransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.BeginTransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.BeginTransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.BeginTransactionRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.BeginTransactionRequest}
 */
proto.sqlrpc.v1.BeginTransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.BeginTransactionRequest;
  return proto.sqlrpc.v1.BeginTransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.BeginTransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.BeginTransactionRequest}
 */
proto.sqlrpc.v1.BeginTransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {!proto.sqlrpc.v1.TransactionLockMode} */ (reader.readEnum());
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
proto.sqlrpc.v1.BeginTransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.BeginTransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.BeginTransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.BeginTransactionRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.BeginTransactionRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.BeginTransactionRequest} returns this
 */
proto.sqlrpc.v1.BeginTransactionRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.Duration timeout = 2;
 * @return {?proto.google.protobuf.Duration}
 */
proto.sqlrpc.v1.BeginTransactionRequest.prototype.getTimeout = function() {
  return /** @type{?proto.google.protobuf.Duration} */ (
    jspb.Message.getWrapperField(this, google_protobuf_duration_pb.Duration, 2));
};


/**
 * @param {?proto.google.protobuf.Duration|undefined} value
 * @return {!proto.sqlrpc.v1.BeginTransactionRequest} returns this
*/
proto.sqlrpc.v1.BeginTransactionRequest.prototype.setTimeout = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.BeginTransactionRequest} returns this
 */
proto.sqlrpc.v1.BeginTransactionRequest.prototype.clearTimeout = function() {
  return this.setTimeout(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.BeginTransactionRequest.prototype.hasTimeout = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional TransactionLockMode mode = 3;
 * @return {!proto.sqlrpc.v1.TransactionLockMode}
 */
proto.sqlrpc.v1.BeginTransactionRequest.prototype.getMode = function() {
  return /** @type {!proto.sqlrpc.v1.TransactionLockMode} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.sqlrpc.v1.TransactionLockMode} value
 * @return {!proto.sqlrpc.v1.BeginTransactionRequest} returns this
 */
proto.sqlrpc.v1.BeginTransactionRequest.prototype.setMode = function(value) {
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
proto.sqlrpc.v1.BeginTransactionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.BeginTransactionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.BeginTransactionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.BeginTransactionResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.BeginTransactionResponse}
 */
proto.sqlrpc.v1.BeginTransactionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.BeginTransactionResponse;
  return proto.sqlrpc.v1.BeginTransactionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.BeginTransactionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.BeginTransactionResponse}
 */
proto.sqlrpc.v1.BeginTransactionResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.BeginTransactionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.BeginTransactionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.BeginTransactionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.BeginTransactionResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.BeginTransactionResponse.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.BeginTransactionResponse} returns this
 */
proto.sqlrpc.v1.BeginTransactionResponse.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp expires_at = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.sqlrpc.v1.BeginTransactionResponse.prototype.getExpiresAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.sqlrpc.v1.BeginTransactionResponse} returns this
*/
proto.sqlrpc.v1.BeginTransactionResponse.prototype.setExpiresAt = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.BeginTransactionResponse} returns this
 */
proto.sqlrpc.v1.BeginTransactionResponse.prototype.clearExpiresAt = function() {
  return this.setExpiresAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.BeginTransactionResponse.prototype.hasExpiresAt = function() {
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
proto.sqlrpc.v1.TransactionQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TransactionQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TransactionQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
transactionId: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, ""),
parameters: (f = msg.getParameters()) && sqlrpc_v1_types_pb.Parameters.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.TransactionQueryRequest}
 */
proto.sqlrpc.v1.TransactionQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TransactionQueryRequest;
  return proto.sqlrpc.v1.TransactionQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TransactionQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TransactionQueryRequest}
 */
proto.sqlrpc.v1.TransactionQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = new sqlrpc_v1_types_pb.Parameters;
      reader.readMessage(value,sqlrpc_v1_types_pb.Parameters.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TransactionQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TransactionQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TransactionQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionQueryRequest.serializeBinaryToWriter = function(message, writer) {
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
      sqlrpc_v1_types_pb.Parameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string transaction_id = 1;
 * @return {string}
 */
proto.sqlrpc.v1.TransactionQueryRequest.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TransactionQueryRequest} returns this
 */
proto.sqlrpc.v1.TransactionQueryRequest.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.sqlrpc.v1.TransactionQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TransactionQueryRequest} returns this
 */
proto.sqlrpc.v1.TransactionQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional Parameters parameters = 3;
 * @return {?proto.sqlrpc.v1.Parameters}
 */
proto.sqlrpc.v1.TransactionQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.sqlrpc.v1.Parameters} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.Parameters, 3));
};


/**
 * @param {?proto.sqlrpc.v1.Parameters|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionQueryRequest} returns this
*/
proto.sqlrpc.v1.TransactionQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionQueryRequest} returns this
 */
proto.sqlrpc.v1.TransactionQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionQueryRequest.prototype.hasParameters = function() {
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
proto.sqlrpc.v1.TransactionSavepointRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TransactionSavepointRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TransactionSavepointRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionSavepointRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
transactionId: jspb.Message.getFieldWithDefault(msg, 1, ""),
savepoint: (f = msg.getSavepoint()) && proto.sqlrpc.v1.SavepointRequest.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.TransactionSavepointRequest}
 */
proto.sqlrpc.v1.TransactionSavepointRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TransactionSavepointRequest;
  return proto.sqlrpc.v1.TransactionSavepointRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TransactionSavepointRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TransactionSavepointRequest}
 */
proto.sqlrpc.v1.TransactionSavepointRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = new proto.sqlrpc.v1.SavepointRequest;
      reader.readMessage(value,proto.sqlrpc.v1.SavepointRequest.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TransactionSavepointRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TransactionSavepointRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TransactionSavepointRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionSavepointRequest.serializeBinaryToWriter = function(message, writer) {
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
      proto.sqlrpc.v1.SavepointRequest.serializeBinaryToWriter
    );
  }
};


/**
 * optional string transaction_id = 1;
 * @return {string}
 */
proto.sqlrpc.v1.TransactionSavepointRequest.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TransactionSavepointRequest} returns this
 */
proto.sqlrpc.v1.TransactionSavepointRequest.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional SavepointRequest savepoint = 2;
 * @return {?proto.sqlrpc.v1.SavepointRequest}
 */
proto.sqlrpc.v1.TransactionSavepointRequest.prototype.getSavepoint = function() {
  return /** @type{?proto.sqlrpc.v1.SavepointRequest} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.SavepointRequest, 2));
};


/**
 * @param {?proto.sqlrpc.v1.SavepointRequest|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionSavepointRequest} returns this
*/
proto.sqlrpc.v1.TransactionSavepointRequest.prototype.setSavepoint = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionSavepointRequest} returns this
 */
proto.sqlrpc.v1.TransactionSavepointRequest.prototype.clearSavepoint = function() {
  return this.setSavepoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionSavepointRequest.prototype.hasSavepoint = function() {
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
proto.sqlrpc.v1.SavepointResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.SavepointResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.SavepointResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.SavepointResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.SavepointResponse}
 */
proto.sqlrpc.v1.SavepointResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.SavepointResponse;
  return proto.sqlrpc.v1.SavepointResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.SavepointResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.SavepointResponse}
 */
proto.sqlrpc.v1.SavepointResponse.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {!proto.sqlrpc.v1.SavepointAction} */ (reader.readEnum());
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
proto.sqlrpc.v1.SavepointResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.SavepointResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.SavepointResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.SavepointResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.SavepointResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.SavepointResponse} returns this
 */
proto.sqlrpc.v1.SavepointResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.sqlrpc.v1.SavepointResponse.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.SavepointResponse} returns this
 */
proto.sqlrpc.v1.SavepointResponse.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional SavepointAction action = 3;
 * @return {!proto.sqlrpc.v1.SavepointAction}
 */
proto.sqlrpc.v1.SavepointResponse.prototype.getAction = function() {
  return /** @type {!proto.sqlrpc.v1.SavepointAction} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.sqlrpc.v1.SavepointAction} value
 * @return {!proto.sqlrpc.v1.SavepointResponse} returns this
 */
proto.sqlrpc.v1.SavepointResponse.prototype.setAction = function(value) {
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
proto.sqlrpc.v1.TransactionControlRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TransactionControlRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TransactionControlRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionControlRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.TransactionControlRequest}
 */
proto.sqlrpc.v1.TransactionControlRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TransactionControlRequest;
  return proto.sqlrpc.v1.TransactionControlRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TransactionControlRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TransactionControlRequest}
 */
proto.sqlrpc.v1.TransactionControlRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.TransactionControlRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TransactionControlRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TransactionControlRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionControlRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.TransactionControlRequest.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TransactionControlRequest} returns this
 */
proto.sqlrpc.v1.TransactionControlRequest.prototype.setTransactionId = function(value) {
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
proto.sqlrpc.v1.TransactionControlResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TransactionControlResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TransactionControlResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionControlResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.TransactionControlResponse}
 */
proto.sqlrpc.v1.TransactionControlResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TransactionControlResponse;
  return proto.sqlrpc.v1.TransactionControlResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TransactionControlResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TransactionControlResponse}
 */
proto.sqlrpc.v1.TransactionControlResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.TransactionControlResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TransactionControlResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TransactionControlResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionControlResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.TransactionControlResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.TransactionControlResponse} returns this
 */
proto.sqlrpc.v1.TransactionControlResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.ExecuteTransactionRequest.repeatedFields_ = [1];



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
proto.sqlrpc.v1.ExecuteTransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.ExecuteTransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.ExecuteTransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ExecuteTransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
requestsList: jspb.Message.toObjectList(msg.getRequestsList(),
    proto.sqlrpc.v1.TransactionRequest.toObject, includeInstance)
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
 * @return {!proto.sqlrpc.v1.ExecuteTransactionRequest}
 */
proto.sqlrpc.v1.ExecuteTransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.ExecuteTransactionRequest;
  return proto.sqlrpc.v1.ExecuteTransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.ExecuteTransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.ExecuteTransactionRequest}
 */
proto.sqlrpc.v1.ExecuteTransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sqlrpc.v1.TransactionRequest;
      reader.readMessage(value,proto.sqlrpc.v1.TransactionRequest.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.ExecuteTransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.ExecuteTransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.ExecuteTransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ExecuteTransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRequestsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.sqlrpc.v1.TransactionRequest.serializeBinaryToWriter
    );
  }
};


/**
 * repeated TransactionRequest requests = 1;
 * @return {!Array<!proto.sqlrpc.v1.TransactionRequest>}
 */
proto.sqlrpc.v1.ExecuteTransactionRequest.prototype.getRequestsList = function() {
  return /** @type{!Array<!proto.sqlrpc.v1.TransactionRequest>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sqlrpc.v1.TransactionRequest, 1));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.TransactionRequest>} value
 * @return {!proto.sqlrpc.v1.ExecuteTransactionRequest} returns this
*/
proto.sqlrpc.v1.ExecuteTransactionRequest.prototype.setRequestsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sqlrpc.v1.TransactionRequest=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TransactionRequest}
 */
proto.sqlrpc.v1.ExecuteTransactionRequest.prototype.addRequests = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sqlrpc.v1.TransactionRequest, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.ExecuteTransactionRequest} returns this
 */
proto.sqlrpc.v1.ExecuteTransactionRequest.prototype.clearRequestsList = function() {
  return this.setRequestsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.ExecuteTransactionResponse.repeatedFields_ = [1];



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
proto.sqlrpc.v1.ExecuteTransactionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.ExecuteTransactionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.ExecuteTransactionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ExecuteTransactionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
responsesList: jspb.Message.toObjectList(msg.getResponsesList(),
    proto.sqlrpc.v1.TransactionResponse.toObject, includeInstance)
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
 * @return {!proto.sqlrpc.v1.ExecuteTransactionResponse}
 */
proto.sqlrpc.v1.ExecuteTransactionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.ExecuteTransactionResponse;
  return proto.sqlrpc.v1.ExecuteTransactionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.ExecuteTransactionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.ExecuteTransactionResponse}
 */
proto.sqlrpc.v1.ExecuteTransactionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sqlrpc.v1.TransactionResponse;
      reader.readMessage(value,proto.sqlrpc.v1.TransactionResponse.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.ExecuteTransactionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.ExecuteTransactionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.ExecuteTransactionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ExecuteTransactionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResponsesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.sqlrpc.v1.TransactionResponse.serializeBinaryToWriter
    );
  }
};


/**
 * repeated TransactionResponse responses = 1;
 * @return {!Array<!proto.sqlrpc.v1.TransactionResponse>}
 */
proto.sqlrpc.v1.ExecuteTransactionResponse.prototype.getResponsesList = function() {
  return /** @type{!Array<!proto.sqlrpc.v1.TransactionResponse>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sqlrpc.v1.TransactionResponse, 1));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.TransactionResponse>} value
 * @return {!proto.sqlrpc.v1.ExecuteTransactionResponse} returns this
*/
proto.sqlrpc.v1.ExecuteTransactionResponse.prototype.setResponsesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sqlrpc.v1.TransactionResponse=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TransactionResponse}
 */
proto.sqlrpc.v1.ExecuteTransactionResponse.prototype.addResponses = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sqlrpc.v1.TransactionResponse, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.ExecuteTransactionResponse} returns this
 */
proto.sqlrpc.v1.ExecuteTransactionResponse.prototype.clearResponsesList = function() {
  return this.setResponsesList([]);
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
proto.sqlrpc.v1.TypedQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TypedQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TypedQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, ""),
parameters: (f = msg.getParameters()) && sqlrpc_v1_types_pb.TypedParameters.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.TypedQueryRequest}
 */
proto.sqlrpc.v1.TypedQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TypedQueryRequest;
  return proto.sqlrpc.v1.TypedQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TypedQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TypedQueryRequest}
 */
proto.sqlrpc.v1.TypedQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
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
    case 4:
      var value = new sqlrpc_v1_types_pb.TypedParameters;
      reader.readMessage(value,sqlrpc_v1_types_pb.TypedParameters.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TypedQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TypedQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TypedQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryRequest.serializeBinaryToWriter = function(message, writer) {
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
  f = message.getParameters();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      sqlrpc_v1_types_pb.TypedParameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string database = 1;
 * @return {string}
 */
proto.sqlrpc.v1.TypedQueryRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TypedQueryRequest} returns this
 */
proto.sqlrpc.v1.TypedQueryRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.sqlrpc.v1.TypedQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TypedQueryRequest} returns this
 */
proto.sqlrpc.v1.TypedQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional TypedParameters parameters = 4;
 * @return {?proto.sqlrpc.v1.TypedParameters}
 */
proto.sqlrpc.v1.TypedQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.sqlrpc.v1.TypedParameters} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.TypedParameters, 4));
};


/**
 * @param {?proto.sqlrpc.v1.TypedParameters|undefined} value
 * @return {!proto.sqlrpc.v1.TypedQueryRequest} returns this
*/
proto.sqlrpc.v1.TypedQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TypedQueryRequest} returns this
 */
proto.sqlrpc.v1.TypedQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TypedQueryRequest.prototype.hasParameters = function() {
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
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TypedTransactionQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TypedTransactionQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
transactionId: jspb.Message.getFieldWithDefault(msg, 1, ""),
sql: jspb.Message.getFieldWithDefault(msg, 2, ""),
parameters: (f = msg.getParameters()) && sqlrpc_v1_types_pb.TypedParameters.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.TypedTransactionQueryRequest}
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TypedTransactionQueryRequest;
  return proto.sqlrpc.v1.TypedTransactionQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TypedTransactionQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TypedTransactionQueryRequest}
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = new sqlrpc_v1_types_pb.TypedParameters;
      reader.readMessage(value,sqlrpc_v1_types_pb.TypedParameters.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TypedTransactionQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TypedTransactionQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.serializeBinaryToWriter = function(message, writer) {
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
      sqlrpc_v1_types_pb.TypedParameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string transaction_id = 1;
 * @return {string}
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TypedTransactionQueryRequest} returns this
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string sql = 2;
 * @return {string}
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TypedTransactionQueryRequest} returns this
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional TypedParameters parameters = 3;
 * @return {?proto.sqlrpc.v1.TypedParameters}
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.sqlrpc.v1.TypedParameters} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.TypedParameters, 3));
};


/**
 * @param {?proto.sqlrpc.v1.TypedParameters|undefined} value
 * @return {!proto.sqlrpc.v1.TypedTransactionQueryRequest} returns this
*/
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TypedTransactionQueryRequest} returns this
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TypedTransactionQueryRequest.prototype.hasParameters = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.TypedQueryResult.repeatedFields_ = [1,2,3,4,5];



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
proto.sqlrpc.v1.TypedQueryResult.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TypedQueryResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TypedQueryResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryResult.toObject = function(includeInstance, msg) {
  var f, obj = {
columnsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
columnAffinitiesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
columnDeclaredTypesList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
columnRawTypesList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
rowsList: jspb.Message.toObjectList(msg.getRowsList(),
    sqlrpc_v1_types_pb.SqlRow.toObject, includeInstance),
stats: (f = msg.getStats()) && sqlrpc_v1_types_pb.ExecutionStats.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.TypedQueryResult}
 */
proto.sqlrpc.v1.TypedQueryResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TypedQueryResult;
  return proto.sqlrpc.v1.TypedQueryResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TypedQueryResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TypedQueryResult}
 */
proto.sqlrpc.v1.TypedQueryResult.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = new sqlrpc_v1_types_pb.SqlRow;
      reader.readMessage(value,sqlrpc_v1_types_pb.SqlRow.deserializeBinaryFromReader);
      msg.addRows(value);
      break;
    case 6:
      var value = new sqlrpc_v1_types_pb.ExecutionStats;
      reader.readMessage(value,sqlrpc_v1_types_pb.ExecutionStats.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TypedQueryResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TypedQueryResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TypedQueryResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryResult.serializeBinaryToWriter = function(message, writer) {
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
      sqlrpc_v1_types_pb.SqlRow.serializeBinaryToWriter
    );
  }
  f = message.getStats();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      sqlrpc_v1_types_pb.ExecutionStats.serializeBinaryToWriter
    );
  }
};


/**
 * repeated string columns = 1;
 * @return {!Array<string>}
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.getColumnsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.setColumnsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.addColumns = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * repeated ColumnAffinity column_affinities = 2;
 * @return {!Array<!proto.sqlrpc.v1.ColumnAffinity>}
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.getColumnAffinitiesList = function() {
  return /** @type {!Array<!proto.sqlrpc.v1.ColumnAffinity>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.ColumnAffinity>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.setColumnAffinitiesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.sqlrpc.v1.ColumnAffinity} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.addColumnAffinities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.clearColumnAffinitiesList = function() {
  return this.setColumnAffinitiesList([]);
};


/**
 * repeated DeclaredType column_declared_types = 3;
 * @return {!Array<!proto.sqlrpc.v1.DeclaredType>}
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.getColumnDeclaredTypesList = function() {
  return /** @type {!Array<!proto.sqlrpc.v1.DeclaredType>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.DeclaredType>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.setColumnDeclaredTypesList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!proto.sqlrpc.v1.DeclaredType} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.addColumnDeclaredTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.clearColumnDeclaredTypesList = function() {
  return this.setColumnDeclaredTypesList([]);
};


/**
 * repeated string column_raw_types = 4;
 * @return {!Array<string>}
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.getColumnRawTypesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.setColumnRawTypesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.addColumnRawTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.clearColumnRawTypesList = function() {
  return this.setColumnRawTypesList([]);
};


/**
 * repeated SqlRow rows = 5;
 * @return {!Array<!proto.sqlrpc.v1.SqlRow>}
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.sqlrpc.v1.SqlRow>} */ (
    jspb.Message.getRepeatedWrapperField(this, sqlrpc_v1_types_pb.SqlRow, 5));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.SqlRow>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
*/
proto.sqlrpc.v1.TypedQueryResult.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.sqlrpc.v1.SqlRow=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.SqlRow}
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.sqlrpc.v1.SqlRow, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.clearRowsList = function() {
  return this.setRowsList([]);
};


/**
 * optional ExecutionStats stats = 6;
 * @return {?proto.sqlrpc.v1.ExecutionStats}
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.getStats = function() {
  return /** @type{?proto.sqlrpc.v1.ExecutionStats} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.ExecutionStats, 6));
};


/**
 * @param {?proto.sqlrpc.v1.ExecutionStats|undefined} value
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
*/
proto.sqlrpc.v1.TypedQueryResult.prototype.setStats = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TypedQueryResult} returns this
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.clearStats = function() {
  return this.setStats(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TypedQueryResult.prototype.hasStats = function() {
  return jspb.Message.getField(this, 6) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.sqlrpc.v1.QueryResponse.oneofGroups_ = [[1,2,3,5]];

/**
 * @enum {number}
 */
proto.sqlrpc.v1.QueryResponse.ResponseCase = {
  RESPONSE_NOT_SET: 0,
  HEADER: 1,
  BATCH: 2,
  COMPLETE: 3,
  ERROR: 5
};

/**
 * @return {proto.sqlrpc.v1.QueryResponse.ResponseCase}
 */
proto.sqlrpc.v1.QueryResponse.prototype.getResponseCase = function() {
  return /** @type {proto.sqlrpc.v1.QueryResponse.ResponseCase} */(jspb.Message.computeOneofCase(this, proto.sqlrpc.v1.QueryResponse.oneofGroups_[0]));
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
proto.sqlrpc.v1.QueryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.QueryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.QueryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
header: (f = msg.getHeader()) && proto.sqlrpc.v1.QueryResultHeader.toObject(includeInstance, f),
batch: (f = msg.getBatch()) && proto.sqlrpc.v1.QueryResultRowBatch.toObject(includeInstance, f),
complete: (f = msg.getComplete()) && proto.sqlrpc.v1.QueryComplete.toObject(includeInstance, f),
error: (f = msg.getError()) && proto.sqlrpc.v1.ErrorResponse.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.QueryResponse}
 */
proto.sqlrpc.v1.QueryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.QueryResponse;
  return proto.sqlrpc.v1.QueryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.QueryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.QueryResponse}
 */
proto.sqlrpc.v1.QueryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sqlrpc.v1.QueryResultHeader;
      reader.readMessage(value,proto.sqlrpc.v1.QueryResultHeader.deserializeBinaryFromReader);
      msg.setHeader(value);
      break;
    case 2:
      var value = new proto.sqlrpc.v1.QueryResultRowBatch;
      reader.readMessage(value,proto.sqlrpc.v1.QueryResultRowBatch.deserializeBinaryFromReader);
      msg.setBatch(value);
      break;
    case 3:
      var value = new proto.sqlrpc.v1.QueryComplete;
      reader.readMessage(value,proto.sqlrpc.v1.QueryComplete.deserializeBinaryFromReader);
      msg.setComplete(value);
      break;
    case 5:
      var value = new proto.sqlrpc.v1.ErrorResponse;
      reader.readMessage(value,proto.sqlrpc.v1.ErrorResponse.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.QueryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.QueryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.QueryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHeader();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sqlrpc.v1.QueryResultHeader.serializeBinaryToWriter
    );
  }
  f = message.getBatch();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sqlrpc.v1.QueryResultRowBatch.serializeBinaryToWriter
    );
  }
  f = message.getComplete();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.sqlrpc.v1.QueryComplete.serializeBinaryToWriter
    );
  }
  f = message.getError();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.sqlrpc.v1.ErrorResponse.serializeBinaryToWriter
    );
  }
};


/**
 * optional QueryResultHeader header = 1;
 * @return {?proto.sqlrpc.v1.QueryResultHeader}
 */
proto.sqlrpc.v1.QueryResponse.prototype.getHeader = function() {
  return /** @type{?proto.sqlrpc.v1.QueryResultHeader} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.QueryResultHeader, 1));
};


/**
 * @param {?proto.sqlrpc.v1.QueryResultHeader|undefined} value
 * @return {!proto.sqlrpc.v1.QueryResponse} returns this
*/
proto.sqlrpc.v1.QueryResponse.prototype.setHeader = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.sqlrpc.v1.QueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.QueryResponse} returns this
 */
proto.sqlrpc.v1.QueryResponse.prototype.clearHeader = function() {
  return this.setHeader(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.QueryResponse.prototype.hasHeader = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional QueryResultRowBatch batch = 2;
 * @return {?proto.sqlrpc.v1.QueryResultRowBatch}
 */
proto.sqlrpc.v1.QueryResponse.prototype.getBatch = function() {
  return /** @type{?proto.sqlrpc.v1.QueryResultRowBatch} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.QueryResultRowBatch, 2));
};


/**
 * @param {?proto.sqlrpc.v1.QueryResultRowBatch|undefined} value
 * @return {!proto.sqlrpc.v1.QueryResponse} returns this
*/
proto.sqlrpc.v1.QueryResponse.prototype.setBatch = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.sqlrpc.v1.QueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.QueryResponse} returns this
 */
proto.sqlrpc.v1.QueryResponse.prototype.clearBatch = function() {
  return this.setBatch(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.QueryResponse.prototype.hasBatch = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional QueryComplete complete = 3;
 * @return {?proto.sqlrpc.v1.QueryComplete}
 */
proto.sqlrpc.v1.QueryResponse.prototype.getComplete = function() {
  return /** @type{?proto.sqlrpc.v1.QueryComplete} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.QueryComplete, 3));
};


/**
 * @param {?proto.sqlrpc.v1.QueryComplete|undefined} value
 * @return {!proto.sqlrpc.v1.QueryResponse} returns this
*/
proto.sqlrpc.v1.QueryResponse.prototype.setComplete = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.sqlrpc.v1.QueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.QueryResponse} returns this
 */
proto.sqlrpc.v1.QueryResponse.prototype.clearComplete = function() {
  return this.setComplete(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.QueryResponse.prototype.hasComplete = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional ErrorResponse error = 5;
 * @return {?proto.sqlrpc.v1.ErrorResponse}
 */
proto.sqlrpc.v1.QueryResponse.prototype.getError = function() {
  return /** @type{?proto.sqlrpc.v1.ErrorResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.ErrorResponse, 5));
};


/**
 * @param {?proto.sqlrpc.v1.ErrorResponse|undefined} value
 * @return {!proto.sqlrpc.v1.QueryResponse} returns this
*/
proto.sqlrpc.v1.QueryResponse.prototype.setError = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.sqlrpc.v1.QueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.QueryResponse} returns this
 */
proto.sqlrpc.v1.QueryResponse.prototype.clearError = function() {
  return this.setError(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.QueryResponse.prototype.hasError = function() {
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
proto.sqlrpc.v1.TypedQueryResponse.oneofGroups_ = [[1,2,3,5]];

/**
 * @enum {number}
 */
proto.sqlrpc.v1.TypedQueryResponse.ResponseCase = {
  RESPONSE_NOT_SET: 0,
  HEADER: 1,
  BATCH: 2,
  COMPLETE: 3,
  ERROR: 5
};

/**
 * @return {proto.sqlrpc.v1.TypedQueryResponse.ResponseCase}
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.getResponseCase = function() {
  return /** @type {proto.sqlrpc.v1.TypedQueryResponse.ResponseCase} */(jspb.Message.computeOneofCase(this, proto.sqlrpc.v1.TypedQueryResponse.oneofGroups_[0]));
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
proto.sqlrpc.v1.TypedQueryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TypedQueryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TypedQueryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
header: (f = msg.getHeader()) && proto.sqlrpc.v1.TypedQueryResultHeader.toObject(includeInstance, f),
batch: (f = msg.getBatch()) && proto.sqlrpc.v1.TypedQueryResultRowBatch.toObject(includeInstance, f),
complete: (f = msg.getComplete()) && proto.sqlrpc.v1.QueryComplete.toObject(includeInstance, f),
error: (f = msg.getError()) && proto.sqlrpc.v1.ErrorResponse.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.TypedQueryResponse}
 */
proto.sqlrpc.v1.TypedQueryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TypedQueryResponse;
  return proto.sqlrpc.v1.TypedQueryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TypedQueryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TypedQueryResponse}
 */
proto.sqlrpc.v1.TypedQueryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sqlrpc.v1.TypedQueryResultHeader;
      reader.readMessage(value,proto.sqlrpc.v1.TypedQueryResultHeader.deserializeBinaryFromReader);
      msg.setHeader(value);
      break;
    case 2:
      var value = new proto.sqlrpc.v1.TypedQueryResultRowBatch;
      reader.readMessage(value,proto.sqlrpc.v1.TypedQueryResultRowBatch.deserializeBinaryFromReader);
      msg.setBatch(value);
      break;
    case 3:
      var value = new proto.sqlrpc.v1.QueryComplete;
      reader.readMessage(value,proto.sqlrpc.v1.QueryComplete.deserializeBinaryFromReader);
      msg.setComplete(value);
      break;
    case 5:
      var value = new proto.sqlrpc.v1.ErrorResponse;
      reader.readMessage(value,proto.sqlrpc.v1.ErrorResponse.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TypedQueryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TypedQueryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TypedQueryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHeader();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sqlrpc.v1.TypedQueryResultHeader.serializeBinaryToWriter
    );
  }
  f = message.getBatch();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sqlrpc.v1.TypedQueryResultRowBatch.serializeBinaryToWriter
    );
  }
  f = message.getComplete();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.sqlrpc.v1.QueryComplete.serializeBinaryToWriter
    );
  }
  f = message.getError();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.sqlrpc.v1.ErrorResponse.serializeBinaryToWriter
    );
  }
};


/**
 * optional TypedQueryResultHeader header = 1;
 * @return {?proto.sqlrpc.v1.TypedQueryResultHeader}
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.getHeader = function() {
  return /** @type{?proto.sqlrpc.v1.TypedQueryResultHeader} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TypedQueryResultHeader, 1));
};


/**
 * @param {?proto.sqlrpc.v1.TypedQueryResultHeader|undefined} value
 * @return {!proto.sqlrpc.v1.TypedQueryResponse} returns this
*/
proto.sqlrpc.v1.TypedQueryResponse.prototype.setHeader = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.sqlrpc.v1.TypedQueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TypedQueryResponse} returns this
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.clearHeader = function() {
  return this.setHeader(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.hasHeader = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional TypedQueryResultRowBatch batch = 2;
 * @return {?proto.sqlrpc.v1.TypedQueryResultRowBatch}
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.getBatch = function() {
  return /** @type{?proto.sqlrpc.v1.TypedQueryResultRowBatch} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TypedQueryResultRowBatch, 2));
};


/**
 * @param {?proto.sqlrpc.v1.TypedQueryResultRowBatch|undefined} value
 * @return {!proto.sqlrpc.v1.TypedQueryResponse} returns this
*/
proto.sqlrpc.v1.TypedQueryResponse.prototype.setBatch = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.sqlrpc.v1.TypedQueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TypedQueryResponse} returns this
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.clearBatch = function() {
  return this.setBatch(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.hasBatch = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional QueryComplete complete = 3;
 * @return {?proto.sqlrpc.v1.QueryComplete}
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.getComplete = function() {
  return /** @type{?proto.sqlrpc.v1.QueryComplete} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.QueryComplete, 3));
};


/**
 * @param {?proto.sqlrpc.v1.QueryComplete|undefined} value
 * @return {!proto.sqlrpc.v1.TypedQueryResponse} returns this
*/
proto.sqlrpc.v1.TypedQueryResponse.prototype.setComplete = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.sqlrpc.v1.TypedQueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TypedQueryResponse} returns this
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.clearComplete = function() {
  return this.setComplete(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.hasComplete = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional ErrorResponse error = 5;
 * @return {?proto.sqlrpc.v1.ErrorResponse}
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.getError = function() {
  return /** @type{?proto.sqlrpc.v1.ErrorResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.ErrorResponse, 5));
};


/**
 * @param {?proto.sqlrpc.v1.ErrorResponse|undefined} value
 * @return {!proto.sqlrpc.v1.TypedQueryResponse} returns this
*/
proto.sqlrpc.v1.TypedQueryResponse.prototype.setError = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.sqlrpc.v1.TypedQueryResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TypedQueryResponse} returns this
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.clearError = function() {
  return this.setError(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TypedQueryResponse.prototype.hasError = function() {
  return jspb.Message.getField(this, 5) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.QueryResultHeader.repeatedFields_ = [1,2,3,4];



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
proto.sqlrpc.v1.QueryResultHeader.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.QueryResultHeader.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.QueryResultHeader} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryResultHeader.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.QueryResultHeader}
 */
proto.sqlrpc.v1.QueryResultHeader.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.QueryResultHeader;
  return proto.sqlrpc.v1.QueryResultHeader.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.QueryResultHeader} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.QueryResultHeader}
 */
proto.sqlrpc.v1.QueryResultHeader.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.QueryResultHeader.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.QueryResultHeader.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.QueryResultHeader} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryResultHeader.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.QueryResultHeader.prototype.getColumnsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.setColumnsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.addColumns = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * repeated ColumnAffinity column_affinities = 2;
 * @return {!Array<!proto.sqlrpc.v1.ColumnAffinity>}
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.getColumnAffinitiesList = function() {
  return /** @type {!Array<!proto.sqlrpc.v1.ColumnAffinity>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.ColumnAffinity>} value
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.setColumnAffinitiesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.sqlrpc.v1.ColumnAffinity} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.addColumnAffinities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.clearColumnAffinitiesList = function() {
  return this.setColumnAffinitiesList([]);
};


/**
 * repeated DeclaredType column_declared_types = 3;
 * @return {!Array<!proto.sqlrpc.v1.DeclaredType>}
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.getColumnDeclaredTypesList = function() {
  return /** @type {!Array<!proto.sqlrpc.v1.DeclaredType>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.DeclaredType>} value
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.setColumnDeclaredTypesList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!proto.sqlrpc.v1.DeclaredType} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.addColumnDeclaredTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.clearColumnDeclaredTypesList = function() {
  return this.setColumnDeclaredTypesList([]);
};


/**
 * repeated string column_raw_types = 4;
 * @return {!Array<string>}
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.getColumnRawTypesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.setColumnRawTypesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.addColumnRawTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResultHeader} returns this
 */
proto.sqlrpc.v1.QueryResultHeader.prototype.clearColumnRawTypesList = function() {
  return this.setColumnRawTypesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.QueryResultRowBatch.repeatedFields_ = [1];



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
proto.sqlrpc.v1.QueryResultRowBatch.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.QueryResultRowBatch.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.QueryResultRowBatch} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryResultRowBatch.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.QueryResultRowBatch}
 */
proto.sqlrpc.v1.QueryResultRowBatch.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.QueryResultRowBatch;
  return proto.sqlrpc.v1.QueryResultRowBatch.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.QueryResultRowBatch} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.QueryResultRowBatch}
 */
proto.sqlrpc.v1.QueryResultRowBatch.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.QueryResultRowBatch.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.QueryResultRowBatch.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.QueryResultRowBatch} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryResultRowBatch.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.QueryResultRowBatch.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.google.protobuf.ListValue>} */ (
    jspb.Message.getRepeatedWrapperField(this, google_protobuf_struct_pb.ListValue, 1));
};


/**
 * @param {!Array<!proto.google.protobuf.ListValue>} value
 * @return {!proto.sqlrpc.v1.QueryResultRowBatch} returns this
*/
proto.sqlrpc.v1.QueryResultRowBatch.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.google.protobuf.ListValue=} opt_value
 * @param {number=} opt_index
 * @return {!proto.google.protobuf.ListValue}
 */
proto.sqlrpc.v1.QueryResultRowBatch.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.google.protobuf.ListValue, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.QueryResultRowBatch} returns this
 */
proto.sqlrpc.v1.QueryResultRowBatch.prototype.clearRowsList = function() {
  return this.setRowsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.TypedQueryResultHeader.repeatedFields_ = [1,2,3,4];



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
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TypedQueryResultHeader.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TypedQueryResultHeader} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryResultHeader.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader}
 */
proto.sqlrpc.v1.TypedQueryResultHeader.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TypedQueryResultHeader;
  return proto.sqlrpc.v1.TypedQueryResultHeader.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TypedQueryResultHeader} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader}
 */
proto.sqlrpc.v1.TypedQueryResultHeader.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TypedQueryResultHeader.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TypedQueryResultHeader} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryResultHeader.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.getColumnsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.setColumnsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.addColumns = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.clearColumnsList = function() {
  return this.setColumnsList([]);
};


/**
 * repeated ColumnAffinity column_affinities = 2;
 * @return {!Array<!proto.sqlrpc.v1.ColumnAffinity>}
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.getColumnAffinitiesList = function() {
  return /** @type {!Array<!proto.sqlrpc.v1.ColumnAffinity>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.ColumnAffinity>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.setColumnAffinitiesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.sqlrpc.v1.ColumnAffinity} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.addColumnAffinities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.clearColumnAffinitiesList = function() {
  return this.setColumnAffinitiesList([]);
};


/**
 * repeated DeclaredType column_declared_types = 3;
 * @return {!Array<!proto.sqlrpc.v1.DeclaredType>}
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.getColumnDeclaredTypesList = function() {
  return /** @type {!Array<!proto.sqlrpc.v1.DeclaredType>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.DeclaredType>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.setColumnDeclaredTypesList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!proto.sqlrpc.v1.DeclaredType} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.addColumnDeclaredTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.clearColumnDeclaredTypesList = function() {
  return this.setColumnDeclaredTypesList([]);
};


/**
 * repeated string column_raw_types = 4;
 * @return {!Array<string>}
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.getColumnRawTypesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.setColumnRawTypesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.addColumnRawTypes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResultHeader} returns this
 */
proto.sqlrpc.v1.TypedQueryResultHeader.prototype.clearColumnRawTypesList = function() {
  return this.setColumnRawTypesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.TypedQueryResultRowBatch.repeatedFields_ = [1];



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
proto.sqlrpc.v1.TypedQueryResultRowBatch.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TypedQueryResultRowBatch.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TypedQueryResultRowBatch} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryResultRowBatch.toObject = function(includeInstance, msg) {
  var f, obj = {
rowsList: jspb.Message.toObjectList(msg.getRowsList(),
    sqlrpc_v1_types_pb.SqlRow.toObject, includeInstance)
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
 * @return {!proto.sqlrpc.v1.TypedQueryResultRowBatch}
 */
proto.sqlrpc.v1.TypedQueryResultRowBatch.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TypedQueryResultRowBatch;
  return proto.sqlrpc.v1.TypedQueryResultRowBatch.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TypedQueryResultRowBatch} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TypedQueryResultRowBatch}
 */
proto.sqlrpc.v1.TypedQueryResultRowBatch.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new sqlrpc_v1_types_pb.SqlRow;
      reader.readMessage(value,sqlrpc_v1_types_pb.SqlRow.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TypedQueryResultRowBatch.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TypedQueryResultRowBatch.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TypedQueryResultRowBatch} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedQueryResultRowBatch.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRowsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      sqlrpc_v1_types_pb.SqlRow.serializeBinaryToWriter
    );
  }
};


/**
 * repeated SqlRow rows = 1;
 * @return {!Array<!proto.sqlrpc.v1.SqlRow>}
 */
proto.sqlrpc.v1.TypedQueryResultRowBatch.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.sqlrpc.v1.SqlRow>} */ (
    jspb.Message.getRepeatedWrapperField(this, sqlrpc_v1_types_pb.SqlRow, 1));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.SqlRow>} value
 * @return {!proto.sqlrpc.v1.TypedQueryResultRowBatch} returns this
*/
proto.sqlrpc.v1.TypedQueryResultRowBatch.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sqlrpc.v1.SqlRow=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.SqlRow}
 */
proto.sqlrpc.v1.TypedQueryResultRowBatch.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sqlrpc.v1.SqlRow, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.TypedQueryResultRowBatch} returns this
 */
proto.sqlrpc.v1.TypedQueryResultRowBatch.prototype.clearRowsList = function() {
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
proto.sqlrpc.v1.QueryComplete.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.QueryComplete.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.QueryComplete} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryComplete.toObject = function(includeInstance, msg) {
  var f, obj = {
stats: (f = msg.getStats()) && sqlrpc_v1_types_pb.ExecutionStats.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.QueryComplete}
 */
proto.sqlrpc.v1.QueryComplete.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.QueryComplete;
  return proto.sqlrpc.v1.QueryComplete.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.QueryComplete} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.QueryComplete}
 */
proto.sqlrpc.v1.QueryComplete.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new sqlrpc_v1_types_pb.ExecutionStats;
      reader.readMessage(value,sqlrpc_v1_types_pb.ExecutionStats.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.QueryComplete.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.QueryComplete.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.QueryComplete} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.QueryComplete.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStats();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      sqlrpc_v1_types_pb.ExecutionStats.serializeBinaryToWriter
    );
  }
};


/**
 * optional ExecutionStats stats = 1;
 * @return {?proto.sqlrpc.v1.ExecutionStats}
 */
proto.sqlrpc.v1.QueryComplete.prototype.getStats = function() {
  return /** @type{?proto.sqlrpc.v1.ExecutionStats} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.ExecutionStats, 1));
};


/**
 * @param {?proto.sqlrpc.v1.ExecutionStats|undefined} value
 * @return {!proto.sqlrpc.v1.QueryComplete} returns this
*/
proto.sqlrpc.v1.QueryComplete.prototype.setStats = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.QueryComplete} returns this
 */
proto.sqlrpc.v1.QueryComplete.prototype.clearStats = function() {
  return this.setStats(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.QueryComplete.prototype.hasStats = function() {
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
proto.sqlrpc.v1.ErrorResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.ErrorResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.ErrorResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ErrorResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.ErrorResponse}
 */
proto.sqlrpc.v1.ErrorResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.ErrorResponse;
  return proto.sqlrpc.v1.ErrorResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.ErrorResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.ErrorResponse}
 */
proto.sqlrpc.v1.ErrorResponse.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {!proto.sqlrpc.v1.SqliteCode} */ (reader.readEnum());
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
proto.sqlrpc.v1.ErrorResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.ErrorResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.ErrorResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ErrorResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.ErrorResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.ErrorResponse} returns this
 */
proto.sqlrpc.v1.ErrorResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string failed_sql = 2;
 * @return {string}
 */
proto.sqlrpc.v1.ErrorResponse.prototype.getFailedSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.ErrorResponse} returns this
 */
proto.sqlrpc.v1.ErrorResponse.prototype.setFailedSql = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional SqliteCode sqlite_error_code = 3;
 * @return {!proto.sqlrpc.v1.SqliteCode}
 */
proto.sqlrpc.v1.ErrorResponse.prototype.getSqliteErrorCode = function() {
  return /** @type {!proto.sqlrpc.v1.SqliteCode} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.sqlrpc.v1.SqliteCode} value
 * @return {!proto.sqlrpc.v1.ErrorResponse} returns this
 */
proto.sqlrpc.v1.ErrorResponse.prototype.setSqliteErrorCode = function(value) {
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
proto.sqlrpc.v1.TransactionRequest.oneofGroups_ = [[1,2,3,4,5,6,7,8,9,10]];

/**
 * @enum {number}
 */
proto.sqlrpc.v1.TransactionRequest.CommandCase = {
  COMMAND_NOT_SET: 0,
  BEGIN: 1,
  QUERY: 2,
  QUERY_STREAM: 3,
  TYPED_QUERY: 4,
  TYPED_QUERY_STREAM: 5,
  EXEC: 6,
  TYPED_EXEC: 7,
  SAVEPOINT: 8,
  COMMIT: 9,
  ROLLBACK: 10
};

/**
 * @return {proto.sqlrpc.v1.TransactionRequest.CommandCase}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getCommandCase = function() {
  return /** @type {proto.sqlrpc.v1.TransactionRequest.CommandCase} */(jspb.Message.computeOneofCase(this, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0]));
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
proto.sqlrpc.v1.TransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
begin: (f = msg.getBegin()) && proto.sqlrpc.v1.BeginRequest.toObject(includeInstance, f),
query: (f = msg.getQuery()) && proto.sqlrpc.v1.TransactionalQueryRequest.toObject(includeInstance, f),
queryStream: (f = msg.getQueryStream()) && proto.sqlrpc.v1.TransactionalQueryRequest.toObject(includeInstance, f),
typedQuery: (f = msg.getTypedQuery()) && proto.sqlrpc.v1.TypedTransactionalQueryRequest.toObject(includeInstance, f),
typedQueryStream: (f = msg.getTypedQueryStream()) && proto.sqlrpc.v1.TypedTransactionalQueryRequest.toObject(includeInstance, f),
exec: (f = msg.getExec()) && proto.sqlrpc.v1.TransactionalQueryRequest.toObject(includeInstance, f),
typedExec: (f = msg.getTypedExec()) && proto.sqlrpc.v1.TypedTransactionalQueryRequest.toObject(includeInstance, f),
savepoint: (f = msg.getSavepoint()) && proto.sqlrpc.v1.SavepointRequest.toObject(includeInstance, f),
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
 * @return {!proto.sqlrpc.v1.TransactionRequest}
 */
proto.sqlrpc.v1.TransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TransactionRequest;
  return proto.sqlrpc.v1.TransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TransactionRequest}
 */
proto.sqlrpc.v1.TransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sqlrpc.v1.BeginRequest;
      reader.readMessage(value,proto.sqlrpc.v1.BeginRequest.deserializeBinaryFromReader);
      msg.setBegin(value);
      break;
    case 2:
      var value = new proto.sqlrpc.v1.TransactionalQueryRequest;
      reader.readMessage(value,proto.sqlrpc.v1.TransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setQuery(value);
      break;
    case 3:
      var value = new proto.sqlrpc.v1.TransactionalQueryRequest;
      reader.readMessage(value,proto.sqlrpc.v1.TransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setQueryStream(value);
      break;
    case 4:
      var value = new proto.sqlrpc.v1.TypedTransactionalQueryRequest;
      reader.readMessage(value,proto.sqlrpc.v1.TypedTransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setTypedQuery(value);
      break;
    case 5:
      var value = new proto.sqlrpc.v1.TypedTransactionalQueryRequest;
      reader.readMessage(value,proto.sqlrpc.v1.TypedTransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setTypedQueryStream(value);
      break;
    case 6:
      var value = new proto.sqlrpc.v1.TransactionalQueryRequest;
      reader.readMessage(value,proto.sqlrpc.v1.TransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setExec(value);
      break;
    case 7:
      var value = new proto.sqlrpc.v1.TypedTransactionalQueryRequest;
      reader.readMessage(value,proto.sqlrpc.v1.TypedTransactionalQueryRequest.deserializeBinaryFromReader);
      msg.setTypedExec(value);
      break;
    case 8:
      var value = new proto.sqlrpc.v1.SavepointRequest;
      reader.readMessage(value,proto.sqlrpc.v1.SavepointRequest.deserializeBinaryFromReader);
      msg.setSavepoint(value);
      break;
    case 9:
      var value = new google_protobuf_empty_pb.Empty;
      reader.readMessage(value,google_protobuf_empty_pb.Empty.deserializeBinaryFromReader);
      msg.setCommit(value);
      break;
    case 10:
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
proto.sqlrpc.v1.TransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBegin();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sqlrpc.v1.BeginRequest.serializeBinaryToWriter
    );
  }
  f = message.getQuery();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sqlrpc.v1.TransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getQueryStream();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.sqlrpc.v1.TransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getTypedQuery();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.sqlrpc.v1.TypedTransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getTypedQueryStream();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.sqlrpc.v1.TypedTransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getExec();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.sqlrpc.v1.TransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getTypedExec();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.sqlrpc.v1.TypedTransactionalQueryRequest.serializeBinaryToWriter
    );
  }
  f = message.getSavepoint();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.sqlrpc.v1.SavepointRequest.serializeBinaryToWriter
    );
  }
  f = message.getCommit();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      google_protobuf_empty_pb.Empty.serializeBinaryToWriter
    );
  }
  f = message.getRollback();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      google_protobuf_empty_pb.Empty.serializeBinaryToWriter
    );
  }
};


/**
 * optional BeginRequest begin = 1;
 * @return {?proto.sqlrpc.v1.BeginRequest}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getBegin = function() {
  return /** @type{?proto.sqlrpc.v1.BeginRequest} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.BeginRequest, 1));
};


/**
 * @param {?proto.sqlrpc.v1.BeginRequest|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setBegin = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearBegin = function() {
  return this.setBegin(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasBegin = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional TransactionalQueryRequest query = 2;
 * @return {?proto.sqlrpc.v1.TransactionalQueryRequest}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getQuery = function() {
  return /** @type{?proto.sqlrpc.v1.TransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TransactionalQueryRequest, 2));
};


/**
 * @param {?proto.sqlrpc.v1.TransactionalQueryRequest|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setQuery = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearQuery = function() {
  return this.setQuery(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasQuery = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional TransactionalQueryRequest query_stream = 3;
 * @return {?proto.sqlrpc.v1.TransactionalQueryRequest}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getQueryStream = function() {
  return /** @type{?proto.sqlrpc.v1.TransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TransactionalQueryRequest, 3));
};


/**
 * @param {?proto.sqlrpc.v1.TransactionalQueryRequest|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setQueryStream = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearQueryStream = function() {
  return this.setQueryStream(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasQueryStream = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional TypedTransactionalQueryRequest typed_query = 4;
 * @return {?proto.sqlrpc.v1.TypedTransactionalQueryRequest}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getTypedQuery = function() {
  return /** @type{?proto.sqlrpc.v1.TypedTransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TypedTransactionalQueryRequest, 4));
};


/**
 * @param {?proto.sqlrpc.v1.TypedTransactionalQueryRequest|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setTypedQuery = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearTypedQuery = function() {
  return this.setTypedQuery(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasTypedQuery = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional TypedTransactionalQueryRequest typed_query_stream = 5;
 * @return {?proto.sqlrpc.v1.TypedTransactionalQueryRequest}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getTypedQueryStream = function() {
  return /** @type{?proto.sqlrpc.v1.TypedTransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TypedTransactionalQueryRequest, 5));
};


/**
 * @param {?proto.sqlrpc.v1.TypedTransactionalQueryRequest|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setTypedQueryStream = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearTypedQueryStream = function() {
  return this.setTypedQueryStream(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasTypedQueryStream = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional TransactionalQueryRequest exec = 6;
 * @return {?proto.sqlrpc.v1.TransactionalQueryRequest}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getExec = function() {
  return /** @type{?proto.sqlrpc.v1.TransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TransactionalQueryRequest, 6));
};


/**
 * @param {?proto.sqlrpc.v1.TransactionalQueryRequest|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setExec = function(value) {
  return jspb.Message.setOneofWrapperField(this, 6, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearExec = function() {
  return this.setExec(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasExec = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional TypedTransactionalQueryRequest typed_exec = 7;
 * @return {?proto.sqlrpc.v1.TypedTransactionalQueryRequest}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getTypedExec = function() {
  return /** @type{?proto.sqlrpc.v1.TypedTransactionalQueryRequest} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TypedTransactionalQueryRequest, 7));
};


/**
 * @param {?proto.sqlrpc.v1.TypedTransactionalQueryRequest|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setTypedExec = function(value) {
  return jspb.Message.setOneofWrapperField(this, 7, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearTypedExec = function() {
  return this.setTypedExec(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasTypedExec = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional SavepointRequest savepoint = 8;
 * @return {?proto.sqlrpc.v1.SavepointRequest}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getSavepoint = function() {
  return /** @type{?proto.sqlrpc.v1.SavepointRequest} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.SavepointRequest, 8));
};


/**
 * @param {?proto.sqlrpc.v1.SavepointRequest|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setSavepoint = function(value) {
  return jspb.Message.setOneofWrapperField(this, 8, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearSavepoint = function() {
  return this.setSavepoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasSavepoint = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional google.protobuf.Empty commit = 9;
 * @return {?proto.google.protobuf.Empty}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getCommit = function() {
  return /** @type{?proto.google.protobuf.Empty} */ (
    jspb.Message.getWrapperField(this, google_protobuf_empty_pb.Empty, 9));
};


/**
 * @param {?proto.google.protobuf.Empty|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setCommit = function(value) {
  return jspb.Message.setOneofWrapperField(this, 9, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearCommit = function() {
  return this.setCommit(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasCommit = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional google.protobuf.Empty rollback = 10;
 * @return {?proto.google.protobuf.Empty}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.getRollback = function() {
  return /** @type{?proto.google.protobuf.Empty} */ (
    jspb.Message.getWrapperField(this, google_protobuf_empty_pb.Empty, 10));
};


/**
 * @param {?proto.google.protobuf.Empty|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
*/
proto.sqlrpc.v1.TransactionRequest.prototype.setRollback = function(value) {
  return jspb.Message.setOneofWrapperField(this, 10, proto.sqlrpc.v1.TransactionRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionRequest} returns this
 */
proto.sqlrpc.v1.TransactionRequest.prototype.clearRollback = function() {
  return this.setRollback(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionRequest.prototype.hasRollback = function() {
  return jspb.Message.getField(this, 10) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.sqlrpc.v1.TransactionResponse.oneofGroups_ = [[1,2,3,4,5,7,8,9,11,10]];

/**
 * @enum {number}
 */
proto.sqlrpc.v1.TransactionResponse.ResponseCase = {
  RESPONSE_NOT_SET: 0,
  BEGIN: 1,
  QUERY_RESULT: 2,
  STREAM_RESULT: 3,
  TYPED_QUERY_RESULT: 4,
  TYPED_STREAM_RESULT: 5,
  SAVEPOINT: 7,
  COMMIT: 8,
  ROLLBACK: 9,
  EXEC_RESULT: 11,
  ERROR: 10
};

/**
 * @return {proto.sqlrpc.v1.TransactionResponse.ResponseCase}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getResponseCase = function() {
  return /** @type {proto.sqlrpc.v1.TransactionResponse.ResponseCase} */(jspb.Message.computeOneofCase(this, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0]));
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
proto.sqlrpc.v1.TransactionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TransactionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TransactionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
begin: (f = msg.getBegin()) && proto.sqlrpc.v1.BeginResponse.toObject(includeInstance, f),
queryResult: (f = msg.getQueryResult()) && proto.sqlrpc.v1.QueryResult.toObject(includeInstance, f),
streamResult: (f = msg.getStreamResult()) && proto.sqlrpc.v1.QueryResponse.toObject(includeInstance, f),
typedQueryResult: (f = msg.getTypedQueryResult()) && proto.sqlrpc.v1.TypedQueryResult.toObject(includeInstance, f),
typedStreamResult: (f = msg.getTypedStreamResult()) && proto.sqlrpc.v1.TypedQueryResponse.toObject(includeInstance, f),
savepoint: (f = msg.getSavepoint()) && proto.sqlrpc.v1.SavepointResponse.toObject(includeInstance, f),
commit: (f = msg.getCommit()) && proto.sqlrpc.v1.CommitResponse.toObject(includeInstance, f),
rollback: (f = msg.getRollback()) && proto.sqlrpc.v1.RollbackResponse.toObject(includeInstance, f),
execResult: (f = msg.getExecResult()) && proto.sqlrpc.v1.ExecResponse.toObject(includeInstance, f),
error: (f = msg.getError()) && proto.sqlrpc.v1.ErrorResponse.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.TransactionResponse}
 */
proto.sqlrpc.v1.TransactionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TransactionResponse;
  return proto.sqlrpc.v1.TransactionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TransactionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TransactionResponse}
 */
proto.sqlrpc.v1.TransactionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sqlrpc.v1.BeginResponse;
      reader.readMessage(value,proto.sqlrpc.v1.BeginResponse.deserializeBinaryFromReader);
      msg.setBegin(value);
      break;
    case 2:
      var value = new proto.sqlrpc.v1.QueryResult;
      reader.readMessage(value,proto.sqlrpc.v1.QueryResult.deserializeBinaryFromReader);
      msg.setQueryResult(value);
      break;
    case 3:
      var value = new proto.sqlrpc.v1.QueryResponse;
      reader.readMessage(value,proto.sqlrpc.v1.QueryResponse.deserializeBinaryFromReader);
      msg.setStreamResult(value);
      break;
    case 4:
      var value = new proto.sqlrpc.v1.TypedQueryResult;
      reader.readMessage(value,proto.sqlrpc.v1.TypedQueryResult.deserializeBinaryFromReader);
      msg.setTypedQueryResult(value);
      break;
    case 5:
      var value = new proto.sqlrpc.v1.TypedQueryResponse;
      reader.readMessage(value,proto.sqlrpc.v1.TypedQueryResponse.deserializeBinaryFromReader);
      msg.setTypedStreamResult(value);
      break;
    case 7:
      var value = new proto.sqlrpc.v1.SavepointResponse;
      reader.readMessage(value,proto.sqlrpc.v1.SavepointResponse.deserializeBinaryFromReader);
      msg.setSavepoint(value);
      break;
    case 8:
      var value = new proto.sqlrpc.v1.CommitResponse;
      reader.readMessage(value,proto.sqlrpc.v1.CommitResponse.deserializeBinaryFromReader);
      msg.setCommit(value);
      break;
    case 9:
      var value = new proto.sqlrpc.v1.RollbackResponse;
      reader.readMessage(value,proto.sqlrpc.v1.RollbackResponse.deserializeBinaryFromReader);
      msg.setRollback(value);
      break;
    case 11:
      var value = new proto.sqlrpc.v1.ExecResponse;
      reader.readMessage(value,proto.sqlrpc.v1.ExecResponse.deserializeBinaryFromReader);
      msg.setExecResult(value);
      break;
    case 10:
      var value = new proto.sqlrpc.v1.ErrorResponse;
      reader.readMessage(value,proto.sqlrpc.v1.ErrorResponse.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TransactionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TransactionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TransactionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBegin();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sqlrpc.v1.BeginResponse.serializeBinaryToWriter
    );
  }
  f = message.getQueryResult();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sqlrpc.v1.QueryResult.serializeBinaryToWriter
    );
  }
  f = message.getStreamResult();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.sqlrpc.v1.QueryResponse.serializeBinaryToWriter
    );
  }
  f = message.getTypedQueryResult();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.sqlrpc.v1.TypedQueryResult.serializeBinaryToWriter
    );
  }
  f = message.getTypedStreamResult();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.sqlrpc.v1.TypedQueryResponse.serializeBinaryToWriter
    );
  }
  f = message.getSavepoint();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.sqlrpc.v1.SavepointResponse.serializeBinaryToWriter
    );
  }
  f = message.getCommit();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.sqlrpc.v1.CommitResponse.serializeBinaryToWriter
    );
  }
  f = message.getRollback();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      proto.sqlrpc.v1.RollbackResponse.serializeBinaryToWriter
    );
  }
  f = message.getExecResult();
  if (f != null) {
    writer.writeMessage(
      11,
      f,
      proto.sqlrpc.v1.ExecResponse.serializeBinaryToWriter
    );
  }
  f = message.getError();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      proto.sqlrpc.v1.ErrorResponse.serializeBinaryToWriter
    );
  }
};


/**
 * optional BeginResponse begin = 1;
 * @return {?proto.sqlrpc.v1.BeginResponse}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getBegin = function() {
  return /** @type{?proto.sqlrpc.v1.BeginResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.BeginResponse, 1));
};


/**
 * @param {?proto.sqlrpc.v1.BeginResponse|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setBegin = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearBegin = function() {
  return this.setBegin(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasBegin = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional QueryResult query_result = 2;
 * @return {?proto.sqlrpc.v1.QueryResult}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getQueryResult = function() {
  return /** @type{?proto.sqlrpc.v1.QueryResult} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.QueryResult, 2));
};


/**
 * @param {?proto.sqlrpc.v1.QueryResult|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setQueryResult = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearQueryResult = function() {
  return this.setQueryResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasQueryResult = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional QueryResponse stream_result = 3;
 * @return {?proto.sqlrpc.v1.QueryResponse}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getStreamResult = function() {
  return /** @type{?proto.sqlrpc.v1.QueryResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.QueryResponse, 3));
};


/**
 * @param {?proto.sqlrpc.v1.QueryResponse|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setStreamResult = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearStreamResult = function() {
  return this.setStreamResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasStreamResult = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional TypedQueryResult typed_query_result = 4;
 * @return {?proto.sqlrpc.v1.TypedQueryResult}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getTypedQueryResult = function() {
  return /** @type{?proto.sqlrpc.v1.TypedQueryResult} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TypedQueryResult, 4));
};


/**
 * @param {?proto.sqlrpc.v1.TypedQueryResult|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setTypedQueryResult = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearTypedQueryResult = function() {
  return this.setTypedQueryResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasTypedQueryResult = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional TypedQueryResponse typed_stream_result = 5;
 * @return {?proto.sqlrpc.v1.TypedQueryResponse}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getTypedStreamResult = function() {
  return /** @type{?proto.sqlrpc.v1.TypedQueryResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.TypedQueryResponse, 5));
};


/**
 * @param {?proto.sqlrpc.v1.TypedQueryResponse|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setTypedStreamResult = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearTypedStreamResult = function() {
  return this.setTypedStreamResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasTypedStreamResult = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional SavepointResponse savepoint = 7;
 * @return {?proto.sqlrpc.v1.SavepointResponse}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getSavepoint = function() {
  return /** @type{?proto.sqlrpc.v1.SavepointResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.SavepointResponse, 7));
};


/**
 * @param {?proto.sqlrpc.v1.SavepointResponse|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setSavepoint = function(value) {
  return jspb.Message.setOneofWrapperField(this, 7, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearSavepoint = function() {
  return this.setSavepoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasSavepoint = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional CommitResponse commit = 8;
 * @return {?proto.sqlrpc.v1.CommitResponse}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getCommit = function() {
  return /** @type{?proto.sqlrpc.v1.CommitResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.CommitResponse, 8));
};


/**
 * @param {?proto.sqlrpc.v1.CommitResponse|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setCommit = function(value) {
  return jspb.Message.setOneofWrapperField(this, 8, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearCommit = function() {
  return this.setCommit(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasCommit = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional RollbackResponse rollback = 9;
 * @return {?proto.sqlrpc.v1.RollbackResponse}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getRollback = function() {
  return /** @type{?proto.sqlrpc.v1.RollbackResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.RollbackResponse, 9));
};


/**
 * @param {?proto.sqlrpc.v1.RollbackResponse|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setRollback = function(value) {
  return jspb.Message.setOneofWrapperField(this, 9, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearRollback = function() {
  return this.setRollback(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasRollback = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional ExecResponse exec_result = 11;
 * @return {?proto.sqlrpc.v1.ExecResponse}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getExecResult = function() {
  return /** @type{?proto.sqlrpc.v1.ExecResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.ExecResponse, 11));
};


/**
 * @param {?proto.sqlrpc.v1.ExecResponse|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setExecResult = function(value) {
  return jspb.Message.setOneofWrapperField(this, 11, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearExecResult = function() {
  return this.setExecResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasExecResult = function() {
  return jspb.Message.getField(this, 11) != null;
};


/**
 * optional ErrorResponse error = 10;
 * @return {?proto.sqlrpc.v1.ErrorResponse}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.getError = function() {
  return /** @type{?proto.sqlrpc.v1.ErrorResponse} */ (
    jspb.Message.getWrapperField(this, proto.sqlrpc.v1.ErrorResponse, 10));
};


/**
 * @param {?proto.sqlrpc.v1.ErrorResponse|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
*/
proto.sqlrpc.v1.TransactionResponse.prototype.setError = function(value) {
  return jspb.Message.setOneofWrapperField(this, 10, proto.sqlrpc.v1.TransactionResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionResponse} returns this
 */
proto.sqlrpc.v1.TransactionResponse.prototype.clearError = function() {
  return this.setError(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionResponse.prototype.hasError = function() {
  return jspb.Message.getField(this, 10) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.ExplainResponse.repeatedFields_ = [1];



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
proto.sqlrpc.v1.ExplainResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.ExplainResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.ExplainResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ExplainResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
nodesList: jspb.Message.toObjectList(msg.getNodesList(),
    sqlrpc_v1_types_pb.QueryPlanNode.toObject, includeInstance)
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
 * @return {!proto.sqlrpc.v1.ExplainResponse}
 */
proto.sqlrpc.v1.ExplainResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.ExplainResponse;
  return proto.sqlrpc.v1.ExplainResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.ExplainResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.ExplainResponse}
 */
proto.sqlrpc.v1.ExplainResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new sqlrpc_v1_types_pb.QueryPlanNode;
      reader.readMessage(value,sqlrpc_v1_types_pb.QueryPlanNode.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.ExplainResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.ExplainResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.ExplainResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ExplainResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNodesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      sqlrpc_v1_types_pb.QueryPlanNode.serializeBinaryToWriter
    );
  }
};


/**
 * repeated QueryPlanNode nodes = 1;
 * @return {!Array<!proto.sqlrpc.v1.QueryPlanNode>}
 */
proto.sqlrpc.v1.ExplainResponse.prototype.getNodesList = function() {
  return /** @type{!Array<!proto.sqlrpc.v1.QueryPlanNode>} */ (
    jspb.Message.getRepeatedWrapperField(this, sqlrpc_v1_types_pb.QueryPlanNode, 1));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.QueryPlanNode>} value
 * @return {!proto.sqlrpc.v1.ExplainResponse} returns this
*/
proto.sqlrpc.v1.ExplainResponse.prototype.setNodesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sqlrpc.v1.QueryPlanNode=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.QueryPlanNode}
 */
proto.sqlrpc.v1.ExplainResponse.prototype.addNodes = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sqlrpc.v1.QueryPlanNode, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.ExplainResponse} returns this
 */
proto.sqlrpc.v1.ExplainResponse.prototype.clearNodesList = function() {
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
proto.sqlrpc.v1.ListTablesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.ListTablesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.ListTablesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ListTablesRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.ListTablesRequest}
 */
proto.sqlrpc.v1.ListTablesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.ListTablesRequest;
  return proto.sqlrpc.v1.ListTablesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.ListTablesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.ListTablesRequest}
 */
proto.sqlrpc.v1.ListTablesRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.ListTablesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.ListTablesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.ListTablesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ListTablesRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.ListTablesRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.ListTablesRequest} returns this
 */
proto.sqlrpc.v1.ListTablesRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.ListTablesResponse.repeatedFields_ = [1];



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
proto.sqlrpc.v1.ListTablesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.ListTablesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.ListTablesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ListTablesResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.ListTablesResponse}
 */
proto.sqlrpc.v1.ListTablesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.ListTablesResponse;
  return proto.sqlrpc.v1.ListTablesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.ListTablesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.ListTablesResponse}
 */
proto.sqlrpc.v1.ListTablesResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.ListTablesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.ListTablesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.ListTablesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ListTablesResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.ListTablesResponse.prototype.getTableNamesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.ListTablesResponse} returns this
 */
proto.sqlrpc.v1.ListTablesResponse.prototype.setTableNamesList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.ListTablesResponse} returns this
 */
proto.sqlrpc.v1.ListTablesResponse.prototype.addTableNames = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.ListTablesResponse} returns this
 */
proto.sqlrpc.v1.ListTablesResponse.prototype.clearTableNamesList = function() {
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
proto.sqlrpc.v1.GetTableSchemaRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.GetTableSchemaRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.GetTableSchemaRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.GetTableSchemaRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.GetTableSchemaRequest}
 */
proto.sqlrpc.v1.GetTableSchemaRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.GetTableSchemaRequest;
  return proto.sqlrpc.v1.GetTableSchemaRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.GetTableSchemaRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.GetTableSchemaRequest}
 */
proto.sqlrpc.v1.GetTableSchemaRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.GetTableSchemaRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.GetTableSchemaRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.GetTableSchemaRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.GetTableSchemaRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.GetTableSchemaRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.GetTableSchemaRequest} returns this
 */
proto.sqlrpc.v1.GetTableSchemaRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string table_name = 2;
 * @return {string}
 */
proto.sqlrpc.v1.GetTableSchemaRequest.prototype.getTableName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.GetTableSchemaRequest} returns this
 */
proto.sqlrpc.v1.GetTableSchemaRequest.prototype.setTableName = function(value) {
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
proto.sqlrpc.v1.GetDatabaseSchemaRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.GetDatabaseSchemaRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.GetDatabaseSchemaRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.GetDatabaseSchemaRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.GetDatabaseSchemaRequest}
 */
proto.sqlrpc.v1.GetDatabaseSchemaRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.GetDatabaseSchemaRequest;
  return proto.sqlrpc.v1.GetDatabaseSchemaRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.GetDatabaseSchemaRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.GetDatabaseSchemaRequest}
 */
proto.sqlrpc.v1.GetDatabaseSchemaRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.GetDatabaseSchemaRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.GetDatabaseSchemaRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.GetDatabaseSchemaRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.GetDatabaseSchemaRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.GetDatabaseSchemaRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.GetDatabaseSchemaRequest} returns this
 */
proto.sqlrpc.v1.GetDatabaseSchemaRequest.prototype.setDatabase = function(value) {
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
proto.sqlrpc.v1.VacuumRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.VacuumRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.VacuumRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.VacuumRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.VacuumRequest}
 */
proto.sqlrpc.v1.VacuumRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.VacuumRequest;
  return proto.sqlrpc.v1.VacuumRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.VacuumRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.VacuumRequest}
 */
proto.sqlrpc.v1.VacuumRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.VacuumRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.VacuumRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.VacuumRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.VacuumRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.VacuumRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.VacuumRequest} returns this
 */
proto.sqlrpc.v1.VacuumRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string into_file = 2;
 * @return {string}
 */
proto.sqlrpc.v1.VacuumRequest.prototype.getIntoFile = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.VacuumRequest} returns this
 */
proto.sqlrpc.v1.VacuumRequest.prototype.setIntoFile = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.sqlrpc.v1.VacuumRequest} returns this
 */
proto.sqlrpc.v1.VacuumRequest.prototype.clearIntoFile = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.VacuumRequest.prototype.hasIntoFile = function() {
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
proto.sqlrpc.v1.VacuumResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.VacuumResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.VacuumResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.VacuumResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.VacuumResponse}
 */
proto.sqlrpc.v1.VacuumResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.VacuumResponse;
  return proto.sqlrpc.v1.VacuumResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.VacuumResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.VacuumResponse}
 */
proto.sqlrpc.v1.VacuumResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.VacuumResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.VacuumResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.VacuumResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.VacuumResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.VacuumResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.VacuumResponse} returns this
 */
proto.sqlrpc.v1.VacuumResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.sqlrpc.v1.VacuumResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.VacuumResponse} returns this
 */
proto.sqlrpc.v1.VacuumResponse.prototype.setMessage = function(value) {
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
proto.sqlrpc.v1.CheckpointRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.CheckpointRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.CheckpointRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.CheckpointRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.CheckpointRequest}
 */
proto.sqlrpc.v1.CheckpointRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.CheckpointRequest;
  return proto.sqlrpc.v1.CheckpointRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.CheckpointRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.CheckpointRequest}
 */
proto.sqlrpc.v1.CheckpointRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {!proto.sqlrpc.v1.CheckpointMode} */ (reader.readEnum());
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
proto.sqlrpc.v1.CheckpointRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.CheckpointRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.CheckpointRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.CheckpointRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.CheckpointRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.CheckpointRequest} returns this
 */
proto.sqlrpc.v1.CheckpointRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional CheckpointMode mode = 2;
 * @return {!proto.sqlrpc.v1.CheckpointMode}
 */
proto.sqlrpc.v1.CheckpointRequest.prototype.getMode = function() {
  return /** @type {!proto.sqlrpc.v1.CheckpointMode} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.sqlrpc.v1.CheckpointMode} value
 * @return {!proto.sqlrpc.v1.CheckpointRequest} returns this
 */
proto.sqlrpc.v1.CheckpointRequest.prototype.setMode = function(value) {
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
proto.sqlrpc.v1.CheckpointResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.CheckpointResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.CheckpointResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.CheckpointResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.CheckpointResponse}
 */
proto.sqlrpc.v1.CheckpointResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.CheckpointResponse;
  return proto.sqlrpc.v1.CheckpointResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.CheckpointResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.CheckpointResponse}
 */
proto.sqlrpc.v1.CheckpointResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.CheckpointResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.CheckpointResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.CheckpointResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.CheckpointResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.CheckpointResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.CheckpointResponse} returns this
 */
proto.sqlrpc.v1.CheckpointResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.sqlrpc.v1.CheckpointResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.CheckpointResponse} returns this
 */
proto.sqlrpc.v1.CheckpointResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int64 busy_checkpoints = 3;
 * @return {number}
 */
proto.sqlrpc.v1.CheckpointResponse.prototype.getBusyCheckpoints = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sqlrpc.v1.CheckpointResponse} returns this
 */
proto.sqlrpc.v1.CheckpointResponse.prototype.setBusyCheckpoints = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional int64 log_checkpoints = 4;
 * @return {number}
 */
proto.sqlrpc.v1.CheckpointResponse.prototype.getLogCheckpoints = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sqlrpc.v1.CheckpointResponse} returns this
 */
proto.sqlrpc.v1.CheckpointResponse.prototype.setLogCheckpoints = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional int64 checkpointed_pages = 5;
 * @return {number}
 */
proto.sqlrpc.v1.CheckpointResponse.prototype.getCheckpointedPages = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.sqlrpc.v1.CheckpointResponse} returns this
 */
proto.sqlrpc.v1.CheckpointResponse.prototype.setCheckpointedPages = function(value) {
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
proto.sqlrpc.v1.IntegrityCheckRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.IntegrityCheckRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.IntegrityCheckRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.IntegrityCheckRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.IntegrityCheckRequest}
 */
proto.sqlrpc.v1.IntegrityCheckRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.IntegrityCheckRequest;
  return proto.sqlrpc.v1.IntegrityCheckRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.IntegrityCheckRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.IntegrityCheckRequest}
 */
proto.sqlrpc.v1.IntegrityCheckRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.IntegrityCheckRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.IntegrityCheckRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.IntegrityCheckRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.IntegrityCheckRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.IntegrityCheckRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.IntegrityCheckRequest} returns this
 */
proto.sqlrpc.v1.IntegrityCheckRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int32 max_errors = 2;
 * @return {number}
 */
proto.sqlrpc.v1.IntegrityCheckRequest.prototype.getMaxErrors = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sqlrpc.v1.IntegrityCheckRequest} returns this
 */
proto.sqlrpc.v1.IntegrityCheckRequest.prototype.setMaxErrors = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.sqlrpc.v1.IntegrityCheckRequest} returns this
 */
proto.sqlrpc.v1.IntegrityCheckRequest.prototype.clearMaxErrors = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.IntegrityCheckRequest.prototype.hasMaxErrors = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.IntegrityCheckResponse.repeatedFields_ = [3];



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
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.IntegrityCheckResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.IntegrityCheckResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.IntegrityCheckResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.IntegrityCheckResponse}
 */
proto.sqlrpc.v1.IntegrityCheckResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.IntegrityCheckResponse;
  return proto.sqlrpc.v1.IntegrityCheckResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.IntegrityCheckResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.IntegrityCheckResponse}
 */
proto.sqlrpc.v1.IntegrityCheckResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.IntegrityCheckResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.IntegrityCheckResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.IntegrityCheckResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.IntegrityCheckResponse} returns this
 */
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.IntegrityCheckResponse} returns this
 */
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated string errors = 3;
 * @return {!Array<string>}
 */
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.getErrorsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sqlrpc.v1.IntegrityCheckResponse} returns this
 */
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.setErrorsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.IntegrityCheckResponse} returns this
 */
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.addErrors = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.IntegrityCheckResponse} returns this
 */
proto.sqlrpc.v1.IntegrityCheckResponse.prototype.clearErrorsList = function() {
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
proto.sqlrpc.v1.AttachDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.AttachDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.AttachDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.AttachDatabaseRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
parentDatabase: jspb.Message.getFieldWithDefault(msg, 1, ""),
attachment: (f = msg.getAttachment()) && sqlrpc_v1_types_pb.Attachment.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.AttachDatabaseRequest}
 */
proto.sqlrpc.v1.AttachDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.AttachDatabaseRequest;
  return proto.sqlrpc.v1.AttachDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.AttachDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.AttachDatabaseRequest}
 */
proto.sqlrpc.v1.AttachDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = new sqlrpc_v1_types_pb.Attachment;
      reader.readMessage(value,sqlrpc_v1_types_pb.Attachment.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.AttachDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.AttachDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.AttachDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.AttachDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
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
      sqlrpc_v1_types_pb.Attachment.serializeBinaryToWriter
    );
  }
};


/**
 * optional string parent_database = 1;
 * @return {string}
 */
proto.sqlrpc.v1.AttachDatabaseRequest.prototype.getParentDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.AttachDatabaseRequest} returns this
 */
proto.sqlrpc.v1.AttachDatabaseRequest.prototype.setParentDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional Attachment attachment = 2;
 * @return {?proto.sqlrpc.v1.Attachment}
 */
proto.sqlrpc.v1.AttachDatabaseRequest.prototype.getAttachment = function() {
  return /** @type{?proto.sqlrpc.v1.Attachment} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.Attachment, 2));
};


/**
 * @param {?proto.sqlrpc.v1.Attachment|undefined} value
 * @return {!proto.sqlrpc.v1.AttachDatabaseRequest} returns this
*/
proto.sqlrpc.v1.AttachDatabaseRequest.prototype.setAttachment = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.AttachDatabaseRequest} returns this
 */
proto.sqlrpc.v1.AttachDatabaseRequest.prototype.clearAttachment = function() {
  return this.setAttachment(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.AttachDatabaseRequest.prototype.hasAttachment = function() {
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
proto.sqlrpc.v1.AttachDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.AttachDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.AttachDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.AttachDatabaseResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.AttachDatabaseResponse}
 */
proto.sqlrpc.v1.AttachDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.AttachDatabaseResponse;
  return proto.sqlrpc.v1.AttachDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.AttachDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.AttachDatabaseResponse}
 */
proto.sqlrpc.v1.AttachDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.AttachDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.AttachDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.AttachDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.AttachDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.AttachDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.AttachDatabaseResponse} returns this
 */
proto.sqlrpc.v1.AttachDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.sqlrpc.v1.AttachDatabaseResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.AttachDatabaseResponse} returns this
 */
proto.sqlrpc.v1.AttachDatabaseResponse.prototype.setMessage = function(value) {
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
proto.sqlrpc.v1.DetachDatabaseRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.DetachDatabaseRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.DetachDatabaseRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.DetachDatabaseRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.DetachDatabaseRequest}
 */
proto.sqlrpc.v1.DetachDatabaseRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.DetachDatabaseRequest;
  return proto.sqlrpc.v1.DetachDatabaseRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.DetachDatabaseRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.DetachDatabaseRequest}
 */
proto.sqlrpc.v1.DetachDatabaseRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.DetachDatabaseRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.DetachDatabaseRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.DetachDatabaseRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.DetachDatabaseRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.DetachDatabaseRequest.prototype.getParentDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.DetachDatabaseRequest} returns this
 */
proto.sqlrpc.v1.DetachDatabaseRequest.prototype.setParentDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string alias = 2;
 * @return {string}
 */
proto.sqlrpc.v1.DetachDatabaseRequest.prototype.getAlias = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.DetachDatabaseRequest} returns this
 */
proto.sqlrpc.v1.DetachDatabaseRequest.prototype.setAlias = function(value) {
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
proto.sqlrpc.v1.DetachDatabaseResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.DetachDatabaseResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.DetachDatabaseResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.DetachDatabaseResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.DetachDatabaseResponse}
 */
proto.sqlrpc.v1.DetachDatabaseResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.DetachDatabaseResponse;
  return proto.sqlrpc.v1.DetachDatabaseResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.DetachDatabaseResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.DetachDatabaseResponse}
 */
proto.sqlrpc.v1.DetachDatabaseResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.DetachDatabaseResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.DetachDatabaseResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.DetachDatabaseResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.DetachDatabaseResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.DetachDatabaseResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.DetachDatabaseResponse} returns this
 */
proto.sqlrpc.v1.DetachDatabaseResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.sqlrpc.v1.DetachDatabaseResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.DetachDatabaseResponse} returns this
 */
proto.sqlrpc.v1.DetachDatabaseResponse.prototype.setMessage = function(value) {
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
proto.sqlrpc.v1.BeginRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.BeginRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.BeginRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.BeginRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.BeginRequest}
 */
proto.sqlrpc.v1.BeginRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.BeginRequest;
  return proto.sqlrpc.v1.BeginRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.BeginRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.BeginRequest}
 */
proto.sqlrpc.v1.BeginRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {!proto.sqlrpc.v1.TransactionLockMode} */ (reader.readEnum());
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
proto.sqlrpc.v1.BeginRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.BeginRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.BeginRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.BeginRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.BeginRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.BeginRequest} returns this
 */
proto.sqlrpc.v1.BeginRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional TransactionLockMode mode = 2;
 * @return {!proto.sqlrpc.v1.TransactionLockMode}
 */
proto.sqlrpc.v1.BeginRequest.prototype.getMode = function() {
  return /** @type {!proto.sqlrpc.v1.TransactionLockMode} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.sqlrpc.v1.TransactionLockMode} value
 * @return {!proto.sqlrpc.v1.BeginRequest} returns this
 */
proto.sqlrpc.v1.BeginRequest.prototype.setMode = function(value) {
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
proto.sqlrpc.v1.TransactionalQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TransactionalQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TransactionalQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionalQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
sql: jspb.Message.getFieldWithDefault(msg, 1, ""),
parameters: (f = msg.getParameters()) && sqlrpc_v1_types_pb.Parameters.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.TransactionalQueryRequest}
 */
proto.sqlrpc.v1.TransactionalQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TransactionalQueryRequest;
  return proto.sqlrpc.v1.TransactionalQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TransactionalQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TransactionalQueryRequest}
 */
proto.sqlrpc.v1.TransactionalQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = new sqlrpc_v1_types_pb.Parameters;
      reader.readMessage(value,sqlrpc_v1_types_pb.Parameters.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TransactionalQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TransactionalQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TransactionalQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TransactionalQueryRequest.serializeBinaryToWriter = function(message, writer) {
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
      sqlrpc_v1_types_pb.Parameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string sql = 1;
 * @return {string}
 */
proto.sqlrpc.v1.TransactionalQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TransactionalQueryRequest} returns this
 */
proto.sqlrpc.v1.TransactionalQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional Parameters parameters = 2;
 * @return {?proto.sqlrpc.v1.Parameters}
 */
proto.sqlrpc.v1.TransactionalQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.sqlrpc.v1.Parameters} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.Parameters, 2));
};


/**
 * @param {?proto.sqlrpc.v1.Parameters|undefined} value
 * @return {!proto.sqlrpc.v1.TransactionalQueryRequest} returns this
*/
proto.sqlrpc.v1.TransactionalQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TransactionalQueryRequest} returns this
 */
proto.sqlrpc.v1.TransactionalQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TransactionalQueryRequest.prototype.hasParameters = function() {
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
proto.sqlrpc.v1.SavepointRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.SavepointRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.SavepointRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.SavepointRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.SavepointRequest}
 */
proto.sqlrpc.v1.SavepointRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.SavepointRequest;
  return proto.sqlrpc.v1.SavepointRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.SavepointRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.SavepointRequest}
 */
proto.sqlrpc.v1.SavepointRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = /** @type {!proto.sqlrpc.v1.SavepointAction} */ (reader.readEnum());
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
proto.sqlrpc.v1.SavepointRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.SavepointRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.SavepointRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.SavepointRequest.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.SavepointRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.SavepointRequest} returns this
 */
proto.sqlrpc.v1.SavepointRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional SavepointAction action = 2;
 * @return {!proto.sqlrpc.v1.SavepointAction}
 */
proto.sqlrpc.v1.SavepointRequest.prototype.getAction = function() {
  return /** @type {!proto.sqlrpc.v1.SavepointAction} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.sqlrpc.v1.SavepointAction} value
 * @return {!proto.sqlrpc.v1.SavepointRequest} returns this
 */
proto.sqlrpc.v1.SavepointRequest.prototype.setAction = function(value) {
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
proto.sqlrpc.v1.BeginResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.BeginResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.BeginResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.BeginResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.BeginResponse}
 */
proto.sqlrpc.v1.BeginResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.BeginResponse;
  return proto.sqlrpc.v1.BeginResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.BeginResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.BeginResponse}
 */
proto.sqlrpc.v1.BeginResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.BeginResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.BeginResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.BeginResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.BeginResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.BeginResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.BeginResponse} returns this
 */
proto.sqlrpc.v1.BeginResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string transaction_id = 2;
 * @return {string}
 */
proto.sqlrpc.v1.BeginResponse.prototype.getTransactionId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.BeginResponse} returns this
 */
proto.sqlrpc.v1.BeginResponse.prototype.setTransactionId = function(value) {
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
proto.sqlrpc.v1.CommitResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.CommitResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.CommitResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.CommitResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.CommitResponse}
 */
proto.sqlrpc.v1.CommitResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.CommitResponse;
  return proto.sqlrpc.v1.CommitResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.CommitResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.CommitResponse}
 */
proto.sqlrpc.v1.CommitResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.CommitResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.CommitResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.CommitResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.CommitResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.CommitResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.CommitResponse} returns this
 */
proto.sqlrpc.v1.CommitResponse.prototype.setSuccess = function(value) {
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
proto.sqlrpc.v1.RollbackResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.RollbackResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.RollbackResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.RollbackResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.RollbackResponse}
 */
proto.sqlrpc.v1.RollbackResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.RollbackResponse;
  return proto.sqlrpc.v1.RollbackResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.RollbackResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.RollbackResponse}
 */
proto.sqlrpc.v1.RollbackResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.RollbackResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.RollbackResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.RollbackResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.RollbackResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.RollbackResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.RollbackResponse} returns this
 */
proto.sqlrpc.v1.RollbackResponse.prototype.setSuccess = function(value) {
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
proto.sqlrpc.v1.TypedTransactionalQueryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.TypedTransactionalQueryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.TypedTransactionalQueryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedTransactionalQueryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
sql: jspb.Message.getFieldWithDefault(msg, 1, ""),
parameters: (f = msg.getParameters()) && sqlrpc_v1_types_pb.TypedParameters.toObject(includeInstance, f)
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
 * @return {!proto.sqlrpc.v1.TypedTransactionalQueryRequest}
 */
proto.sqlrpc.v1.TypedTransactionalQueryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.TypedTransactionalQueryRequest;
  return proto.sqlrpc.v1.TypedTransactionalQueryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.TypedTransactionalQueryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.TypedTransactionalQueryRequest}
 */
proto.sqlrpc.v1.TypedTransactionalQueryRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      var value = new sqlrpc_v1_types_pb.TypedParameters;
      reader.readMessage(value,sqlrpc_v1_types_pb.TypedParameters.deserializeBinaryFromReader);
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
proto.sqlrpc.v1.TypedTransactionalQueryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.TypedTransactionalQueryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.TypedTransactionalQueryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.TypedTransactionalQueryRequest.serializeBinaryToWriter = function(message, writer) {
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
      sqlrpc_v1_types_pb.TypedParameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional string sql = 1;
 * @return {string}
 */
proto.sqlrpc.v1.TypedTransactionalQueryRequest.prototype.getSql = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.TypedTransactionalQueryRequest} returns this
 */
proto.sqlrpc.v1.TypedTransactionalQueryRequest.prototype.setSql = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional TypedParameters parameters = 2;
 * @return {?proto.sqlrpc.v1.TypedParameters}
 */
proto.sqlrpc.v1.TypedTransactionalQueryRequest.prototype.getParameters = function() {
  return /** @type{?proto.sqlrpc.v1.TypedParameters} */ (
    jspb.Message.getWrapperField(this, sqlrpc_v1_types_pb.TypedParameters, 2));
};


/**
 * @param {?proto.sqlrpc.v1.TypedParameters|undefined} value
 * @return {!proto.sqlrpc.v1.TypedTransactionalQueryRequest} returns this
*/
proto.sqlrpc.v1.TypedTransactionalQueryRequest.prototype.setParameters = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sqlrpc.v1.TypedTransactionalQueryRequest} returns this
 */
proto.sqlrpc.v1.TypedTransactionalQueryRequest.prototype.clearParameters = function() {
  return this.setParameters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.TypedTransactionalQueryRequest.prototype.hasParameters = function() {
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
proto.sqlrpc.v1.ListExtensionsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.ListExtensionsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.ListExtensionsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ListExtensionsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f
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
 * @return {!proto.sqlrpc.v1.ListExtensionsRequest}
 */
proto.sqlrpc.v1.ListExtensionsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.ListExtensionsRequest;
  return proto.sqlrpc.v1.ListExtensionsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.ListExtensionsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.ListExtensionsRequest}
 */
proto.sqlrpc.v1.ListExtensionsRequest.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.ListExtensionsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.ListExtensionsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.ListExtensionsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ListExtensionsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
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
proto.sqlrpc.v1.ListExtensionsRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.ListExtensionsRequest} returns this
 */
proto.sqlrpc.v1.ListExtensionsRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.sqlrpc.v1.ListExtensionsRequest} returns this
 */
proto.sqlrpc.v1.ListExtensionsRequest.prototype.clearDatabase = function() {
  return jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sqlrpc.v1.ListExtensionsRequest.prototype.hasDatabase = function() {
  return jspb.Message.getField(this, 1) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sqlrpc.v1.ListExtensionsResponse.repeatedFields_ = [1];



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
proto.sqlrpc.v1.ListExtensionsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.ListExtensionsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.ListExtensionsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ListExtensionsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
extensionsList: jspb.Message.toObjectList(msg.getExtensionsList(),
    sqlrpc_v1_types_pb.ExtensionInfo.toObject, includeInstance)
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
 * @return {!proto.sqlrpc.v1.ListExtensionsResponse}
 */
proto.sqlrpc.v1.ListExtensionsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.ListExtensionsResponse;
  return proto.sqlrpc.v1.ListExtensionsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.ListExtensionsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.ListExtensionsResponse}
 */
proto.sqlrpc.v1.ListExtensionsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new sqlrpc_v1_types_pb.ExtensionInfo;
      reader.readMessage(value,sqlrpc_v1_types_pb.ExtensionInfo.deserializeBinaryFromReader);
      msg.addExtensions(value);
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
proto.sqlrpc.v1.ListExtensionsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.ListExtensionsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.ListExtensionsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.ListExtensionsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getExtensionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      sqlrpc_v1_types_pb.ExtensionInfo.serializeBinaryToWriter
    );
  }
};


/**
 * repeated ExtensionInfo extensions = 1;
 * @return {!Array<!proto.sqlrpc.v1.ExtensionInfo>}
 */
proto.sqlrpc.v1.ListExtensionsResponse.prototype.getExtensionsList = function() {
  return /** @type{!Array<!proto.sqlrpc.v1.ExtensionInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, sqlrpc_v1_types_pb.ExtensionInfo, 1));
};


/**
 * @param {!Array<!proto.sqlrpc.v1.ExtensionInfo>} value
 * @return {!proto.sqlrpc.v1.ListExtensionsResponse} returns this
*/
proto.sqlrpc.v1.ListExtensionsResponse.prototype.setExtensionsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sqlrpc.v1.ExtensionInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sqlrpc.v1.ExtensionInfo}
 */
proto.sqlrpc.v1.ListExtensionsResponse.prototype.addExtensions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sqlrpc.v1.ExtensionInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sqlrpc.v1.ListExtensionsResponse} returns this
 */
proto.sqlrpc.v1.ListExtensionsResponse.prototype.clearExtensionsList = function() {
  return this.setExtensionsList([]);
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
proto.sqlrpc.v1.LoadExtensionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.LoadExtensionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.LoadExtensionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.LoadExtensionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
database: jspb.Message.getFieldWithDefault(msg, 1, ""),
folderName: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.sqlrpc.v1.LoadExtensionRequest}
 */
proto.sqlrpc.v1.LoadExtensionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.LoadExtensionRequest;
  return proto.sqlrpc.v1.LoadExtensionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.LoadExtensionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.LoadExtensionRequest}
 */
proto.sqlrpc.v1.LoadExtensionRequest.deserializeBinaryFromReader = function(msg, reader) {
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
      msg.setFolderName(value);
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
proto.sqlrpc.v1.LoadExtensionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.LoadExtensionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.LoadExtensionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.LoadExtensionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDatabase();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getFolderName();
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
proto.sqlrpc.v1.LoadExtensionRequest.prototype.getDatabase = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.LoadExtensionRequest} returns this
 */
proto.sqlrpc.v1.LoadExtensionRequest.prototype.setDatabase = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string folder_name = 2;
 * @return {string}
 */
proto.sqlrpc.v1.LoadExtensionRequest.prototype.getFolderName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.LoadExtensionRequest} returns this
 */
proto.sqlrpc.v1.LoadExtensionRequest.prototype.setFolderName = function(value) {
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
proto.sqlrpc.v1.LoadExtensionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sqlrpc.v1.LoadExtensionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sqlrpc.v1.LoadExtensionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.LoadExtensionResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.sqlrpc.v1.LoadExtensionResponse}
 */
proto.sqlrpc.v1.LoadExtensionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sqlrpc.v1.LoadExtensionResponse;
  return proto.sqlrpc.v1.LoadExtensionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sqlrpc.v1.LoadExtensionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sqlrpc.v1.LoadExtensionResponse}
 */
proto.sqlrpc.v1.LoadExtensionResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sqlrpc.v1.LoadExtensionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sqlrpc.v1.LoadExtensionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sqlrpc.v1.LoadExtensionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sqlrpc.v1.LoadExtensionResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.sqlrpc.v1.LoadExtensionResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sqlrpc.v1.LoadExtensionResponse} returns this
 */
proto.sqlrpc.v1.LoadExtensionResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.sqlrpc.v1.LoadExtensionResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sqlrpc.v1.LoadExtensionResponse} returns this
 */
proto.sqlrpc.v1.LoadExtensionResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * @enum {number}
 */
proto.sqlrpc.v1.SavepointAction = {
  SAVEPOINT_ACTION_UNSPECIFIED: 0,
  SAVEPOINT_ACTION_CREATE: 1,
  SAVEPOINT_ACTION_RELEASE: 2,
  SAVEPOINT_ACTION_ROLLBACK: 3
};

goog.object.extend(exports, proto.sqlrpc.v1);
