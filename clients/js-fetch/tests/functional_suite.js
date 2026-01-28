/**
 * @file tests/functional_suite.js
 * Port of functional_suite.js to use node:test and the new js-fetch client.
 */
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { TransactionMode, SavepointAction, ColumnType, SQL } = require('../src/index');

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
                const result = await client.query("SELECT 1 + 1 AS sum");
                expect(result.rows[0][0]).toBe(2);
                expect(result.columns).toContain("sum");
            });

            it("BLOB Data Integrity", async () => {
                const binaryData = Buffer.from([0x00, 0xff, 0xaa, 0x55]);

                await client.query("CREATE TABLE IF NOT EXISTS blobs (data BLOB)");
                await client.query("DELETE FROM blobs");

                await client.query(
                    "INSERT INTO blobs (data) VALUES (?)",
                    { positional: [binaryData.toString("base64")] },
                    {
                        positional: {
                            0: ColumnType.COLUMN_TYPE_BLOB,
                        },
                    },
                );

                const result = await client.query("SELECT data FROM blobs LIMIT 1");
                const returnedBuffer = result.rows[0][0];

                assert.ok(Buffer.isBuffer(returnedBuffer), "Expected Buffer");
                assert.ok(returnedBuffer.equals(binaryData), "Buffer mismatch");
            });

            it("Stateless Iteration: Large Result Set", async () => {
                await client.query("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, country TEXT, age INTEGER)");
                await client.query("DELETE FROM users");

                const values = [];
                for (let i = 0; i < 15; i++) {
                    values.push(i, `user_${i}`, 'USA', 20 + i);
                }
                const ph = Array(15).fill("(?, ?, ?, ?)").join(",");

                await client.query(`INSERT INTO users (id, name, country, age) VALUES ${ph}`, { positional: values });

                const { columns, rows } = await client.iterate(
                    "SELECT id FROM users LIMIT 10",
                );
                // expect(columns).toContain("id"); // Not immeditaly available
                expect(columns.isLoaded).toBe(false);

                let count = 0;
                for await (const row of rows) {
                    if (count === 0) {
                        expect(columns.isLoaded).toBe(true);
                        expect(columns).toContain("id");
                    }
                    expect(row[0]).toBeDefined();
                    count++;
                }
                expect(count).toBe(10);
            });

            it("Stateless Iteration: Very Large Result Set (>500)", async () => {
                await client.query("CREATE TABLE IF NOT EXISTS large_users (id INTEGER)");
                await client.query("DELETE FROM large_users");

                const totalRows = 600;
                const batchSize = 100;
                for (let i = 0; i < totalRows; i += batchSize) {
                    const placeholders = Array(batchSize).fill("(?)").join(",");
                    const values = [];
                    for (let j = 0; j < batchSize; j++) {
                        values.push(i + j);
                    }
                    await client.query(`INSERT INTO large_users (id) VALUES ${placeholders}`, { positional: values });
                }

                const { rows } = await client.iterate("SELECT id FROM large_users ORDER BY id");

                let count = 0;
                let lastId = -1;
                for await (const row of rows) {
                    const id = row[0];
                    if (id !== lastId + 1) {
                        throw new Error(`Sequence mismatch at index ${count}: expected ${lastId + 1}, got ${id}`);
                    }
                    lastId = id;
                    count++;
                }
                expect(count).toBe(totalRows);
            });
        });

        describe("Parameter Binding", () => {
            before(async () => {
                await client.query("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, country TEXT, age INTEGER)");
                await client.query("DELETE FROM users");
                await client.query("INSERT INTO users (name, country, age) VALUES ('Alice', 'USA', 30)");
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
                    named: { age: ColumnType.COLUMN_TYPE_INTEGER },
                });
                expect(result.type).toBe("SELECT");
                expect(result.rows.length).toBe(1);
            });

            it("Positional Parameters", async () => {
                const sql = "SELECT name FROM users WHERE country = ? AND age > ? LIMIT 1";
                const params = { positional: ["USA", 25] };
                const result = await client.query(sql, params, {
                    positional: { 1: ColumnType.COLUMN_TYPE_INTEGER },
                });
                expect(result.type).toBe("SELECT");
                expect(result.rows.length).toBe(1);
            });

            it("Mixed Mode (Named and Positional)", async () => {
                const sql = "SELECT name FROM users WHERE country = :country AND age > ? LIMIT 1";
                const params = {
                    named: { country: "USA" },
                    positional: [25],
                };
                const hints = {
                    positional: { 0: ColumnType.COLUMN_TYPE_INTEGER },
                };

                const result = await client.query(sql, params, hints);
                expect(result.type).toBe("SELECT");
                expect(result.rows.length).toBe(1);
            });
        });

        describe("Atomic Transaction Script", () => {
            it("Successful Atomic Transaction", async () => {
                await client.query("CREATE TABLE IF NOT EXISTS script_tx (id INTEGER)");
                await client.query("DELETE FROM script_tx");

                const queries = [
                    "INSERT INTO script_tx (id) VALUES (100)",
                    "INSERT INTO script_tx (id) VALUES (101)",
                    SQL`UPDATE script_tx SET id = id + 1`,
                ];

                const results = await client.executeTransaction(queries);
                expect(results.length).toBe(3);
                expect(results[0].rowsAffected).toBe(1);
                expect(results[1].rowsAffected).toBe(1);
            });

            it("Atomic Rollback on Failure", async () => {
                await client.query("CREATE TABLE IF NOT EXISTS script_fail (id INTEGER PRIMARY KEY)");
                await client.query("DELETE FROM script_fail");
                await client.query("INSERT INTO script_fail (id) VALUES (50)");

                const queries = [
                    "INSERT INTO script_fail (id) VALUES (51)",
                    "INSERT INTO script_fail (id) VALUES (50)", // FAIL: PK
                    "INSERT INTO script_fail (id) VALUES (52)",
                ];

                await assert.rejects(async () => await client.executeTransaction(queries));

                const check = await client.query("SELECT id FROM script_fail ORDER BY id");
                expect(check.rows.length).toBe(1);
                expect(check.rows[0][0]).toBe(50);
            });
        });

        describe("Transaction Support (Unary/ID-Based)", () => {
            it("Full ACID Workflow: Begin -> Savepoint -> Rollback -> Commit", async () => {
                const tx = await client.beginTransaction(
                    TransactionMode.TRANSACTION_MODE_IMMEDIATE
                );

                await client.query("CREATE TABLE IF NOT EXISTS accounts (id INTEGER, balance INTEGER)");
                await client.query("DELETE FROM accounts");

                await tx.query("INSERT INTO accounts (id, balance) VALUES (999, 1000)");
                await tx.savepoint("sp1", SavepointAction.SAVEPOINT_ACTION_CREATE);

                await tx.query("UPDATE accounts SET balance = 500 WHERE id = 999");

                const rbRes = await tx.savepoint("sp1", SavepointAction.SAVEPOINT_ACTION_ROLLBACK);
                expect(rbRes.success).toBe(true);

                await tx.commit();

                const res = await client.query("SELECT balance FROM accounts WHERE id = 999");
                expect(res.rows[0][0]).toBe(1000);
            });

            it("Transaction Wrapper: Auto-rollback on error", async () => {
                const tableName = "wrapper_test_unary";
                await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER)`);
                await client.query(`DELETE FROM ${tableName}`);

                const t = async () => {
                    await client.transaction(async (tx) => {
                        await tx.query(`INSERT INTO ${tableName} (id) VALUES (3)`);
                        throw new Error("Trigger Rollback");
                    }, TransactionMode.TRANSACTION_MODE_DEFERRED);
                };

                await expect(t()).rejects.toThrow("Trigger Rollback");

                const count = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
                expect(count.rows[0][0]).toBe(0);
            });

            it("Streaming: iterate() and queryStream()", async () => {
                const tableName = "stream_test_unary";
                await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER)`);
                await client.query(`DELETE FROM ${tableName}`);

                const tx = await client.beginTransaction(TransactionMode.TRANSACTION_MODE_DEFERRED);
                await tx.query(`INSERT INTO ${tableName} (id) VALUES (1), (2), (3)`);

                let sum = 0;
                const { rows: iterRows } = await tx.iterate(`SELECT id FROM ${tableName}`);
                for await (const row of iterRows) {
                    sum += row[0];
                }
                expect(sum).toBe(6);

                // Test queryStream
                const { rows: batches } = await tx.queryStream(`SELECT id FROM ${tableName}`);
                let count = 0;
                for await (const batch of batches) {
                    count += batch.length;
                }
                expect(count).toBe(3);

                await tx.commit();
            });
        });
    });
}

module.exports = { runFunctionalTests };
