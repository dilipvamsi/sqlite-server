/**
 * @file lib/DatabaseClient.js
 */
const grpc = require("@grpc/grpc-js");
const TransactionHandle = require("./TransactionHandle");
const UnaryTransactionHandle = require("./UnaryTransactionHandle");
const { TransactionMode, TransactionType } = require("./constants");
const {
  resolveArgs,
  getAuthMetadata,
  // Typed API utilities
  toTypedProtoParams,
  createTypedRowIterator,
  createTypedBatchIterator,
  mapTypedQueryResult,
  mapExplainResponse,
} = require("./utils");


// Import the generated static stubs
const db_service_pb = require("../protos/db/v1/db_service_pb");
const db_service_grpc_pb = require("../protos/db/v1/db_service_grpc_pb");
const google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");


class DatabaseClient {
  /**
   * @param {string} address - gRPC Server Address (e.g. localhost:50051).
   * @param {string} databaseName - The database to bind this client to.
   * @param {object} [credentials] - grpc.credentials object (default: insecure).
   * @param {object} [config] - Configuration options.
   * @param {string} [config.dateHandling='date'] - How to handle date/time values ('date' for Date objects, 'string' for ISO strings).
   * @param {object} [config.retry] - Retry configuration for SQLITE_BUSY/LOCKED errors.
   * @param {number} [config.retry.maxRetries=3] - Maximum number of retries.
   * @param {number} [config.retry.baseDelayMs=100] - Base delay in milliseconds for exponential backoff.
   * @param {Array<object>} [config.interceptors=[]] - Array of interceptor objects.
   * @param {object} [config.typeParsers] - Type parsing configuration.
   * @param {boolean} [config.typeParsers.bigint=true] - If true, BigInts are returned as JS BigInts. If false, as strings.
   * @param {boolean} [config.typeParsers.json=true] - If true, JSON strings are parsed into objects.
   * @param {boolean} [config.typeParsers.blob=true] - If true, BLOBs are returned as Buffers. If false, as Base64 strings.
   * @param {string} [config.typeParsers.date='date'] - 'date' (Date obj), 'string' (ISO), or 'number' (Epoch).
   */
  constructor(
    address,
    databaseName,
    configOrCredentials = {},
    maybeConfig = {},
  ) {
    let credentials = grpc.credentials.createInsecure();
    let config = {};

    // Argument Shifting Logic for Backward Compatibility & Cleaner API
    // Check if 3rd argument is likely a Configuration Object or Credentials
    // gRPC credentials are internal opaque objects, usually not plain JSON.
    // If 3rd arg has 'auth' or 'retry' keys, it's definitely config.
    // If 4th arg is provided, then 3rd is explicitly credentials.

    if (configOrCredentials instanceof grpc.ChannelCredentials) {
      // Legacy Signature: (addr, db, creds, config)
      credentials = configOrCredentials;
      config = maybeConfig;
    } else {
      // New Signature: (addr, db, config)
      // Check if the user passed credentials inside config
      config = configOrCredentials;
      if (config.credentials) {
        credentials = config.credentials;
      }
    }

    this.client = new db_service_grpc_pb.DatabaseServiceClient(
      address,
      credentials,
    );
    this.adminClient = new db_service_grpc_pb.AdminServiceClient(
      address,
      credentials,
    );
    this.dbName = databaseName;

    // Default Config
    const defaults = {
      retry: { maxRetries: 3, baseDelayMs: 100 },
      interceptors: [],
      auth: null,
      typeParsers: {
        bigint: true,
        json: true,
        blob: true,
        date: 'date',
      },
    };

    // Merge User Config
    this.config = {
      ...defaults,
      ...config,
      // Deep merge typeParsers
      typeParsers: {
        ...defaults.typeParsers,
        ...(config.typeParsers || {}),
      },
    };

    this.isClosed = false;
  }

  /**
   * Closes the gRPC client connection.
   */
  close() {
    this.isClosed = true;
    if (this.client) {
      this.client.close();
    }
  }

  /**
   * Internal: Retry wrapper for SQLITE_BUSY (5) and SQLITE_LOCKED (6).
   */
  async _withRetry(fn) {
    const { maxRetries, baseDelayMs } = this.config.retry;
    let attempts = 0;

    while (true) {
      if (this.isClosed) {
        throw new Error("Client is closed");
      }
      try {
        return await fn();
      } catch (err) {
        if (this.isClosed) throw err;

        const code = err.code;
        // 5 = SQLITE_BUSY, 6 = SQLITE_LOCKED
        const isLocked = code === 5 || code === 6;

        if (isLocked && attempts < maxRetries) {
          attempts++;
          const delay = baseDelayMs * Math.pow(2, attempts - 1); // Exponential backoff
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        // Run onError interceptors
        this._runInterceptors('onError', err);
        throw err;
      }
    }
  }

  _runInterceptors(stage, ...args) {
    if (!this.config.interceptors) return;
    for (const hook of this.config.interceptors) {
      if (hook[stage]) {
        try { hook[stage](...args); } catch (e) { console.error("Interceptor failed", e); }
      }
    }
  }

  /**
   * Internal: Initiates a typed stateless QueryStream and peels off the first message (Header/DML).
   * @param {string|object} sqlOrObj - SQL string or SQLStatement object.
   * @param {Array|object} paramsOrHints - Positional/Named parameters or hints.
   * @param {object} hintsOrNull - Type hints (ignored for typed API).
   * @returns {Promise<{
   *   iterator: AsyncIterator<any>,
   *   columns: string[],
   *   columnAffinities: number[],
   *   columnDeclaredTypes: number[],
   *   columnRawTypes: string[],
   *   isDml: boolean,
   *   dmlStats?: { rowsAffected: number, lastInsertId: number }
   * }>}
   */
  async _initStream(sqlOrObj, paramsOrHints, hintsOrNull) {
    const { sql, positional, named } = resolveArgs(
      sqlOrObj,
      paramsOrHints,
      hintsOrNull,
    );

    this._runInterceptors('beforeQuery', { sql, params: { positional, named } });

    // Use TypedQueryRequest for better wire efficiency
    const req = new db_service_pb.TypedQueryRequest();
    req.setDatabase(this.dbName);
    req.setSql(sql);
    req.setParameters(toTypedProtoParams(positional, named));

    // TODO: queryStream currently doesn't support easy retries because it returns a stream immediately.
    // We would need to re-create the stream on error which is complex for a generator.
    // For now, only unary calls get auto-retry.

    const metadata = getAuthMetadata(this.config.auth);
    const stream = this.client.typedQueryStream(req, metadata);
    const iterator = stream[Symbol.asyncIterator]();

    try {
      const first = await iterator.next();
      if (first.done) {
        return { iterator, columns: [], columnAffinities: [], columnDeclaredTypes: [], columnRawTypes: [], isDml: false };
      }

      const msg = first.value;
      const responseType = msg.getResponseCase();

      if (responseType === db_service_pb.TypedQueryResponse.ResponseCase.ERROR) {
        const errPb = msg.getError();
        const err = new Error(errPb.getMessage());
        err.code = errPb.getSqliteErrorCode();
        throw err;
      }

      if (responseType === db_service_pb.TypedQueryResponse.ResponseCase.DML) {
        const dml = msg.getDml();
        return {
          iterator,
          columns: [],
          columnAffinities: [],
          columnDeclaredTypes: [],
          columnRawTypes: [],
          isDml: true,
          dmlStats: {
            rowsAffected: dml.getRowsAffected(),
            lastInsertId: dml.getLastInsertId(),
          },
        };
      }

      let columns = [];
      let columnAffinities = [];
      let columnDeclaredTypes = [];
      let columnRawTypes = [];
      if (responseType === db_service_pb.TypedQueryResponse.ResponseCase.HEADER) {
        const header = msg.getHeader();
        columns = header.getColumnsList();
        columnAffinities = header.getColumnAffinitiesList();
        columnDeclaredTypes = header.getColumnDeclaredTypesList();
        columnRawTypes = header.getColumnRawTypesList();
      }

      return { iterator, columns, columnAffinities, columnDeclaredTypes, columnRawTypes, isDml: false };
    } catch (err) {
      this._runInterceptors('onError', err);
      throw err;
    }
  }


  /**
   * Executes a query and yields rows one by one.
   * Optimized for large result sets to avoid memory overflow.
   *
   * @param {string|object} sqlOrObj - SQL string or SQLStatement object.
   * @param {Array|object} [paramsOrHints] - Parameters or hints.
   * @param {object} [hintsOrNull] - Hints.
   * @returns {Promise<{
   *   columns: string[],
   *   columnAffinities: number[],
   *   columnDeclaredTypes: number[],
   *   columnRawTypes: string[],
   *   rows: AsyncIterable<any[]>
   * }>}
   */
  async iterate(sqlOrObj, paramsOrHints, hintsOrNull) {
    const { iterator, columns, columnAffinities, columnDeclaredTypes, columnRawTypes, isDml } = await this._initStream(
      sqlOrObj,
      paramsOrHints,
      hintsOrNull,
    );

    if (isDml) {
      // eslint-disable-next-line require-yield
      return { columns, rows: isDml ? (async function* () { return; })() : null };
    }

    // Adapt the typed stream iterator to yield SqlRow batches
    const batchSource = async function* () {
      let nextVal = await iterator.next();
      while (!nextVal.done) {
        const res = nextVal.value;
        const type = res.getResponseCase();
        if (type === db_service_pb.TypedQueryResponse.ResponseCase.BATCH) {
          yield res.getBatch().getRowsList();
        } else if (type === db_service_pb.TypedQueryResponse.ResponseCase.ERROR) {
          throw new Error(res.getError().getMessage());
        }
        nextVal = await iterator.next();
      }
    };

    return {
      columns,
      columnAffinities,
      columnDeclaredTypes,
      columnRawTypes,
      rows: createTypedRowIterator(batchSource(), columnDeclaredTypes, this.config.typeParsers),
    };
  }

  /**
   * Executes a stateless query and yields batches of rows.
   * @param {number} [batchSize=500]
   * @returns {Promise<{columns: string[], columnAffinities: number[], columnDeclaredTypes: number[], columnRawTypes: string[], rows: AsyncIterable<any[][]>}>}
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

    const { iterator, columns, columnAffinities, columnDeclaredTypes, columnRawTypes, isDml } = await this._initStream(
      sqlOrObj,
      paramsOrHints,
      resolvedHints,
    );

    if (isDml) {
      // eslint-disable-next-line require-yield
      return { columns, rows: (async function* () { return; })() };
    }

    // Adapt the typed stream iterator to yield SqlRow batches
    const batchSource = async function* () {
      let nextVal = await iterator.next();
      while (!nextVal.done) {
        const res = nextVal.value;
        const type = res.getResponseCase();
        if (type === db_service_pb.TypedQueryResponse.ResponseCase.BATCH) {
          yield res.getBatch().getRowsList();
        } else if (type === db_service_pb.TypedQueryResponse.ResponseCase.ERROR) {
          throw new Error(res.getError().getMessage());
        }
        nextVal = await iterator.next();
      }
    };

    return {
      columns,
      columnAffinities,
      columnDeclaredTypes,
      columnRawTypes,
      rows: createTypedBatchIterator(batchSource(), columnDeclaredTypes, resolvedBatchSize, this.config.typeParsers),
    };
  }

  /**
   * Executes a stateless query and buffers all results in memory.
   * Uses Unary RPC for efficiency.
   * @returns {Promise<{type: string, columns: string[], columnAffinities: number[], columnDeclaredTypes: number[], columnRawTypes: string[], rows: any[][], rowsAffected?: number, lastInsertId?: number}>}
   */
  async query(sqlOrObj, paramsOrHints, hintsOrNull) {
    return this._withRetry(async () => {
      const { sql, positional, named } = resolveArgs(
        sqlOrObj,
        paramsOrHints,
        hintsOrNull,
      );

      this._runInterceptors('beforeQuery', { sql, params: { positional, named } });

      // Use TypedQueryRequest for better wire efficiency
      const req = new db_service_pb.TypedQueryRequest();
      req.setDatabase(this.dbName);
      req.setSql(sql);
      req.setParameters(toTypedProtoParams(positional, named));

      return new Promise((resolve, reject) => {
        const metadata = getAuthMetadata(this.config.auth);
        this.client.typedQuery(req, metadata, (err, response) => {
          if (err) return reject(err);
          // Use typed result mapper
          const result = mapTypedQueryResult(response, this.config.typeParsers);
          this._runInterceptors('afterQuery', result);
          resolve(result);
        });
      });
    });
  }

  /**
   * Returns the structured EXPLAIN QUERY PLAN for a given query.
   * Leverages the TypedExplain RPC for efficiency.
   *
   * @param {string|object} sqlOrObj - SQL string or object.
   * @param {object|Array} [paramsOrHints] - Parameters or hints.
   * @param {object} [hintsOrNull] - Hints.
   * @returns {Promise<Array<{id: number, parentId: number, detail: string}>>} List of plan nodes.
   */
  async explain(sqlOrObj, paramsOrHints, hintsOrNull) {
    return this._withRetry(async () => {
      const { sql, positional, named } = resolveArgs(
        sqlOrObj,
        paramsOrHints,
        hintsOrNull,
      );

      this._runInterceptors('beforeQuery', { sql, params: { positional, named } });

      const req = new db_service_pb.TypedQueryRequest();
      req.setDatabase(this.dbName);
      req.setSql(sql);
      req.setParameters(toTypedProtoParams(positional, named));

      return new Promise((resolve, reject) => {
        const metadata = getAuthMetadata(this.config.auth);
        this.client.typedExplain(req, metadata, (err, response) => {
          if (err) return reject(err);
          const result = mapExplainResponse(response);
          // Explains usually don't have detailed stats or need full afterQuery interceptors
          // but we can pass the result if needed.
          resolve(result);
        });
      });
    });
  }



  /**
   * Executes a list of queries in a single atomic transaction using the ExecuteTransaction RPC.
   * Automatically handles Begin and Commit.
   *
   * @param {Array<{sql: string|object, params?: any, hints?: any} | string | object>} queries
   * @param {number} [mode] - TransactionMode enum (default: DEFERRED).
   * @returns {Promise<Array<{
   *   type: 'SELECT'|'DML',
   *   rows?: any[][],
   *   columns?: string[],
   *   rowsAffected?: number,
   *   lastInsertId?: number
   * }>>} List of results for each query.
   */
  async executeTransaction(
    queries,
    mode = TransactionMode.TRANSACTION_MODE_DEFERRED,
  ) {
    return this._withRetry(async () => {
      // Prepare Requests
      const requests = [];

      // 1. Begin
      const beginReq = new db_service_pb.BeginRequest();
      beginReq.setDatabase(this.dbName);
      beginReq.setMode(mode);
      const txBegin = new db_service_pb.TransactionRequest();
      txBegin.setBegin(beginReq);
      requests.push(txBegin);

      // 2. Queries
      const resolvedQueries = [];
      for (const q of queries) {
        const { sql, positional, named } = resolveArgs(
          q.sql || q,
          q.params,
          q.hints,
        );
        resolvedQueries.push({ sql });

        const queryReq = new db_service_pb.TypedTransactionalQueryRequest();
        queryReq.setSql(sql);
        queryReq.setParameters(toTypedProtoParams(positional, named));

        const txQuery = new db_service_pb.TransactionRequest();
        txQuery.setTypedQuery(queryReq);
        requests.push(txQuery);
      }

      // Execute Hooks
      this._runInterceptors('beforeQuery', { type: 'TX_SCRIPT', queries: resolvedQueries });

      // 3. Commit
      const txCommit = new db_service_pb.TransactionRequest();
      txCommit.setCommit(new google_protobuf_empty_pb.Empty());
      requests.push(txCommit);

      // 4. Execute RPC
      const execReq = new db_service_pb.ExecuteTransactionRequest();
      execReq.setRequestsList(requests);

      return new Promise((resolve, reject) => {
        const metadata = getAuthMetadata(this.config.auth);
        this.client.executeTransaction(execReq, metadata, (err, response) => {
          if (err) return reject(err);

          try {
            // Map responses back to friendly format
            const results = [];
            for (const res of response.getResponsesList()) {
              const caseType = res.getResponseCase();
              const ResCase = db_service_pb.TransactionResponse.ResponseCase;

              if (caseType === ResCase.ERROR) {
                const errPb = res.getError();
                const err = new Error(errPb.getMessage());
                err.code = errPb.getSqliteErrorCode();
                throw err; // will be caught by promise wrapper or fallback
              }

              if (caseType === ResCase.TYPED_QUERY_RESULT) {
                // Use typed helper
                results.push(mapTypedQueryResult(res.getTypedQueryResult(), this.config.typeParsers));
              }
            }
            this._runInterceptors('afterQuery', results);
            resolve(results);
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  }

  /**
   * Opens a transaction.
   * @param {number} [mode] - TransactionMode enum (Default: DEFERRED).
   * @param {number} [type] - TransactionType enum (Default: STREAMING).
   * @returns {Promise<TransactionHandle|UnaryTransactionHandle>}
   */
  async beginTransaction(
    mode = TransactionMode.TRANSACTION_MODE_DEFERRED,
    type = TransactionType.STREAMING,
  ) {
    if (type === TransactionType.UNARY) {
      const tx = new UnaryTransactionHandle(this.client, this.dbName, mode, this.config);
      await tx.begin();
      return tx;
    }
    const tx = new TransactionHandle(this.client, this.dbName, mode, this.config);
    await tx.begin();
    return tx;
  }

  /**
   * Executes a function within a transaction.
   * Automatically commits if the function returns, and rolls back if it throws.
   *
   * @param {Function} fn - Async function (tx, ...args) => { ... }
   * @param {number} [mode] - TransactionMode enum.
   * @param {number} [type] - TransactionType enum.
   * @param {...any} args - Additional arguments to pass to the callback function.
   * @returns {Promise<any>} The result of the callback function.
   */
  async transaction(
    fn,
    mode = TransactionMode.TRANSACTION_MODE_DEFERRED,
    type = TransactionType.STREAMING,
    ...args
  ) {
    const tx = await this.beginTransaction(mode, type);
    try {
      // Pass the transaction object followed by any spread arguments
      const result = await fn(tx, ...args);

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
        } catch {
          // Ignore: stream might already be closed by the server due to the error
        }
      }
      throw err; // Re-throw original error
    }
  }
  /**
   * Triggers a VACUUM command to rebuild the database file.
   * @param {string} [intoFile] - Optional path to create a backup file (VACUUM INTO).
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async vacuum(intoFile) {
    return this._withRetry(async () => {
      const req = new db_service_pb.VacuumRequest();
      req.setDatabase(this.dbName);
      if (intoFile) {
        req.setIntoFile(intoFile);
      }

      return new Promise((resolve, reject) => {
        const metadata = getAuthMetadata(this.config.auth);
        this.client.vacuum(req, metadata, (err, response) => {
          if (err) return reject(err);
          resolve({
            success: response.getSuccess(),
            message: response.getMessage(),
          });
        });
      });
    });
  }

  /**
   * Manages WAL checkpoints.
   * @param {number} mode - CheckpointMode enum value.
   * @returns {Promise<{success: boolean, message: string, busyCheckpoints: number, logCheckpoints: number, checkpointedPages: number}>}
   */
  async checkpoint(mode) {
    return this._withRetry(async () => {
      const req = new db_service_pb.CheckpointRequest();
      req.setDatabase(this.dbName);
      req.setMode(mode);

      return new Promise((resolve, reject) => {
        const metadata = getAuthMetadata(this.config.auth);
        this.client.checkpoint(req, metadata, (err, response) => {
          if (err) return reject(err);
          resolve({
            success: response.getSuccess(),
            message: response.getMessage(),
            busyCheckpoints: response.getBusyCheckpoints(),
            logCheckpoints: response.getLogCheckpoints(),
            checkpointedPages: response.getCheckpointedPages(),
          });
        });
      });
    });
  }

  /**
   * Runs an integrity check on the database.
   * @param {number} [maxErrors=100] - Max errors to report.
   * @returns {Promise<{success: boolean, message: string, errors: string[]}>}
   */
  async integrityCheck(maxErrors = 100) {
    return this._withRetry(async () => {
      const req = new db_service_pb.IntegrityCheckRequest();
      req.setDatabase(this.dbName);
      req.setMaxErrors(maxErrors);

      return new Promise((resolve, reject) => {
        const metadata = getAuthMetadata(this.config.auth);
        this.client.integrityCheck(req, metadata, (err, response) => {
          if (err) return reject(err);
          resolve({
            success: response.getSuccess(),
            message: response.getMessage(),
            errors: response.getErrorsList(),
          });
        });
      });
    });
  }

  /**
   * Attaches an external database.
   * @param {object} options - Attachment configuration.
   * @param {string} options.name - Alias for the attached database.
   * @param {string} options.dbPath - Path to the database file.
   * @param {string} [options.key] - Encryption key (optional).
   * @param {boolean} [options.readOnly=false] - If true, opens as read-only.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async attach(options) {
    return this._withRetry(async () => {
      const attachment = new db_service_pb.AttachedDatabase();
      attachment.setName(options.name);
      attachment.setDbPath(options.dbPath);
      if (options.key) attachment.setKey(options.key);
      attachment.setReadOnly(!!options.readOnly);

      const req = new db_service_pb.AttachDatabaseRequest();
      req.setParentDatabase(this.dbName);
      req.setAttachment(attachment);

      return new Promise((resolve, reject) => {
        const metadata = getAuthMetadata(this.config.auth);
        this.adminClient.attachDatabase(req, metadata, (err, response) => {
          if (err) return reject(err);
          resolve({
            success: response.getSuccess(),
            message: response.getMessage(),
          });
        });
      });
    });
  }

  /**
   * Detaches an attached database.
   * @param {string} name - Alias of the database to detach.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async detach(name) {
    return this._withRetry(async () => {
      const req = new db_service_pb.DetachDatabaseRequest();
      req.setParentDatabase(this.dbName);
      req.setAlias(name);

      return new Promise((resolve, reject) => {
        const metadata = getAuthMetadata(this.config.auth);
        this.adminClient.detachDatabase(req, metadata, (err, response) => {
          if (err) return reject(err);
          resolve({
            success: response.getSuccess(),
            message: response.getMessage(),
          });
        });
      });
    });
  }
}

module.exports = DatabaseClient;
