import {
    mockBodySatisfiesSelectors,
    objectLiteralTypingSelectors,
    restrictedSyntaxRuleEntry,
} from '@kristijorgji/eslint-plugin';
import { createReactConfig } from '@kristijorgji/eslint-config-react-typescript';
import globals from 'globals';

import translationsEslintConfig from './eslint.translations.config.js';

const reactConfig = await createReactConfig({
    variant: 'vite',
    tsconfigRootDir: import.meta.dirname,
    storybook: true,
    prettier: 'prettierrc',
    codeQuality: true,
    explicitTypes: true,
    importOrder: {
        pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'external', position: 'after' },
            { pattern: '@test/**', group: 'internal', position: 'before' },
        ],
        pathGroupsExcludedImportTypes: ['react'],
    },
    sortImports: { ignoreCase: false, allowSeparatedGroups: false },
    ignores: ['dist', 'coverage', 'storybook-static', 'reports'],
    extractionIgnores: [
        '**/components/ui/**',
        '**/*.test.tsx',
        '**/*.stories.tsx',
        '**/*.test.ts',
        '**/*.stories.ts',
        '.storybook/**',
    ],
});

/** @type {import('eslint').Linter.Config[]} */
export default [
    // Shared React/TS/Vite/Storybook baseline from @kristijorgji/eslint-config-react-typescript.
    ...reactConfig,

    // This Vite app does not import Storybook renderer packages; disable the check.
    {
        files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
        rules: {
            'storybook/no-renderer-packages': 'off',
        },
    },

    // Project-wide TS/TSX: console policy, ban-ts-comment, and object-literal typing.
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            'no-console': ['error', { allow: ['warn', 'error'] }],
            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-expect-error': 'allow-with-description',
                    'ts-ignore': true,
                    'ts-nocheck': true,
                    'ts-check': true,
                    minimumDescriptionLength: 5,
                },
            ],
            'no-restricted-syntax': restrictedSyntaxRuleEntry([objectLiteralTypingSelectors]),
        },
    },

    // Tests, stories, and shared test helpers: also require `satisfies` on mock/expectation bodies.
    // Re-lists objectLiteralTypingSelectors because no-restricted-syntax replaces (does not merge).
    {
        files: ['**/*.{test,stories}.{ts,tsx}', 'test/**'],
        rules: {
            'no-restricted-syntax': restrictedSyntaxRuleEntry([
                objectLiteralTypingSelectors,
                mockBodySatisfiesSelectors,
            ]),
        },
    },

    // Vitest environment only — do not apply globals or this React rule override to stories.
    {
        files: ['**/*.test.{ts,tsx}', 'test/**'],
        languageOptions: {
            globals: {
                ...globals.vitest,
            },
        },
        rules: {
            'react-x/component-hook-factories': 'off',
        },
    },

    // i18n / translation-key linting (separate config module).
    translationsEslintConfig,
];
