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
    ...reactConfig,

    {
        rules: {
            'storybook/no-renderer-packages': 'off',
        },
    },

    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off',
        },
    },

    {
        files: ['src/**/*.{ts,tsx}'],
        rules: {
            'no-console': ['error', { allow: ['warn', 'error'] }],
        },
    },

    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            'no-restricted-syntax': restrictedSyntaxRuleEntry([objectLiteralTypingSelectors]),
        },
    },

    {
        files: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.ts', '**/*.stories.tsx'],
        rules: {
            'no-restricted-syntax': restrictedSyntaxRuleEntry([
                objectLiteralTypingSelectors,
                mockBodySatisfiesSelectors,
            ]),
        },
    },

    {
        files: ['**/*.test.ts', '**/*.test.tsx', 'test/**'],
        languageOptions: {
            globals: {
                ...globals.vitest,
            },
        },
        rules: {
            'react-x/component-hook-factories': 'off',
        },
    },

    translationsEslintConfig,
];
