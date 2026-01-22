const fs = require('fs');
const path = require('path');
const { DatabaseClient } = require("../src");
const { runFunctionalTests } = require("./functional_suite");

// We'll look for a file similar to api-key, or just use hardcoded defaults which seem to be common in local dev
// If provided by user later we can switch. For now, let's assume a file might exist or fallback/skip.
const KEY_FILE = path.resolve(__dirname, '../../../.loadtest-basic');

describe("DatabaseClient Integration Tests (Basic Auth)", () => {
    let username = 'admin';
    let password = 'password';

    if (fs.existsSync(KEY_FILE)) {
        // Assuming format user:pass
        const content = fs.readFileSync(KEY_FILE, 'utf8').trim();
        const parts = content.split(':');
        if (parts.length >= 2) {
            username = parts[0];
            password = parts.slice(1).join(':'); // handle passwords with colons
        }
    } else {
        // Fallback or Skip?
        // If we can't find credentials, we can't really test Basic Auth against a real server unless we know the defaults.
        // I will warn and skip if not present, similar to API key.
        console.warn("Skipping Basic Auth tests: .loadtest-basic file not found. Create it with 'username:password'");
        test.skip("Skipping Basic Auth tests", () => { });
        return;
    }

    const DB_NAME = "loadtest";

    runFunctionalTests(async () => {
        return new DatabaseClient("localhost:50051", DB_NAME, {
            auth: {
                type: 'basic',
                username,
                password,
            },
        });
    });
});
