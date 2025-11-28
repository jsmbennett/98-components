import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'test',
    resolve: {
        alias: {
            '98-components-client': resolve(__dirname, 'src/index.js'),
        },
    },
});
