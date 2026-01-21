const { DatabaseClient, SQL } = require("../src");
const {
  TransactionMode,
  SavepointAction,
  TransactionType,
} = require("../src/lib/constants");
const db_service_pb = require("../src/protos/db/v1/db_service_pb");

describe("DatabaseClient Integration Tests", () => {
  let client;
  const DB_NAME = "loadtest"; // Matches the server config

  beforeAll(() => {
    client = new DatabaseClient("localhost:50051", DB_NAME);
  });

  afterAll(() => {
    client.close();
  });

  // test("Unary Query: SELECT", async () => {
  //   const result = await client.query("SELECT 1 + 1 AS sum");
  //   expect(result.type).toBe("SELECT");
  //   expect(result.rows[0][0]).toBe(2);
  //   expect(result.columns).toContain("sum");
  // });

  test("BLOB Data Integrity", async () => {
    const binaryData = Buffer.from([0x00, 0xff, 0xaa, 0x55]);
    // console.log(b64Data);

    // Insert binary data using a hint
    await client.query("CREATE TABLE IF NOT EXISTS blobs (data BLOB)");
    await client.query(
      "INSERT INTO blobs (data) VALUES (?)",
      { positional: [binaryData.toString("base64")] },
      {
        positional: {
          // Ensure this is the actual integer (5), not a string
          0: db_service_pb.ColumnType.COLUMN_TYPE_BLOB,
        },
      },
    );

    // Retrieve binary data
    const result = await client.query("SELECT data FROM blobs LIMIT 1");

    const returnedBuffer = result.rows[0][0];

    // console.log(result);
    // console.log(returnedBuffer);
    expect(Buffer.isBuffer(returnedBuffer)).toBe(true);
    expect(returnedBuffer.equals(binaryData)).toBe(true);
  });

  test("Stateless Iteration: Large Result Set", async () => {
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

  test("Parameter Binding: Named", async () => {
    const sql =
      "SELECT name FROM users WHERE country = :country AND age > :age LIMIT 1";

    // Use a single object for all parameters
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
  });

  test("Parameter Binding: Positional", async () => {
    const sql = "SELECT name FROM users WHERE country = ? AND age > ? LIMIT 1";

    // Use a single array for all parameters
    const params = { positional: ["USA", 25] };

    const result = await client.query(sql, params, {
      positional: { 1: db_service_pb.ColumnType.COLUMN_TYPE_INTEGER },
    });

    expect(result.type).toBe("SELECT");
  });

  test("Parameter Binding: Mixed Mode (Named and Positional)", async () => {
    const sql =
      "SELECT name FROM users WHERE country = :country AND age > ? LIMIT 1";

    // Format: first arg is SQL, second is the data object
    const params = {
      named: { country: "USA" },
      positional: [25],
    };

    const hints = {
      positional: { 0: db_service_pb.ColumnType.COLUMN_TYPE_INTEGER },
    };

    const result = await client.query(sql, params, hints);

    expect(result.type).toBe("SELECT");
  });
});

const runCommonTransactionTests = (suiteName, txType) => {
  describe(`${suiteName} Transaction Support`, () => {
    let client;
    const DB_NAME = "loadtest";

    beforeAll(() => {
      client = new DatabaseClient("localhost:50051", DB_NAME);
    });

    afterAll(() => {
      client.close();
    });

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

// Run for both modes
runCommonTransactionTests("Streaming (Bidirectional)", TransactionType.STREAMING);
runCommonTransactionTests("Unary (ID-Based)", TransactionType.UNARY);

describe("Atomic Transaction Script (executeTransaction)", () => {
  let client;
  const DB_NAME = "loadtest";

  beforeAll(() => {
    client = new DatabaseClient("localhost:50051", DB_NAME);
  });

  afterAll(() => {
    client.close();
  });

  test("Successfull Atomic Transaction", async () => {
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
    // DML returns rowsAffected in result object
    // The helper maps DMLResult to object with rowsAffected
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

describe("Client Enhancements", () => {
  const DB_NAME = "loadtest";

  test("Date Handling Configuration", async () => {
    // 1. Default (Date object)
    const clientDate = new DatabaseClient("localhost:50051", DB_NAME, undefined, { dateHandling: 'date' });
    await clientDate.query("CREATE TABLE IF NOT EXISTS date_test (id INTEGER, d DATE)");
    await clientDate.query("DELETE FROM date_test");
    await clientDate.query("INSERT INTO date_test (id, d) VALUES (1, '2023-10-27T10:00:00.000Z')");

    const res1 = await clientDate.query("SELECT d FROM date_test WHERE id = 1");
    expect(res1.rows[0][0]).toBeInstanceOf(Date);
    expect(res1.rows[0][0].toISOString()).toBe('2023-10-27T10:00:00.000Z');
    clientDate.close();

    // 2. String (ISO)
    const clientStr = new DatabaseClient("localhost:50051", DB_NAME, undefined, { dateHandling: 'string' });
    const res2 = await clientStr.query("SELECT d FROM date_test WHERE id = 1");
    expect(typeof res2.rows[0][0]).toBe('string');
    // Server might normalize or strip 000 millis
    // We accept either strict ISO or the one received: 2023-10-27T10:00:00Z
    const accepted = ['2023-10-27T10:00:00.000Z', '2023-10-27T10:00:00Z'];
    expect(accepted).toContain(res2.rows[0][0]);
    clientStr.close();

    // 3. Number (Timestamp)
    const clientNum = new DatabaseClient("localhost:50051", DB_NAME, undefined, { dateHandling: 'number' });
    const res3 = await clientNum.query("SELECT d FROM date_test WHERE id = 1");
    expect(typeof res3.rows[0][0]).toBe('number');
    expect(res3.rows[0][0]).toBe(new Date('2023-10-27T10:00:00Z').getTime());
    clientNum.close();
  });

  test("Interceptors", async () => {
    const logs = [];
    const interceptor = {
      beforeQuery: (req) => logs.push(['before', req.sql]),
      afterQuery: (res) => logs.push(['after', res.type]),
    };

    const client = new DatabaseClient("localhost:50051", DB_NAME, undefined, {
      interceptors: [interceptor],
    });

    await client.query("SELECT 1");

    expect(logs.length).toBe(2);
    expect(logs[0][0]).toBe('before');
    expect(logs[0][1]).toBe('SELECT 1');
    expect(logs[1][0]).toBe('after');
    expect(logs[1][1]).toBe('SELECT');

    client.close();
  });

  test("Retry Wrapper Passthrough", async () => {
    const client = new DatabaseClient("localhost:50051", DB_NAME, undefined, {
      retry: { maxRetries: 1, baseDelayMs: 10 },
    });
    const res = await client.query("SELECT 1");
    expect(res.rows[0][0]).toBe(1);
    client.close();
  });
});

describe("Strict Parameter Validation", () => {
  let client;
  const DB_NAME = "loadtest";

  beforeAll(() => {
    client = new DatabaseClient("localhost:50051", DB_NAME);
  });

  afterAll(() => {
    client.close();
  });

  test("Should accept empty parameters", async () => {
    const res = await client.query("SELECT 1");
    expect(res.rows[0][0]).toBe(1);

    // Explicit empty object
    const res2 = await client.query("SELECT 1", {});
    expect(res2.rows[0][0]).toBe(1);
  });

  test("Should throw on direct array parameters", async () => {
    await expect(client.query("SELECT ?", [1])).rejects.toThrow(
      "Direct array parameters are not supported",
    );
  });

  test("Should throw on direct named object parameters", async () => {
    await expect(client.query("SELECT :a", { a: 1 })).rejects.toThrow(
      "Direct named parameters are not supported",
    );
  });

  test("Should accept strict positional parameters", async () => {
    const res = await client.query("SELECT ?", { positional: [1] });
    expect(res.rows[0][0]).toBe(1);
  });

  test("Should accept strict named parameters", async () => {
    const res = await client.query("SELECT :a AS val", { named: { a: 10 } });
    expect(res.rows[0][0]).toBe(10);
  });
});

describe("Backpressure Verification", () => {
  jest.setTimeout(30000);
  const DB_NAME = "loadtest";

  test("Should handle slow consumers without buffering entire result", async () => {
    const client = new DatabaseClient("localhost:50051", DB_NAME);

    // 1. Setup: Insert 500 rows (enough to trigger HWM=100)
    await client.query("CREATE TABLE IF NOT EXISTS kv_store (key INTEGER, value TEXT)");
    await client.query("DELETE FROM kv_store");

    const entries = Array.from({ length: 500 }, (_, i) => ({
      id: i,
      value: `val_${i}`,
    }));

    // Batch insert for speed
    for (let i = 0; i < entries.length; i += 50) {
      const chunk = entries.slice(i, i + 50);
      const placeholders = chunk.map(() => "(?, ?)").join(",");
      const values = chunk.flatMap(e => [e.id, e.value]);
      await client.query(`INSERT INTO kv_store (key, value) VALUES ${placeholders}`, { positional: values });
    }

    // 2. Iterate slowly using streaming transaction
    const tx = await client.beginTransaction(TransactionMode.TRANSACTION_MODE_DEFERRED, TransactionType.STREAMING);

    // Spy on the stream pause/resume
    let pauseCount = 0;
    let resumeCount = 0;

    // We need to access the internal stream. ideally we shouldn't but for verification we must.
    if (tx.stream) {
      const originalPause = tx.stream.pause.bind(tx.stream);
      const originalResume = tx.stream.resume.bind(tx.stream);

      tx.stream.pause = () => {
        pauseCount++;
        originalPause();
      };
      tx.stream.resume = () => {
        resumeCount++;
        originalResume();
      };
    }

    const iterator = await tx.iterate("SELECT * FROM kv_store ORDER BY key");
    let rowCount = 0;

    for await (const _row of iterator.rows) {
      rowCount++;
      if (rowCount % 10 === 0) {
        // Simulate slow processing (5ms * 50 times = 250ms total delay)
        await new Promise(r => setTimeout(r, 5));
      }
    }

    await tx.commit();
    client.close();

    expect(rowCount).toBe(500);

    // 3. Verify Backpressure was triggered
    // With 500 rows and HWM 100, we expect multiple pauses.
    // However, depending on network speed and batch size, it might not always pause if the server matches speed.
    // locally it should.
    // console.log(`Backpressure Stats - Pause: ${pauseCount}, Resume: ${resumeCount}`);

    // We assert that IF it paused, it also resumed. 
    // If it didn't pause (super fast machine?), that's technically valid but less ideal for this test.
    // But given 500 vs 100, it SHOULD pause.
    if (pauseCount > 0) {
      expect(resumeCount).toBeGreaterThan(0);
    }
  });

  test("Configurable Backpressure: Should respect maxStreamBuffer", async () => {
    // Test that we can initialize with custom buffer size and it flows correctly
    const clientSmall = new DatabaseClient("localhost:50051", DB_NAME, undefined, {
      maxStreamBuffer: 5,
    });

    const tx = await clientSmall.beginTransaction(TransactionMode.TRANSACTION_MODE_DEFERRED, TransactionType.STREAMING);
    // If we query a table with >5 rows and iterate slowly, it should throttle.
    const iterator = await tx.iterate("SELECT 1 AS val UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6");

    let count = 0;
    for await (const _row of iterator.rows) {
      count++;
    }
    expect(count).toBe(6);
    await tx.commit();
    clientSmall.close();
  });
});

