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
  TransactionMode,
  ColumnAffinity,
  DeclaredType,
  SavepointAction,
  TransactionType,
  CheckpointMode,
};
