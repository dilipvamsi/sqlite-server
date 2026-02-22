/**
 * @file lib/constants.js
 * @description Exported Enums matching the sqlrpc/v1 Protobuf definitions.
 */

/**
 * SqliteCode maps standard SQLite C result codes.
 * Reference: https://www.sqlite.org/rescode.html
 * @readonly
 * @enum {number}
 */
const SqliteCode = {
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
  SQLITE_DONE: 101,
};

/**
 * TransactionLockMode defines the locking behavior (aligned with db_service.proto).
 * @readonly
 * @enum {number}
 */
const TransactionLockMode = {
  TRANSACTION_LOCK_MODE_UNSPECIFIED: 0,
  TRANSACTION_LOCK_MODE_DEFERRED: 1,
  TRANSACTION_LOCK_MODE_IMMEDIATE: 2,
  TRANSACTION_LOCK_MODE_EXCLUSIVE: 3,
};
const TransactionMode = TransactionLockMode;

/**
 * ColumnAffinity defines the storage class of the column.
 * @readonly
 * @enum {number}
 */
const ColumnAffinity = {
  COLUMN_AFFINITY_UNSPECIFIED: 0,
  COLUMN_AFFINITY_INTEGER: 1,
  COLUMN_AFFINITY_TEXT: 2,
  COLUMN_AFFINITY_BLOB: 3,
  COLUMN_AFFINITY_REAL: 4,
  COLUMN_AFFINITY_NUMERIC: 5,
};

/**
 * DeclaredType hints at the semantic meaning of the column.
 * @readonly
 * @enum {number}
 */
const DeclaredType = {
  DECLARED_TYPE_UNSPECIFIED: 0,
  // --- Integer Family ---
  DECLARED_TYPE_INT: 1,
  DECLARED_TYPE_INTEGER: 2,
  DECLARED_TYPE_TINYINT: 3,
  DECLARED_TYPE_SMALLINT: 4,
  DECLARED_TYPE_MEDIUMINT: 5,
  DECLARED_TYPE_BIGINT: 6,
  DECLARED_TYPE_UNSIGNED_BIG_INT: 7,
  DECLARED_TYPE_INT2: 8,
  DECLARED_TYPE_INT8: 9,
  // --- Character/Text Family ---
  DECLARED_TYPE_CHARACTER: 10,
  DECLARED_TYPE_VARCHAR: 11,
  DECLARED_TYPE_VARYING_CHARACTER: 12,
  DECLARED_TYPE_NCHAR: 13,
  DECLARED_TYPE_NATIVE_CHARACTER: 14,
  DECLARED_TYPE_NVARCHAR: 15,
  DECLARED_TYPE_TEXT: 16,
  DECLARED_TYPE_CLOB: 17,
  // --- Blob Family ---
  DECLARED_TYPE_BLOB: 18,
  // --- Real/Float Family ---
  DECLARED_TYPE_REAL: 19,
  DECLARED_TYPE_DOUBLE: 20,
  DECLARED_TYPE_DOUBLE_PRECISION: 21,
  DECLARED_TYPE_FLOAT: 22,
  // --- Numeric/Date/Boolean/JSON Family ---
  DECLARED_TYPE_NUMERIC: 23,
  DECLARED_TYPE_DECIMAL: 24,
  DECLARED_TYPE_BOOLEAN: 25,
  DECLARED_TYPE_DATE: 26,
  DECLARED_TYPE_DATETIME: 27,
  DECLARED_TYPE_TIMESTAMP: 28,
  DECLARED_TYPE_JSON: 29,
  // --- Specialized Types ---
  DECLARED_TYPE_UUID: 30,
  DECLARED_TYPE_TIME: 31,
  DECLARED_TYPE_YEAR: 32,
  DECLARED_TYPE_CHAR: 33,
  DECLARED_TYPE_XML: 34,
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

/**
 * TransactionType defines the underlying execution mode.
 * @readonly
 * @enum {number}
 */
const TransactionType = {
  STREAMING: 1,
  UNARY: 2,
};

/**
 * CheckpointMode defines the WAL checkpoint mode.
 * @readonly
 * @enum {number}
 */
const CheckpointMode = {
  CHECKPOINT_MODE_UNSPECIFIED: 0,
  CHECKPOINT_MODE_PASSIVE: 1,
  CHECKPOINT_MODE_FULL: 2,
  CHECKPOINT_MODE_RESTART: 3,
  CHECKPOINT_MODE_TRUNCATE: 4,
};

module.exports = {
  SqliteCode,
  ColumnAffinity,
  DeclaredType,
  SavepointAction,
  TransactionType,
  CheckpointMode,
  TransactionLockMode,
};
