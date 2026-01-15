/**
 * @file lib/constants.js
 * @description Exported Enums matching the db/v1/database.proto definitions.
 */

/**
 * SqliteCode maps standard SQLite C result codes.
 * Reference: https://www.sqlite.org/rescode.html
 * @readonly
 * @enum {number}
 */
const SqliteCode = {
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
  SQLITE_CODE_DONE: 101,
};

/**
 * TransactionMode defines the locking behavior.
 * @readonly
 * @enum {number}
 */
const TransactionMode = {
  TRANSACTION_MODE_UNSPECIFIED: 0,
  TRANSACTION_MODE_DEFERRED: 1,
  TRANSACTION_MODE_IMMEDIATE: 2,
  TRANSACTION_MODE_EXCLUSIVE: 3,
};

/**
 * ColumnType hints allow the server to interpret ambiguous JSON/Proto types correctly.
 * @readonly
 * @enum {number}
 */
const ColumnType = {
  COLUMN_TYPE_UNSPECIFIED: 0,
  COLUMN_TYPE_NULL: 1,
  COLUMN_TYPE_INTEGER: 2,
  COLUMN_TYPE_FLOAT: 3,
  COLUMN_TYPE_TEXT: 4,
  COLUMN_TYPE_BLOB: 5,
  COLUMN_TYPE_BOOLEAN: 6,
  COLUMN_TYPE_DATE: 7,
  COLUMN_TYPE_JSON: 8,
};

/**
 * SavepointAction defines the save point action.
 * @readonly
 * @enum {number}
 */
const SavepointAction = {
  SAVEPOINT_ACTION_UNSPECIFIED: 0,
  SAVEPOINT_ACTION_CREATE: 1,
  SAVEPOINT_ACTION_RELEASE: 2,
  SAVEPOINT_ACTION_ROLLBACK: 3,
};

module.exports = {
  SqliteCode,
  TransactionMode,
  ColumnType,
  SavepointAction,
};
