import { ESLintUtils } from '@typescript-eslint/utils';
import ts from 'typescript';

const createRule = ESLintUtils.RuleCreator(
    () => 'https://github.com/kristijorgji/react_ts_vite_tailwind_sb/blob/main/eslint/no-weak-typeof-satisfies.js',
);

function isAnyOrUnknown(type) {
    if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return true;
    if (type.isUnion?.()) {
        return type.types.every((part) => isAnyOrUnknown(part));
    }
    return false;
}

/**
 * Flags `typeof expr` inside `satisfies` when `expr` resolves to `any` or `unknown`.
 * Catches untyped `await res.json()` bodies and similar weak expectation typing.
 */
export const noWeakTypeofSatisfiesRule = createRule({
    name: 'no-weak-typeof-satisfies',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow typeof in satisfies when the expression type is any or unknown.',
        },
        schema: [],
        messages: {
            weakTypeof:
                'Do not use `typeof {{expr}}` in `satisfies` when it resolves to any/unknown. Use an exported API/domain type, ReturnType, or a named alias instead.',
        },
    },
    defaultOptions: [],
    create(context) {
        const services = ESLintUtils.getParserServices(context, /* allowWithoutFullTypeInformation */ true);
        if (!services.program) {
            return {};
        }
        const checker = services.program.getTypeChecker();

        /**
         * @param {import('@typescript-eslint/utils').TSESTree.Node} node
         */
        function visit(node) {
            if (!node || typeof node !== 'object' || !('type' in node)) return;

            if (node.type === 'TSTypeQuery') {
                try {
                    const tsNode = services.esTreeNodeToTSNodeMap.get(node);
                    if (tsNode && ts.isTypeQueryNode(tsNode)) {
                        const type = checker.getTypeFromTypeNode(tsNode);
                        if (isAnyOrUnknown(type)) {
                            context.report({
                                node,
                                messageId: 'weakTypeof',
                                data: { expr: context.sourceCode.getText(node.exprName) },
                            });
                        }
                    }
                } catch {
                    // Incomplete parser services — skip.
                }
            }

            for (const key of Object.keys(node)) {
                if (key === 'parent' || key === 'loc' || key === 'range' || key === 'type') continue;
                const child = node[key];
                if (!child || typeof child !== 'object') continue;
                if (Array.isArray(child)) {
                    for (const item of child) visit(item);
                } else if ('type' in child) {
                    visit(child);
                }
            }
        }

        return {
            TSSatisfiesExpression(node) {
                visit(node.typeAnnotation);
            },
        };
    },
});

/** Flat-config fragment: plugin + rule. */
export function createNoWeakTypeofSatisfiesConfig() {
    return {
        plugins: {
            'repo-typing': {
                rules: {
                    'no-weak-typeof-satisfies': noWeakTypeofSatisfiesRule,
                },
            },
        },
        rules: {
            'repo-typing/no-weak-typeof-satisfies': 'error',
        },
    };
}
