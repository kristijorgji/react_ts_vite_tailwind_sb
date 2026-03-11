/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';
import removeAttributes from 'vite-plugin-react-remove-attributes';
import tsconfigPaths from 'vite-tsconfig-paths';

import { envValidator } from './vite-env-validator';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
    plugins: [
        envValidator(),
        tsconfigPaths(),
        tailwindcss(),
        react(),
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
                statements: 70,
                branches: 70,
                functions: 70,
                lines: 70,
            },
        },
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                },
            },
            {
                extends: true,
                plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright(),
                        instances: [{ browser: 'chromium' }],
                    },
                    setupFiles: ['.storybook/vitest.setup.ts'],
                },
            },
        ],
    },
}));
