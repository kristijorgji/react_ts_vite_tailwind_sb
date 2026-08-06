import path from 'node:path';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.ts';

export default defineConfig((env) =>
    mergeConfig(
        typeof viteConfig === 'function' ? viteConfig(env) : viteConfig,
        defineConfig({
            // Pre-bundle deps Storybook browser tests need so Vite does not reload mid-run on CI.
            optimizeDeps: {
                include: ['@welldone-software/why-did-you-render', 'react-router-dom'],
            },
            test: {
                globals: true,
                coverage: {
                    provider: 'v8',
                    reporter: ['text', 'lcov', 'html'],
                    include: ['src/**/*.{ts,tsx}'],
                    exclude: [
                        // Thin app glue; localized routing logic is covered in
                        // @kristijorgji/react-localized-routing.
                        'src/core/routing/AppRouter.tsx',
                        'src/core/routing/routesConfig.tsx',
                        'src/core/routing/routes.ts',
                    ],
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
                        plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
                        test: {
                            name: 'storybook',
                            browser: {
                                enabled: true,
                                headless: true,
                                provider: playwright(),
                                instances: [{ browser: 'chromium' }],
                            },
                        },
                    },
                ],
            },
        })
    )
);
