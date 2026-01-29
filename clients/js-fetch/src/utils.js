/**
 * @file src/utils.js
 * @description Helper functions for parameter marshalling and result hydration.
 */
const { ColumnAffinity, DeclaredType } = require('./constants');

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
 * @param {Array<number>} affinities - Array of ColumnAffinity enums.
 * @param {Array<number>} declaredTypes - Array of DeclaredType enums.
 * @param {object} [typeParsers={}] - { bigint, json, blob, date }
 */
function hydrateRow(row, affinities, declaredTypes, typeParsers = {}) {
    if (!row) return [];

    const parseBigInt = typeParsers.bigint !== false;
    const parseJson = typeParsers.json !== false;
    const parseBlob = typeParsers.blob !== false;
    const dateHandling = typeParsers.date || 'date';

    return row.map((val, i) => {
        if (val === null) return null;

        const affinity = affinities[i];
        const declaredType = declaredTypes[i];

        if (parseBigInt && (affinity === ColumnAffinity.COLUMN_AFFINITY_INTEGER || affinity === 'COLUMN_AFFINITY_INTEGER')) {
            if (typeof val === 'string') {
                try {
                    return BigInt(val);
                } catch {
                    return val;
                }
            }
            return val;
        }

        if (parseBigInt && (declaredType === DeclaredType.DECLARED_TYPE_BIGINT || declaredType === 'DECLARED_TYPE_BIGINT')) {
            if (typeof val === 'string') {
                try {
                    return BigInt(val);
                } catch {
                    return val;
                }
            }
        }

        if (parseJson && (declaredType === DeclaredType.DECLARED_TYPE_JSON || declaredType === 'DECLARED_TYPE_JSON')) {
            if (typeof val === 'string') {
                try {
                    return JSON.parse(val);
                } catch {
                    return val; // Fallback: return raw string if invalid JSON
                }
            }
        }

        if (parseBlob && (affinity === ColumnAffinity.COLUMN_AFFINITY_BLOB || affinity === 'COLUMN_AFFINITY_BLOB')) {
            if (typeof val === 'string') {
                return Buffer.from(val, 'base64');
            }
            return val;
        }

        if (declaredType === DeclaredType.DECLARED_TYPE_DATE || declaredType === 'DECLARED_TYPE_DATE' ||
            declaredType === DeclaredType.DECLARED_TYPE_DATETIME || declaredType === 'DECLARED_TYPE_DATETIME') {
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
function toObject(columns, row, declaredTypes = [], typeParsers = {}) {
    const obj = {};
    const parseBigInt = typeParsers.bigint !== false;
    const parseJson = typeParsers.json !== false;

    for (let i = 0; i < columns.length; i++) {
        let val = row[i];
        if (parseBigInt && declaredTypes && declaredTypes[i] === DeclaredType.DECLARED_TYPE_BIGINT) {
            if (typeof val === 'string') {
                try { val = BigInt(val); } catch (e) { console.warn('BigInt parse failed:', e); }
            }
        }
        if (parseJson && declaredTypes && declaredTypes[i] === DeclaredType.DECLARED_TYPE_JSON) {
            if (typeof val === 'string') {
                try { val = JSON.parse(val); } catch (e) { console.warn('JSON parse failed:', e); }
            }
        }
        obj[columns[i]] = val;
    }
    return obj;
}

/**
 * Normalizes column affinities to integers (enum values).
 * @param {Array<string|number>} types
 * @returns {Array<number>}
 */
function normalizeColumnAffinities(types) {
    if (!types) return [];
    return types.map(t => {
        if (typeof t === 'number') return t;
        // Check if t is a valid key in ColumnAffinity
        if (Object.prototype.hasOwnProperty.call(ColumnAffinity, t)) {
            return ColumnAffinity[t];
        }
        return ColumnAffinity.COLUMN_AFFINITY_UNSPECIFIED;
    });
}

/**
 * Normalizes declared types to integers (enum values).
 * @param {Array<string|number>} types
 * @returns {Array<number>}
 */
function normalizeDeclaredTypes(types) {
    if (!types) return [];
    return types.map(t => {
        if (typeof t === 'number') return t;
        // Check if t is a valid key in DeclaredType
        if (Object.prototype.hasOwnProperty.call(DeclaredType, t)) {
            return DeclaredType[t];
        }
        return DeclaredType.DECLARED_TYPE_UNSPECIFIED;
    });
}

module.exports = {
    toParams,
    hydrateRow,
    resolveArgs,
    toObject,
    normalizeColumnAffinities,
    normalizeDeclaredTypes,
};
