const {
    TransactionMode,
    SavepointAction,
    TransactionType,
} = require("../src/lib/constants");
const db_service_pb = require("../src/protos/db/v1/db_service_pb");
const { SQL } = require("../src");

/**
 * Runs the standard functional verification suite against a client instance.
 * @param {function(): Promise<import('../src/lib/DatabaseClient')>} createClientFn - async factory that returns a CONNECTED client.
 */
function runFunctionalTests(createClientFn) {
    let client;

    // We need a fresh client for each test block or at least for the suite.
    // The caller manages the client lifecycle before/after all if needed,
    // but here we might assume we get a client that is ready.
    // To keep it simple, we ask for a client in beforeAll.

    beforeAll(async () => {
        client = await createClientFn();
    });

    afterAll(() => {
        if (client) client.close();
    });

    describe("Basic Queries", () => {
        test("Unary Query: SELECT", async () => {
            const result = await client.query("SELECT 1 + 1 AS sum");
            expect(result.rows[0][0]).toBe(2);
            expect(result.columns).toContain("sum");
        });

        test("BLOB Data Integrity", async () => {
            const binaryData = Buffer.from([0x00, 0xff, 0xaa, 0x55]);

            await client.query("CREATE TABLE IF NOT EXISTS blobs (data BLOB)");
            await client.query("DELETE FROM blobs"); // Clean up

            await client.query(
                "INSERT INTO blobs (data) VALUES (?)",
                { positional: [binaryData.toString("base64")] },
                {
                    positional: {
                        0: db_service_pb.ColumnType.COLUMN_TYPE_BLOB,
                    },
                },
            );

            const result = await client.query("SELECT data FROM blobs LIMIT 1");
            const returnedBuffer = result.rows[0][0];

            expect(Buffer.isBuffer(returnedBuffer)).toBe(true);
            expect(returnedBuffer.equals(binaryData)).toBe(true);
        });

        test("Stateless Iteration: Large Result Set", async () => {
            // Ensure data exists
            await client.query("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, country TEXT, age INTEGER)");
            await client.query("DELETE FROM users");
            // Insert 15 rows
            const values = [];
            for (let i = 0; i < 15; i++) {
                values.push(i, `user_${i}`, 'USA', 20 + i);
            }
            const placeholders = Array(15).fill("(?, ?, ?, ?)").join(",");
            await client.query(`INSERT INTO users (id, name, country, age) VALUES ${placeholders}`, { positional: values });

            const { columns, rows } = await client.iterate(
                "SELECT id FROM users LIMIT 10",
            );
            expect(columns).toContain("id");

            let count = 0;
            for await (const row of rows) {
                expect(row[0]).toBeDefined();
                count++;
            }
            expect(count).toBe(10);
        });
    });

    describe("Parameter Binding", () => {
        beforeAll(async () => {
            // Setup data
            await client.query("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, country TEXT, age INTEGER)");
            await client.query("DELETE FROM users");
            await client.query("INSERT INTO users (name, country, age) VALUES ('Alice', 'USA', 30)");
        });

        test("Named Parameters", async () => {
            const sql =
                "SELECT name FROM users WHERE country = :country AND age > :age LIMIT 1";

            const params = {
                named: {
                    country: "USA",
                    age: 25,
                },
            };

            const result = await client.query(sql, params, {
                named: { age: db_service_pb.ColumnType.COLUMN_TYPE_INTEGER },
            });

            expect(result.type).toBe("SELECT");
            expect(result.rows.length).toBe(1);
        });

        test("Positional Parameters", async () => {
            const sql = "SELECT name FROM users WHERE country = ? AND age > ? LIMIT 1";

            const params = { positional: ["USA", 25] };

            const result = await client.query(sql, params, {
                positional: { 1: db_service_pb.ColumnType.COLUMN_TYPE_INTEGER },
            });

            expect(result.type).toBe("SELECT");
            expect(result.rows.length).toBe(1);
        });

        test("Mixed Mode (Named and Positional)", async () => {
            const sql =
                "SELECT name FROM users WHERE country = :country AND age > ? LIMIT 1";

            const params = {
                named: { country: "USA" },
                positional: [25],
            };

            const hints = {
                positional: { 0: db_service_pb.ColumnType.COLUMN_TYPE_INTEGER },
            };

            const result = await client.query(sql, params, hints);

            expect(result.type).toBe("SELECT");
            expect(result.rows.length).toBe(1);
        });
    });

    describe("Atomic Transaction Script", () => {
        test("Successful Atomic Transaction", async () => {
            await client.query("CREATE TABLE IF NOT EXISTS script_tx (id INTEGER)");
            await client.query("DELETE FROM script_tx");

            const queries = [
                "INSERT INTO script_tx (id) VALUES (100)",
                "INSERT INTO script_tx (id) VALUES (101)",
                SQL`UPDATE script_tx SET id = id + 1`,
            ];

            const results = await client.executeTransaction(queries);

            expect(results.length).toBe(3);
            expect(results[0].rowsAffected).toBe(1); // Insert 1
            expect(results[1].rowsAffected).toBe(1); // Insert 2
        });

        test("Atomic Rollback on Failure", async () => {
            await client.query("CREATE TABLE IF NOT EXISTS script_fail (id INTEGER PRIMARY KEY)");
            await client.query("DELETE FROM script_fail");
            await client.query("INSERT INTO script_fail (id) VALUES (50)");

            const queries = [
                "INSERT INTO script_fail (id) VALUES (51)", // OK
                "INSERT INTO script_fail (id) VALUES (50)", // FAIL: Constraint Violation
                "INSERT INTO script_fail (id) VALUES (52)",  // Should not happen
            ];

            // Should throw
            await expect(client.executeTransaction(queries)).rejects.toThrow();

            // Verify no changes (51 should not be there)
            const check = await client.query("SELECT id FROM script_fail ORDER BY id");
            expect(check.rows.length).toBe(1);
            expect(check.rows[0][0]).toBe(50);
        });
    });

    const runCommonTransactionTests = (suiteName, txType) => {
        describe(`${suiteName} Transaction Support`, () => {
            // 1. Basic Lifecycle
            test("Full ACID Workflow: Begin -> Savepoint -> Rollback -> Commit", async () => {
                const tx = await client.beginTransaction(
                    TransactionMode.TRANSACTION_MODE_IMMEDIATE,
                    txType,
                );

                // Ensure we got the right class
                if (txType === TransactionType.UNARY) {
                    expect(tx.constructor.name).toBe("UnaryTransactionHandle");
                } else {
                    expect(tx.constructor.name).toBe("TransactionHandle");
                }

                // Cleanup
                await client.query("CREATE TABLE IF NOT EXISTS accounts (id INTEGER, balance INTEGER)");
                await client.query("DELETE FROM accounts");

                // 1. Initial Insert
                await tx.query("INSERT INTO accounts (id, balance) VALUES (999, 1000)");

                // 2. Create Savepoint
                await tx.savepoint("sp1", SavepointAction.SAVEPOINT_ACTION_CREATE);

                // 3. Update that we will later undo
                await tx.query("UPDATE accounts SET balance = 500 WHERE id = 999");

                // 4. Rollback to Savepoint
                const rbRes = await tx.savepoint("sp1", SavepointAction.SAVEPOINT_ACTION_ROLLBACK);
                expect(rbRes.success).toBe(true);

                // 5. Commit
                await tx.commit();

                // 6. Verify result (balance should be 1000, not 500)
                const res = await client.query("SELECT balance FROM accounts WHERE id = 999");
                expect(res.rows[0][0]).toBe(1000);
            });

            // 2. Auto-rollback Wrapper
            test("Transaction Wrapper: Auto-rollback on error", async () => {
                const tableName = `wrapper_test_${txType}`;
                await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER)`);
                await client.query(`DELETE FROM ${tableName}`);

                const t = async () => {
                    await client.transaction(async (tx) => {
                        await tx.query(`INSERT INTO ${tableName} (id) VALUES (3)`);
                        throw new Error("Trigger Rollback");
                    }, TransactionMode.TRANSACTION_MODE_DEFERRED, txType);
                };

                await expect(t()).rejects.toThrow("Trigger Rollback");

                // Verify rollback
                const count = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
                expect(count.rows[0][0]).toBe(0);
            });

            // 3. Streaming / Iteration
            test("Streaming: iterate() and queryStream()", async () => {
                const tableName = `stream_test_${txType}`;
                await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER)`);
                await client.query(`DELETE FROM ${tableName}`);

                const tx = await client.beginTransaction(TransactionMode.TRANSACTION_MODE_DEFERRED, txType);
                await tx.query(`INSERT INTO ${tableName} (id) VALUES (1), (2), (3)`);

                // Test iterate
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
    };

    runCommonTransactionTests("Streaming (Bidirectional)", TransactionType.STREAMING);
    runCommonTransactionTests("Unary (ID-Based)", TransactionType.UNARY);
}

module.exports = { runFunctionalTests };
