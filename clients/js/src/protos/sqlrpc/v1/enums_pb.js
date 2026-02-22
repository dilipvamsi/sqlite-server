// source: sqlrpc/v1/enums.proto
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

goog.exportSymbol('proto.sqlrpc.v1.CheckpointMode', null, global);
goog.exportSymbol('proto.sqlrpc.v1.ColumnAffinity', null, global);
goog.exportSymbol('proto.sqlrpc.v1.DeclaredType', null, global);
goog.exportSymbol('proto.sqlrpc.v1.Role', null, global);
goog.exportSymbol('proto.sqlrpc.v1.SqliteCode', null, global);
goog.exportSymbol('proto.sqlrpc.v1.TransactionLockMode', null, global);
/**
 * @enum {number}
 */
proto.sqlrpc.v1.SqliteCode = {
  SQLITE_OK: 0,
  SQLITE_ERROR: 1,
  SQLITE_INTERNAL: 2,
  SQLITE_PERM: 3,
  SQLITE_ABORT: 4,
  SQLITE_BUSY: 5,
  SQLITE_LOCKED: 6,
  SQLITE_NOMEM: 7,
  SQLITE_READONLY: 8,
  SQLITE_INTERRUPT: 9,
  SQLITE_IOERR: 10,
  SQLITE_CORRUPT: 11,
  SQLITE_NOTFOUND: 12,
  SQLITE_FULL: 13,
  SQLITE_CANTOPEN: 14,
  SQLITE_PROTOCOL: 15,
  SQLITE_EMPTY: 16,
  SQLITE_SCHEMA: 17,
  SQLITE_TOOBIG: 18,
  SQLITE_CONSTRAINT: 19,
  SQLITE_MISMATCH: 20,
  SQLITE_MISUSE: 21,
  SQLITE_NOLFS: 22,
  SQLITE_AUTH: 23,
  SQLITE_FORMAT: 24,
  SQLITE_RANGE: 25,
  SQLITE_NOTADB: 26,
  SQLITE_NOTICE: 27,
  SQLITE_WARNING: 28,
  SQLITE_ROW: 100,
  SQLITE_DONE: 101
};

/**
 * @enum {number}
 */
proto.sqlrpc.v1.TransactionLockMode = {
  TRANSACTION_LOCK_MODE_UNSPECIFIED: 0,
  TRANSACTION_LOCK_MODE_DEFERRED: 1,
  TRANSACTION_LOCK_MODE_IMMEDIATE: 2,
  TRANSACTION_LOCK_MODE_EXCLUSIVE: 3
};

/**
 * @enum {number}
 */
proto.sqlrpc.v1.CheckpointMode = {
  CHECKPOINT_MODE_UNSPECIFIED: 0,
  CHECKPOINT_MODE_PASSIVE: 1,
  CHECKPOINT_MODE_FULL: 2,
  CHECKPOINT_MODE_RESTART: 3,
  CHECKPOINT_MODE_TRUNCATE: 4
};

/**
 * @enum {number}
 */
proto.sqlrpc.v1.ColumnAffinity = {
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
proto.sqlrpc.v1.DeclaredType = {
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
  DECLARED_TYPE_TIME: 31,
  DECLARED_TYPE_YEAR: 32,
  DECLARED_TYPE_JSON: 29,
  DECLARED_TYPE_UUID: 30,
  DECLARED_TYPE_CHAR: 33,
  DECLARED_TYPE_XML: 34
};

/**
 * @enum {number}
 */
proto.sqlrpc.v1.Role = {
  ROLE_UNSPECIFIED: 0,
  ROLE_READ_ONLY: 10,
  ROLE_READ_WRITE: 20,
  ROLE_DATABASE_MANAGER: 30,
  ROLE_ADMIN: 40
};

goog.object.extend(exports, proto.sqlrpc.v1);
