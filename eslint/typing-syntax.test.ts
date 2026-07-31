import { Linter } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

import { mockBodySatisfiesSyntaxRules, objectLiteralTypingSyntaxRules } from './typing-syntax.js';

const linter = new Linter({ version: '9.0.0' });

function lint(code: string, ruleConfig: Linter.RuleEntry): Linter.LintMessage[] {
    return linter.verify(code, {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        rules: {
            'no-restricted-syntax': ruleConfig,
        },
    });
}

function expectRestricted(code: string, ruleConfig: Linter.RuleEntry): void {
    const messages = lint(code, ruleConfig);
    expect(messages.some((message) => message.ruleId === 'no-restricted-syntax')).toBe(true);
}

function expectAllowed(code: string, ruleConfig: Linter.RuleEntry): void {
    const messages = lint(code, ruleConfig);
    expect(messages.filter((message) => message.ruleId === 'no-restricted-syntax')).toEqual([]);
}

const objectLiteralRules: Linter.RuleEntry = ['error', ...objectLiteralTypingSyntaxRules];
const mockBodyRules: Linter.RuleEntry = ['error', ...mockBodySatisfiesSyntaxRules];

describe('objectLiteralTypingSyntaxRules', () => {
    it('allows annotated const object literals', () => {
        expectAllowed('const x: Record<string, never> = {};', objectLiteralRules);
    });

    it('allows primitives without annotations', () => {
        expectAllowed('const n = 2;', objectLiteralRules);
    });

    it('flags untyped const object literals', () => {
        expectRestricted('const mock = { id: "1" };', objectLiteralRules);
    });

    it('flags const object literals with satisfies instead of binding annotation', () => {
        expectRestricted('const mock = { id: "1" } satisfies Record<string, string>;', objectLiteralRules);
    });

    it('allows const initialized from a typed function call', () => {
        expectAllowed(
            'function create(): { id: string } { return { id: "1" }; } const chain = create();',
            objectLiteralRules
        );
    });
});

describe('mockBodySatisfiesSyntaxRules', () => {
    it('allows inline mock bodies with satisfies', () => {
        expectAllowed('type R = { id: string }; mock.mockReturnValue({ id: "1" } satisfies R);', mockBodyRules);
    });

    it('allows annotated const mocks outside inline mock calls', () => {
        expectAllowed(
            'const mock: { mockReturnValue: (v: unknown) => void } = { mockReturnValue: () => {} };',
            mockBodyRules
        );
    });

    it('flags bare inline mockReturnValue object literals', () => {
        expectRestricted('mock.mockReturnValue({ id: "1" });', mockBodyRules);
    });

    it('allows inline toEqual bodies with satisfies', () => {
        expectAllowed('type R = { id: string }; expect(x).toEqual({ id: "1" } satisfies R);', mockBodyRules);
    });

    it('allows inline toStrictEqual and toMatchObject bodies with satisfies', () => {
        expectAllowed(
            'type R = { id: string }; expect(x).toStrictEqual({ id: "1" } satisfies R); expect(y).toMatchObject({ id: "1" } satisfies R);',
            mockBodyRules
        );
    });

    it('flags bare inline toEqual object literals', () => {
        expectRestricted('expect(x).toEqual({ id: "1" });', mockBodyRules);
    });

    it('flags bare inline toStrictEqual object literals', () => {
        expectRestricted('expect(x).toStrictEqual({ id: "1" });', mockBodyRules);
    });

    it('flags bare inline toMatchObject object literals', () => {
        expectRestricted('expect(x).toMatchObject({ id: "1" });', mockBodyRules);
    });

    it('flags satisfies Record<string, unknown>', () => {
        expectRestricted('expect(x).toEqual({ id: "1" } satisfies Record<string, unknown>);', mockBodyRules);
    });

    it('flags satisfies Record<string, any>', () => {
        expectRestricted('expect(x).toEqual({ id: "1" } satisfies Record<string, any>);', mockBodyRules);
    });

    it('flags satisfies any / unknown / object keywords', () => {
        expectRestricted('expect(x).toEqual({ id: "1" } satisfies any);', mockBodyRules);
        expectRestricted('expect(x).toEqual({ id: "1" } satisfies unknown);', mockBodyRules);
        expectRestricted('expect(x).toEqual({ id: "1" } satisfies object);', mockBodyRules);
    });
});
