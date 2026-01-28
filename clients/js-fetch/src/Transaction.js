/**
 * @file src/Transaction.js
 */
const { SavepointAction, RPC } = require('./constants');
const { resolveArgs, toParams, hydrateRow } = require('./utils');

class Transaction {
    /**
     * @param {import('./Client')} client
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
            const types = columnTypes || []; // List of enums
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

    async commit() {
        if (this.isFinalized) return;
        await this.client._fetch(RPC.COMMIT_TRANSACTION, { transactionId: this.txId });
        this.isFinalized = true;
    }

    async rollback() {
        if (this.isFinalized) return;
        try {
            await this.client._fetch(RPC.ROLLBACK_TRANSACTION, { transactionId: this.txId });
        } catch (e) {
            console.warn("Rollback failed:", e.message);
        }
        this.isFinalized = true;
    }

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

    // Streaming within transaction
    async queryStream(sqlOrObj, paramsOrHints, hintsOrNull, onMetadata) {
        if (this.isFinalized) throw new Error("Transaction is already finalized.");
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            transactionId: this.txId,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        // TransactionQueryStream
        const streamGen = this.client._streamRequest(RPC.TRANSACTION_QUERY_STREAM, body, onMetadata);
        return {
            rows: streamGen
        };
    }

    async iterate(sqlOrObj, paramsOrHints, hintsOrNull) {
        if (this.isFinalized) throw new Error("Transaction is already finalized.");
        const columns = [];
        Object.defineProperty(columns, 'isLoaded', { value: false, writable: true });

        const onMetadata = (header) => {
            if (header.columns) {
                columns.push(...header.columns);
                columns.isLoaded = true;
            }
        };

        const { rows: stream } = await this.queryStream(sqlOrObj, paramsOrHints, hintsOrNull, onMetadata);

        return {
            columns,
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

module.exports = Transaction;
