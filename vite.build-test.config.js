import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'test',
    base: '/98-components/', // Update this to match your GitHub repo name
    build: {
        outDir: '../dist-test',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '98-components': resolve(__dirname, 'src/index.js'),
        },
    },
});
