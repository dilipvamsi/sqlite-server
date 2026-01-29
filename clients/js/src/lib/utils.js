/**
 * @file lib/utils.js
 * @description Helper functions for parameter marshalling and argument resolution.
 */


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
 * @returns {db_service_pb.SqlValue} The SqlValue proto message.
 */
function jsToSqlValue(val) {
  const sv = new db_service_pb.SqlValue();

  if (val === null || val === undefined) {
    sv.setNullValue(true);
  } else if (typeof val === 'bigint') {
    // BigInt -> integer_value (pass as string to preserve precision for int64)
    sv.setIntegerValue(val.toString());
  } else if (typeof val === 'number') {
    if (Number.isInteger(val) && Number.isSafeInteger(val)) {
      sv.setIntegerValue(val);
    } else {
      sv.setRealValue(val);
    }
  } else if (typeof val === 'string') {
    sv.setTextValue(val);
  } else if (Buffer.isBuffer(val)) {
    // Send raw bytes directly
    sv.setBlobValue(val);
  } else if (val instanceof Uint8Array) {
    sv.setBlobValue(val);
  } else if (typeof val === 'boolean') {
    sv.setIntegerValue(val ? 1 : 0);
  } else if (val instanceof Date) {
    sv.setTextValue(val.toISOString());
  } else if (typeof val === 'object') {
    // JSON objects -> text
    sv.setTextValue(JSON.stringify(val));
  } else {
    // Fallback: convert to string
    sv.setTextValue(String(val));
  }

  return sv;
}

/**
 * Converts JavaScript parameters to TypedParameters proto message.
 *
 * @param {Array<any>} [positional=[]] - Positional parameters.
 * @param {Object.<string, any>} [named={}] - Named parameters.
 * @returns {db_service_pb.TypedParameters} The TypedParameters proto message.
 */
function toTypedProtoParams(positional = [], named = {}) {
  const params = new db_service_pb.TypedParameters();

  // Convert positional parameters
  if (Array.isArray(positional) && positional.length > 0) {
    for (const val of positional) {
      params.addPositional(jsToSqlValue(val));
    }
  }

  // Convert named parameters
  if (named && Object.keys(named).length > 0) {
    const namedMap = params.getNamedMap();
    for (const [key, val] of Object.entries(named)) {
      namedMap.set(key, jsToSqlValue(val));
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
  const ValueCase = db_service_pb.SqlValue.ValueCase;
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
      // Check if we should promote to BigInt based on declared type
      if (declaredType === db_service_pb.DeclaredType.DECLARED_TYPE_BIGINT) {
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

      // JSON hydration
      if (parseJson && declaredType === db_service_pb.DeclaredType.DECLARED_TYPE_JSON) {
        try {
          return JSON.parse(str);
        } catch {
          return str;
        }
      }

      // Date hydration
      if (declaredType === db_service_pb.DeclaredType.DECLARED_TYPE_DATE ||
        declaredType === db_service_pb.DeclaredType.DECLARED_TYPE_DATETIME) {
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
  const resultType = result.getResultCase();
  const statsPb = result.hasStats() ? result.getStats() : null;
  const stats = statsPb
    ? {
      duration_ms: statsPb.getDurationMs(),
      rows_read: statsPb.getRowsRead(),
      rows_written: statsPb.getRowsWritten(),
    }
    : null;

  if (resultType === db_service_pb.TypedQueryResult.ResultCase.SELECT) {
    const select = result.getSelect();
    const columnDeclaredTypes = select.getColumnDeclaredTypesList();
    const columnAffinities = select.getColumnAffinitiesList();
    const columnRawTypes = select.getColumnRawTypesList();

    return {
      type: "SELECT",
      columns: select.getColumnsList(),
      columnAffinities,
      columnDeclaredTypes,
      columnRawTypes,
      rows: select.getRowsList().map((r) => fromTypedProtoRow(r, columnDeclaredTypes, typeParsers)),
      stats,
    };
  } else if (resultType === db_service_pb.TypedQueryResult.ResultCase.DML) {
    const dml = result.getDml();
    return {
      type: "DML",
      rowsAffected: Number(dml.getRowsAffected()),
      lastInsertId: Number(dml.getLastInsertId()),
      stats,
    };
  }

  return {
    type: "UNKNOWN",
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
