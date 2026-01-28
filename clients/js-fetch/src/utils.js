/**
 * @file src/utils.js
 * @description Helper functions for parameter marshalling and result hydration.
 */
const { ColumnType } = require('./constants');

/**
 * Converts JS params to the JSON structure expected by the Connect RPC/JSON gateway.
 * 
 * @param {Array<any>} positional - Positional args.
 * @param {Object} named - Named args.
 * @param {Object} hints - { positional: { index: type }, named: { name: type } }
 * @returns {Object} JSON-serializable Parameters object
 */
function toParams(positional = [], named = {}, hints = {}) {
    const params = {};

    if (Array.isArray(positional) && positional.length > 0) {
        params.positional = positional;
        params.positionalHints = {};
        const h = hints.positional || {};
        for (const [k, v] of Object.entries(h)) {
            params.positionalHints[k] = v;
        }
    }

    if (named && Object.keys(named).length > 0) {
        params.named = named;
        params.namedHints = {};
        const h = hints.named || {};
        for (const [k, v] of Object.entries(h)) {
            params.namedHints[k] = v;
        }
    }

    return params;
}

/**
 * Hydrates a single row from JSON values based on column types.
 * 
 * @param {Array<any>} row - The raw JSON row (strings, numbers, nulls).
 * @param {Array<number>} columnTypes - Array of ColumnType enums.
 * @param {string} dateHandling - 'date' | 'string' | 'number'.
 */
function hydrateRow(row, columnTypes, dateHandling = 'date') {
    if (!row) return [];

    return row.map((val, i) => {
        if (val === null) return null;

        const type = columnTypes[i];

        if (type === ColumnType.COLUMN_TYPE_INTEGER || type === 'COLUMN_TYPE_INTEGER') {
            if (typeof val === 'string') {
                try {
                    return BigInt(val);
                } catch {
                    return val;
                }
            }
            return val;
        }

        if (type === ColumnType.COLUMN_TYPE_BLOB || type === 'COLUMN_TYPE_BLOB') {
            if (typeof val === 'string') {
                return Buffer.from(val, 'base64');
            }
            return val;
        }

        if (type === ColumnType.COLUMN_TYPE_DATE || type === 'COLUMN_TYPE_DATE') {
            if (dateHandling === 'string') return val;

            const date = new Date(val);
            const ts = isNaN(date.getTime()) ? null : date.getTime();
            if (ts === null) return val;

            if (dateHandling === 'number') return ts;
            return date;
        }

        return val;
    });
}

/**
 * Resolves standard query arguments.
 */
function resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull) {
    let sql = "";
    let positional = [];
    let named = {};
    let rawHints = {};

    // Case 1: SQL string
    if (typeof sqlOrObj === 'string') {
        sql = sqlOrObj;
        const p = paramsOrHints;
        if (p) {
            if (Array.isArray(p)) {
                throw new Error("Direct array parameters not supported in js-fetch client. Use { positional: [...] }.");
            }
            if (typeof p === 'object') {
                positional = p.positional || [];
                named = p.named || {};
            }
            rawHints = hintsOrNull || {};
        }
    }
    // Case 2: Template String Object (sql-template-strings)
    else if (sqlOrObj && typeof sqlOrObj === 'object' && sqlOrObj.text) {
        sql = sqlOrObj.text;
        positional = sqlOrObj.values || [];
        rawHints = paramsOrHints || {};
    } else {
        throw new Error("Invalid SQL argument. Expected string or SQL object.");
    }

    // Normalize hints
    const normalizedHints = { positional: {}, named: {} };
    if (rawHints.positional || rawHints.named) {
        normalizedHints.positional = rawHints.positional || {};
        normalizedHints.named = rawHints.named || {};
    } else if (Object.keys(rawHints).length > 0) {
        // Guess
        if (positional.length > 0 && Object.keys(named).length === 0) {
            normalizedHints.positional = rawHints;
        } else if (Object.keys(named).length > 0 && positional.length === 0) {
            normalizedHints.named = rawHints;
        }
    }

    return { sql, positional, named, hints: normalizedHints };
}

/**
 * Helper to convert row arrays to objects.
 */
function toObject(columns, row) {
    const obj = {};
    for (let i = 0; i < columns.length; i++) {
        obj[columns[i]] = row[i];
    }
    return obj;
}

module.exports = {
    toParams,
    hydrateRow,
    resolveArgs,
    toObject,
};
