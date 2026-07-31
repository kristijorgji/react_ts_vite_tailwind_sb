/**
 * Ban thin `index.ts` barrels that only re-export a single symbol (usually a React
 * component) from a sibling path — import the module file directly instead.
 *
 * Allows multi-export domain/index barrels.
 */

/**
 * @param {import('estree').Program} program
 * @returns {{ node: import('estree').Node, exportName: string, source: string } | null}
 */
function getSingleReExport(program) {
    /** @type {import('estree').ExportNamedDeclaration[]} */
    const reExports = [];
    for (const statement of program.body) {
        if (statement.type === 'ExportNamedDeclaration' && statement.source) {
            reExports.push(statement);
            continue;
        }
        // Anything else (imports, declarations, export *) disqualifies the thin-barrel pattern.
        return null;
    }
    if (reExports.length === 0) {
        return null;
    }

    /** @type {{ node: import('estree').Node, exportName: string, source: string }[]} */
    const specs = [];
    for (const decl of reExports) {
        const source = typeof decl.source.value === 'string' ? decl.source.value : null;
        if (!source) {
            return null;
        }
        for (const spec of decl.specifiers) {
            if (spec.type !== 'ExportSpecifier') {
                return null;
            }
            const exportName = spec.exported.type === 'Identifier' ? spec.exported.name : null;
            if (!exportName) {
                return null;
            }
            specs.push({ node: decl, exportName, source });
        }
    }

    if (specs.length !== 1) {
        return null;
    }

    return specs[0] ?? null;
}

function createNoSingleExportBarrelRule() {
    return {
        meta: {
            type: 'problem',
            docs: {
                description: 'Disallow index.ts barrels that only re-export a single symbol from a sibling module',
            },
            schema: [],
            messages: {
                noSingleExportBarrel:
                    "Avoid a single-export index barrel (`export { {{name}} } from '{{source}}'`). Import `{{source}}` directly and delete this file.",
            },
        },
        create(context) {
            const filename = context.filename.replace(/\\/g, '/');
            if (!/(^|\/)index\.tsx?$/.test(filename)) {
                return {};
            }

            return {
                Program(node) {
                    const single = getSingleReExport(node);
                    if (!single) {
                        return;
                    }
                    // Component-style (PascalCase) or obvious UI modules only.
                    if (!/^[A-Z]/.test(single.exportName)) {
                        return;
                    }
                    context.report({
                        node: single.node,
                        messageId: 'noSingleExportBarrel',
                        data: { name: single.exportName, source: single.source },
                    });
                },
            };
        },
    };
}

export const noSingleExportBarrelRules = {
    files: ['**/src/**/index.ts', '**/src/**/index.tsx'],
    ignores: ['**/node_modules/**'],
    plugins: {
        'no-single-export-barrel': {
            rules: {
                'no-single-export-barrel': createNoSingleExportBarrelRule(),
            },
        },
    },
    rules: {
        'no-single-export-barrel/no-single-export-barrel': 'error',
    },
};
