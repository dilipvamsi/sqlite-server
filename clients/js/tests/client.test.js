const { DatabaseClient } = require("../src");
const { runFunctionalTests } = require("./functional_suite");

describe("DatabaseClient Integration Tests (No Auth)", () => {
  const DB_NAME = "loadtest";

  runFunctionalTests(async () => {
    return new DatabaseClient("localhost:50051", DB_NAME);
  });
});
