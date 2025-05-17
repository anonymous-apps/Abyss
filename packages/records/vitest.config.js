import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: ['./vitest.setup.js'],
        // Add other Vitest configurations here if needed
    },
});
