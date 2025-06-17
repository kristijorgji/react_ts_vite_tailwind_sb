/// <reference types="vitest" />
/// <reference types="vite/client" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), tailwindcss(), react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './__tests__/setup.ts',
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'html'],
            include: ['src/**/*.{ts,tsx}'],
            thresholds: {
                autoUpdate: false,
                statements: 37.5,
                branches: 77.02,
                functions: 37.23,
                lines: 37.5,
            },
        },
    },
});
