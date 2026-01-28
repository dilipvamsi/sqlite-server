/**
 * @file src/Client.js
 */
const {
    toParams,
    resolveArgs,
    hydrateRow
} = require('./utils');
const {
    TransactionMode,
    RPC
} = require('./constants');
const Transaction = require('./Transaction');

// Polyfill for ReadableStream async iteration if needed (Node 18+ has it native)

class DatabaseClient {
    /**
     * @param {string} address - Base URL (e.g. "http://localhost:50051")
     * @param {string} database - Database name
     * @param {object} config - { auth: { type: 'basic'|'bearer', username, password, token }, dateHandling: 'date'|'string'|'number' }
     */
    constructor(address, database, config = {}) {
        // Ensure no trailing slash
        this.baseUrl = address.replace(/\/$/, "");
        this.database = database;
        this.config = {
            dateHandling: 'date',
            ...config
        };
    }

    /**
     * Internal wrapper for fetch with standard headers and error handling.
     */
    async _fetch(rpcPath, bodyObj, extraHeaders = {}) {
        const url = `${this.baseUrl}/${rpcPath}`;
        const headers = {
            'Content-Type': 'application/json',
            ...extraHeaders
        };

        if (this.config.auth) {
            if (this.config.auth.type === 'basic') {
                const creds = btoa(`${this.config.auth.username}:${this.config.auth.password}`);
                headers['Authorization'] = `Basic ${creds}`;
            } else if (this.config.auth.type === 'bearer') {
                headers['Authorization'] = `Bearer ${this.config.auth.token}`;
            }
        }

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: (bodyObj instanceof Uint8Array) ? bodyObj : JSON.stringify(bodyObj)
        });

        if (!res.ok) {
            let errMsg = res.statusText;
            try {
                const errJson = await res.json();
                if (errJson.message) errMsg = errJson.message;
                if (errJson.code) {
                    // Map Connect/Grpc codes if needed
                    // But often we get detailed error details
                }
            } catch (e) {
                console.error("Error parsing error body:", e);
            }
            const error = new Error(errMsg);
            error.status = res.status;
            throw error;
        }
        return res;
    }

    /**
     * Internal streaming request handler.
     * Parses standard Connect-JSON stream (or raw NDJSON if server supports it, but here we assume Connect).
     * Note: Connect streaming Protocol is a bit complex (Envelope: Default flag + size + message).
     * HOWEVER, for "Stream Query", if we use the unary endpoint, we get one big JSON.
     * If we use the Stream endpoint, we get a stream of messages.
     *
     * Simplification: Since implementation_plan mentioned using 'Server-Sent Events' or 'Chunked JSON',
     * but Connect default is a specific binary-framed JSON stream.
     *
     * To keep dependencies ZERO, we will try to parse the Connect JSON Stream format manually.
     * Format:
     *   1 byte flags (0x00 = data, 0x02 = end)
     *   4 bytes big-endian length
     *   <length> bytes JSON payload
     */
    async* _streamRequest(rpcPath, bodyObj, onMetadata) {
        // Envelope the request
        const jsonStr = JSON.stringify(bodyObj);
        const jsonBytes = new TextEncoder().encode(jsonStr);
        const len = jsonBytes.length;
        const envelope = new Uint8Array(5 + len);
        envelope[0] = 0; // Flags: 0
        envelope[1] = (len >> 24) & 0xFF;
        envelope[2] = (len >> 16) & 0xFF;
        envelope[3] = (len >> 8) & 0xFF;
        envelope[4] = len & 0xFF;
        envelope.set(jsonBytes, 5);

        const res = await this._fetch(rpcPath, envelope, { 'Content-Type': 'application/connect+json' });
        const reader = res.body.getReader();

        let buffer = new Uint8Array(0);
        let currentStreamTypes = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Append new chunk
            const temp = new Uint8Array(buffer.length + value.length);
            temp.set(buffer);
            temp.set(value, buffer.length);
            buffer = temp;

            // Parse Loop
            while (buffer.length >= 5) { // Header is 5 bytes
                const flags = buffer[0];
                const length = (buffer[1] << 24) | (buffer[2] << 16) | (buffer[3] << 8) | buffer[4];

                // Not enough data for full message
                if (buffer.length < 5 + length) {
                    break;
                }

                // Extract Message
                const msgBytes = buffer.subarray(5, 5 + length);
                const msgStr = new TextDecoder().decode(msgBytes);

                // Advance Buffer
                buffer = buffer.subarray(5 + length);

                if (flags === 2) { // End Stream info
                    // usually contains error or metadata, verify if error
                    // We can ignore for success case
                    return;
                }

                if (flags === 0) {
                    const msg = JSON.parse(msgStr);
                    // Handle QueryResponse (Header, Batch, DML, Error)

                    if (msg.error) {
                        throw new Error(msg.error.message);
                    }

                    if (msg.header) {
                        currentStreamTypes = msg.header.columnTypes;
                        if (onMetadata) {
                            onMetadata(msg.header);
                        }
                    } else if (msg.batch) {
                        const rows = (msg.batch.rows || []).map(r =>
                            hydrateRow(r, currentStreamTypes, this.config.dateHandling)
                        );
                        yield rows;
                    } else if (msg.dml) {
                        // Empty yield for DML?
                    }
                }
            }
        }
    }

    async query(sqlOrObj, paramsOrHints, hintsOrNull) {
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            database: this.database,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        const res = await this._fetch(RPC.QUERY, body);
        const json = await res.json();

        if (json.select) {
            const { columns, rows, columnTypes } = json.select;
            const types = columnTypes || [];
            return {
                type: 'SELECT',
                columns: columns || [],
                columnTypes: types,
                rows: (rows || []).map(r => {
                    // console.log("DEBUG ROW:", JSON.stringify(r));
                    return hydrateRow(r, types, this.config.dateHandling)
                })
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
        return { type: 'UNKNOWN', rows: [] };
    }

    async queryStream(sqlOrObj, paramsOrHints, hintsOrNull, onMetadata) {
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            database: this.database,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        const streamGen = this._streamRequest(RPC.QUERY_STREAM, body, onMetadata);
        return {
            rows: streamGen
        };
    }

    async iterate(sqlOrObj, paramsOrHints, hintsOrNull) {
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

    async beginTransaction(mode = TransactionMode.TRANSACTION_MODE_DEFERRED) {
        const body = {
            database: this.database,
            mode: mode
            // timeout can be added
        };

        const res = await this._fetch(RPC.BEGIN_TRANSACTION, body);
        const json = await res.json();

        return new Transaction(this, json.transactionId, this.config);
    }

    async executeTransaction(queries) {
        // atomic script
        // Map queries...
        const requests = [];

        // 1. Begin
        requests.push({ begin: { database: this.database, mode: TransactionMode.TRANSACTION_MODE_DEFERRED } });

        for (const q of queries) {
            const { sql, positional, named, hints } = resolveArgs(q.sql || q, q.params, q.hints);
            requests.push({
                query: {
                    sql,
                    parameters: toParams(positional, named, hints)
                }
            });
        }

        requests.push({ commit: {} });

        const body = { requests };
        const res = await this._fetch(RPC.EXECUTE_TRANSACTION, body);
        const json = await res.json();

        const results = [];
        if (json.responses) {
            for (const r of json.responses) {
                if (r.queryResult) {
                    // Map Query Result
                    const qr = r.queryResult;
                    if (qr.select) {
                        const types = qr.select.columnTypes || [];
                        results.push({
                            type: 'SELECT',
                            rows: (qr.select.rows || []).map(row => hydrateRow(row, types, this.config.dateHandling))
                        });
                    } else if (qr.dml) {
                        results.push({
                            type: 'DML',
                            rowsAffected: Number(qr.dml.rowsAffected),
                            lastInsertId: Number(qr.dml.lastInsertId)
                        });
                    }
                } else if (r.error) {
                    throw new Error(r.error.message);
                }
            }
        }
        return results;
    }

    async transaction(fn, mode = TransactionMode.TRANSACTION_MODE_DEFERRED) {
        const tx = await this.beginTransaction(mode);
        try {
            const result = await fn(tx);
            await tx.commit();
            return result;
        } catch (e) {
            await tx.rollback();
            throw e;
        }
    }

    close() {
        // Nothing to close for fetch
    }
}

module.exports = DatabaseClient;

// Polyfill btoa used for basic auth
if (typeof btoa === 'undefined') {
    global.btoa = function (str) {
        return Buffer.from(str, 'binary').toString('base64');
    };
}
