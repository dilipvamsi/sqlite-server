/**
 * @file index.js
 * @description Main entry point for the sqlite-server client library.
 */

const DatabaseClient = require('./lib/DatabaseClient');
const TransactionHandle = require('./lib/TransactionHandle');
const {
  TransactionMode,
  SavepointAction,
  ColumnType,
  SqliteCode,
  TransactionType,
} = require("./lib/constants");
const { toObject } = require('./lib/utils');
const SQL = require('sql-template-strings');

/**
 * @module sqlite-client
 */
module.exports = {
  /**
   * The main client class for connecting to the SQLite Server.
   * @type {typeof import('./lib/DatabaseClient')}
   */
  DatabaseClient,

  /**
   * Represents a bidirectional streaming transaction.
   * @type {typeof import('./lib/TransactionHandle')}
   */
  TransactionHandle,

  /**
   * Helper to convert row arrays to objects.
   * @type {typeof import('./lib/utils').toObject}
   */
  toObject,

  /**
   * Tag function for writing safe SQL queries.
   * @type {function}
   */
  SQL,

  /**
   * Enums for transaction locking modes.
   * @type {object}
   */
  TransactionMode,

  /**
   * Enums for savepoint actions.
   * @type {object}
   */
  SavepointAction,

  /**
   * Enums for column hint types.
   * @type {object}
   */
  ColumnType,

  /**
   * Enums for SQLite result codes.
   * @type {object}
   */
  SqliteCode,

  /**
   * Enums for Transaction types (Streaming vs Unary).
   * @type {object}
   */
  TransactionType,
};
