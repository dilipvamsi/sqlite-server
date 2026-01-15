const { DatabaseClient } = require("../src");
const {
  TransactionMode,
  SavepointAction,
  ColumnType,
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
    const b64Data = binaryData.toString("base64");
    // console.log(b64Data);

    // Insert binary data using a hint
    await client.query("CREATE TABLE IF NOT EXISTS blobs (data BLOB)");
    await client.query(
      "INSERT INTO blobs (data) VALUES (?)",
      [binaryData.toString("base64")],
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
      country: "USA",
      age: 25,
    };

    const result = await client.query(sql, params, {
      named: { age: db_service_pb.ColumnType.COLUMN_TYPE_INTEGER },
    });

    expect(result.type).toBe("SELECT");
  });

  test("Parameter Binding: Positional", async () => {
    const sql = "SELECT name FROM users WHERE country = ? AND age > ? LIMIT 1";

    // Use a single array for all parameters
    const params = ["USA", 25];

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

describe("TransactionHandle Lifecycle", () => {
  let client;
  beforeAll(() => {
    client = new DatabaseClient("localhost:50051", "loadtest-mixed");
  });

  test("Full ACID Workflow: Begin -> Savepoint -> Rollback -> Commit", async () => {
    const tx = await client.beginTransaction(
      TransactionMode.TRANSACTION_MODE_IMMEDIATE,
    );

    // 1. Initial Insert
    await tx.query("INSERT INTO accounts (id, balance) VALUES (999, 1000)");

    // 2. Create Savepoint
    await tx.savepoint("sp1", SavepointAction.SAVEPOINT_ACTION_CREATE);

    // 3. Update that we will later undo
    await tx.query("UPDATE accounts SET balance = 500 WHERE id = 999");

    // 4. Rollback to Savepoint
    await tx.savepoint("sp1", SavepointAction.SAVEPOINT_ACTION_ROLLBACK);

    // 5. Commit
    await tx.commit();

    // 6. Verify result (balance should be 1000, not 500)
    const res = await client.query(
      "SELECT balance FROM accounts WHERE id = 999",
    );
    expect(res.rows[0][0]).toBe(1000);

    // Cleanup
    await client.query("DELETE FROM accounts WHERE id = 999");
  });

  test("Sequentiality Protection: Prevent concurrent commands on one handle", async () => {
    const tx = await client.beginTransaction();
    const p1 = tx.query("SELECT 1");

    // Attempting a second command before p1 resolves should thro`w
    await expect(tx.query("SELECT 2")).rejects.toThrow("Transaction is busy");

    await p1;
    await tx.rollback();
  });
  test("Better-Sqlite3 style transaction: Auto-commit", async () => {
    const result = await client.transaction(async (tx) => {
      // 1. Setup table
      await tx.query(
        "CREATE TABLE IF NOT EXISTS test_cb (id INTEGER PRIMARY KEY)",
      );

      // 2. IMPORTANT: Clear the table so the inserts below don't fail on run #2, #3...
      await tx.query("DELETE FROM test_cb");

      // 3. First operation
      await tx.query("INSERT INTO test_cb (id) VALUES (1)");

      // 4. Nested logic using savepoints
      await tx.savepoint("pt1");
      await tx.query("INSERT INTO test_cb (id) VALUES (2)");

      return "Done";
    });
    expect(result).toBe("Done");

    // Verify data was committed
    const verify = await client.query(
      "SELECT id FROM test_cb WHERE id IN (1, 2) ORDER BY id ASC",
    );
    expect(verify.rows).toHaveLength(2);
    expect(verify.rows[0][0]).toBe(1); // First row
    expect(verify.rows[1][0]).toBe(2); // Second row
  });

  test("Better-Sqlite3 style transaction: Auto-rollback on error", async () => {
    const t = async () => {
      await client.transaction(async (tx) => {
        await tx.query("INSERT INTO test_cb (id) VALUES (3)");
        throw new Error("Trigger Rollback");
      });
    };

    await expect(t()).rejects.toThrow("Trigger Rollback");

    // 1. Verify id 3 does NOT exist
    const verify3 = await client.query(
      "SELECT COUNT(*) FROM test_cb WHERE id = 3",
    );
    expect(verify3.rows[0][0]).toBe(0);

    // 2. Verify IDs 1 and 2 ARE still there
    const verify12 = await client.query(
      "SELECT id FROM test_cb WHERE id IN (1, 2) ORDER BY id ASC",
    );
    expect(verify12.rows).toHaveLength(2);
    expect(verify12.rows[0][0]).toBe(1);
    expect(verify12.rows[1][0]).toBe(2);
  });
});

// describe("Garbage Collection Leak Protection", () => {
//   let client;
//   beforeAll(() => {
//     client = new DatabaseClient("localhost:50051", "loadtest");
//   });

//   test("Emergency cleanup triggers on GC", async () => {
//     let capturedStream;

//     // 1. Logic wrapped in an IIFE to ensure the stack is cleared
//     await (async function createLeak() {
//       const tx = await client.beginTransaction();
//       capturedStream = tx.stream;
//       jest.spyOn(capturedStream, "cancel");
//       // tx goes out of scope here
//     })();

//     // 2. Force GC and clear event loop multiple times
//     if (!global.gc) {
//       console.warn("Test requires --expose-gc. Skipping.");
//       return;
//     }

//     // Aggressive loop to ensure FinalizationRegistry processes
//     for (let i = 0; i < 6; i++) {
//       global.gc();
//       // Tick the microtask queue
//       await new Promise((resolve) => setImmediate(resolve));
//       // Tick the macrotask queue (Registry often fires here)
//       await new Promise((resolve) => setTimeout(resolve, 50));
//     }

//     // 3. Verification
//     expect(capturedStream.cancel).toHaveBeenCalled();
//   });
// });
