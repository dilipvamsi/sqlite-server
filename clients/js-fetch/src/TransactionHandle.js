/**
 * @file src/TransactionHandle.js
 */
const { SavepointAction, RPC } = require('./constants');
const { resolveArgs, toParams, hydrateRow, normalizeColumnAffinities, normalizeDeclaredTypes } = require('./utils');

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
            throw new Error(`Transaction Query Failed: ${res.statusText}`);
        }

        const json = await res.json();
        const data = json.queryResult || json.select || json;

        if (data.columns && data.columns.length > 0) {
            const { columns, rows, columnAffinities, columnDeclaredTypes, columnRawTypes } = data;
            const affinities = normalizeColumnAffinities(columnAffinities || []);
            const declaredTypes = normalizeDeclaredTypes(columnDeclaredTypes || []);
            return {
                columns: columns || [],
                columnAffinities: affinities,
                columnDeclaredTypes: declaredTypes,
                columnRawTypes: columnRawTypes || [],
                rows: (rows || []).map(r => {
                    const row = (r && typeof r === 'object' && !Array.isArray(r) && r.values) ? r.values : r;
                    return hydrateRow(row, affinities, declaredTypes, this.client.config.typeParsers)
                }),
                stats: json.stats || data.stats
            };
        }

        return { columns: [], columnAffinities: [], columnDeclaredTypes: [], columnRawTypes: [], rows: [] };
    }

    /**
     * Executes a DML statement within this transaction context.
     * @param {string|object} sqlOrObj - SQL string or object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
     * @param {object} [hintsOrNull] - Hints.
     * @returns {Promise<{rowsAffected: number, lastInsertId: number}>}
     */
    async exec(sqlOrObj, paramsOrHints, hintsOrNull) {
        if (this.isFinalized) throw new Error("Transaction is already finalized.");

        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            transactionId: this.txId,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        const res = await this.client._fetch(RPC.TRANSACTION_EXEC, body);
        if (!res.ok) {
            throw new Error(`Transaction Exec Failed: ${res.statusText}`);
        }

        const json = await res.json();
        const dml = json.dml || {};

        return {
            dml: {
                rowsAffected: Number(dml.rowsAffected || 0),
                lastInsertId: Number(dml.lastInsertId || 0)
            },
            stats: json.stats || {}
        };
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
     * @returns {Promise<{
     *   columns: string[],
     *   columnAffinities: number[],
     *   columnDeclaredTypes: number[],
     *   columnRawTypes: string[],
     *   rows: AsyncIterable<any[]>
     * }>}
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
        const { iterator, columns, columnAffinities, columnDeclaredTypes, columnRawTypes, isDml } = await this.client._initStream(RPC.TRANSACTION_QUERY_STREAM, body);

        if (isDml) {
            // eslint-disable-next-line require-yield
            return { columns, columnAffinities: [], columnDeclaredTypes: [], columnRawTypes: [], rows: (async function* () { return; })() };
        }

        const typeParsers = this.config.typeParsers;

        // Yield batches
        const self = this;
        const rowIterator = async function* () {
            for await (const msg of iterator) {
                if (msg.error) {
                    throw new Error(msg.error.message);
                }
                if (msg.batch) {
                    const rows = (msg.batch.rows || []).map(r => {
                        const row = (r && typeof r === 'object' && !Array.isArray(r) && r.values) ? r.values : r;
                        return hydrateRow(row, columnAffinities, columnDeclaredTypes, self.client.config.typeParsers);
                    });
                    yield rows;
                }
            }
        };

        return {
            columns,
            columnAffinities,
            columnDeclaredTypes,
            columnRawTypes,
            rows: rowIterator()
        };
    }

    /**
     * Iterates over query results row by row within the transaction.
     * @param {string|object} sqlOrObj - SQL string or object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
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
        if (this.isFinalized) throw new Error("Transaction is already finalized.");

        const { columns, columnAffinities, columnDeclaredTypes, columnRawTypes, rows: stream } = await this.queryStream(sqlOrObj, paramsOrHints, hintsOrNull);

        return {
            columns,
            columnAffinities,
            columnDeclaredTypes,
            columnRawTypes,
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
