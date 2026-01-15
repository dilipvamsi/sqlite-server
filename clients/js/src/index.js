/**
 * @file index.js
 * @description Main entry point for the sqlite-server client library.
 */

const DatabaseClient = require('./lib/DatabaseClient');
const TransactionHandle = require('./lib/TransactionHandle');
const { SqliteCode, TransactionMode, ColumnType } = require('./lib/constants');
const { toObject } = require('./lib/utils');
const SQL = require('sql-template-strings');

module.exports = {
  DatabaseClient,
  TransactionHandle,
  SqliteCode,
  TransactionMode,
  ColumnType,
  toObject,
  SQL,
};
