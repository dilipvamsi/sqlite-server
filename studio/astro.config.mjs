// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    base: '/studio',
    output: 'static',
    build: {
        assets: '_astro',
    },
    vite: {
        server: {
            proxy: {
                '/db.v1': 'http://localhost:50173',
                '/studio/api': 'http://localhost:50173',
            }
        }
    }
});
