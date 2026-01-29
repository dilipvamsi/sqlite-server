/**
 * @file src/TransactionHandle.js
 */
const { SavepointAction, RPC } = require('./constants');
const { resolveArgs, toParams, hydrateRow, normalizeColumnTypes } = require('./utils');

class TransactionHandle {
    /**
     * @param {import('./DatabaseClient')} client
     * @param {string} txId
     * @param {object} config
     */
    constructor(client, txId, config) {
        this.client = client;
        this.txId = txId;
        this.config = config;
        this.isFiles = false; // Closed/Committed/Rolledback
    }

    /**
     * Executes a query within this transaction context.
     * @param {string|object} sqlOrObj - SQL string or object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
     * @param {object} [hintsOrNull] - Hints.
     * @returns {Promise<import('./index').BufferedResult>}
     */
    async query(sqlOrObj, paramsOrHints, hintsOrNull) {
        if (this.isFinalized) throw new Error("Transaction is already finalized.");

        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            transactionId: this.txId,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        const res = await this.client._fetch(RPC.TRANSACTION_QUERY, body);

        // Check for not found (expired tx)
        if (!res.ok) {
            // Handled by _fetch mostly, but double check
            throw new Error(`Transaction Query Failed: ${res.statusText}`);
        }

        const json = await res.json();

        // The result from TransactionQuery is a QueryResult
        // Which might be SELECT or DML
        // JSON response from Connect looks like: { select: { columns: [], rows: [], columnTypes: [] } }
        // or { dml: { rowsAffected: "1", lastInsertId: "123" } }

        if (json.select) {
            const { columns, rows, columnTypes } = json.select;
            const types = normalizeColumnTypes(columnTypes || []); // List of enums
            return {
                type: 'SELECT',
                columns: columns || [],
                columnTypes: types,
                rows: (rows || []).map(r => hydrateRow(r, types, this.config.dateHandling))
            };
        } else if (json.dml) {
            return {
                type: 'DML',
                columns: [],
                rows: [],
                rowsAffected: Number(json.dml.rowsAffected || 0),
                lastInsertId: Number(json.dml.lastInsertId || 0)
            };
        }

        // Empty/Unknown
        return { type: 'UNKNOWN', rows: [] };
    }

    /**
     * Commit the transaction.
     * @returns {Promise<void>}
     */
    async commit() {
        if (this.isFinalized) return;
        await this.client._fetch(RPC.COMMIT_TRANSACTION, { transactionId: this.txId });
        this.isFinalized = true;
    }

    /**
     * Rollback the transaction.
     * @returns {Promise<void>}
     */
    async rollback() {
        if (this.isFinalized) return;
        try {
            await this.client._fetch(RPC.ROLLBACK_TRANSACTION, { transactionId: this.txId });
        } catch (e) {
            console.warn("Rollback failed:", e.message);
        }
        this.isFinalized = true;
    }

    /**
     * Create, release, or rollback a savepoint.
     * @param {string} name - Savepoint name.
     * @param {number} [action=SavepointAction.SAVEPOINT_ACTION_UNSPECIFIED] - Savepoint action (CREATE/RELEASE/ROLLBACK).
     * @returns {Promise<{success: boolean}>}
     */
    async savepoint(name, action = SavepointAction.SAVEPOINT_ACTION_UNSPECIFIED) {
        if (this.isFinalized) throw new Error("Transaction is already finalized.");

        const body = {
            transactionId: this.txId,
            savepoint: { name, action }
        };

        const res = await this.client._fetch(RPC.TRANSACTION_SAVEPOINT, body); // eslint-disable-line no-unused-vars
        // Returns empty success message
        return { success: true };
    }

    /**
     * Executes a query within the transaction returning a stream of rows.
     * @param {string|object} sqlOrObj - SQL string or object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
     * @param {object} [hintsOrNull] - Hints.
     * @returns {Promise<{columns: string[], columnTypes: number[], rows: AsyncIterable<Array<any>>}>}
     */
    async queryStream(sqlOrObj, paramsOrHints, hintsOrNull) {
        if (this.isFinalized) throw new Error("Transaction is already finalized.");
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            transactionId: this.txId,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        // TransactionQueryStream
        const { iterator, columns, columnTypes, isDml } = await this.client._initStream(RPC.TRANSACTION_QUERY_STREAM, body);

        if (isDml) {
            // eslint-disable-next-line require-yield
            return { columns, columnTypes: [], rows: (async function* () { return; })() };
        }

        const dateHandling = this.config.dateHandling;

        // Yield batches
        const rowIterator = async function* () {
            for await (const msg of iterator) {
                if (msg.error) {
                    throw new Error(msg.error.message);
                }
                if (msg.batch) {
                    const rows = (msg.batch.rows || []).map(r =>
                        hydrateRow(r, columnTypes, dateHandling)
                    );
                    yield rows;
                }
            }
        };

        return {
            columns,
            columnTypes,
            rows: rowIterator()
        };
    }

    /**
     * Iterates over query results row by row within the transaction.
     * @param {string|object} sqlOrObj - SQL string or object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
     * @param {object} [hintsOrNull] - Hints.
     * @returns {Promise<{columns: string[], columnTypes: number[], rows: AsyncIterable<any[]>}>}
     */
    async iterate(sqlOrObj, paramsOrHints, hintsOrNull) {
        if (this.isFinalized) throw new Error("Transaction is already finalized.");

        const { columns, columnTypes, rows: stream } = await this.queryStream(sqlOrObj, paramsOrHints, hintsOrNull);

        return {
            columns,
            columnTypes,
            rows: (async function* () {
                for await (const batch of stream) {
                    for (const row of batch) {
                        yield row;
                    }
                }
            })()
        };
    }

}

module.exports = TransactionHandle;
