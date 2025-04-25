import react from '@vitejs/plugin-react';
import { join } from 'path';
import { defineConfig } from 'vite';
import renderer from 'vite-plugin-electron-renderer';
import electron from 'vite-plugin-electron/simple';

export default defineConfig({
    base: './',
    plugins: [
        react(),
        electron({
            main: {
                entry: 'server/main/index.ts',
            },
            preload: {
                input: 'server/preload/index.ts',
            },
            renderer: {},
        }),
        renderer(),
    ],
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist-vite',
        assetsInlineLimit: 0,
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            output: {
                format: 'es',
            },
        },
    },
});
