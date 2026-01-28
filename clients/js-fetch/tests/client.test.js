const { DatabaseClient } = require('../src');
const { runFunctionalTests } = require('./functional_suite');

const SERVER_URL = "http://localhost:50051";
const DB_NAME = "loadtest";

runFunctionalTests(async () => {
    return new DatabaseClient(SERVER_URL, DB_NAME);
}, { suiteName: "Functional Suite (No Auth)" });
