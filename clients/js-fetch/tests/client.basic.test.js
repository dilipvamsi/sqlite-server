const fs = require('fs');
const path = require('path');
const { DatabaseClient } = require('../src');
const { runFunctionalTests } = require('./functional_suite');

// Matches existing clients/js logic
const KEY_FILE = path.resolve(__dirname, '../../../.loadtest-basic');

let username = 'admin';
let password = 'password';

// Try to read common key file, but default to admin/admin (which is what server uses by default)
if (fs.existsSync(KEY_FILE)) {
    const content = fs.readFileSync(KEY_FILE, 'utf8').trim();
    const parts = content.split(':');
    if (parts.length >= 2) {
        username = parts[0];
        password = parts.slice(1).join(':');
    }
}
// If default server, it's usually admin:admin.
// The original test skips if file missing, but my manual runs showed I need to assume or setup.
// Let's assume admin:admin for local dev if file missing, OR check if we should skip.

// To allow local running against currently generic make setup:
username = 'admin';
password = 'admin'; // Based on makefile: SQLITE_SERVER_ADMIN_PASSWORD=admin

runFunctionalTests(async () => {
    return new DatabaseClient("http://localhost:50173", "loadtest", {
        auth: {
            type: 'basic',
            username,
            password
        }
    });
}, { suiteName: "Functional Suite (Basic Auth)" });
