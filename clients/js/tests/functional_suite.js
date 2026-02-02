const {
    TransactionMode,
    SavepointAction,
    TransactionType,
    CheckpointMode,
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
            expect(result.columnAffinities).toBeDefined();
            // 2 = INTEGER (TEXT pending server impl specifics for expressions, but usually INT/NUMERIC)
            // 5 = NUMERIC (often used for expressions like 1+1 in SQLite/this-setup)
            expect(result.columnAffinities[0]).toBe(db_service_pb.ColumnAffinity.COLUMN_AFFINITY_NUMERIC);
        });

        test("BLOB Data Integrity", async () => {
            const binaryData = Buffer.from([0x00, 0xff, 0xaa, 0x55]);

            await client.query("CREATE TABLE IF NOT EXISTS blobs (data BLOB)");
            await client.query("DELETE FROM blobs"); // Clean up

            // The typed API supports Buffers directly!
            await client.query(
                "INSERT INTO blobs (data) VALUES (?)",
                { positional: [binaryData] },
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

            const { columns, columnAffinities, rows } = await client.iterate(
                "SELECT id FROM users LIMIT 10",
            );
            expect(columns).toContain("id");
            expect(columnAffinities).toBeDefined();
            // id column is INTEGER
            expect(columnAffinities[0]).toBe(db_service_pb.ColumnAffinity.COLUMN_AFFINITY_INTEGER);

            let count = 0;
            for await (const row of rows) {
                expect(row[0]).toBeDefined();
                count++;
            }
            expect(count).toBe(10);
        });

        test("Stateless Iteration: Very Large Result Set (>500)", async () => {
            // Ensure data exists
            await client.query("CREATE TABLE IF NOT EXISTS large_users (id INTEGER)");
            await client.query("DELETE FROM large_users");

            // Insert 600 rows
            const totalRows = 600;
            // Batch insert to speed up setup
            const batchSize = 100;
            for (let i = 0; i < totalRows; i += batchSize) {
                const placeholders = Array(batchSize).fill("(?)").join(",");
                const values = [];
                for (let j = 0; j < batchSize; j++) {
                    values.push(i + j);
                }
                const res = await client.query(`INSERT INTO large_users (id) VALUES ${placeholders}`, { positional: values });
                expect(res.type).toBe("DML");
                expect(res.rowsAffected).toBe(batchSize);
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

        test("Stateless Streaming: queryStream", async () => {
            await client.query("CREATE TABLE IF NOT EXISTS stream_users (id INTEGER)");
            await client.query("DELETE FROM stream_users");
            await client.query("INSERT INTO stream_users (id) VALUES (1), (2), (3)");

            const { columns, columnAffinities, rows } = await client.queryStream("SELECT id FROM stream_users");
            expect(columns).toContain("id");
            expect(columnAffinities).toBeDefined();
            expect(columnAffinities[0]).toBe(db_service_pb.ColumnAffinity.COLUMN_AFFINITY_INTEGER);

            let count = 0;
            for await (const batch of rows) {
                count += batch.length;
            }
            expect(count).toBe(3);
        });


        test("DeclaredType Verification", async () => {
            await client.query("DROP TABLE IF EXISTS dtypes");
            await client.query("CREATE TABLE IF NOT EXISTS dtypes (id UUID, meta JSON, age INTEGER, name VARCHAR(255))");
            await client.query("DELETE FROM dtypes");
            await client.query("INSERT INTO dtypes (id, meta, age, name) VALUES ('u-1', '{\"a\":1}', 30, 'Alice')");

            const result = await client.query("SELECT id, meta, age, name FROM dtypes LIMIT 1");

            expect(result.columnDeclaredTypes).toBeDefined();
            expect(result.columnDeclaredTypes.length).toBe(4);

            // 1. UUID -> DECLARED_TYPE_UUID
            expect(result.columnDeclaredTypes[0]).toBe(db_service_pb.DeclaredType.DECLARED_TYPE_UUID);

            // 2. JSON -> DECLARED_TYPE_JSON
            expect(result.columnDeclaredTypes[1]).toBe(db_service_pb.DeclaredType.DECLARED_TYPE_JSON);

            // 3. INT -> DECLARED_TYPE_INTEGER
            expect(result.columnDeclaredTypes[2]).toBe(db_service_pb.DeclaredType.DECLARED_TYPE_INTEGER);

            // 4. VARCHAR(255) -> DECLARED_TYPE_VARCHAR
            expect(result.columnDeclaredTypes[3]).toBe(db_service_pb.DeclaredType.DECLARED_TYPE_VARCHAR);

            // Verify raw types as well
            expect(result.columnRawTypes).toBeDefined();
            expect(result.columnRawTypes[0]).toBe("UUID");
            expect(result.columnRawTypes[1]).toBe("JSON");
            expect(result.columnRawTypes[3]).toBe("VARCHAR(255)");
            expect(result.columnRawTypes[3]).toBe("VARCHAR(255)");
        });

        test("BigInt Verification", async () => {
            const tableName = "bigint_test";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id BIGINT, val TEXT)`);
            await client.query(`DELETE FROM ${tableName}`);

            // Insert a value larger than 2^53 - 1 but within Int64
            // Max Safe Integer: 9,007,199,254,740,991
            // Max Int64:        9,223,372,036,854,775,807
            const bigVal = 9223372036854775800n;
            // const bigValStr = bigVal.toString(); // unused

            // Insert as string because JS client params might not support BigInt directly yet without specific handling,
            // but let's try assuming the client serialization handles BigInt -> String or similar, OR we pass as string and rely on implicit cast.
            // Safest: Pass as string for insertion, verify readout as BigInt.
            await client.query(`INSERT INTO ${tableName} (id, val) VALUES (?, 'test')`, {
                positional: [bigVal],
            });

            const result = await client.query(`SELECT id FROM ${tableName} LIMIT 1`);

            expect(result.columnDeclaredTypes[0]).toBe(db_service_pb.DeclaredType.DECLARED_TYPE_BIGINT);

            const row = result.rows[0];
            const id = row[0];

            expect(id).toBe(bigVal);
        });

        test("JSON Verification", async () => {
            const tableName = "json_test";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id INT, data JSON)`);
            await client.query(`DELETE FROM ${tableName}`);

            const jsonData = { foo: "bar", baz: 123, nested: { array: [1, 2] } };
            const jsonStr = JSON.stringify(jsonData);

            await client.query(`INSERT INTO ${tableName} (id, data) VALUES (1, ?)`, {
                positional: [jsonStr],
            });

            const result = await client.query(`SELECT data FROM ${tableName} LIMIT 1`);

            expect(result.columnDeclaredTypes[0]).toBe(db_service_pb.DeclaredType.DECLARED_TYPE_JSON);

            const row = result.rows[0];
            const data = row[0];

            expect(typeof data).toBe('object');
            expect(data).toEqual(jsonData);
        });
        test("Date Verification", async () => {
            const tableName = "date_test";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER, d DATE, dt DATETIME)`);
            await client.query(`DELETE FROM ${tableName}`);

            const now = new Date();
            // SQLite stores dates as strings usually, but we want to verify hydration
            const nowStr = now.toISOString();

            await client.query(`INSERT INTO ${tableName} (id, d, dt) VALUES (1, ?, ?)`, {
                positional: [now, now],
            });

            const result = await client.query(`SELECT d, dt FROM ${tableName} LIMIT 1`);

            // Check Declared Types
            expect(result.columnDeclaredTypes).toBeDefined();
            // 0: DATE, 1: DATETIME
            expect(result.columnDeclaredTypes[0]).toBe(db_service_pb.DeclaredType.DECLARED_TYPE_DATE);
            expect(result.columnDeclaredTypes[1]).toBe(db_service_pb.DeclaredType.DECLARED_TYPE_DATETIME);

            // Check Hydration (Default is Date object)
            const row = result.rows[0];
            expect(row[0]).toBeInstanceOf(Date);
            expect(row[1]).toBeInstanceOf(Date);
            expect(row[0].toISOString()).toBe(nowStr);
        });

        test("EXPLAIN QUERY PLAN", async () => {
            const nodes = await client.explain("SELECT * FROM users WHERE id = ?", { positional: [1] });
            expect(Array.isArray(nodes)).toBe(true);
            expect(nodes.length).toBeGreaterThan(0);
            expect(nodes[0]).toHaveProperty("id");
            expect(nodes[0]).toHaveProperty("parentId");
            expect(nodes[0]).toHaveProperty("detail");
            // Detail should contain information about the table or index access
            expect(nodes[0].detail.toLowerCase()).toMatch(/search|scan/);
        });
    });

    describe("Parsing Configuration", () => {
        test("Disable BigInt Parsing", async () => {
            const tableName = "bigint_parse_off";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id BIGINT)`);
            await client.query(`DELETE FROM ${tableName}`);

            const bigValStr = "9223372036854775800";
            await client.query(`INSERT INTO ${tableName} (id) VALUES (?)`, { positional: [bigValStr] });

            // Temporarily disable bigint parsing
            const originalSetting = client.config.typeParsers.bigint;
            client.config.typeParsers.bigint = false;
            try {
                const result = await client.query(`SELECT id FROM ${tableName} LIMIT 1`);
                expect(result.rows[0][0]).toBe(bigValStr); // Should be string
                expect(typeof result.rows[0][0]).toBe('string');
            } finally {
                client.config.typeParsers.bigint = originalSetting;
            }
        });

        test("Disable JSON Parsing", async () => {
            const tableName = "json_parse_off";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (data JSON)`);
            await client.query(`DELETE FROM ${tableName}`);

            const jsonData = { foo: "bar" };
            const jsonStr = JSON.stringify(jsonData);
            await client.query(`INSERT INTO ${tableName} (data) VALUES (?)`, { positional: [jsonStr] });

            // Temporarily disable json parsing
            const originalSetting = client.config.typeParsers.json;
            client.config.typeParsers.json = false;
            try {
                const result = await client.query(`SELECT data FROM ${tableName} LIMIT 1`);
                expect(result.rows[0][0]).toBe(jsonStr); // Should be string
                expect(typeof result.rows[0][0]).toBe('string');
            } finally {
                client.config.typeParsers.json = originalSetting;
            }
        });

        test("Date as String", async () => {
            const tableName = "date_parse_string";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (d DATE)`);
            await client.query(`DELETE FROM ${tableName}`);

            const nowStr = new Date().toISOString();
            await client.query(`INSERT INTO ${tableName} (d) VALUES (?)`, { positional: [nowStr] });

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

        test("Date as Number", async () => {
            const tableName = "date_parse_number";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (d DATE)`);
            await client.query(`DELETE FROM ${tableName}`);

            const now = new Date();
            const nowStr = now.toISOString();
            const nowTs = now.getTime();

            await client.query(`INSERT INTO ${tableName} (d) VALUES (?)`, { positional: [nowStr] });

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

        test("Disable BLOB Parsing", async () => {
            const tableName = "blob_parse_off";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (data BLOB)`);
            await client.query(`DELETE FROM ${tableName}`);

            // Use the existing BLOB test data approach (Buffer passed directly)
            // const rawBytes = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            // Use X'...' hex literal for inserting BLOB data
            await client.query(`INSERT INTO ${tableName} (data) VALUES (X'01020304')`);

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

        test("Multiple parsers disabled simultaneously", async () => {
            const tableName = "multi_parse_off";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id BIGINT, data JSON)`);
            await client.query(`DELETE FROM ${tableName}`);

            const bigValStr = "9223372036854775800";
            const jsonData = { key: "value" };
            const jsonStr = JSON.stringify(jsonData);

            await client.query(`INSERT INTO ${tableName} (id, data) VALUES (?, ?)`, {
                positional: [bigValStr, jsonStr],
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

        test("TypeParsers apply to streaming (iterate)", async () => {
            const tableName = "stream_parse_test";
            await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (data JSON)`);
            await client.query(`DELETE FROM ${tableName}`);

            const jsonData = { stream: true };
            const jsonStr = JSON.stringify(jsonData);
            await client.query(`INSERT INTO ${tableName} (data) VALUES (?)`, { positional: [jsonStr] });

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

        test("TypeParsers within transaction", async () => {
            const tableName = "tx_parse_test";

            const originalSetting = client.config.typeParsers.bigint;
            client.config.typeParsers.bigint = false;
            try {
                await client.transaction(async (tx) => {
                    await tx.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id BIGINT)`);
                    await tx.query(`DELETE FROM ${tableName}`);
                    await tx.query(`INSERT INTO ${tableName} (id) VALUES (?)`, { positional: ["9223372036854775800"] });
                    const result = await tx.query(`SELECT id FROM ${tableName} LIMIT 1`);
                    expect(typeof result.rows[0][0]).toBe('string');
                });
            } finally {
                client.config.typeParsers.bigint = originalSetting;
            }
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
                named: { age: db_service_pb.ColumnAffinity.COLUMN_AFFINITY_INTEGER },
            });

            expect(result.type).toBe("SELECT");
            expect(result.rows.length).toBe(1);
        });

        test("Positional Parameters", async () => {
            const sql = "SELECT name FROM users WHERE country = ? AND age > ? LIMIT 1";

            const params = { positional: ["USA", 25] };

            const result = await client.query(sql, params, {
                positional: { 1: db_service_pb.ColumnAffinity.COLUMN_AFFINITY_INTEGER },
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
                positional: { 0: db_service_pb.ColumnAffinity.COLUMN_AFFINITY_INTEGER },
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
                // Cleanup
                await client.query("CREATE TABLE IF NOT EXISTS accounts (id INTEGER, balance INTEGER)");
                await client.query("DELETE FROM accounts");

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
                const { rows: iterRows, columnAffinities: iterTypes } = await tx.iterate(`SELECT id FROM ${tableName}`);
                expect(iterTypes).toBeDefined();
                expect(iterTypes[0]).toBe(db_service_pb.ColumnAffinity.COLUMN_AFFINITY_INTEGER);

                for await (const row of iterRows) {
                    sum += row[0];
                }
                expect(sum).toBe(6);

                // Test queryStream
                const { rows: batches, columnAffinities: streamTypes } = await tx.queryStream(`SELECT id FROM ${tableName}`);
                expect(streamTypes).toBeDefined();
                expect(streamTypes[0]).toBe(db_service_pb.ColumnAffinity.COLUMN_AFFINITY_INTEGER);

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

    describe("Maintenance RPCs", () => {
        test("VACUUM", async () => {
            const res = await client.vacuum();
            expect(res.success).toBe(true);
        });

        test("CHECKPOINT", async () => {
            // Perform some writes
            await client.query("CREATE TABLE IF NOT EXISTS cp_test (id INTEGER)");
            await client.query("INSERT INTO cp_test (id) VALUES (1)");
            // PASSIVE = 1
            const res = await client.checkpoint(CheckpointMode.CHECKPOINT_MODE_PASSIVE);
            expect(res.success).toBe(true);
            expect(res.logCheckpoints).toBeDefined();
        });

        test("INTEGRITY_CHECK", async () => {
            const res = await client.integrityCheck();
            expect(res.success).toBe(true);
            expect(res.errors).toEqual([]);
        });
    });

    describe("Attached Databases", () => {
        test("Attach and Detach Database", async () => {
            const fs = require('fs');
            const path = require('path');
            const os = require('os');

            const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sqlite-server-test-'));
            const adbPath = path.join(tmpDir, 'attached.db');

            // Attach it
            const attachRes = await client.attach({
                name: "ext_db",
                dbPath: adbPath
            });
            expect(attachRes.success).toBe(true);

            // Create table and insert in parent (ensure main stays functional)
            await client.query("CREATE TABLE IF NOT EXISTS main_table (id INTEGER)");

            // Try to query the attached - we need to create it first.
            // In SQLite, ATTACH creates the file if it doesn't exist?
            // Actually, better to create it beforehand or via ATTACH if supported.
            // Let's create a table via the alias.
            await client.query("CREATE TABLE ext_db.t1 (id INTEGER)");
            await client.query("INSERT INTO ext_db.t1 (id) VALUES (123)");

            const result = await client.query("SELECT id FROM ext_db.t1");
            expect(result.rows[0][0]).toBe(123);

            // Detach it
            const detachRes = await client.detach("ext_db");
            expect(detachRes.success).toBe(true);

            // Verify it's detached
            await expect(client.query("SELECT id FROM ext_db.t1")).rejects.toThrow();

            // Cleanup
            if (fs.existsSync(adbPath)) fs.unlinkSync(adbPath);
            fs.rmdirSync(tmpDir);
        });
    });
}

module.exports = { runFunctionalTests };
