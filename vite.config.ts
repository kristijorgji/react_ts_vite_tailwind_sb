/// <reference types="vitest" />
/// <reference types="vite/client" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import removeAttributes from 'vite-plugin-react-remove-attributes';
import tsconfigPaths from 'vite-tsconfig-paths';

import { envValidator } from './vite-env-validator';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        envValidator(),
        tsconfigPaths(),
        tailwindcss(),
        react(),
        // Only strip attributes in production mode

        mode === 'production' &&
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            (removeAttributes as any).default({
                attributes: ['data-testid'],
            }),
    ],
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
                statements: 44.51,
                branches: 75,
                functions: 39,
                lines: 44.51,
            },
        },
    },
}));
