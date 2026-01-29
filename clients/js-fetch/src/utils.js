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

    const posHints = hints.positional || {};
    const namedHints = hints.named || {};

    if (Array.isArray(positional) && positional.length > 0) {
        params.positionalHints = {};
        for (const [k, v] of Object.entries(posHints)) {
            params.positionalHints[k] = v;
        }

        params.positional = positional.map((val, i) => {
            if (val === null || val === undefined) return null;

            if (typeof val === 'bigint') {
                if (!params.positionalHints[i]) {
                    params.positionalHints[i] = ColumnAffinity.COLUMN_AFFINITY_INTEGER;
                }
                return val.toString();
            }

            if (Buffer.isBuffer(val)) {
                if (!params.positionalHints[i]) {
                    params.positionalHints[i] = ColumnAffinity.COLUMN_AFFINITY_BLOB;
                }
                return val.toString('base64');
            }
            if (val instanceof Uint8Array) {
                if (!params.positionalHints[i]) {
                    params.positionalHints[i] = ColumnAffinity.COLUMN_AFFINITY_BLOB;
                }
                return Buffer.from(val).toString('base64');
            }
            return encodeValue(val, posHints[i]);
        });
    }

    if (named && Object.keys(named).length > 0) {
        params.namedHints = {};
        for (const [k, v] of Object.entries(namedHints)) {
            params.namedHints[k] = v;
        }

        params.named = {};
        for (const [k, val] of Object.entries(named)) {
            if (val === null || val === undefined) {
                params.named[k] = null;
                continue;
            }

            if (typeof val === 'bigint') {
                if (!params.namedHints[k]) {
                    params.namedHints[k] = ColumnAffinity.COLUMN_AFFINITY_INTEGER;
                }
                params.named[k] = val.toString();
                continue;
            }

            if (Buffer.isBuffer(val)) {
                if (!params.namedHints[k]) {
                    params.namedHints[k] = ColumnAffinity.COLUMN_AFFINITY_BLOB;
                }
                params.named[k] = val.toString('base64');
                continue;
            }
            if (val instanceof Uint8Array) {
                if (!params.namedHints[k]) {
                    params.namedHints[k] = ColumnAffinity.COLUMN_AFFINITY_BLOB;
                }
                params.named[k] = Buffer.from(val).toString('base64');
                continue;
            }
            params.named[k] = encodeValue(val, namedHints[k]);
        }
    }

    return params;
}

/**
 * Helper to encode values for JSON transport.
 * - Buffers -> base64 string
 * - String + BLOB hint -> base64 string
 */
function encodeValue(val, hint) {
    if (val === null || val === undefined) return null;

    if (typeof val === 'bigint') return val.toString();
    if (val instanceof Date) return val.toISOString();

    // 1. Buffer / Uint8Array -> Base64
    if (Buffer.isBuffer(val)) {
        return val.toString('base64');
    }
    if (val instanceof Uint8Array) {
        return Buffer.from(val).toString('base64');
    }

    // 2. String + BLOB hint -> Base64
    // If the user says it's a BLOB, but passes a string, we assume they passed raw bytes
    // as a string and we must encode it so the server (which expects base64 for blobs)
    // receives the correct data.
    if (typeof val === 'string') {
        if (hint === ColumnAffinity.COLUMN_AFFINITY_BLOB || hint === 'COLUMN_AFFINITY_BLOB') {
            return Buffer.from(val).toString('base64');
        }
    }

    return val;
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
