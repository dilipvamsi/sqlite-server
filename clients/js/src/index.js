/**
 * @file index.js
 * @description Main entry point for the sqlite-server client library.
 */

const DatabaseClient = require('./lib/DatabaseClient');
const TransactionHandle = require('./lib/TransactionHandle');
const {
  SavepointAction,
  ColumnAffinity,
  DeclaredType,
  SqliteCode,
  TransactionType,
  CheckpointMode,
  TransactionLockMode,
} = require("./lib/constants");
const { toObject } = require('./lib/utils');
const SQL = require('sql-template-strings');

/**
 * @typedef {object} BasicAuthConfig
 * @property {'basic'} type - Authentication type.
 * @property {string} username - Basic auth username.
 * @property {string} password - Basic auth password.
 */

/**
 * @typedef {object} BearerAuthConfig
 * @property {'bearer'} type - Authentication type.
 * @property {string} token - Bearer token.
 */

/**
 * @typedef {BasicAuthConfig | BearerAuthConfig} AuthConfig
 */

/**
 * @typedef {object} ClientConfig
 * @property {'date'|'string'|'number'} [dateHandling]
 * @property {object} [retry]
 * @property {number} [retry.maxRetries]
 * @property {number} [retry.baseDelayMs]
 * @property {Array<object>} [interceptors]
 * @property {AuthConfig} [auth]
 * @property {object} [credentials] - gRPC ChannelCredentials (default: insecure).

 */

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
   * Enums for savepoint actions.
   * @type {object}
   */
  SavepointAction,

  /**
   * Enums for column storage classes.
   * @type {object}
   */
  ColumnAffinity,

  /**
   * Enums for declared semantic types.
   * @type {object}
   */
  DeclaredType,

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

  /**
   * Enums for Checkpoint modes.
   * @type {object}
   */
  CheckpointMode,

  /**
   * Enums for Transaction locking modes (STRICT).
   * @type {object}
   */
  TransactionLockMode,
};
