/**
 * @file lib/TransactionHandle.js
 * @description Manages a stateful, bidirectional gRPC stream for SQLite transactions.
 */

const db_service_pb = require("../protos/db/v1/db_service_pb");
const { TransactionMode, SavepointAction } = require("./constants");
const {
  toProtoParams,
  resolveArgs,
  createRowIterator,
  createBatchIterator,
  mapQueryResult,
} = require("./utils");
const AsyncQueue = require("./AsyncQueue");

/**
 * FinalizationRegistry to catch "Leaked" transactions.
 * It holds a weak reference to the object and runs this callback if the object is GC'd.
 */
const cleanupRegistry = new FinalizationRegistry((heldValue) => {
  // CHANGE: Destructure 'state' instead of 'isFinalized'
  const { stream, databaseName, state } = heldValue;

  // CHANGE: Check state.isFinalized (access the mutable object property)
  if (
    state &&
    !state.isFinalized &&
    stream &&
    typeof stream.cancel === "function"
  ) {
    console.error(
      `[sqlite-server] CRITICAL: TransactionHandle for "${databaseName}" was garbage collected ` +
      `without calling commit() or rollback(). Forcing stream cancellation.`,
    );
    stream.cancel();
  }
});

/**
 * External helper to attach listeners WITHOUT capturing the 'this' context.
 * This is the secret to allowing GC to happen while the stream is open.
 */
function _attachStreamListeners(stream, state, weakHandle) {
  stream.on("data", (res) => {
    const handle = weakHandle.deref();
    if (handle) handle._onData(res);
  });

  stream.on("error", (err) => {
    state.isFinalized = true;
    const handle = weakHandle.deref();
    if (handle) handle._onError(err);
  });

  stream.on("end", () => {
    state.isFinalized = true;
    const handle = weakHandle.deref();
    if (handle) handle._onEnd();
  });
}

/**
 * @class TransactionHandle
 * @description
 * Represents an active transaction session over a single gRPC bidirectional stream.
 *
 * DESIGN PHILOSOPHY:
 * 1. SEQUENTIALITY: SQLite transactions are strictly sequential. This class uses a
 *    'pendingResolver' to ensure only one command is active on the stream at a time.
 * 2. HYBRID RESULTS: Supports both buffered results (for small DML/Queries) and
 *    streaming results (for large datasets) within the same transaction.
 * 3. AUTO-CLEANUP: Handles stream termination and errors by rejecting pending promises
 *    and closing active iterators.
 */
class TransactionHandle {
  /**
   * Creates a new TransactionHandle.
   * @param {object} client - The generated DatabaseServiceClient instance.
   * @param {string} databaseName - The logical name of the database to lock.
   * @param {number} mode - Initial locking mode (DEFERRED, IMMEDIATE, EXCLUSIVE).
   * @param {object} [config] - Client configuration.
   */
  constructor(client, databaseName, mode, config) {
    /** @private */
    this.client = client;
    /** @private */
    this.databaseName = databaseName;
    /** @private */
    this.mode = mode;
    /** @private */
    this.config = config || {};

    /** @type {import('@grpc/grpc-js').ClientDuplexStream | null} The raw gRPC stream */
    this.stream = null;

    /**
     * @type {{resolve: Function, reject: Function, type: string} | null}
     * Keeps track of the Unary-style command currently waiting for a response.
     */
    this.pendingResolver = null;

    /**
     * @type {AsyncQueue | null}
     * Bridges the gRPC 'data' events to an AsyncIterator for row streaming.
     */
    this.activeQueue = null;

    /**
     * @private
     * Stores metadata for the currently executing query in the stream.
     * Reset after every query completion.
     */
    this._currentColumnTypes = [];

    /**
     * @private
     * State tracking for the FinalizationRegistry.
     * We use a "held" object because the Registry cannot hold a reference to 'this'
     */
    this._state = {
      isFinalized: false,
    };

    // Register this instance for GC tracking
    cleanupRegistry.register(
      this,
      {
        state: this._state,
        databaseName: this.databaseName,
        stream: null,
      },
      this._state,
    );
  }

  /**
   * Opens the bidirectional stream and initiates the transaction.
   * @async
   * @returns {Promise<db_service_pb.BeginResponse>}
   * @throws {Error} If the stream cannot be opened or the database is locked.
   */
  async begin() {
    return new Promise((resolve, reject) => {
      // 1. Open the Bi-Directional Stream
      this.stream = this.client.transaction();

      // Keep the registry state updated with the active stream
      this._state.stream = this.stream;

      // Update registry with the actual stream object
      cleanupRegistry.unregister(this._state);
      cleanupRegistry.register(
        this,
        {
          state: this._state,
          databaseName: this.databaseName,
          stream: this.stream,
        },
        this._state,
      );

      // 2. Attach Stream Lifecycle Listeners
      // --- USE WEAK REFERENCES FOR LISTENERS ---
      // This allows 'this' (TransactionHandle) to be GC'd even if the
      // stream is still alive and pointing here.
      // Pass the stream and state to the external helper
      // This breaks the reference cycle.
      _attachStreamListeners(this.stream, this._state, new WeakRef(this));

      // 3. Set the lock and write the Begin request
      this.pendingResolver = { resolve, reject, type: "BEGIN" };

      const beginReq = new db_service_pb.BeginRequest();
      beginReq.setDatabase(this.databaseName);
      beginReq.setMode(this.mode || TransactionMode.TRANSACTION_MODE_DEFERRED);

      const req = new db_service_pb.TransactionRequest();
      req.setBegin(beginReq);

      this.stream.write(req);
    });
  }

  /**
   * Executes a query and buffers all results into memory.
   * Recommended for DML (INSERT/UPDATE) or small SELECT results.
   *
   * @param {string|object} sqlOrObj - SQL string or Template Object.
   * @param {Array|object} [paramsOrHints] - Positional/Named parameters.
   * @param {object} [hintsOrNull] - Type hints for BLOBs/BigInts.
   * @returns {Promise<{type: 'SELECT'|'DML', columns: string[], columnTypes: number[], rows: any[][], rowsAffected?: number, lastInsertId?: number}>}
   */
  async query(sqlOrObj, paramsOrHints, hintsOrNull) {
    if (this.pendingResolver || this.activeQueue)
      throw new Error("Transaction is busy");

    const { sql, positional, named, hints } = resolveArgs(
      sqlOrObj,
      paramsOrHints,
      hintsOrNull,
    );

    return new Promise((resolve, reject) => {
      this.pendingResolver = { resolve, reject, type: "QUERY_BUFFERED" };

      const queryReq = new db_service_pb.TransactionalQueryRequest();
      queryReq.setSql(sql);
      queryReq.setParameters(toProtoParams(positional, named, hints));

      const req = new db_service_pb.TransactionRequest();
      req.setQuery(queryReq);

      this.stream.write(req);
    });
  }

  /**
   * Executes a query and returns an AsyncIterator yielding one row at a time.
   * Optimized for large result sets; keeps memory usage O(1).
   *
   * @returns {Promise<{columns: string[], columnTypes: number[], rows: AsyncIterable<any[]>}>}
   */
  async iterate(sqlOrObj, paramsOrHints, hintsOrNull) {
    if (this.activeQueue || this.pendingResolver)
      throw new Error("Transaction is busy");

    const { sql, positional, named, hints } = resolveArgs(
      sqlOrObj,
      paramsOrHints,
      hintsOrNull,
    );

    return new Promise((resolve, reject) => {
      // Create a queue to hold incoming row batches
      this.activeQueue = new AsyncQueue();
      // Resolver will trigger once the Header (metadata) is received
      this.pendingResolver = { resolve, reject, type: "QUERY_STREAM_INIT" };

      const queryReq = new db_service_pb.TransactionalQueryRequest();
      queryReq.setSql(sql);
      queryReq.setParameters(toProtoParams(positional, named, hints));

      const req = new db_service_pb.TransactionRequest();
      req.setQueryStream(queryReq);

      this.stream.write(req);
    }).then((res) => {
      // res is { columns, columnTypes, rows: activeQueue }
      // We replace 'rows' with our helper wrapper
      return {
        columns: res.columns,
        columnTypes: res.columnTypes,
        rows: createRowIterator(res.rows, res.columnTypes, this.config.dateHandling),
      };
    });
  }

  /**
   * Executes a query and returns an AsyncIterator yielding BATCHES of rows.
   * Useful for high-performance data processing or local caching.
   *
   * @param {string|object} sqlOrObj
   * @param {Array|object} paramsOrHints
   * @param {number} [batchSize=500] - Desired rows per yield.
   * @returns {Promise<{columns: string[], columnTypes: number[], rows: AsyncIterable<any[][]>}>}
   */
  async queryStream(sqlOrObj, paramsOrHints, hintsOrNull, batchSize = 500) {
    let resolvedBatchSize = batchSize;
    let resolvedHints = hintsOrNull;

    // Handle JSDoc/Overload logic if SQL templates are used
    if (
      sqlOrObj?.text &&
      arguments.length === 3 &&
      typeof hintsOrNull === "number"
    ) {
      resolvedBatchSize = hintsOrNull;
      resolvedHints = paramsOrHints;
    }

    if (this.activeQueue || this.pendingResolver)
      throw new Error("Transaction is busy");

    const { sql, positional, named, hints } = resolveArgs(
      sqlOrObj,
      paramsOrHints,
      resolvedHints,
    );

    return new Promise((resolve, reject) => {
      this.activeQueue = new AsyncQueue();

      this.pendingResolver = { resolve, reject, type: "QUERY_STREAM_INIT" };

      const queryReq = new db_service_pb.TransactionalQueryRequest();
      queryReq.setSql(sql);
      queryReq.setParameters(toProtoParams(positional, named, hints));

      const req = new db_service_pb.TransactionRequest();
      req.setQueryStream(queryReq);

      this.stream.write(req);
    }).then(res => {
      return {
        columns: res.columns,
        columnTypes: res.columnTypes,
        rows: createBatchIterator(res.rows, res.columnTypes, this.config.dateHandling, resolvedBatchSize),
      };
    });
  }

  /**
   * Manages a SQLite Savepoint (Nested Transaction).
   *
   * @param {string} name - Unique identifier for the checkpoint.
   * @param {number} action - CREATE, RELEASE, or ROLLBACK_TO.
   * @returns {Promise<{success: boolean, name: string, action: number}>}
   */
  async savepoint(name, action = SavepointAction.SAVEPOINT_ACTION_CREATE) {
    if (this.pendingResolver || this.activeQueue)
      throw new Error("Transaction is busy");

    return new Promise((resolve, reject) => {
      this.pendingResolver = { resolve, reject, type: "SAVEPOINT" };

      const spReq = new db_service_pb.SavepointRequest();
      spReq.setName(name);
      spReq.setAction(action);

      const req = new db_service_pb.TransactionRequest();
      req.setSavepoint(spReq);

      this.stream.write(req);
    });
  }

  /**
   * Internal helper to stop the GC Registry from throwing an error.
   * @private
   */
  _markFinalized() {
    this._state.isFinalized = true;
    // We can also unregister to save a tiny bit of memory
    cleanupRegistry.unregister(this._state);
  }

  /**
   * Commits all changes in the current transaction to disk and closes the stream.
   * @returns {Promise<{success: boolean}>}
   */
  async commit() {
    if (this._state.isFinalized) return;
    // this._markFinalized();
    if (this.activeQueue || this.pendingResolver)
      throw new Error("Transaction is busy");
    return new Promise((resolve, reject) => {
      this.pendingResolver = { resolve, reject, type: "COMMIT" };
      const req = new db_service_pb.TransactionRequest();
      req.setCommit(new db_service_pb.CommitRequest());
      this.stream.write(req);
    });
  }

  /**
   * Aborts the transaction and discards all changes.
   * Safe to call multiple times or on a closed stream.
   * @returns {Promise<{success: boolean}>}
   */
  async rollback() {
    if (this._state.isFinalized) return { success: true };
    // this._markFinalized();
    if (!this.stream) return { success: true };
    return new Promise((resolve, reject) => {
      this.pendingResolver = { resolve, reject, type: "ROLLBACK" };
      const req = new db_service_pb.TransactionRequest();
      req.setRollback(new db_service_pb.RollbackRequest());
      this.stream.write(req);
    });
  }

  /**
   * Internal dispatcher for incoming stream data.
   * Uses a Type Switch logic based on the Protobuf 'oneof' response.
   * @private
   * @param {db_service_pb.TransactionResponse} res
   */
  _onData(res) {
    const responseCase = res.getResponseCase();
    const Case = db_service_pb.TransactionResponse.ResponseCase;

    // 1. HANDLE SERVER-SIDE ERRORS
    if (responseCase === Case.ERROR) {
      const errPb = res.getError();
      const err = new Error(errPb.getMessage());
      err.code = errPb.getSqliteErrorCode();

      // Notify both the active streaming query AND the current command promise
      if (this.activeQueue) this.activeQueue.fail(err);
      if (this.pendingResolver) this.pendingResolver.reject(err);

      this._cleanup();
      return;
    }

    // 2. HANDLE BUFFERED QUERY RESULTS (SELECT/DML)
    if (responseCase === Case.QUERY_RESULT) {
      // CRITICAL GUARD: If the resolver was cleared by an error/timeout, exit
      if (!this.pendingResolver) return;

      const result = res.getQueryResult();
      // Use helper
      const mapped = mapQueryResult(result, this.config.dateHandling);
      this.pendingResolver.resolve(mapped);
      this.pendingResolver = null;
      return;
    }

    // 3. HANDLE CHUNKED STREAMING RESULTS
    if (responseCase === Case.STREAM_RESULT) {
      const streamRes = res.getStreamResult();
      const streamCase = streamRes.getResponseCase();
      const SCase = db_service_pb.QueryResponse.ResponseCase;

      if (streamCase === SCase.HEADER) {
        this._currentColumnTypes = streamRes.getHeader().getColumnTypesList();
        // First message of a stream: Resolve the iterate() promise with the iterator
        if (this.pendingResolver?.type === "QUERY_STREAM_INIT") {
          this.pendingResolver.resolve({
            columns: streamRes.getHeader().getColumnsList(),
            columnTypes: this._currentColumnTypes,
            rows: this.activeQueue,
          });
          this.pendingResolver = null;
        }
      } else if (streamCase === SCase.BATCH) {
        // Data message: Push raw batch (array of ListValue) into the queue
        // The helper iterator will flatten and hydrate it.
        const rowsList = streamRes.getBatch().getRowsList();
        // Since AsyncQueue is item-based, we can push the whole array as one "item"
        // and the helper "createRowIterator" expects "batchIterator" (yields arrays).
        if (rowsList && rowsList.length > 0) {
          this.activeQueue.push(rowsList);
        }
      } else if (streamCase === SCase.DML) {
        // Special Case: DML with RETURNING clause in streaming mode
        const dml = streamRes.getDml();
        this.activeQueue.dmlResult = {
          rowsAffected: dml.getRowsAffected(),
          lastInsertId: dml.getLastInsertId(),
        };
        this._currentColumnTypes = [];
        this.activeQueue.close();
      } else if (streamCase === SCase.COMPLETE) {
        // Final message: Close the iterator
        this._currentColumnTypes = [];
        this.activeQueue.close();
        this.activeQueue = null;
      }
      return;
    }

    // 4. HANDLE LIFECYCLE COMMANDS (BEGIN, COMMIT, ROLLBACK, SAVEPOINT)
    if (this.pendingResolver) {
      switch (responseCase) {
        case Case.BEGIN:
          this.pendingResolver.resolve(res.getBegin());
          break;
        case Case.COMMIT:
          this.pendingResolver.resolve(res.getCommit());
          this.stream.end(); // Cleanly close the duplex stream
          break;
        case Case.ROLLBACK:
          this.pendingResolver.resolve(res.getRollback());
          this.stream.end();
          break;
        case Case.SAVEPOINT: {
          const sp = res.getSavepoint();
          this.pendingResolver.resolve({
            success: sp.getSuccess(),
            name: sp.getName(),
            action: sp.getAction(),
          });
          break;
        }
      }
      this.pendingResolver = null;
    }
  }

  /** @private */
  _onError(err) {
    // this._markFinalized();
    if (this.activeQueue) this.activeQueue.fail(err);
    if (this.pendingResolver) this.pendingResolver.reject(err);
    this._cleanup();
  }

  /** @private */
  _onEnd() {
    if (this.activeQueue) this.activeQueue.close();
    if (this.pendingResolver)
      this.pendingResolver.reject(
        new Error("Transaction stream closed unexpectedly"),
      );
    this._cleanup();
  }

  /** @private */
  _cleanup() {
    this._markFinalized();
    if (this.stream) {
      // cancel() is safer than end() for error scenarios as it
      // ensures the socket is destroyed and the event loop can exit.
      this.stream.cancel();
    }
    this.activeQueue = null;
    this.pendingResolver = null;
    this.stream = null;
    this._currentColumnTypes = [];
  }
}

module.exports = TransactionHandle;
