/**
 * Warn when a file declares more than one PascalCase React component.
 * Replaces eslint-plugin-react's `react/no-multi-comp` (incompatible with ESLint 10).
 */

/**
 * @param {string | undefined} name
 * @returns {boolean}
 */
function isComponentName(name) {
    return typeof name === 'string' && /^[A-Z]/.test(name);
}

/**
 * @param {import('estree').Node | null | undefined} node
 * @returns {boolean}
 */
function isFunctionLike(node) {
    return (
        node != null &&
        (node.type === 'FunctionExpression' ||
            node.type === 'ArrowFunctionExpression' ||
            node.type === 'FunctionDeclaration')
    );
}

function createNoMultiCompRule() {
    return {
        meta: {
            type: 'suggestion',
            docs: {
                description: 'Disallow multiple React components in a single file',
            },
            schema: [],
            messages: {
                tooMany:
                    'Declare only one React component per file (found {{count}}). Extract extras into their own modules.',
            },
        },
        /**
         * @param {import('eslint').Rule.RuleContext} context
         */
        create(context) {
            /** @type {import('estree').Node[]} */
            const components = [];

            return {
                FunctionDeclaration(node) {
                    if (isComponentName(node.id?.name)) {
                        components.push(node);
                    }
                },
                VariableDeclarator(node) {
                    if (
                        node.id.type === 'Identifier' &&
                        isComponentName(node.id.name) &&
                        isFunctionLike(node.init)
                    ) {
                        components.push(node);
                    }
                },
                ClassDeclaration(node) {
                    if (isComponentName(node.id?.name)) {
                        components.push(node);
                    }
                },
                'Program:exit'() {
                    if (components.length <= 1) {
                        return;
                    }
                    for (const node of components.slice(1)) {
                        context.report({
                            node,
                            messageId: 'tooMany',
                            data: { count: String(components.length) },
                        });
                    }
                },
            };
        },
    };
}

export const noMultiCompRules = {
    files: ['**/*.tsx'],
    ignores: ['**/*.test.tsx', '**/*.stories.tsx', '.storybook/**'],
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
};

export { createNoMultiCompRule };
