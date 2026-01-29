/**
 * @file lib/utils.js
 * @description Helper functions for parameter marshalling and argument resolution.
 */

const {
  Struct,
  ListValue,
} = require("google-protobuf/google/protobuf/struct_pb");
const grpc = require("@grpc/grpc-js");
const db_service_pb = require("../protos/db/v1/db_service_pb");

/**
 * Generates gRPC Metadata for authentication.
 *
 * @param {object} [authConfig] - Auth configuration.
 * @param {string} [authConfig.type] - 'basic' or 'bearer'.
 * @param {string} [authConfig.username] - For basic auth.
 * @param {string} [authConfig.password] - For basic auth.
 * @param {string} [authConfig.token] - For bearer auth.
 * @returns {import('@grpc/grpc-js').Metadata}
 */
function getAuthMetadata(authConfig) {
  const metadata = new grpc.Metadata();
  if (!authConfig) return metadata;

  if (authConfig.type === 'basic') {
    if (authConfig.username && authConfig.password) {
      const creds = `${authConfig.username}:${authConfig.password}`;
      const base64Creds = Buffer.from(creds).toString('base64');
      metadata.add('Authorization', `Basic ${base64Creds}`);
    }
  } else if (authConfig.type === 'bearer') {
    if (authConfig.token) {
      metadata.add('Authorization', `Bearer ${authConfig.token}`);
    }
  }
  return metadata;
}

/**
 * Converts JS data into the static Protobuf Parameters message.
 * Supports the non-oneof structure where both fields can be populated.
 *
 * @param {Array<any>} [positional] - Positional parameters (e.g. [1, "two"]).
 * @param {Object.<string, any>} [named] - Named parameters (e.g. { id: 1 }).
 * @param {{positional?: Object.<number, number>, named?: Object.<string, number>}} [hints] - Type hints.
 * @returns {db_service_pb.Parameters} The Protobuf message.
 */
function toProtoParams(
  positional = [],
  named = {},
  hints = { positional: {}, named: {} },
) {
  const protoParams = new db_service_pb.Parameters();

  // console.log({ positional, named, hints });

  // 1. Handle Positional
  if (Array.isArray(positional) && positional.length > 0) {
    protoParams.setPositional(ListValue.fromJavaScript(positional));

    const pHintsMap = protoParams.getPositionalHintsMap();
    const posHints = hints.positional || {};

    for (const [idx, type] of Object.entries(posHints)) {
      const key = parseInt(idx, 10);
      const val = Number(type);

      // Validation: Ensure we aren't setting NaN
      if (!isNaN(key) && !isNaN(val)) {
        pHintsMap.set(key, val);
      }
    }
  }

  // 2. Handle Named
  if (named && Object.keys(named).length > 0) {
    protoParams.setNamed(Struct.fromJavaScript(named));

    const nHintsMap = protoParams.getNamedHintsMap();
    const namedHints = hints.named || {};

    for (const [key, type] of Object.entries(namedHints)) {
      const val = Number(type);
      if (!isNaN(val)) {
        nHintsMap.set(key, val);
      }
    }
  }

  return protoParams;
}

/**
 * Converts a Protobuf ListValue (a row) into a native JavaScript Array.
 *
 * This function performs "Type Promotion" by using the server-provided metadata
 * (columnTypes) to restore types lost during Protobuf/JSON serialization.
 *
 * @param {import('../protos/db/v1/db_service_pb').ListValue} listValue - The row data.
 * @param {import('../protos/db/v1/db_service_pb').ListValue} listValue - The row data.
 * @param {number[]} affinities - Storage class affinities.
 * @param {number[]} declaredTypes - Semantic declared types.
 * @param {string} [dateHandling='date'] - 'date' | 'string' | 'number'
 * @returns {any[]} A standard JS array containing hydrated types (Number, BigInt, Buffer, etc).
 */
/**
 * Converts a Protobuf ListValue (a row) into a native JavaScript Array.
 *
 * This function performs "Type Promotion" by using the server-provided metadata
 * (columnTypes) to restore types lost during Protobuf/JSON serialization.
 *
 * @param {import('../protos/db/v1/db_service_pb').ListValue} listValue - The row data.
 * @param {number[]} affinities - Storage class affinities.
 * @param {number[]} declaredTypes - Semantic declared types.
 * @param {object} [typeParsers={}] - { bigint, json, blob, date }
 * @returns {any[]} A standard JS array containing hydrated types (Number, BigInt, Buffer, etc).
 */
function fromProtoList(listValue, affinities = [], declaredTypes = [], typeParsers = {}) {
  if (!listValue) return [];

  // Default parsers (safeguard if {} passed)
  const parseBigInt = typeParsers.bigint !== false;
  const parseJson = typeParsers.json !== false;
  const parseBlob = typeParsers.blob !== false;
  const dateHandling = typeParsers.date || 'date';

  // Get the array of Value objects from the ListValue wrapper
  const values = listValue.getValuesList();

  return values.map((v, i) => {
    // Determine what kind of data is in this Protobuf Value (String, Number, Bool, etc.)
    const kind = v.getKindCase();
    const ValueCase = v.constructor.KindCase;

    // Map the metadata for this specific column
    const affinity = affinities[i];
    const declaredType = declaredTypes[i];

    switch (kind) {
      case ValueCase.NULL_VALUE:
        return null;

      case ValueCase.NUMBER_VALUE:
        // standard JS Number (float64)
        return v.getNumberValue();

      case ValueCase.BOOL_VALUE:
        return v.getBoolValue();

      case ValueCase.STRING_VALUE: {
        const str = v.getStringValue();

        /**
         * LOGIC: BIGINT HYDRATION
         * If the server metadata identifies this column as an INTEGER, but it
         * arrived as a STRING, it means the value exceeds the 53-bit safe
         * integer limit of float64 (2^53 - 1).
         * We promote it to a native JS BigInt.
         */
        if (parseBigInt && affinity === db_service_pb.ColumnAffinity.COLUMN_AFFINITY_INTEGER) {
          try {
            // BigInt parsing is native in Node.js 10.4+
            return BigInt(str);
          } catch {
            // Fallback to string if for some reason it's not a valid integer
            return str;
          }
        }

        // Explicitly check DeclaredType for BigInt (if affinity mismatch or explicit request)
        if (parseBigInt && declaredType === db_service_pb.DeclaredType.DECLARED_TYPE_BIGINT) {
          try {
            return BigInt(str);
          } catch {
            return str;
          }
        }

        // Explicitly check DeclaredType for JSON
        if (parseJson && declaredType === db_service_pb.DeclaredType.DECLARED_TYPE_JSON) {
          try {
            return JSON.parse(str);
          } catch {
            return str;
          }
        }

        /**
         * LOGIC: BLOB HYDRATION
         * Protobuf's 'Value' type does not support raw bytes. The server
         * encodes BLOBs as Base64 strings. If metadata indicates a BLOB,
         * we decode it back into a Node.js Buffer.
         */
        if (parseBlob && affinity === db_service_pb.ColumnAffinity.COLUMN_AFFINITY_BLOB) {
          // console.log(str);
          return Buffer.from(str, "base64");
        }

        /**
         * LOGIC: DATE HYDRATION
         * Hydrate based on user preference.
         */
        if (declaredType === db_service_pb.DeclaredType.DECLARED_TYPE_DATE || declaredType === db_service_pb.DeclaredType.DECLARED_TYPE_DATETIME) {
          if (dateHandling === 'string') {
            return str;
          }
          const date = new Date(str);
          const timestamp = isNaN(date.getTime()) ? null : date.getTime();

          if (timestamp === null) return str; // Invalid date string fallback

          if (dateHandling === 'number') {
            return timestamp;
          }
          // Default to Date object
          return date;
        }

        // Default: Just a standard text string
        return str;
      }

      case ValueCase.STRUCT_VALUE:
        // Recursively convert nested JSON-like structures
        return v.getStructValue().toJavaScript();

      case ValueCase.LIST_VALUE:
        // Recursively convert nested arrays
        return v.getListValue().toJavaScript();

      default:
        // Handle unexpected types gracefully
        return undefined;
    }
  });
}

/**
 * Combines column names and a row array into a Key-Value object.
 * @param {string[]} columns - Array of column names.
 * @param {any[]} row - Array of row values.
 * @param {number[]} declaredTypes - Semantic declared types.
 * @param {object} [typeParsers={}] - { bigint: boolean, json: boolean, blob: boolean }
 * @returns {object} mapped object { col1: val1, col2: val2 }
 */
function toObject(columns, row, declaredTypes = [], typeParsers = {}) {
  const obj = {};
  const parseBigInt = typeParsers.bigint !== false;
  const parseJson = typeParsers.json !== false;

  for (let i = 0; i < columns.length; i++) {
    let val = row[i];
    // Optional: secondary check if toObject is used on raw data
    if (parseBigInt && declaredTypes && declaredTypes[i] === db_service_pb.DeclaredType.DECLARED_TYPE_BIGINT) {
      if (typeof val === 'string') {
        try { val = BigInt(val); } catch (e) { console.warn('BigInt parse failed:', e); }
      }
    }
    if (parseJson && declaredTypes && declaredTypes[i] === db_service_pb.DeclaredType.DECLARED_TYPE_JSON) {
      if (typeof val === 'string') {
        try { val = JSON.parse(val); } catch (e) { console.warn('JSON parse failed:', e); }
      }
    }
    obj[columns[i]] = val;
  }
  return obj;
}

/**
 * Resolves overloaded arguments for query methods.
 *
 * Supports:
 * 1. Standard: query(sql, [1, 2], { positional: { 0: 5 } })
 * 2. Named:    query(sql, { id: 1 }, { named: { id: 5 } })
 * 3. Mixed:    query(sql, { positional: [1], named: { id: 2 } }, hints)
 * 4. Template: query(SQL`SELECT... ${val}`, { positional: { 0: 5 } })
 *
 * @param {string|object} sqlOrObj - SQL string or SQLStatement object.
 * @param {Array|object} [paramsOrHints] - Parameters OR hints (if template).
 * @param {object} [hintsOrNull] - Hints (if standard usage).
 * @returns {{
 *   sql: string,
 *   positional: Array<any>,
 *   named: Object.<string, any>,
 *   hints: { positional: Object.<number, number>, named: Object.<string, number> }
 * }}
 */
function resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull) {
  let sql = "";
  let positional = [];
  let named = {};
  let rawHints = {};

  // --- Case 1: SQL is a standard string ---
  if (typeof sqlOrObj === "string") {
    sql = sqlOrObj;
    const p = paramsOrHints;

    if (p) {
      if (Array.isArray(p)) {
        throw new Error("Direct array parameters are not supported. Use { positional: [...] } instead.");
      }
      if (typeof p === "object") {
        if (Object.keys(p).length === 0) {
          // Empty parameters
        } else if (Object.prototype.hasOwnProperty.call(p, "positional") || Object.prototype.hasOwnProperty.call(p, "named")) {
          positional = p.positional || [];
          named = p.named || {};
        } else {
          throw new Error("Direct named parameters are not supported. Use { named: { ... } } instead.");
        }
        rawHints = hintsOrNull || {};
      }
    }
  }

  // --- Case 2: SQL is a SQLStatement Object (sql-template-strings) ---
  else if (sqlOrObj && typeof sqlOrObj === "object" && sqlOrObj.text) {
    sql = sqlOrObj.text;
    // Template strings always populate the positional 'values' array
    positional = Array.isArray(sqlOrObj.values) ? sqlOrObj.values : [];
    // In template mode, the second argument is the hints object
    rawHints = paramsOrHints || {};
  } else {
    throw new Error(
      "Invalid SQL argument format. Expected string or SQLStatement object.",
    );
  }

  // --- HINT NORMALIZATION ---
  // This ensures toProtoParams always receives { positional: {}, named: {} }
  const normalizedHints = {
    positional: {},
    named: {},
  };

  if (rawHints.positional || rawHints.named) {
    // Already structured correctly
    normalizedHints.positional = rawHints.positional || {};
    normalizedHints.named = rawHints.named || {};
  } else if (Object.keys(rawHints).length > 0) {
    /**
     * AMBIGUITY HANDLING:
     * If the user passed a flat object like { 0: 5 }, we infer where it belongs.
     */
    if (positional.length > 0 && Object.keys(named).length === 0) {
      // If we only have positional params, the flat hints belong to positional
      normalizedHints.positional = rawHints;
    } else if (Object.keys(named).length > 0 && positional.length === 0) {
      // If we only have named params, the flat hints belong to named
      normalizedHints.named = rawHints;
    } else {
      // In mixed mode, we cannot guess; user MUST use { positional: {}, named: {} }
      // We'll leave them empty to avoid mis-binding
    }
  }

  return {
    sql,
    positional,
    named,
    hints: normalizedHints,
  };
}

/**
 * Creates an async generator that yields single rows from a batch iterator.
 *
 * @param {AsyncIterable<any[]>} batchIterator - Yields lists of Proto-Values.
 * @param {number[]} columnAffinities - Enum values for hydration.
 * @param {number[]} columnDeclaredTypes - Enum values for hydration.
 * @param {object} [typeParsers={}] - Type parser config.
 */
async function* createRowIterator(batchIterator, columnAffinities, columnDeclaredTypes, typeParsers = {}) {
  for await (const batch of batchIterator) {
    if (batch && batch.length > 0) {
      // Destructively consume the batch array to free memory as we go
      while (batch.length > 0) {
        const row = batch.shift();
        yield fromProtoList(row, columnAffinities, columnDeclaredTypes, typeParsers);
      }
    }
  }
}

/**
 * Creates an async generator that yields custom-sized batches from a source batch iterator.
 * Buffer/Re-batch logic.
 *
 * @param {AsyncIterable<any[]>} batchIterator - Source iterator yielding raw proto batches.
 * @param {number[]} columnAffinities
 * @param {number[]} columnDeclaredTypes
 * @param {number} batchSize
 * @param {object} [typeParsers={}]
 */
async function* createBatchIterator(batchIterator, columnAffinities, columnDeclaredTypes, batchSize, typeParsers = {}) {
  let buffer = [];
  for await (const batch of batchIterator) {
    if (batch && batch.length > 0) {
      const mapped = batch.map(r => fromProtoList(r, columnAffinities, columnDeclaredTypes, typeParsers));
      buffer.push(...mapped);

      while (buffer.length >= batchSize) {
        // Destructively slice off the head
        yield buffer.splice(0, batchSize);
      }
    }
  }
  if (buffer.length > 0) yield buffer;
}

/**
 * Maps a Protobuf QueryResult to a standardized JS object.
 *
 * @param {import('../protos/db/v1/db_service_pb').QueryResult} result - The result proto.
 * @param {object} [typeParsers={}] - Type parser config.
 * @param {import('../protos/db/v1/db_service_pb').ExecutionStats} [statsPb] - Optional stats.
 * @returns {{
 *   type: 'SELECT'|'DML'|'UNKNOWN',
 *   rowsAffected?: number,
 *   lastInsertId?: number,
 *   columns?: string[],
 *   columnAffinities?: number[],
 *   columnDeclaredTypes?: number[],
 *   columnRawTypes?: string[],
 *   rows?: any[],
 *   stats?: { duration_ms: number, rows_read: number, rows_written: number }
 * }} Standardized result object.
 */
function mapQueryResult(result, typeParsers = {}, statsPb = null) {
  const resultType = result.getResultCase();
  const stats = statsPb
    ? {
      duration_ms: statsPb.getDurationMs(),
      rows_read: statsPb.getRowsRead(),
      rows_written: statsPb.getRowsWritten(),
    }
    : result.hasStats()
      ? {
        duration_ms: result.getStats().getDurationMs(),
        rows_read: result.getStats().getRowsRead(),
        rows_written: result.getStats().getRowsWritten(),
      }
      : null;

  if (resultType === db_service_pb.QueryResult.ResultCase.SELECT) {
    const select = result.getSelect();
    const columnAffinities = select.getColumnAffinitiesList();
    const columnDeclaredTypes = select.getColumnDeclaredTypesList();
    const columnRawTypes = select.getColumnRawTypesList();

    return {
      type: "SELECT",
      columns: select.getColumnsList(),
      columnAffinities,
      columnDeclaredTypes,
      columnRawTypes,
      rows: select.getRowsList().map((r) => fromProtoList(r, columnAffinities, columnDeclaredTypes, typeParsers)),
      stats,
    };
  } else {
    // DML
    if (resultType === db_service_pb.QueryResult.ResultCase.DML) {
      const dml = result.getDml();
      return {
        type: "DML",
        rowsAffected: Number(dml.getRowsAffected()),
        lastInsertId: Number(dml.getLastInsertId()),
        stats,
      };
    }

    // Fallback/Empty
    return {
      type: "UNKNOWN",
      stats,
    };
  }
}

module.exports = {
  toProtoParams,
  fromProtoList,
  toObject,
  resolveArgs,
  createRowIterator,
  createBatchIterator,
  mapQueryResult,
  getAuthMetadata,
};
