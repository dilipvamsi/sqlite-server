/**
 * @file src/Client.js
 */
const {
    toParams,
    resolveArgs,
    hydrateRow,
    normalizeColumnAffinities,
    normalizeDeclaredTypes
} = require('./utils');
const {
    TransactionLockMode,
    RPC
} = require('./constants');
const Transaction = require('./TransactionHandle');

// Polyfill for ReadableStream async iteration if needed (Node 18+ has it native)

class DatabaseClient {
    /**
     * @param { string } address - Base URL(e.g. "http://localhost:50173")
     * @param { string } database - Database name
     * @param { object } config - Configuration options.
     * @param { object } [config.auth] - { type: 'basic' | 'bearer', username, password, token }
     * @param { object } [config.typeParsers] - { bigint: boolean, json: boolean, blob: boolean, date: 'date' | 'string' | 'number' }
     */
    constructor(address, database, config = {}) {
        // Ensure no trailing slash
        this.baseUrl = address.replace(/\/$/, "");
        this.database = database;

        const defaults = {
            retry: { maxRetries: 3, baseDelayMs: 100 },
            interceptors: [],
            auth: null,
            typeParsers: {
                bigint: true,
                json: true,
                blob: true,
                date: 'date'
            }
        };

        this.config = {
            ...defaults,
            ...config,
            typeParsers: {
                ...defaults.typeParsers,
                ...(config.typeParsers || {})
            }
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
    /**
     * Internal generator that yields parsed messages from the stream.
     * @param {ReadableStreamDefaultReader} reader
     */
    async * _fetchStreamIterator(reader) {
        let buffer = new Uint8Array(0);

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
                    return;
                }

                if (flags === 0) {
                    const msg = JSON.parse(msgStr);
                    yield msg;
                }
            }
        }
    }

    /**
     * Initializes a stream request and reads the first message (Header/DML).
     * @returns {Promise<{
     *   iterator: AsyncGenerator<object>,
     *   columns: string[],
     *   columnAffinities: number[],
     *   columnDeclaredTypes: number[],
     *   columnRawTypes: string[],
     *   isDml: boolean,
     *   dmlStats?: { rowsAffected: number, lastInsertId: number }
     * }>}
     */
    async _initStream(rpcPath, bodyObj) {
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
        const iterator = this._fetchStreamIterator(reader);

        // Read first message
        const first = await iterator.next();
        if (first.done) {
            return { iterator, columns: [], columnAffinities: [], columnDeclaredTypes: [], columnRawTypes: [], isDml: false };
        }

        const msg = first.value;

        if (msg.error) {
            throw new Error(msg.error.message);
        }

        if (msg.dml || msg.execResult) {
            const dml = msg.dml || (msg.execResult || {}).dml || {};
            return {
                iterator,
                columns: [],
                columnAffinities: [],
                columnDeclaredTypes: [],
                columnRawTypes: [],
                isDml: true,
                dmlStats: {
                    rowsAffected: Number(dml.rowsAffected || 0),
                    lastInsertId: Number(dml.lastInsertId || 0)
                }
            };
        }

        let columns = [];
        let columnAffinities = [];
        let columnDeclaredTypes = [];
        let columnRawTypes = [];

        if (msg.header) {
            columns = msg.header.columns || [];
            columnAffinities = normalizeColumnAffinities(msg.header.columnAffinities || []);
            columnDeclaredTypes = normalizeDeclaredTypes(msg.header.columnDeclaredTypes || []);
            columnRawTypes = msg.header.columnRawTypes || [];
            // console.log("STREAM HEADER:", { columns, columnAffinities });
        }

        return { iterator, columns, columnAffinities, columnDeclaredTypes, columnRawTypes, isDml: false };
    }

    /**
     * Executes a single query and buffers the results.
     * @param {string|object} sqlOrObj - SQL string or object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
     * @param {object} [hintsOrNull] - Hints.
     * @returns {Promise<object>} Query result.
     */
    async query(sqlOrObj, paramsOrHints, hintsOrNull) {
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            database: this.database,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        const res = await this._fetch(RPC.QUERY, body);
        const text = await res.text();
        const json = JSON.parse(text);

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
                    return hydrateRow(row, affinities, declaredTypes, this.config.typeParsers)
                }),
                stats: json.stats || data.stats
            };
        }

        return { columns: [], columnAffinities: [], columnDeclaredTypes: [], columnRawTypes: [], rows: [] };
    }

    /**
     * Executes a DML statement (INSERT, UPDATE, DELETE) and returns affected row info.
     * Routes strictly to a Read-Write connection.
     *
     * @param {string|object} sqlOrObj - SQL string or SQLStatement object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
     * @param {object} [hintsOrNull] - Hints.
     * @returns {Promise<{rowsAffected: number, lastInsertId: number, stats?: object}>}
     */
    async exec(sqlOrObj, paramsOrHints, hintsOrNull) {
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            database: this.database,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        const res = await this._fetch(RPC.EXEC, body);
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
     *
     * @param {string|object} sqlOrObj - SQL string or object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
     * @param {object} [hintsOrNull] - Hints.
     * @returns {Promise<Array<{id: number, parentId: number, detail: string}>>} List of plan nodes.
     */
    async explain(sqlOrObj, paramsOrHints, hintsOrNull) {
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            database: this.database,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        const res = await this._fetch(RPC.EXPLAIN, body);
        const json = await res.json();

        return json.nodes || [];
    }

    /**
     * Executes a query efficiently returning a stream of rows.
     * Useful for large result sets.
     *
     * @param {string|object} sqlOrObj - SQL string or object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
     * @param {object} [hintsOrNull] - Hints if 2nd arg was params.
     * @returns {Promise<{
     *   columns: string[],
     *   columnAffinities: number[],
     *   columnDeclaredTypes: number[],
     *   columnRawTypes: string[],
     *   rows: AsyncIterable<Array<any>>
     * }>}
     */
    async queryStream(sqlOrObj, paramsOrHints, hintsOrNull) {
        const { sql, positional, named, hints } = resolveArgs(sqlOrObj, paramsOrHints, hintsOrNull);

        const body = {
            database: this.database,
            sql: sql,
            parameters: toParams(positional, named, hints)
        };

        const { iterator, columns, columnAffinities, columnDeclaredTypes, columnRawTypes, isDml } = await this._initStream(RPC.QUERY_STREAM, body);

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
                        return hydrateRow(row, columnAffinities, columnDeclaredTypes, self.config.typeParsers);
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
     * Iterates over query results row by row.
     * Wrapper around queryStream for easier consumption.
     *
     * @param {string|object} sqlOrObj - SQL string or object.
     * @param {object|Array} [paramsOrHints] - Parameters or hints.
     * @param {object} [hintsOrNull] - Hints.
     * @returns {Promise<{columns: string[], columnTypes: number[], rows: AsyncIterable<Array<any>>}>}
     */
    async iterate(sqlOrObj, paramsOrHints, hintsOrNull) {
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

    /**
     * Begins a new transaction.
     * @param {TransactionMode} mode - The transaction mode (default: DEFERRED).
     * @returns {Promise<Transaction>} - The transaction handle.
     */
    async beginTransaction(mode = TransactionLockMode.TRANSACTION_LOCK_MODE_DEFERRED) {
        const body = {
            database: this.database,
            mode: mode
            // timeout can be added
        };

        const res = await this._fetch(RPC.BEGIN_TRANSACTION, body);
        const json = await res.json();

        return new Transaction(this, json.transactionId, this.config);
    }

    /**
     * Executes a list of queries atomically (helper for ExecuteTransaction RPC).
     * @param {Array<string|object>} queries - List of SQL queries.
     * @returns {Promise<Array<object>>} - List of results.
     */
    async executeTransaction(queries) {
        // atomic script
        // Map queries...
        const requests = [];

        // 1. Begin
        requests.push({ begin: { database: this.database, mode: TransactionLockMode.TRANSACTION_LOCK_MODE_DEFERRED } });

        for (const q of queries) {
            if (typeof q !== 'object' || !q.type || !q.sql) {
                throw new Error("Queries for executeTransaction must be objects containing 'sql' and 'type' ('query' or 'exec') properties.");
            }

            const { sql, positional, named, hints } = resolveArgs(q.sql, q.params, q.hints);
            if (q.type === 'query') {
                requests.push({
                    query: {
                        sql,
                        parameters: toParams(positional, named, hints)
                    }
                });
            } else if (q.type === 'exec') {
                requests.push({
                    exec: {
                        sql,
                        parameters: toParams(positional, named, hints)
                    }
                });
            } else {
                throw new Error("Invalid query type in executeTransaction. Supported types: 'query', 'exec'.");
            }
        }

        requests.push({ commit: {} });

        const body = { requests };
        const res = await this._fetch(RPC.EXECUTE_TRANSACTION, body);
        const json = await res.json();

        const results = [];
        if (json.responses) {
            for (const r of json.responses) {
                if (r.queryResult || r.execResult || r.select || r.dml) {
                    const data = r.queryResult || r.select || r;
                    const er = r.execResult || r;
                    const dml = er.dml || data.dml || (er.execResult || {}).dml || {};

                    if (data.columns && data.columns.length > 0) {
                        const affinities = normalizeColumnAffinities(data.columnAffinities || []);
                        const declaredTypes = normalizeDeclaredTypes(data.columnDeclaredTypes || []);
                        results.push({
                            columns: data.columns,
                            columnAffinities: affinities,
                            columnDeclaredTypes: declaredTypes,
                            columnRawTypes: data.columnRawTypes || [],
                            rows: (data.rows || []).map(r => {
                                const row = (r && typeof r === 'object' && !Array.isArray(r) && r.values) ? r.values : r;
                                return hydrateRow(row, affinities, declaredTypes, this.config.typeParsers)
                            }),
                            stats: r.stats || data.stats
                        });
                    } else if (dml.rowsAffected !== undefined || dml.lastInsertId !== undefined) {
                        results.push({
                            dml: {
                                rowsAffected: Number(dml.rowsAffected || 0),
                                lastInsertId: Number(dml.lastInsertId || 0)
                            },
                            stats: r.stats || er.stats
                        });
                    } else {
                        // Empty query result buffer
                        results.push({ columns: [], columnAffinities: [], columnDeclaredTypes: [], columnRawTypes: [], rows: [] });
                    }
                } else if (r.begin || r.commit || r.rollback || r.savepoint) {
                    // Skip purely structural responses in results list
                } else if (r.error) {
                    throw new Error(r.error.message);
                } else {
                    // Fallback for empty/skipped responses
                    results.push({ type: 'UNKNOWN' });
                }
            }
        }
        return results;
    }

    /**
     * Wrapper for running a function within a managed transaction.
     * Auto-commits on success, auto-rollbacks on error.
     *
     * @param {Function} fn - Async function(tx)
     * @param {TransactionMode} mode - Transaction mode.
     * @returns {Promise<any>} - Result of the function.
     */
    async transaction(fn, mode = TransactionLockMode.TRANSACTION_LOCK_MODE_DEFERRED) {
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

    async getDatabaseSchema(database) {
        const req = { database };
        const res = await this._fetch('db.v1.DatabaseService/GetDatabaseSchema', req);
        return res.json();
    }

    /**
     * Triggers a VACUUM command to rebuild the database file.
     * @param {string} [intoFile] - Optional path to create a backup file (VACUUM INTO).
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async vacuum(intoFile) {
        const req = { database: this.database };
        if (intoFile) {
            req.intoFile = intoFile;
        }
        const res = await this._fetch(RPC.VACUUM, req);
        return res.json();
    }

    /**
     * Manages WAL checkpoints.
     * @param {import('./constants').CheckpointMode} mode - The checkpoint mode.
     * @returns {Promise<{success: boolean, message: string, busyCheckpoints: number, logCheckpoints: number, checkpointedPages: number}>}
     */
    async checkpoint(mode) {
        const req = { database: this.database, mode };
        const res = await this._fetch(RPC.CHECKPOINT, req);
        const json = await res.json();
        // Map Int64 to Number for easier usage in JS (assuming values fit in 53 bits)
        return {
            success: json.success,
            message: json.message,
            busyCheckpoints: Number(json.busyCheckpoints),
            logCheckpoints: Number(json.logCheckpoints),
            checkpointedPages: Number(json.checkpointedPages),
        };
    }

    /**
     * Runs an integrity check on the database.
     * @param {number} [maxErrors=100] - Max errors to report.
     * @returns {Promise<{success: boolean, message: string, errors: string[]}>}
     */
    async integrityCheck(maxErrors = 100) {
        const req = { database: this.database, maxErrors };
        const res = await this._fetch(RPC.INTEGRITY_CHECK, req);
        return res.json();
    }

    /**
     * Attaches a managed database.
     * @param {object} options - Attachment configuration.
     * @param {string} options.targetDatabaseName - The logical name of the database to attach.
     * @param {string} options.alias - SQL alias for the attached database.
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async attach(options) {
        const req = {
            parentDatabase: this.database,
            attachment: {
                targetDatabaseName: options.targetDatabaseName,
                alias: options.alias
            }
        };
        const res = await this._fetch(RPC.ATTACH_DATABASE, req);
        return res.json();
    }

    /**
     * Detaches an attached database.
     * @param {string} name - Alias of the database to detach.
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async detach(name) {
        const req = {
            parentDatabase: this.database,
            alias: name
        };
        const res = await this._fetch(RPC.DETACH_DATABASE, req);
        return res.json();
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
