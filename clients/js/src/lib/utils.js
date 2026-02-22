/**
 * @file lib/utils.js
 * @description Helper functions for parameter marshalling and argument resolution.
 */


const grpc = require("@grpc/grpc-js");
const types_pb = require("../protos/sqlrpc/v1/types_pb");
const enums_pb = require("../protos/sqlrpc/v1/enums_pb");
const { ColumnAffinity } = require("./constants");


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
 * Converts a Protobuf ListValue (a row) into a native JavaScript Array.
 *
 * This function performs "Type Promotion" by using the server-provided metadata
 * (columnTypes) to restore types lost during Protobuf/JSON serialization.
 *
 * @param {import('../protos/sqlrpc/v1/types_pb').SqlRow} row - The row data.
 * @param {number[]} affinities - Storage class affinities.
 * @param {number[]} declaredTypes - Semantic declared types.
 * @param {string} [dateHandling='date'] - 'date' | 'string' | 'number'
 * @returns {any[]} A standard JS array containing hydrated types (Number, BigInt, Buffer, etc).
 */


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

  return {
    sql,
    positional,
    named,
    hints: rawHints,
  };
}



module.exports = {
  resolveArgs,
  getAuthMetadata,
  jsToSqlValue,
  toTypedProtoParams,
  sqlValueToJs,
  fromTypedProtoRow,
  createTypedRowIterator,
  createTypedBatchIterator,
  mapTypedQueryResult,
  mapExplainResponse,
};

// =============================================================================
// TYPED API UTILITIES
// =============================================================================

/**
 * Converts a JavaScript value to a SqlValue proto message.
 *
 * @param {any} val - The JavaScript value to convert.
 * @param {number} [hint] - Optional ColumnAffinity hint.
 * @returns {types_pb.SqlValue} The SqlValue proto message.
 */
function jsToSqlValue(val, hint) {
  const sv = new types_pb.SqlValue();

  if (val === null || val === undefined) {
    sv.setNullValue(true);
  } else if (typeof val === 'bigint') {
    sv.setIntegerValue(val.toString());
  } else if (typeof val === 'number') {
    // If we have a hint that forces REAL or if it's not a safe integer, use real_value
    if (hint === ColumnAffinity.COLUMN_AFFINITY_REAL || !(Number.isInteger(val) && Number.isSafeInteger(val))) {
      sv.setRealValue(val);
    } else {
      sv.setIntegerValue(val);
    }
  } else if (typeof val === 'string') {
    // Handle string-to-blob-base64 if hint is BLOB
    if (hint === ColumnAffinity.COLUMN_AFFINITY_BLOB) {
      sv.setBlobValue(Buffer.from(val, 'utf8'));
    } else {
      sv.setTextValue(val);
    }
  } else if (Buffer.isBuffer(val)) {
    sv.setBlobValue(val);
  } else if (val instanceof Uint8Array) {
    sv.setBlobValue(val);
  } else if (typeof val === 'boolean') {
    sv.setIntegerValue(val ? 1 : 0);
  } else if (val instanceof Date) {
    sv.setTextValue(val.toISOString());
  } else if (typeof val === 'object') {
    sv.setTextValue(JSON.stringify(val));
  } else {
    sv.setTextValue(String(val));
  }

  return sv;
}

/**
 * Converts JavaScript parameters to TypedParameters proto message.
 *
 * @param {Array<any>} [positional=[]] - Positional parameters.
 * @param {Object.<string, any>} [named={}] - Named parameters.
 * @param {object} [hints={}] - Optional hints.
 * @returns {types_pb.TypedParameters} The TypedParameters proto message.
 */
function toTypedProtoParams(positional = [], named = {}, hints = {}) {
  const params = new types_pb.TypedParameters();

  if (Array.isArray(positional) && positional.length > 0) {
    positional.forEach((val, i) => {
      // Unified hints: keys can be numbers (for positional) or strings (for named)
      let hint = hints[i];

      // Auto-hint for non-strings
      if (hint === undefined) {
        if (typeof val === 'bigint') {
          hint = ColumnAffinity.COLUMN_AFFINITY_INTEGER;
        } else if (Buffer.isBuffer(val) || val instanceof Uint8Array) {
          hint = ColumnAffinity.COLUMN_AFFINITY_BLOB;
        }
      }

      params.addPositional(jsToSqlValue(val, hint));
    });
  }

  if (named && Object.keys(named).length > 0) {
    const namedMap = params.getNamedMap();
    for (const [key, val] of Object.entries(named)) {
      let hint = hints[key];
      // Auto-hint for named
      if (hint === undefined) {
        if (typeof val === 'bigint') {
          hint = ColumnAffinity.COLUMN_AFFINITY_INTEGER;
        } else if (Buffer.isBuffer(val) || val instanceof Uint8Array) {
          hint = ColumnAffinity.COLUMN_AFFINITY_BLOB;
        }
      }
      namedMap.set(key, jsToSqlValue(val, hint));
    }
  }

  return params;
}

/**
 * Converts a SqlValue proto message to a JavaScript value.
 *
 * @param {db_service_pb.SqlValue} sv - The SqlValue proto message.
 * @param {number} [declaredType] - The declared type for type promotion.
 * @param {object} [typeParsers={}] - Type parser configuration.
 * @returns {any} The JavaScript value.
 */
function sqlValueToJs(sv, declaredType, typeParsers = {}) {
  const ValueCase = types_pb.SqlValue.ValueCase;
  const valueCase = sv.getValueCase();

  const parseBigInt = typeParsers.bigint !== false;
  const parseJson = typeParsers.json !== false;
  const parseBlob = typeParsers.blob !== false;
  const dateHandling = typeParsers.date || 'date';

  switch (valueCase) {
    case ValueCase.NULL_VALUE:
      return null;

    case ValueCase.INTEGER_VALUE: {
      const intVal = sv.getIntegerValue();
      if (declaredType === enums_pb.DeclaredType.DECLARED_TYPE_BIGINT) {
        if (parseBigInt) {
          return BigInt(intVal);
        } else {
          return String(intVal);
        }
      }
      return intVal;
    }

    case ValueCase.REAL_VALUE:
      return sv.getRealValue();

    case ValueCase.TEXT_VALUE: {
      const str = sv.getTextValue();

      if (parseJson && declaredType === enums_pb.DeclaredType.DECLARED_TYPE_JSON) {
        try {
          return JSON.parse(str);
        } catch {
          return str;
        }
      }

      if (declaredType === enums_pb.DeclaredType.DECLARED_TYPE_DATE ||
        declaredType === enums_pb.DeclaredType.DECLARED_TYPE_DATETIME) {
        if (dateHandling === 'string') {
          return str;
        }
        const date = new Date(str);
        const timestamp = isNaN(date.getTime()) ? null : date.getTime();
        if (timestamp === null) return str;
        if (dateHandling === 'number') return timestamp;
        return date;
      }

      return str;
    }

    case ValueCase.BLOB_VALUE: {
      const bytes = sv.getBlobValue_asU8();
      if (parseBlob) {
        return Buffer.from(bytes);
      } else {
        return Buffer.from(bytes).toString('base64');
      }
    }

    default:
      return null;
  }
}

/**
 * Converts a SqlRow proto message to a JavaScript array.
 *
 * @param {db_service_pb.SqlRow} sqlRow - The SqlRow proto message.
 * @param {number[]} [declaredTypes=[]] - Declared types for each column.
 * @param {object} [typeParsers={}] - Type parser configuration.
 * @returns {any[]} The JavaScript array of values.
 */
function fromTypedProtoRow(sqlRow, declaredTypes = [], typeParsers = {}) {
  if (!sqlRow) return [];

  const values = sqlRow.getValuesList();
  return values.map((sv, i) => sqlValueToJs(sv, declaredTypes[i], typeParsers));
}

/**
 * Creates an async generator that yields single rows from a typed batch iterator.
 *
 * @param {AsyncIterable<db_service_pb.SqlRow[]>} batchIterator - Yields lists of SqlRow.
 * @param {number[]} columnDeclaredTypes - Declared types for hydration.
 * @param {object} [typeParsers={}] - Type parser config.
 */
async function* createTypedRowIterator(batchIterator, columnDeclaredTypes, typeParsers = {}) {
  for await (const batch of batchIterator) {
    if (batch && batch.length > 0) {
      while (batch.length > 0) {
        const row = batch.shift();
        yield fromTypedProtoRow(row, columnDeclaredTypes, typeParsers);
      }
    }
  }
}

/**
 * Creates an async generator that yields custom-sized batches from a typed source iterator.
 *
 * @param {AsyncIterable<db_service_pb.SqlRow[]>} batchIterator - Source iterator yielding typed batches.
 * @param {number[]} columnDeclaredTypes
 * @param {number} batchSize
 * @param {object} [typeParsers={}]
 */
async function* createTypedBatchIterator(batchIterator, columnDeclaredTypes, batchSize, typeParsers = {}) {
  let buffer = [];
  for await (const batch of batchIterator) {
    if (batch && batch.length > 0) {
      const mapped = batch.map(r => fromTypedProtoRow(r, columnDeclaredTypes, typeParsers));
      buffer.push(...mapped);

      while (buffer.length >= batchSize) {
        yield buffer.splice(0, batchSize);
      }
    }
  }
  if (buffer.length > 0) yield buffer;
}

/**
 * Maps a TypedQueryResult proto to a standardized JS object.
 *
 * @param {db_service_pb.TypedQueryResult} result - The TypedQueryResult proto.
 * @param {object} [typeParsers={}] - Type parser config.
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
 * }}
 */
function mapTypedQueryResult(result, typeParsers = {}) {
  // sqlrpc/v1 TypedQueryResult is flat — columns/rows/stats are top-level.
  // SELECT results have columns + rows; DML results sent via typedQuery
  // come back with 0 columns (use exec() for DML instead).
  const columns = result.getColumnsList();
  const columnAffinities = result.getColumnAffinitiesList();
  const columnDeclaredTypes = result.getColumnDeclaredTypesList();
  const columnRawTypes = result.getColumnRawTypesList();
  const rows = result.getRowsList();

  const statsPb = result.hasStats() ? result.getStats() : null;
  const stats = statsPb
    ? {
      duration_ms: statsPb.getDurationMs(),
      rows_read: statsPb.getRowsRead(),
      rows_written: statsPb.getRowsWritten(),
    }
    : null;

  if (columns.length > 0) {
    return {
      type: "SELECT",
      columns,
      columnAffinities,
      columnDeclaredTypes,
      columnRawTypes,
      rows: rows.map((r) => fromTypedProtoRow(r, columnDeclaredTypes, typeParsers)),
      stats,
    };
  }

  // DML sent via typedQuery (legacy path — prefer exec() for writes)
  return {
    type: "DML",
    rowsAffected: typeParsers.bigint !== false ? BigInt(0) : 0,
    lastInsertId: typeParsers.bigint !== false ? BigInt(0) : 0,
    stats,
  };
}

/**
 * Maps an ExplainResponse proto to a standardized JS object.
 *
 * @param {db_service_pb.ExplainResponse} response - The ExplainResponse proto.
 * @returns {Array<{id: number, parentId: number, detail: string}>} List of plan nodes.
 */
function mapExplainResponse(response) {
  const nodes = response.getNodesList();
  return nodes.map((node) => ({
    id: node.getId(),
    parentId: node.getParentId(),
    detail: node.getDetail(),
  }));
}
