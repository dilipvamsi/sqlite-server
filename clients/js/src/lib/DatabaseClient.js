/**
 * @file lib/DatabaseClient.js
 */
const grpc = require("@grpc/grpc-js");
const TransactionHandle = require("./TransactionHandle");
const { TransactionMode } = require("./constants");
const { toProtoParams, fromProtoList, resolveArgs } = require("./utils");

// Import the generated static stubs
const db_service_pb = require("../protos/db/v1/db_service_pb");
const db_service_grpc_pb = require("../protos/db/v1/db_service_grpc_pb");

class DatabaseClient {
  /**
   * @param {string} address - gRPC Server Address (e.g. localhost:50051).
   * @param {string} databaseName - The database to bind this client to.
   * @param {object} [credentials] - grpc.credentials object (default: insecure).
   */
  constructor(
    address,
    databaseName,
    credentials = grpc.credentials.createInsecure(),
  ) {
    this.client = new db_service_grpc_pb.DatabaseServiceClient(
      address,
      credentials,
    );
    this.dbName = databaseName;
  }

  /**
   * Closes the gRPC client connection.
   */
  close() {
    this.client.close();
  }

  /**
   * Internal: Initiates a stateless QueryStream and peels off the first message (Header/DML).
   */
  async _initStream(sqlOrObj, paramsOrHints, hintsOrNull) {
    const { sql, positional, named, hints } = resolveArgs(
      sqlOrObj,
      paramsOrHints,
      hintsOrNull,
    );

    // Construct the Request using generated classes
    const req = new db_service_pb.QueryRequest();
    req.setDatabase(this.dbName);
    req.setSql(sql);

    // Note: your utils.js toProtoParams should now return a db_service_pb.Parameters object
    const protoParams = toProtoParams(positional, named, hints);
    req.setParameters(protoParams);

    const stream = this.client.queryStream(req);
    const iterator = stream[Symbol.asyncIterator]();

    const first = await iterator.next();
    if (first.done) {
      return { iterator, columns: [], columnTypes: [], isDml: false };
    }

    const msg = first.value;
    const responseType = msg.getResponseCase();

    if (responseType === db_service_pb.QueryResponse.ResponseCase.ERROR) {
      const errPb = msg.getError();
      const err = new Error(errPb.getMessage());
      err.code = errPb.getSqliteErrorCode();
      throw err;
    }

    if (responseType === db_service_pb.QueryResponse.ResponseCase.DML) {
      const dml = msg.getDml();
      return {
        iterator,
        columns: [],
        columnTypes: [],
        isDml: true,
        dmlStats: {
          rowsAffected: dml.getRowsAffected(),
          lastInsertId: dml.getLastInsertId(),
        },
      };
    }

    let columns = [];
    let columnTypes = [];
    if (responseType === db_service_pb.QueryResponse.ResponseCase.HEADER) {
      columns = msg.getHeader().getColumnsList();
      columnTypes = msg.getHeader().getColumnTypesList();
    }

    return { iterator, columns, columnTypes, isDml: false };
  }

  /**
   * Executes a stateless query and yields rows one by one.
   * @returns {Promise<{columns: string[], columnTypes: number[], rows: AsyncIterable<any[]>}>}
   */
  async iterate(sqlOrObj, paramsOrHints, hintsOrNull) {
    const { iterator, columns, columnTypes, isDml } = await this._initStream(
      sqlOrObj,
      paramsOrHints,
      hintsOrNull,
    );

    const rowGenerator = async function* () {
      if (isDml) return;

      let nextVal = await iterator.next();
      while (!nextVal.done) {
        const res = nextVal.value;
        const type = res.getResponseCase();

        if (type === db_service_pb.QueryResponse.ResponseCase.BATCH) {
          for (const protoRow of res.getBatch().getRowsList()) {
            yield fromProtoList(protoRow, columnTypes);
          }
        } else if (type === db_service_pb.QueryResponse.ResponseCase.ERROR) {
          throw new Error(res.getError().getMessage());
        }
        nextVal = await iterator.next();
      }
    };

    return { columns, rows: rowGenerator() };
  }

  /**
   * Executes a stateless query and yields batches of rows.
   * @param {number} [batchSize=500]
   * @returns {Promise<{columns: string[], columnTypes: number[], rows: AsyncIterable<any[][]>}>}
   */
  async queryStream(sqlOrObj, paramsOrHints, hintsOrNull, batchSize = 500) {
    let resolvedBatchSize = batchSize;
    let resolvedHints = hintsOrNull;
    if (
      sqlOrObj?.text &&
      arguments.length === 3 &&
      typeof hintsOrNull === "number"
    ) {
      resolvedBatchSize = hintsOrNull;
      resolvedHints = paramsOrHints;
    }

    const { iterator, columns, columnTypes, isDml } = await this._initStream(
      sqlOrObj,
      paramsOrHints,
      resolvedHints,
    );

    const batchGenerator = async function* () {
      if (isDml) return;

      let buffer = [];
      let nextVal = await iterator.next();

      while (!nextVal.done) {
        const res = nextVal.value;
        if (
          res.getResponseCase() ===
          db_service_pb.QueryResponse.ResponseCase.BATCH
        ) {
          const serverRows = res
            .getBatch()
            .getRowsList()
            .map((r) => fromProtoList(r, columnTypes));
          buffer.push(...serverRows);

          while (buffer.length >= resolvedBatchSize) {
            yield buffer.slice(0, resolvedBatchSize);
            buffer = buffer.slice(resolvedBatchSize);
          }
        } else if (
          res.getResponseCase() ===
          db_service_pb.QueryResponse.ResponseCase.ERROR
        ) {
          throw new Error(res.getError().getMessage());
        }
        nextVal = await iterator.next();
      }
      if (buffer.length > 0) yield buffer;
    };

    return { columns, rows: batchGenerator() };
  }

  /**
   * Executes a stateless query and buffers all results in memory.
   * Uses Unary RPC for efficiency.
   * @returns {Promise<{type: string, columns: string[], columnTypes: number[], rows: any[][], rowsAffected?: number, lastInsertId?: number}>}
   */
  async query(sqlOrObj, paramsOrHints, hintsOrNull) {
    const { sql, positional, named, hints } = resolveArgs(
      sqlOrObj,
      paramsOrHints,
      hintsOrNull,
    );

    // console.log({ sql, positional, named, hints });

    const req = new db_service_pb.QueryRequest();
    req.setDatabase(this.dbName);
    req.setSql(sql);
    req.setParameters(toProtoParams(positional, named, hints));

    return new Promise((resolve, reject) => {
      this.client.query(req, (err, response) => {
        if (err) return reject(err);

        const resultType = response.getResultCase();
        const statsPb = response.getStats();
        const stats = statsPb
          ? {
              durationMs: statsPb.getDurationMs(),
              rowsRead: statsPb.getRowsRead(),
              rowsWritten: statsPb.getRowsWritten(),
            }
          : null;

        if (resultType === db_service_pb.QueryResult.ResultCase.SELECT) {
          const select = response.getSelect();
          const columnTypes = select.getColumnTypesList();
          resolve({
            type: "SELECT",
            columns: select.getColumnsList(),
            columnTypes,
            rows: select
              .getRowsList()
              .map((r) => fromProtoList(r, columnTypes)),
            stats,
          });
        } else {
          const dml = response.getDml();
          resolve({
            type: "DML",
            columns: [],
            columnTypes: [],
            rows: [],
            rowsAffected: Number(dml.getRowsAffected()),
            lastInsertId: Number(dml.getLastInsertId()),
            stats,
          });
        }
      });
    });
  }

  /**
   * Opens a bidirectional transaction stream.
   * @param {number} [mode] - TransactionMode enum (Default: DEFERRED).
   * @returns {Promise<TransactionHandle>}
   */
  async beginTransaction(mode = TransactionMode.TRANSACTION_MODE_DEFERRED) {
    const tx = new TransactionHandle(this.client, this.dbName, mode);
    await tx.begin();
    return tx;
  }

  /**
   * Executes a function within a transaction.
   * Automatically commits if the function returns, and rolls back if it throws.
   *
   * @param {Function} fn - Async function (tx) => { ... }
   * @param {number} [mode] - TransactionMode enum.
   * @returns {Promise<any>} The result of the callback function.
   */
  async transaction(fn, mode = TransactionMode.TRANSACTION_MODE_DEFERRED) {
    const tx = await this.beginTransaction(mode);
    try {
      const result = await fn(tx);
      // Only commit if the user didn't manually close/finalize the tx
      if (!tx._state.isFinalized) {
        await tx.commit();
      }
      return result;
    } catch (err) {
      // If an error occurred inside the callback or during commit
      if (!tx._state.isFinalized) {
        try {
          await tx.rollback();
        } catch (rollbackErr) {
          // Ignore: stream might already be closed by the server due to the error
        }
      }
      throw err; // Re-throw original error
    }
  }
}

module.exports = DatabaseClient;
