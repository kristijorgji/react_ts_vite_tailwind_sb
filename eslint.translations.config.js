/**
 * This configuration file is a specialized ESLint rule set for detecting and preventing hardcoded strings
 * in the codebase. It uses the `eslint-plugin-formatjs` to enforce that all user-facing strings
 * are handled through a translation system, ensuring internationalization. It also includes an `ignores`
 * array to exclude specific files from this check, such as tests and files with intentional, non-translatable strings.
 */

import formatjs from 'eslint-plugin-formatjs'


const mandatoryIgnores = [
    '**/*.test.{ts,tsx}',
    '**/*.stories.{ts,tsx}',
    '**/__tests__/**',
];

export default {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
        ...mandatoryIgnores,
        // you can add here more files
    ],
    plugins: {
        formatjs: formatjs,
    },
    rules: {
        'formatjs/no-literal-string-in-jsx': [
            'error',
            {
                props: {
                    include: [
                        ['*', '(placeholder|label|title|alt|aria-{label,description})'],
                    ],
                },
            }
        ],
        // 'formatjs/no-literal-string-in-object': [
        //     'error',
        // ],
    },
}
