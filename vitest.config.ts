import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig((env) =>
    mergeConfig(
        typeof viteConfig === 'function' ? viteConfig(env) : viteConfig,
        defineConfig({
            resolve: {
                alias: {
                    '@test': path.join(dirname, 'test'),
                },
            },
            test: {
                globals: true,
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
                            environment: 'jsdom',
                            setupFiles: ['./test/setup.ts'],
                            css: true,
                            include: ['src/**/*.{test,spec}.{ts,tsx}'],
                        },
                    },
                    {
                        test: {
                            name: 'eslint-rules',
                            environment: 'node',
                            include: ['eslint/**/*.test.ts'],
                            globals: true,
                        },
                    },
                    {
                        test: {
                            name: 'scripts',
                            environment: 'node',
                            include: ['scripts/**/*.test.ts'],
                            globals: true,
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
        })
    )
);
