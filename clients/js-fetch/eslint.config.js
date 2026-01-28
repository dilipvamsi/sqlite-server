const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                ...globals.jest, // For test files using describe/it
                fetch: "readonly", // Native fetch
                Request: "readonly",
                Response: "readonly",
                Headers: "readonly",
                TextEncoder: "readonly",
                TextDecoder: "readonly",
                ReadableStream: "readonly",
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
        },
        ignores: ["node_modules/", "coverage/"],
    },
];
