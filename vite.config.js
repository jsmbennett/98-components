import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: '98ia-client',
            fileName: '98ia-client',
        },
        rollupOptions: {
            external: [/^98\.css/],
            output: {
                globals: {
                    '98.css': '98.css',
                },
            },
        },
    },
});
