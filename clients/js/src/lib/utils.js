/**
 * @file lib/utils.js
 * @description Helper functions for parameter marshalling and argument resolution.
 */

const {
  Struct,
  ListValue,
  Value,
} = require("google-protobuf/google/protobuf/struct_pb");
const db_service_pb = require("../protos/db/v1/db_service_pb");

/**
 * Converts JS data into the static Protobuf Parameters message.
 * Supports the non-oneof structure where both fields can be populated.
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
 * @param {number[]} columnTypes - An array of ColumnType enum values for this row.
 * @returns {any[]} A standard JS array containing hydrated types (Number, BigInt, Buffer, etc).
 */
function fromProtoList(listValue, columnTypes = []) {
  if (!listValue) return [];

  // Get the array of Value objects from the ListValue wrapper
  const values = listValue.getValuesList();

  return values.map((v, i) => {
    // Determine what kind of data is in this Protobuf Value (String, Number, Bool, etc.)
    const kind = v.getKindCase();
    const ValueCase = v.constructor.KindCase;

    // Map the metadata for this specific column
    const colType = columnTypes[i];

    switch (kind) {
      case ValueCase.NULL_VALUE:
        return null;

      case ValueCase.NUMBER_VALUE:
        // standard JS Number (float64)
        return v.getNumberValue();

      case ValueCase.BOOL_VALUE:
        return v.getBoolValue();

      case ValueCase.STRING_VALUE:
        const str = v.getStringValue();

        /**
         * LOGIC: BIGINT HYDRATION
         * If the server metadata identifies this column as an INTEGER, but it
         * arrived as a STRING, it means the value exceeds the 53-bit safe
         * integer limit of float64 (2^53 - 1).
         * We promote it to a native JS BigInt.
         */
        if (colType === db_service_pb.ColumnType.COLUMN_TYPE_INTEGER) {
          try {
            // BigInt parsing is native in Node.js 10.4+
            return BigInt(str);
          } catch (e) {
            // Fallback to string if for some reason it's not a valid integer
            return str;
          }
        }

        /**
         * LOGIC: BLOB HYDRATION
         * Protobuf's 'Value' type does not support raw bytes. The server
         * encodes BLOBs as Base64 strings. If metadata indicates a BLOB,
         * we decode it back into a Node.js Buffer.
         */
        if (colType === db_service_pb.ColumnType.COLUMN_TYPE_BLOB) {
          // console.log(str);
          return Buffer.from(str, "base64");
        }

        /**
         * LOGIC: DATE HYDRATION (Optional)
         * If your server sends ISO8601 strings for DATE types,
         * you can hydrate them to Date objects here.
         */
        if (colType === db_service_pb.ColumnType.COLUMN_TYPE_DATE) {
          const date = new Date(str);
          return isNaN(date.getTime()) ? str : date;
        }

        // Default: Just a standard text string
        return str;

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
 * @returns {object} mapped object { col1: val1, col2: val2 }
 */
function toObject(columns, row) {
  const obj = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = row[i];
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
 *   positional: any[],
 *   named: object,
 *   hints: { positional: object, named: object }
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

    if (Array.isArray(p)) {
      // Standard positional usage: query(sql, [1, 2])
      positional = p;
      rawHints = hintsOrNull || {};
    } else if (p && typeof p === "object") {
      // Check for explicit mixed structure: query(sql, { positional: [], named: {} })
      if (p.hasOwnProperty("positional") || p.hasOwnProperty("named")) {
        positional = p.positional || [];
        named = p.named || {};
      } else {
        // Standard named usage: query(sql, { id: 1 })
        named = p;
      }
      rawHints = hintsOrNull || {};
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
  toProtoParams,
  fromProtoList,
  toObject,
  resolveArgs,
};
