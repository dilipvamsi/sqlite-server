/**
 * @file tests/functional_suite.js
 * Port of functional_suite.js to use node:test and the new js-fetch client.
 */
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { TransactionLockMode, SavepointAction, ColumnAffinity, DeclaredType, SQL, CheckpointMode } = require('../src/index');

// --- Shim Jest 'expect' to node:assert ---
function expect(actual) {
    return {
        toBe: (expected) => assert.strictEqual(actual, expected),
        toEqual: (expected) => assert.deepStrictEqual(actual, expected),
        toContain: (expected) => {
            if (Array.isArray(actual)) {
                assert.ok(actual.includes(expected), `Expected array to contain ${expected}`);
            } else {
                assert.ok(String(actual).includes(expected), `Expected ${actual} to contain ${expected}`);
            }
        },
        toBeDefined: () => assert.notStrictEqual(actual, undefined),
        toBeUndefined: () => assert.strictEqual(actual, undefined),
        resolves: {
            toBe: async (expected) => assert.strictEqual(await actual, expected),
            toThrow: async (msg) => {
                // Not standard jest, but close enough for our usage
                await assert.rejects(async () => await actual, msg ? { message: msg } : undefined);
            }
        },
        rejects: {
            toThrow: async (msg) => {
                await assert.rejects(async () => await actual, msg ? { message: msg } : undefined);
            }
        }
    };
}

function runFunctionalTests(createClientFn, suiteConfig = {}) {
    describe(suiteConfig.suiteName || "Functional Suite (js-fetch)", () => {
        let client;

        before(async () => {
            client = await createClientFn();
            const config = client.config;
            let authInfo = "No Auth";
            if (config.auth) authInfo = `${config.auth.type} Auth`;
            console.log(`Client connected to ${client.baseUrl} [${authInfo}]`);
        });

        after(() => {
            // client.close();
        });

        describe("Basic Queries", () => {
            it("Unary Query: SELECT", async () => {
                const res = await client.query("SELECT 1+1 AS result");
                console.log("UNARY QUERY RESULT:", JSON.stringify(res, null, 2));
                const { rows } = res;
                expect(rows).toBeDefined();
                expect(rows.length).toBe(1);
                expect(rows[0][0]).toBe(2);
            });

            it("BLOB Data Integrity", async () => {
                const binaryData = Buffer.from([0x00, 0xff, 0xaa, 0x55]);

                await client.exec("CREATE TABLE IF NOT EXISTS blobs (data BLOB)");
                await client.exec("DELETE FROM blobs");

                // 1. Pass Buffer directly - Client should auto-convert to base64
                await client.exec(
                    "INSERT INTO blobs (data) VALUES (?)",
                    { positional: [binaryData] }
                );

                // 2. Pass String with BLOB hint - Client should convert string bytes to base64
                const stringData = "hello blob"; // "don't use binary string"
                const stringBuf = Buffer.from(stringData);

                await client.exec(
                    "INSERT INTO blobs (data) VALUES (?)",
                    { positional: [stringData] },
                    {
                        positional: {
                            0: ColumnAffinity.COLUMN_AFFINITY_BLOB,
                        },
                    },
                );

                const result = await client.query("SELECT data FROM blobs");
                expect(result.rows.length).toBe(2);

                const buf1 = result.rows[0][0];
                const buf2 = result.rows[1][0];

                assert.strictEqual(Buffer.compare(buf1, binaryData), 0, "Buffer 1 mismatch");

                assert.ok(Buffer.isBuffer(buf2), "Expected Buffer 2");
                assert.ok(buf2.equals(stringBuf), "Buffer 2 mismatch");
            });

            it("Stateless Iteration: Large Result Set", async () => {
                await client.query("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, country TEXT, age INTEGER)");
                await client.query("DELETE FROM users");

                const values = [];
                for (let i = 0; i < 15; i++) {
                    values.push(i, `user_${i}`, 'USA', 20 + i);
                }
                const ph = Array(15).fill("(?, ?, ?, ?)").join(",");

                await client.exec(`INSERT INTO users (id, name, country, age) VALUES ${ph}`, { positional: values });

                // Verify DML result shape
                const dmlResult = await client.exec("UPDATE users SET age = age + 1 WHERE id = 1");
                assert.ok(dmlResult.dml && dmlResult.dml.rowsAffected >= 0, "Expected rowsAffected to be defined");

                const { columns, columnAffinities, rows } = await client.iterate(
                    "SELECT id FROM users LIMIT 10",
                );
                expect(columns).toContain("id");

                // Verify columnAffinities is defined and has correct type for 'id' (INTEGER = 1)
                expect(columnAffinities).toBeDefined();
                expect(columnAffinities.length).toBe(1);
                // ColumnAffinity.COLUMN_AFFINITY_INTEGER is 1
                expect(columnAffinities[0]).toBe(ColumnAffinity.COLUMN_AFFINITY_INTEGER);

                let count = 0;
                for await (const row of rows) {
                    expect(row[0]).toBeDefined();
                    count++;
                }
                expect(count).toBe(10);
            });

            it("Stateless Iteration: Very Large Result Set (>500)", async () => {
                await client.exec("CREATE TABLE IF NOT EXISTS large_users (id INTEGER)");
                await client.exec("DELETE FROM large_users");

                const totalRows = 600;
                const batchSize = 100;
                for (let i = 0; i < totalRows; i += batchSize) {
                    const placeholders = Array(batchSize).fill("(?)").join(",");
                    const values = [];
                    for (let j = 0; j < batchSize; j++) {
                        values.push(i + j);
                    }
                    await client.exec(`INSERT INTO large_users (id) VALUES ${placeholders}`, { positional: values });
                }

                const { rows } = await client.iterate("SELECT id FROM large_users ORDER BY id");

                let count = 0;
                let lastId = -1;
                for await (const row of rows) {
                    const id = Number(row[0]);
                    if (id !== lastId + 1) {
                        throw new Error(`Sequence mismatch at index ${count}: expected ${lastId + 1}, got ${id}`);
                    }
                    lastId = id;
                    count++;
                }
                expect(count).toBe(totalRows);
            });

            it("Stateless Streaming: queryStream", async () => {
                await client.exec("CREATE TABLE IF NOT EXISTS stream_users (id INTEGER)");
                await client.exec("DELETE FROM stream_users");
                await client.exec("INSERT INTO stream_users (id) VALUES (1), (2), (3)");

                const { columns, columnAffinities, rows } = await client.queryStream("SELECT id FROM stream_users");
                expect(columns).toContain("id");
                expect(columnAffinities).toBeDefined();
                expect(columnAffinities[0]).toBe(ColumnAffinity.COLUMN_AFFINITY_INTEGER);

                let count = 0;
                for await (const batch of rows) {
                    count += batch.length;
                }
                expect(count).toBe(3);
            });

            it("DML with query() should yield no rows per QueryResult", async () => {
                await client.exec("CREATE TABLE IF NOT EXISTS query_dml_test (id INTEGER)");
                const res = await client.query("INSERT INTO query_dml_test (id) VALUES (1)");
                assert.ok(!res.type);
                assert.ok(Array.isArray(res.columns) && res.columns.length === 0);
                assert.ok(Array.isArray(res.rows) && res.rows.length === 0);
            });

            it("EXPLAIN QUERY PLAN", async () => {
                const nodes = await client.explain("SELECT * FROM users WHERE id = ?", { positional: [1] });
                assert.ok(Array.isArray(nodes), "Expected array of nodes");
                assert.ok(nodes.length > 0, "Expected at least one node");
                assert.ok('id' in nodes[0], "Expected id field");
                // parentId might be omitted if it's 0 (default) in JSON
                assert.ok('detail' in nodes[0], "Expected detail field");
                assert.match(nodes[0].detail.toLowerCase(), /search|scan/, "Expected search or scan in detail");
            });
        });

        describe("Exec (DML Write Endpoint)", () => {
            before(async () => {
                await client.query("CREATE TABLE IF NOT EXISTS exec_test (id INTEGER PRIMARY KEY, value TEXT)");
                await client.query("DELETE FROM exec_test");
            });

            it("exec: INSERT returns rowsAffected and lastInsertId", async () => {
                const result = await client.exec(
                    "INSERT INTO exec_test (id, value) VALUES (?, ?)",
                    { positional: [1, "hello"] },
                );
                expect(result.dml.rowsAffected).toBe(1);
                expect(result.dml.lastInsertId).toBe(1);
            });

            it("exec: UPDATE returns correct rowsAffected", async () => {
                await client.exec("INSERT INTO exec_test (id, value) VALUES (2, 'world')");
                const result = await client.exec(
                    "UPDATE exec_test SET value = 'updated' WHERE id <= 2",
                );
                expect(result.dml.rowsAffected).toBe(2);
            });

            it("exec: DELETE returns correct rowsAffected", async () => {
                const result = await client.exec(
                    "DELETE FROM exec_test WHERE id = ?",
                    { positional: [1] },
                );
                expect(result.dml.rowsAffected).toBe(1);
            });

            it("exec: result shape has rowsAffected and lastInsertId", async () => {
                await client.exec("DELETE FROM exec_test");
                const result = await client.exec("INSERT INTO exec_test (id, value) VALUES (100, 'abc')");
                assert.ok(result.dml, 'Missing dml object');
                assert.ok(Object.prototype.hasOwnProperty.call(result.dml, 'rowsAffected'), 'Missing rowsAffected');
                assert.ok(Object.prototype.hasOwnProperty.call(result.dml, 'lastInsertId'), 'Missing lastInsertId');
                expect(typeof result.dml.rowsAffected).toBe('number');
                expect(typeof result.dml.lastInsertId).toBe('number');
                expect(result.dml.lastInsertId).toBe(100);
            });

            it("exec: SQL template tag works", async () => {
                await client.exec("DELETE FROM exec_test");
                const id = 42;
                const val = 'template';
                const result = await client.exec(SQL`INSERT INTO exec_test (id, value) VALUES (${id}, ${val})`);
                expect(result.dml.rowsAffected).toBe(1);
                expect(result.dml.lastInsertId).toBe(42);
            });
        });

        describe("DeclaredType Verification", () => {
            it("Correctly identifies specialized types", async () => {
                await client.exec("DROP TABLE IF EXISTS dtypes_fetch");
                await client.exec("CREATE TABLE IF NOT EXISTS dtypes_fetch (id UUID, meta JSON, age INTEGER, name VARCHAR(255))");
                await client.exec("DELETE FROM dtypes_fetch");
                await client.exec("INSERT INTO dtypes_fetch (id, meta, age, name) VALUES ('u-1', '{\"a\":1}', 30, 'Alice')");

                const result = await client.query("SELECT id, meta, age, name FROM dtypes_fetch LIMIT 1");

                expect(result.columnDeclaredTypes).toBeDefined();
                expect(result.columnDeclaredTypes.length).toBe(4);

                // 1. UUID -> DECLARED_TYPE_UUID
                expect(result.columnDeclaredTypes[0]).toBe(DeclaredType.DECLARED_TYPE_UUID);

                // 2. JSON -> DECLARED_TYPE_JSON
                expect(result.columnDeclaredTypes[1]).toBe(DeclaredType.DECLARED_TYPE_JSON);

                // 3. INT -> DECLARED_TYPE_INTEGER
                expect(result.columnDeclaredTypes[2]).toBe(DeclaredType.DECLARED_TYPE_INTEGER);

                // 4. VARCHAR(255) -> DECLARED_TYPE_VARCHAR
                expect(result.columnDeclaredTypes[3]).toBe(DeclaredType.DECLARED_TYPE_VARCHAR);

                // Verify raw types as well
                expect(result.columnRawTypes).toBeDefined();
                expect(result.columnRawTypes[0]).toBe("UUID");
                expect(result.columnRawTypes[3]).toBe("VARCHAR(255)");
            });

            it("Correctly handles BigInt values", async () => {
                const tableName = "bigint_test_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (id BIGINT)`);
                await client.exec(`DELETE FROM ${tableName}`);

                // Insert a value larger than 2^53 - 1 but within Int64
                const bigVal = 9223372036854775800n;
                await client.exec(`INSERT INTO ${tableName} (id) VALUES (?)`, {
                    positional: [bigVal]
                });

                const result = await client.query(`SELECT id FROM ${tableName} LIMIT 1`);
                expect(result.columnDeclaredTypes[0]).toBe(DeclaredType.DECLARED_TYPE_BIGINT);

                const id = result.rows[0][0];
                expect(typeof id).toBe('bigint');
                expect(id).toBe(bigVal);
            });

            it("Correctly parses JSON values", async () => {
                const tableName = "json_test_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (id INT, data JSON)`);
                await client.exec(`DELETE FROM ${tableName}`);

                const jsonData = { foo: "bar", baz: 123, nested: { array: [1, 2] } };
                const jsonStr = JSON.stringify(jsonData);

                await client.exec(`INSERT INTO ${tableName} (id, data) VALUES (1, ?)`, {
                    positional: [jsonStr]
                });

                const result = await client.query(`SELECT data FROM ${tableName} LIMIT 1`);

                expect(result.columnDeclaredTypes[0]).toBe(DeclaredType.DECLARED_TYPE_JSON);

                const data = result.rows[0][0];

                expect(typeof data).toBe('object');
                expect(data).toEqual(jsonData);
            });

            it("Date Verification", async () => {
                const tableName = "date_test_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER, d DATE, dt DATETIME)`);
                await client.exec(`DELETE FROM ${tableName}`);

                const now = new Date();
                const nowStr = now.toISOString();

                await client.exec(`INSERT INTO ${tableName} (id, d, dt) VALUES (1, ?, ?)`, {
                    positional: [now, now]
                });

                const result = await client.query(`SELECT d, dt FROM ${tableName} LIMIT 1`);

                // Check Declared Types
                expect(result.columnDeclaredTypes).toBeDefined();
                expect(result.columnDeclaredTypes[0]).toBe(DeclaredType.DECLARED_TYPE_DATE);
                expect(result.columnDeclaredTypes[1]).toBe(DeclaredType.DECLARED_TYPE_DATETIME);

                // Check Hydration (Default is Date object)
                const row = result.rows[0];
                assert.ok(row[0] instanceof Date, "Expected Date object for DATE column");
                assert.ok(row[1] instanceof Date, "Expected Date object for DATETIME column");
                expect(row[0].toISOString()).toBe(nowStr);
            });
        });

        describe("Parsing Configuration", () => {
            it("Disable BigInt Parsing", async () => {
                const tableName = "bigint_parse_off_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (id BIGINT)`);
                await client.exec(`DELETE FROM ${tableName}`);

                const bigValStr = "9223372036854775800";
                await client.exec(`INSERT INTO ${tableName} (id) VALUES (?)`, { positional: [bigValStr] });

                const originalSetting = client.config.typeParsers.bigint;
                client.config.typeParsers.bigint = false;
                try {
                    const result = await client.query(`SELECT id FROM ${tableName} LIMIT 1`);
                    expect(result.rows[0][0]).toBe(bigValStr);
                    expect(typeof result.rows[0][0]).toBe('string');
                } finally {
                    client.config.typeParsers.bigint = originalSetting;
                }
            });

            it("Disable JSON Parsing", async () => {
                const tableName = "json_parse_off_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (data JSON)`);
                await client.exec(`DELETE FROM ${tableName}`);

                const jsonData = { foo: "bar" };
                const jsonStr = JSON.stringify(jsonData);
                await client.exec(`INSERT INTO ${tableName} (data) VALUES (?)`, { positional: [jsonStr] });

                const originalSetting = client.config.typeParsers.json;
                client.config.typeParsers.json = false;
                try {
                    const result = await client.query(`SELECT data FROM ${tableName} LIMIT 1`);
                    expect(result.rows[0][0]).toBe(jsonStr);
                    expect(typeof result.rows[0][0]).toBe('string');
                } finally {
                    client.config.typeParsers.json = originalSetting;
                }
            });

            it("Date as String", async () => {
                const tableName = "date_parse_string_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (d DATE)`);
                await client.exec(`DELETE FROM ${tableName}`);

                const nowStr = new Date().toISOString();
                await client.exec(`INSERT INTO ${tableName} (d) VALUES (?)`, { positional: [nowStr] });

                const originalSetting = client.config.typeParsers.date;
                client.config.typeParsers.date = 'string';
                try {
                    const result = await client.query(`SELECT d FROM ${tableName} LIMIT 1`);
                    // Server may strip trailing zeros, so check prefix match
                    expect(result.rows[0][0].startsWith(nowStr.slice(0, 19))).toBe(true);
                    expect(typeof result.rows[0][0]).toBe('string');
                } finally {
                    client.config.typeParsers.date = originalSetting;
                }
            });

            it("Date as Number", async () => {
                const tableName = "date_parse_number_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (d DATE)`);
                await client.exec(`DELETE FROM ${tableName}`);

                const now = new Date();
                const nowStr = now.toISOString();
                const nowTs = now.getTime();

                await client.exec(`INSERT INTO ${tableName} (d) VALUES (?)`, { positional: [nowStr] });

                const originalSetting = client.config.typeParsers.date;
                client.config.typeParsers.date = 'number';
                try {
                    const result = await client.query(`SELECT d FROM ${tableName} LIMIT 1`);
                    expect(result.rows[0][0]).toBe(nowTs);
                    expect(typeof result.rows[0][0]).toBe('number');
                } finally {
                    client.config.typeParsers.date = originalSetting;
                }
            });

            it("Disable BLOB Parsing", async () => {
                const tableName = "blob_parse_off_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (data BLOB)`);
                await client.exec(`DELETE FROM ${tableName}`);

                // Use X'...' hex literal for inserting BLOB data
                await client.exec(`INSERT INTO ${tableName} (data) VALUES (X'01020304')`);

                const originalSetting = client.config.typeParsers.blob;
                client.config.typeParsers.blob = false;
                try {
                    const result = await client.query(`SELECT data FROM ${tableName} LIMIT 1`);
                    // Should be base64 string instead of Buffer
                    expect(typeof result.rows[0][0]).toBe('string');
                } finally {
                    client.config.typeParsers.blob = originalSetting;
                }
            });

            it("Multiple parsers disabled simultaneously", async () => {
                const tableName = "multi_parse_off_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (id BIGINT, data JSON)`);
                await client.exec(`DELETE FROM ${tableName}`);

                const bigValStr = "9223372036854775800";
                const jsonData = { key: "value" };
                const jsonStr = JSON.stringify(jsonData);

                await client.exec(`INSERT INTO ${tableName} (id, data) VALUES (?, ?)`, {
                    positional: [bigValStr, jsonStr]
                });

                const origBigint = client.config.typeParsers.bigint;
                const origJson = client.config.typeParsers.json;
                client.config.typeParsers.bigint = false;
                client.config.typeParsers.json = false;
                try {
                    const result = await client.query(`SELECT id, data FROM ${tableName} LIMIT 1`);
                    expect(typeof result.rows[0][0]).toBe('string');
                    expect(result.rows[0][0]).toBe(bigValStr);
                    expect(typeof result.rows[0][1]).toBe('string');
                    expect(result.rows[0][1]).toBe(jsonStr);
                } finally {
                    client.config.typeParsers.bigint = origBigint;
                    client.config.typeParsers.json = origJson;
                }
            });

            it("TypeParsers apply to streaming (iterate)", async () => {
                const tableName = "stream_parse_test_fetch";
                await client.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (data JSON)`);
                await client.exec(`DELETE FROM ${tableName}`);

                const jsonData = { stream: true };
                const jsonStr = JSON.stringify(jsonData);
                await client.exec(`INSERT INTO ${tableName} (data) VALUES (?)`, { positional: [jsonStr] });

                const originalSetting = client.config.typeParsers.json;
                client.config.typeParsers.json = false;
                try {
                    const { rows } = await client.iterate(`SELECT data FROM ${tableName}`);
                    for await (const row of rows) {
                        expect(typeof row[0]).toBe('string');
                        expect(row[0]).toBe(jsonStr);
                    }
                } finally {
                    client.config.typeParsers.json = originalSetting;
                }
            });

            it("TypeParsers within transaction", async () => {
                const tableName = "tx_parse_test_fetch";

                const originalSetting = client.config.typeParsers.bigint;
                client.config.typeParsers.bigint = false;
                try {
                    await client.transaction(async (tx) => {
                        await tx.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (id BIGINT)`);
                        await tx.exec(`DELETE FROM ${tableName}`);
                        await tx.exec(`INSERT INTO ${tableName} (id) VALUES (?)`, { positional: ["9223372036854775800"] });
                        const result = await tx.query(`SELECT id FROM ${tableName} LIMIT 1`);
                        expect(typeof result.rows[0][0]).toBe('string');
                    });
                } finally {
                    client.config.typeParsers.bigint = originalSetting;
                }
            });
        });

        describe("Parameter Binding", () => {
            before(async () => {
                await client.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, country TEXT, age INTEGER)");
                await client.exec("DELETE FROM users");
                await client.exec("INSERT INTO users (name, country, age) VALUES ('Alice', 'USA', 30)");
            });

            it("Named Parameters", async () => {
                const sql = "SELECT name FROM users WHERE country = :country AND age > :age LIMIT 1";
                const params = {
                    named: {
                        country: "USA",
                        age: 25,
                    },
                };
                const result = await client.query(sql, params, {
                    named: { age: ColumnAffinity.COLUMN_AFFINITY_INTEGER },
                });
                assert.ok(!result.type, 'Should not have type property');
                expect(result.rows.length).toBe(1);
            });

            it("Positional Parameters", async () => {
                const sql = "SELECT name FROM users WHERE country = ? AND age > ? LIMIT 1";
                const params = { positional: ["USA", 25] };
                const result = await client.query(sql, params, {
                    positional: { 1: ColumnAffinity.COLUMN_AFFINITY_INTEGER },
                });
                assert.ok(!result.type, 'Should not have type property');
                expect(result.rows.length).toBe(1);
            });

            it("Mixed Mode (Named and Positional)", async () => {
                const sql = "SELECT name FROM users WHERE country = :country AND age > ? LIMIT 1";
                const params = {
                    named: { country: "USA" },
                    positional: [25],
                };
                const hints = {
                    positional: { 0: ColumnAffinity.COLUMN_AFFINITY_INTEGER },
                };

                const result = await client.query(sql, params, hints);
                assert.ok(!result.type, 'Should not have type property');
                expect(result.rows.length).toBe(1);
            });
        });

        describe("Atomic Transaction Script", () => {
            it("Successful Atomic Transaction", async () => {
                await client.exec("CREATE TABLE IF NOT EXISTS script_tx (id INTEGER)");
                await client.exec("DELETE FROM script_tx");

                const queries = [
                    { type: 'exec', sql: "INSERT INTO script_tx (id) VALUES (100)" },
                    { type: 'exec', sql: "INSERT INTO script_tx (id) VALUES (101)" },
                    { type: 'exec', sql: "UPDATE script_tx SET id = id + 1" },
                ];

                const results = await client.executeTransaction(queries);
                expect(results.length).toBe(3);

                // executeTransaction returns an array of QueryResult/ExecResponse shapes.
                expect(results[0].dml.rowsAffected).toBe(1);
                expect(results[1].dml.rowsAffected).toBe(1);
            });

            it("Atomic Rollback on Failure", async () => {
                await client.exec("CREATE TABLE IF NOT EXISTS script_fail (id INTEGER PRIMARY KEY)");
                await client.exec("DELETE FROM script_fail");
                await client.exec("INSERT INTO script_fail (id) VALUES (50)");

                const queries = [
                    { type: 'exec', sql: "INSERT INTO script_fail (id) VALUES (51)" },
                    { type: 'exec', sql: "INSERT INTO script_fail (id) VALUES (50)" } // duplicate key error
                ];

                await assert.rejects(async () => await client.executeTransaction(queries));

                const check = await client.query("SELECT id FROM script_fail ORDER BY id");
                expect(check.rows.length).toBe(1);
                expect(Number(check.rows[0][0])).toBe(50);
            });
        });

        describe("Transaction Support (Unary/ID-Based)", () => {
            it("Full ACID Workflow: Begin -> Savepoint -> Rollback -> Commit", async () => {
                const tx = await client.beginTransaction(
                    TransactionLockMode.TRANSACTION_LOCK_MODE_IMMEDIATE
                );

                await client.exec("CREATE TABLE IF NOT EXISTS accounts (id INTEGER, balance INTEGER)");
                await client.exec("DELETE FROM accounts");

                await tx.exec("INSERT INTO accounts (id, balance) VALUES (999, 1000)");
                await tx.savepoint("sp1", SavepointAction.SAVEPOINT_ACTION_CREATE);

                await tx.exec("UPDATE accounts SET balance = 500 WHERE id = 999");

                const rbRes = await tx.savepoint("sp1", SavepointAction.SAVEPOINT_ACTION_ROLLBACK);
                expect(rbRes.success).toBe(true);

                await tx.commit();

                const res = await client.query("SELECT balance FROM accounts WHERE id = 999");
                expect(Number(res.rows[0][0])).toBe(1000);
            });

            it("Transaction Wrapper: Auto-rollback on error", async () => {
                const tableName = "wrapper_test_unary";
                await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER)`);
                await client.query(`DELETE FROM ${tableName}`);

                const t = async () => {
                    await client.transaction(async (tx) => {
                        await tx.query(`INSERT INTO ${tableName} (id) VALUES (3)`);
                        throw new Error("Trigger Rollback");
                    }, TransactionLockMode.TRANSACTION_LOCK_MODE_DEFERRED);
                };

                await expect(t()).rejects.toThrow("Trigger Rollback");

                const count = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
                expect(count.rows[0][0]).toBe(0);
            });

            it("Streaming: iterate() and queryStream()", async () => {
                const tableName = "stream_test_unary";
                await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER)`);
                await client.query(`DELETE FROM ${tableName}`);

                const tx = await client.beginTransaction(TransactionLockMode.TRANSACTION_LOCK_MODE_DEFERRED);
                await tx.exec(`INSERT INTO ${tableName} (id) VALUES (1), (2), (3)`);

                // Test iterate
                let sum = 0;
                const { rows: iterRows, columnAffinities: iterTypes } = await tx.iterate(`SELECT id FROM ${tableName}`);
                expect(iterTypes).toBeDefined();
                expect(iterTypes[0]).toBe(ColumnAffinity.COLUMN_AFFINITY_INTEGER);

                for await (const row of iterRows) {
                    sum += Number(row[0]);
                }
                expect(sum).toBe(6);

                // Test queryStream
                const { rows: batches, columnAffinities: streamTypes } = await tx.queryStream(`SELECT id FROM ${tableName}`);
                expect(streamTypes).toBeDefined();
                expect(streamTypes[0]).toBe(ColumnAffinity.COLUMN_AFFINITY_INTEGER);

                let count = 0;
                for await (const batch of batches) {
                    count += batch.length;
                }
                expect(count).toBe(3);

                await tx.commit();
            });
        });

        describe("Maintenance RPCs", () => {
            it("VACUUM", async () => {
                const res = await client.vacuum();
                expect(res.success).toBe(true);
            });

            it("CHECKPOINT", async () => {
                // Perform some writes to ensure WAL activity
                await client.query("CREATE TABLE IF NOT EXISTS cp_test (id INTEGER)");
                await client.query("INSERT INTO cp_test (id) VALUES (1)");

                // PASSIVE = 1
                const res = await client.checkpoint(CheckpointMode.CHECKPOINT_MODE_PASSIVE);
                expect(res.success).toBe(true);
                // Depending on wal state, logCheckpoints might be > 0
                expect(res.logCheckpoints).toBeDefined();
            });

            it("INTEGRITY_CHECK", async () => {
                const res = await client.integrityCheck();
                expect(res.success).toBe(true);
                if (res.errors) {
                    expect(res.errors.length).toBe(0);
                } else {
                    expect(res.errors).toBeUndefined();
                }
            });
        });

        describe("Attached Databases", () => {
            it("Attach and Detach Database (Managed)", async () => {
                // We use 'loadtest-mixed' as the target database, which should be pre-configured on the server.
                // This assumes the server is running with 'loadtest-mixed' managed database.
                const dbName = "loadtest-mixed";
                const alias = "ext_db_js_fetch";
                const attachRes = await client.attach({
                    alias,
                    targetDatabaseName: dbName
                });
                assert.strictEqual(attachRes.success, true);

                // Verify it's attached by querying its schema
                const result = await client.query(`SELECT name FROM ${alias}.sqlite_master LIMIT 1`);
                assert.ok(!result.type, 'Should not have type property');

                // Detach it
                const detachRes = await client.detach(alias);
                expect(detachRes.success).toBe(true);

                // Verify it's detached
                await expect(client.query(`SELECT name FROM ${alias}.sqlite_master`)).rejects.toThrow();

            });
        });
    });
}

module.exports = { runFunctionalTests };
