const fs = require('fs');
const path = require('path');
const { DatabaseClient } = require('../src');
const { runFunctionalTests } = require('./functional_suite');
const { test } = require('node:test');

const KEY_FILE = path.resolve(__dirname, '../../../.loadtest-api-key');

if (!fs.existsSync(KEY_FILE)) {
    console.warn("Skipping API Key tests: .loadtest-api-key file not found");
    // In node:test, we can't easily skip the whole suite dynamically at top level 
    // without wrapping in test(), but runFunctionalTests wraps in describe().
    // We'll just define an empty test
    test.skip("Functional Suite (API Key) - SKIPPED (No Key File)", () => { });
} else {
    const apiKey = fs.readFileSync(KEY_FILE, 'utf8').trim();

    runFunctionalTests(async () => {
        return new DatabaseClient("http://localhost:50173", "loadtest", {
            auth: {
                type: 'bearer',
                token: apiKey
            }
        });
    }, { suiteName: "Functional Suite (API Key)" });
}
