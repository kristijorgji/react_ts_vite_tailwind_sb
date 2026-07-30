/**
 * Detection-only (warn): flag files with multiple components or excessive length for extraction.
 * Workflow: .agents/skills/component-extraction/SKILL.md
 */
const maxLinesPerFunctionComponent = ['warn', { max: 70, skipBlankLines: true, skipComments: true }];

const maxLinesPerFunctionHook = ['warn', { max: 120, skipBlankLines: true, skipComments: true }];

export const componentExtractionDetectionRules = [
    {
        files: ['**/*.tsx'],
        ignores: ['**/*.test.tsx', '**/*.stories.tsx'],
        rules: {
            'react/no-multi-comp': ['warn', { ignoreStateless: false }],
            'max-lines-per-function': maxLinesPerFunctionComponent,
            'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
        },
    },
    {
        files: ['**/use*.ts', '**/hooks/**/*.ts', 'src/c/hooks/**/*.ts'],
        ignores: ['**/*.test.ts'],
        rules: {
            'max-lines-per-function': maxLinesPerFunctionHook,
        },
    },
];
