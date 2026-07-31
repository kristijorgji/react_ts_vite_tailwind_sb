import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactDom from 'eslint-plugin-react-dom';
import reactX from 'eslint-plugin-react-x';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import storybook from 'eslint-plugin-storybook';
import sonarjs from 'eslint-plugin-sonarjs';
import unusedImports from 'eslint-plugin-unused-imports';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { componentExtractionDetectionRules } from './eslint/component-extraction-detection.js';
import { pureTypeAliasRules } from './eslint/no-pure-type-alias.js';
import { noSingleExportBarrelRules } from './eslint/no-single-export-barrel.js';
import { createNoWeakTypeofSatisfiesConfig } from './eslint/no-weak-typeof-satisfies.js';
import { mockBodySatisfiesSyntaxRules, objectLiteralTypingSyntaxRules } from './eslint/typing-syntax.js';
import translationsEslintConfig from './eslint.translations.config.js';

const weakTypeofConfig = createNoWeakTypeofSatisfiesConfig();

export default tseslint.config(
    { ignores: ['dist', 'coverage', 'storybook-static', 'reports', 'scripts', '!.storybook', 'eslint/**'] },

    ...storybook.configs['flat/recommended'],

    {
        rules: {
            'storybook/no-renderer-packages': 'off',
        },
    },

    // main rule set
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierConfig],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            prettier: prettierPlugin,
            'react-x': reactX,
            'react-dom': reactDom,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'import-x': importPlugin,
            sonarjs,
            'unused-imports': unusedImports,
            perfectionist,
            ...weakTypeofConfig.plugins,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            ...reactX.configs['recommended-typescript'].rules,
            ...reactDom.configs.recommended.rules,
            'prettier/prettier': 'error',
            'import-x/first': 'error',
            'import-x/no-duplicates': 'error',
            'import-x/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling']],
                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: '@/**',
                            group: 'external',
                            position: 'after',
                        },
                        {
                            pattern: '@test/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['react'],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'sort-imports': [
                'error',
                {
                    ignoreDeclarationSort: true,
                },
            ],
            '@typescript-eslint/ban-ts-comment': 'off',

            // Core no-unused-vars does not understand TypeScript
            'no-unused-vars': 'off',

            // --- Unused symbols ---
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            'unused-imports/no-unused-imports': 'error',

            // --- In-file dead code ---
            'no-unreachable': 'error',
            '@typescript-eslint/no-unused-private-class-members': 'error',
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                },
            ],

            // --- Duplication within a file; cross-file clones use jscpd ---
            'sonarjs/no-identical-functions': 'error',
            'sonarjs/no-duplicated-branches': 'error',
            'sonarjs/no-all-duplicated-branches': 'error',
            'sonarjs/no-identical-conditions': 'error',
            'sonarjs/no-identical-expressions': 'error',

            // --- Explicit typing ---
            '@typescript-eslint/consistent-type-assertions': [
                'error',
                {
                    assertionStyle: 'as',
                    objectLiteralTypeAssertions: 'never',
                    arrayLiteralTypeAssertions: 'never',
                },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'inline-type-imports',
                    disallowTypeAnnotations: true,
                },
            ],
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowHigherOrderFunctions: true,
                },
            ],
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            ...weakTypeofConfig.rules,

            // --- JSX attribute order (leading keys match common a11y/test props) ---
            'perfectionist/sort-jsx-props': [
                'error',
                {
                    type: 'alphabetical',
                    order: 'asc',
                    ignoreCase: true,
                    groups: ['testid', 'key', 'ref', 'id', 'name', 'unknown', 'callback'],
                    customGroups: [
                        {
                            groupName: 'testid',
                            elementNamePattern: '^(data-testid|testID)$',
                        },
                        {
                            groupName: 'key',
                            elementNamePattern: '^key$',
                        },
                        {
                            groupName: 'ref',
                            elementNamePattern: '^ref$',
                        },
                        {
                            groupName: 'id',
                            elementNamePattern: '^id$',
                        },
                        {
                            groupName: 'name',
                            elementNamePattern: '^name$',
                        },
                        {
                            groupName: 'callback',
                            elementNamePattern: '^on.+',
                        },
                    ],
                },
            ],
        },
    },

    // Ban debug console noise in app source (warn/error remain allowed)
    {
        files: ['src/**/*.{ts,tsx}'],
        rules: {
            'no-console': ['error', { allow: ['warn', 'error'] }],
        },
    },

    // Const-bound object/array/JSX literals must use `: Type` on the binding
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            'no-restricted-syntax': ['error', ...objectLiteralTypingSyntaxRules],
        },
    },

    // Tests and stories: also require `satisfies` on inline mock/expect/JSON bodies
    {
        files: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.ts', '**/*.stories.tsx'],
        rules: {
            'no-restricted-syntax': [
                'error',
                ...objectLiteralTypingSyntaxRules,
                ...mockBodySatisfiesSyntaxRules,
            ],
        },
    },

    pureTypeAliasRules,

    noSingleExportBarrelRules,

    // JSX components: skip return types on inline helpers (exports still covered by boundary rule)
    {
        files: ['**/*.tsx'],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },

    // Tests/mocks: nested factories and local harness components are intentional
    {
        files: ['**/*.test.ts', '**/*.test.tsx', 'test/**'],
        rules: {
            'react-x/component-hook-factories': 'off',
        },
    },

    // Component / hook size (warn-only extraction signals)
    ...componentExtractionDetectionRules,

    translationsEslintConfig,
);
