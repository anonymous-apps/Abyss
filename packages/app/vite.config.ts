import react from '@vitejs/plugin-react';
import { join } from 'path';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
    base: './',
    plugins: [
        react(),
        electron([
            {
                entry: 'server/main/index.ts',
                onstart(options) {
                    options.startup();
                },
                vite: {
                    build: {
                        outDir: 'dist-electron/main',
                        rollupOptions: {
                            output: {
                                entryFileNames: '[name].mjs',
                            },
                        },
                        watch: {},
                    },
                },
            },
            {
                entry: 'server/preload/index.ts',
                onstart(options) {
                    options.reload();
                },
                vite: {
                    build: {
                        outDir: 'dist-electron/preload',
                        rollupOptions: {
                            external: ['@abyss/intelligence'],
                            output: {
                                entryFileNames: '[name].mjs',
                            },
                        },
                        watch: {},
                    },
                },
            },
        ]),
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
