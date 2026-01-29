/**
 * @file index.js
 */
const DatabaseClient = require('./DatabaseClient');
const TransactionHandle = require('./TransactionHandle');
const { SqliteCode, TransactionMode, ColumnType, SavepointAction } = require('./constants');
const { toObject } = require('./utils');


// But wait, the server expects ? for positional args, not $1.
// Standard sql-template-strings uses ? by default or configurable.
// Let's make a compatible one that produces text with ? and values array.
/**
 * Tag function compatible with sql-template-strings.
 * Returns an object with `text` (containing `?` placeholders) and `values`.
 *
 * @param {TemplateStringsArray} strings - The template strings parts.
 * @param {...any} values - The interpolated values.
 * @returns {{text: string, values: Array<any>}} The SQL statement object.
 */
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
    TransactionHandle,
    SqliteCode,
    TransactionMode,
    ColumnType,
    SavepointAction,
    toObject,
    SQL: SQL_Compatible
};
