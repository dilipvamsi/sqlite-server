const fs = require('fs');
const path = require('path');
const { DatabaseClient } = require("../src");
const { runFunctionalTests } = require("./functional_suite");

const KEY_FILE = path.resolve(__dirname, '../../../.loadtest-api-key');

describe("DatabaseClient Integration Tests (API Key Auth)", () => {
    if (!fs.existsSync(KEY_FILE)) {
        console.warn("Skipping API Key tests: .loadtest-api-key file not found");
        test.skip("Skipping API Key tests", () => { });
        return;
    }

    const apiKey = fs.readFileSync(KEY_FILE, 'utf8').trim();
    const DB_NAME = "loadtest";

    runFunctionalTests(async () => {
        return new DatabaseClient("localhost:50173", DB_NAME, {
            auth: {
                type: 'bearer',
                token: apiKey,
            },
        });
    });
});
