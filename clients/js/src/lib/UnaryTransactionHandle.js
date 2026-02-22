const db_service_pb = require("../protos/sqlrpc/v1/db_service_pb");
const {
    resolveArgs,
    getAuthMetadata,
    // Typed API utilities
    toTypedProtoParams,
    createTypedRowIterator,
    createTypedBatchIterator,
    mapTypedQueryResult,
} = require("./utils");

/**
 * Manages a Unary (ID-Based) Transaction.
 * All operations use a transaction ID and are stateless relative to the connection.
 * Supports streaming results via the TransactionQueryStream RPC.
 */
class UnaryTransactionHandle {
    /**
     * @param {Object} client - The gRPC DatabaseServiceClient.
     * @param {string} databaseName - The name of the database.
     * @param {number} mode - One of TransactionLockMode enum (DEFERRED, IMMEDIATE, EXCLUSIVE).
     * @param {Object} config - Client configuration.
     */
    constructor(client, databaseName, mode, config) {
        this.client = client;
        this.dbName = databaseName;
        this.mode = mode;
        this.config = config || {};
        this.transactionId = null;
        this.isFinalized = false;
    }

    // --- Lifecycle ---

    /**
     * Begins the transaction by calling the Unary BeginTransaction RPC.
     * Stores the returned transaction ID.
     * @returns {Promise<void>}
     */
    async begin() {
        const req = new db_service_pb.BeginTransactionRequest();
        req.setDatabase(this.dbName);
        req.setMode(this.mode);

        return new Promise((resolve, reject) => {
            const metadata = getAuthMetadata(this.config.auth);
            this.client.beginTransaction(req, metadata, (err, res) => {
                if (err) return reject(err);
                this.transactionId = res.getTransactionId();
                resolve();
            });
        });
    }

    /**
     * Commits the transaction using the CommitTransaction RPC.
     * @returns {Promise<{success: boolean}>}
     */
    async commit() {
        this._checkActive();
        const req = new db_service_pb.TransactionControlRequest();
        req.setTransactionId(this.transactionId);

        return new Promise((resolve, reject) => {
            const metadata = getAuthMetadata(this.config.auth);
            this.client.commitTransaction(req, metadata, (err, res) => {
                this.isFinalized = true;
                if (err) return reject(err);
                resolve({ success: res.getSuccess() });
            });
        });
    }

    /**
     * Rolls back the transaction using the RollbackTransaction RPC.
     * explicit rollback.
     * @returns {Promise<{success: boolean}>}
     */
    async rollback() {
        // Determine active state safely to avoid double-rollback errors
        if (!this.transactionId || this.isFinalized) {
            return { success: false };
        }
        const req = new db_service_pb.TransactionControlRequest();
        req.setTransactionId(this.transactionId);

        return new Promise((resolve, reject) => {
            const metadata = getAuthMetadata(this.config.auth);
            this.client.rollbackTransaction(req, metadata, (err, res) => {
                this.isFinalized = true;
                if (err) {
                    // Ignore "NOT_FOUND" which means it's already gone
                    if (err.code === 12 || err.code === 5) { // NOT_FOUND or NOT_FOUND mapped
                        return resolve({ success: false });
                    }
                    return reject(err);
                }
                resolve({ success: res.getSuccess() });
            });
        });
    }

    // --- Savepoints ---

    /**
     * Manages savepoints within the transaction.
     * @param {string} name - Savepoint name.
     * @param {number} action - SavepointAction enum (CREATE, RELEASE, ROLLBACK).
     * @returns {Promise<{success: boolean, name: string, action: number}>}
     */
    async savepoint(name, action) {
        this._checkActive();
        const savepointReq = new db_service_pb.SavepointRequest();
        savepointReq.setName(name);
        savepointReq.setAction(action);

        const req = new db_service_pb.TransactionSavepointRequest();
        req.setTransactionId(this.transactionId);
        req.setSavepoint(savepointReq);

        return new Promise((resolve, reject) => {
            const metadata = getAuthMetadata(this.config.auth);
            this.client.transactionSavepoint(req, metadata, (err, res) => {
                if (err) return reject(err);
                resolve({
                    success: res.getSuccess(),
                    name: res.getName(),
                    action: res.getAction(),
                });
            });
        });
    }

    // --- Queries ---

    /**
     * Executes a query and buffers the result in memory.
     * @param {string|Object} sqlOrObj - SQL string or SQLStatement object.
     * @param {Object|Array} [paramsOrHints] - Parameters or hints (if 3 args).
     * @param {Object} [hintsOrNull] - Hints (if 3 args) or null.
     * @returns {Promise<{
     *   type: 'SELECT'|'DML',
     *   columns?: string[],
     *   columnAffinities?: number[],
     *   columnDeclaredTypes?: number[],
     *   columnRawTypes?: string[],
     *   rows?: any[][],
     *   rowsAffected?: number,
     *   lastInsertId?: number
     * }>} The query result (SELECT or DML).
     */
    async query(sqlOrObj, paramsOrHints, hintsOrNull) {
        this._checkActive();
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        // Use TypedTransactionQueryRequest for better wire efficiency
        const req = new db_service_pb.TypedTransactionQueryRequest();
        req.setTransactionId(this.transactionId);
        req.setSql(sql);
        req.setParameters(toTypedProtoParams(positional, named, hints));

        return new Promise((resolve, reject) => {
            const metadata = getAuthMetadata(this.config.auth);
            this.client.typedTransactionQuery(req, metadata, (err, result) => {
                if (err) return reject(err);

                // Use typed result mapper
                resolve(mapTypedQueryResult(result, this.config.typeParsers));
            });
        });
    }

    /**
     * Executes a DML statement (INSERT, UPDATE, DELETE) within a transaction.
     * Leverages the TypedTransactionExec RPC for transactional write routing.
     *
     * @param {string|Object} sqlOrObj - SQL string or SQLStatement object.
     * @param {Object|Array} [paramsOrHints]
     * @param {Object} [hintsOrNull]
     * @returns {Promise<{rowsAffected: number, lastInsertId: number}>}
     */
    async exec(sqlOrObj, paramsOrHints, hintsOrNull) {
        this._checkActive();
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const req = new db_service_pb.TypedTransactionQueryRequest();
        req.setTransactionId(this.transactionId);
        req.setSql(sql);
        req.setParameters(toTypedProtoParams(positional, named, hints));

        return new Promise((resolve, reject) => {
            const metadata = getAuthMetadata(this.config.auth);
            this.client.typedTransactionExec(req, metadata, (err, response) => {
                if (err) return reject(err);
                const dml = response.getDml();
                const result = {
                    rowsAffected: dml ? (this.config.typeParsers.bigint !== false ? BigInt(dml.getRowsAffected()) : dml.getRowsAffected()) : 0,
                    lastInsertId: dml ? (this.config.typeParsers.bigint !== false ? BigInt(dml.getLastInsertId()) : dml.getLastInsertId()) : 0,
                };
                resolve(result);
            });
        });
    }

    /**
     * Executes a query and yields rows one by one from a stream.
     * @param {string|Object} sqlOrObj - SQL string or SQLStatement object.
     * @param {Object|Array} [paramsOrHints] - Parameters.
     * @param {Object} [hintsOrNull] - Hints.
     * @returns {Promise<{
     *   columns: string[],
     *   columnAffinities: number[],
     *   columnDeclaredTypes: number[],
     *   columnRawTypes: string[],
     *   rows: AsyncIterable<any[]>
     * }>}
     */
    async iterate(sqlOrObj, paramsOrHints, hintsOrNull) {
        const iterator = await this._initStream(sqlOrObj, paramsOrHints, hintsOrNull);
        const { rows, columnDeclaredTypes } = iterator;
        return {
            columns: iterator.columns,
            columnAffinities: iterator.columnAffinities,
            columnDeclaredTypes: iterator.columnDeclaredTypes,
            columnRawTypes: iterator.columnRawTypes,
            rows: createTypedRowIterator(rows, columnDeclaredTypes, this.config.typeParsers),
        };
    }

    /**
     * Executes a query and yields batches of rows from a stream.
     * @param {string|Object} sqlOrObj - SQL string or SQLStatement object.
     * @param {Object|Array} [paramsOrHints] - Parameters.
     * @param {Object} [hintsOrNull] - Hints.
     * @param {number} [batchSize=500] - Client-side re-batching size.
     * @returns {Promise<{
     *   columns: string[],
     *   columnAffinities: number[],
     *   columnDeclaredTypes: number[],
     *   columnRawTypes: string[],
     *   rows: AsyncIterable<any[][]>
     * }>}
     */
    async queryStream(sqlOrObj, paramsOrHints, hintsOrNull, batchSize = 500) {
        // Handle optional batchSize in 4th arg
        let resolvedBatchSize = batchSize;
        let resolvedHints = hintsOrNull;
        if (sqlOrObj?.text && arguments.length === 3 && typeof hintsOrNull === "number") {
            resolvedBatchSize = hintsOrNull;
            resolvedHints = paramsOrHints;
        }

        const iterator = await this._initStream(sqlOrObj, paramsOrHints, resolvedHints);
        const { rows, columnDeclaredTypes } = iterator;

        return {
            columns: iterator.columns,
            columnAffinities: iterator.columnAffinities,
            columnDeclaredTypes: iterator.columnDeclaredTypes,
            columnRawTypes: iterator.columnRawTypes,
            rows: createTypedBatchIterator(rows, columnDeclaredTypes, resolvedBatchSize, this.config.typeParsers),
        };
    }

    /**
     * Internal: Initiates a TransactionQueryStream RPC.
     * @private
     */
    async _initStream(sqlOrObj, paramsOrHints, hintsOrNull) {
        this._checkActive();
        const { sql, positional, named } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        // Use TypedTransactionQueryRequest for better wire efficiency
        const req = new db_service_pb.TypedTransactionQueryRequest();
        req.setTransactionId(this.transactionId);
        req.setSql(sql);
        req.setParameters(toTypedProtoParams(positional, named));

        const metadata = getAuthMetadata(this.config.auth);
        const stream = this.client.typedTransactionQueryStream(req, metadata);
        const iterator = stream[Symbol.asyncIterator]();

        // Peel header
        const first = await iterator.next();
        if (first.done) return { columns: [], columnTypes: [], rows: [] };

        const msg = first.value;
        const caseType = msg.getResponseCase();

        if (caseType === db_service_pb.TypedQueryResponse.ResponseCase.ERROR) {
            throw new Error(msg.getError().getMessage());
        }

        // We expect HEADER first usually
        let columns = [];
        let columnAffinities = [];
        let columnDeclaredTypes = [];
        let columnRawTypes = [];

        if (caseType === db_service_pb.TypedQueryResponse.ResponseCase.HEADER) {
            columns = msg.getHeader().getColumnsList();
            columnAffinities = msg.getHeader().getColumnAffinitiesList();
            columnDeclaredTypes = msg.getHeader().getColumnDeclaredTypesList();
            columnRawTypes = msg.getHeader().getColumnRawTypesList();
        }

        // Generator for raw proto batches (yields SqlRow[])
        const batchGen = async function* () {
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
            rows: batchGen(),
        };
    }

    /**
     * Helper to verify transaction state.
     * @private
     */
    _checkActive() {
        if (!this.transactionId || this.isFinalized) {
            throw new Error("Transaction is closed or not started");
        }
    }

    /**
     * Read-only property for internal test checks.
     * @returns {{isFinalized: boolean}}
     */
    get _state() {
        return { isFinalized: this.isFinalized };
    }
}

module.exports = UnaryTransactionHandle;
