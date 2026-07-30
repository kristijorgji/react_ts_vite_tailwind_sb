import { Linter } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

import { createNoMultiCompRule } from './no-multi-comp.js';

const linter = new Linter({ version: '9.0.0' });

function lint(code: string): Linter.LintMessage[] {
    return linter.verify(code, {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            'no-multi-comp': {
                rules: {
                    'no-multi-comp': createNoMultiCompRule(),
                },
            },
        },
        rules: {
            'no-multi-comp/no-multi-comp': 'warn',
        },
    });
}

describe('no-multi-comp', () => {
    it('allows a single component', () => {
        const messages = lint(`
            export function Button() {
                return null;
            }
        `);
        expect(messages.filter((message) => message.ruleId === 'no-multi-comp/no-multi-comp')).toEqual(
            [],
        );
    });

    it('flags a second component in the same file', () => {
        const messages = lint(`
            export function Button() {
                return null;
            }
            function Icon() {
                return null;
            }
        `);
        expect(messages.some((message) => message.ruleId === 'no-multi-comp/no-multi-comp')).toBe(true);
    });

    it('ignores lowercase helpers', () => {
        const messages = lint(`
            function helper() {
                return null;
            }
            export function Button() {
                return null;
            }
        `);
        expect(messages.filter((message) => message.ruleId === 'no-multi-comp/no-multi-comp')).toEqual(
            [],
        );
    });
});
