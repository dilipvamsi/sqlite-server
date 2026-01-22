// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    base: '/studio',
    output: 'static',
    build: {
        assets: '_astro',
    },
    server: {
        proxy: {
            '/db.v1': 'http://localhost:50051',
            '/studio/api': 'http://localhost:50051',
        }
    }
});
