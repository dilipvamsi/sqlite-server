import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import astroParser from 'astro-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
    ...eslintPluginAstro.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.astro"],
        languageOptions: {
            parser: astroParser,
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: [".astro"],
            },
        },
    },
    {
        ignores: ["dist/", ".astro/", "src/gen/"],
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                // Caught errors must be used (e.g. logged)
                "caughtErrors": "all"
            }]
        }
    }
];
