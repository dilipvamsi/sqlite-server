/**
 * @file index.js
 */
const DatabaseClient = require('./Client');
const Transaction = require('./Transaction');
const { SqliteCode, TransactionMode, ColumnType, SavepointAction } = require('./constants');
const { toObject } = require('./utils');


// But wait, the server expects ? for positional args, not $1.
// Standard sql-template-strings uses ? by default or configurable.
// Let's make a compatible one that produces text with ? and values array.
function SQL_Compatible(strings, ...values) {
    let text = strings[0];
    for (let i = 1; i < strings.length; i++) {
        text += '?' + strings[i];
    }
    return {
        text,
        values
    };
}


/**
 * @module sqlite-client-fetch
 */
module.exports = {
    DatabaseClient,
    Transaction,
    SqliteCode,
    TransactionMode,
    ColumnType,
    SavepointAction,
    toObject,
    SQL: SQL_Compatible
};
