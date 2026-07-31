import { Linter } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

import { noPureTypeAliasRule } from './no-pure-type-alias.js';

const linter = new Linter({ version: '9.0.0' });

function lint(code: string): Linter.LintMessage[] {
    return linter.verify(code, {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            'type-alias': {
                rules: {
                    'no-pure-alias': noPureTypeAliasRule,
                },
            },
        },
        rules: {
            'type-alias/no-pure-alias': 'error',
        },
    });
}

describe('no-pure-type-alias', () => {
    it('flags pure identifier re-aliases', () => {
        const messages = lint('type Session = ApiLoginResponse;');
        expect(messages.some((message) => message.ruleId === 'type-alias/no-pure-alias')).toBe(true);
    });

    it('allows generics', () => {
        const messages = lint('type Result = Promise<string>;');
        expect(messages.filter((message) => message.ruleId === 'type-alias/no-pure-alias')).toEqual([]);
    });

    it('allows unions', () => {
        const messages = lint('type Status = "a" | "b";');
        expect(messages.filter((message) => message.ruleId === 'type-alias/no-pure-alias')).toEqual([]);
    });

    it('allows indexed access', () => {
        const messages = lint('type Email = User["email"];');
        expect(messages.filter((message) => message.ruleId === 'type-alias/no-pure-alias')).toEqual([]);
    });
});
