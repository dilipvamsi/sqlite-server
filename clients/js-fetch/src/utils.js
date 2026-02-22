/**
 * @file src/utils.js
 * @description Helper functions for parameter marshalling and result hydration.
 */
const { ColumnAffinity, DeclaredType } = require('./constants');

function toParams(positional = [], named = {}, hints = {}) {
    const params = {};
    const flatHints = {};

    // Truly normalize hints structure
    const rawPosHints = hints.positional || (hints.named ? {} : hints) || {};
    const rawNamedHints = hints.named || {};

    if (Array.isArray(positional) && positional.length > 0) {
        params.positional = positional.map((val, i) => {
            const hintKey = i.toString();
            // Auto-hint for non-strings
            let hint = rawPosHints[hintKey];
            if (hint === undefined) {
                if (typeof val === 'bigint') {
                    hint = ColumnAffinity.COLUMN_AFFINITY_INTEGER;
                } else if (Buffer.isBuffer(val) || val instanceof Uint8Array) {
                    hint = ColumnAffinity.COLUMN_AFFINITY_BLOB;
                }
            }
            if (hint !== undefined) flatHints[hintKey] = hint;

            // Handle string-to-blob-base64 if hint is BLOB
            if (hint === ColumnAffinity.COLUMN_AFFINITY_BLOB || hint === 'COLUMN_AFFINITY_BLOB') {
                if (typeof val === 'string') {
                    return Buffer.from(val).toString('base64');
                }
            }
            return encodeUntypedValue(val);
        });
    }

    if (named && Object.keys(named).length > 0) {
        params.named = {};
        for (const [k, val] of Object.entries(named)) {
            let hint = rawNamedHints[k];
            if (hint === undefined) {
                if (typeof val === 'bigint') {
                    hint = ColumnAffinity.COLUMN_AFFINITY_INTEGER;
                } else if (Buffer.isBuffer(val) || val instanceof Uint8Array) {
                    hint = ColumnAffinity.COLUMN_AFFINITY_BLOB;
                }
            }
            if (hint !== undefined) flatHints[k] = hint;

            if (hint === ColumnAffinity.COLUMN_AFFINITY_BLOB || hint === 'COLUMN_AFFINITY_BLOB') {
                if (typeof val === 'string') {
                    params.named[k] = Buffer.from(val).toString('base64');
                    continue;
                }
            }
            params.named[k] = encodeUntypedValue(val);
        }
    }

    if (Object.keys(flatHints).length > 0) {
        params.hints = flatHints;
    }
    return params;
}

/**
 * Encodes a JS value into a basic JSON type compatible with google.protobuf.Value
 */
function encodeUntypedValue(val) {
    if (val === null || val === undefined) return null;

    if (typeof val === 'bigint') return val.toString();

    if (Buffer.isBuffer(val)) return Buffer.from(val).toString('base64');
    if (val instanceof Uint8Array) return Buffer.from(val).toString('base64');

    if (val instanceof Date) return val.toISOString();

    // JS primitives map naturally to google.protobuf.Value (string, number, boolean)
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

    const items = Array.isArray(row) ? row : (row.values || []);

    return items.map((val, i) => {
        if (val === null || val === undefined) return null;

        const affinity = affinities[i];
        const declaredType = declaredTypes[i];

        if (parseBigInt && (affinity === ColumnAffinity.COLUMN_AFFINITY_INTEGER || affinity === 'COLUMN_AFFINITY_INTEGER')) {
            if (typeof val === 'string' || typeof val === 'number') {
                try {
                    return BigInt(val);
                } catch {
                    return val;
                }
            }
            return val;
        }

        if (parseBigInt && (declaredType === DeclaredType.DECLARED_TYPE_BIGINT || declaredType === 'DECLARED_TYPE_BIGINT')) {
            if (typeof val === 'string' || typeof val === 'number') {
                try {
                    return BigInt(val);
                } catch {
                    return val;
                }
            }
        }

        if (parseJson && (declaredType === DeclaredType.DECLARED_TYPE_JSON || declaredType === 'DECLARED_TYPE_JSON')) {
            if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
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

    // Case 1: SQL Template Strings object (has .text and .values)
    if (sqlOrObj && typeof sqlOrObj === 'object' && sqlOrObj.text !== undefined && Array.isArray(sqlOrObj.values)) {
        sql = sqlOrObj.text;
        positional = sqlOrObj.values;
        rawHints = paramsOrHints || hintsOrNull || {};
    }
    // Case 2: Standard structured object { sql, positional, named, hints }
    else if (sqlOrObj && typeof sqlOrObj === 'object' && !Array.isArray(sqlOrObj) && sqlOrObj.sql) {
        sql = sqlOrObj.sql;
        positional = sqlOrObj.positional || [];
        named = sqlOrObj.named || {};
        rawHints = sqlOrObj.hints || hintsOrNull || {};
    }
    // Case 3: SQL string
    else if (typeof sqlOrObj === 'string') {
        sql = sqlOrObj;
        if (Array.isArray(paramsOrHints)) {
            positional = paramsOrHints;
            rawHints = hintsOrNull || {};
        } else if (paramsOrHints && typeof paramsOrHints === 'object') {
            positional = paramsOrHints.positional || [];
            named = paramsOrHints.named || {};
            if (!paramsOrHints.positional && !paramsOrHints.named && !paramsOrHints.hints) {
                // assume paramsOrHints IS the named params object
                named = paramsOrHints;
            }
            rawHints = hintsOrNull || paramsOrHints.hints || {};
        } else {
            rawHints = hintsOrNull || {};
        }
    } else {
        throw new Error("Invalid SQL argument: expected string or structured object.");
    }

    return { sql, positional, named, hints: rawHints };
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
