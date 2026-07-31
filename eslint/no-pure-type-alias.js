/** Discourage pure re-alias declarations like `type A = B;` (identifier alias, no generics/indexing). */
export const noPureTypeAliasRule = {
    meta: {
        type: 'suggestion',
        docs: { description: 'Discourage pure type aliases; use the original type directly.' },
        schema: [],
        messages: {
            pureAlias:
                'Avoid pure type aliases (`type {{name}} = {{target}}`). Prefer the original type directly. If intentional, add an eslint-disable-next-line with a reason.',
        },
    },
    create(context) {
        return {
            TSTypeAliasDeclaration(node) {
                const ann = node.typeAnnotation;
                // Only flag `type A = SomeType` / `type A = Ns.Sub` with NO type arguments (a bare re-alias).
                if (ann?.type !== 'TSTypeReference') return;
                if (ann.typeArguments || ann.typeParameters) return;
                const target =
                    ann.typeName.type === 'Identifier' ? ann.typeName.name : context.sourceCode.getText(ann.typeName);
                context.report({ node, messageId: 'pureAlias', data: { name: node.id.name, target } });
            },
        };
    },
};

/** Flat-config block registering the rule across all TS files. */
export const pureTypeAliasRules = {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'type-alias': { rules: { 'no-pure-alias': noPureTypeAliasRule } } },
    rules: { 'type-alias/no-pure-alias': 'error' },
};
