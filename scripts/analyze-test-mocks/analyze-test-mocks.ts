import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { Project, type SourceFile, SyntaxKind } from 'ts-morph';

export const DEFAULT_SCAN_PATHS = ['src'] as const;
export const DEFAULT_SIMILARITY_THRESHOLD = 0.8;

const DELEGATES_TO_HELPER_PATTERN =
    /\bcreate[A-Z]\w*Mock\w*\s*\(|(?:await\s+)?import\(\s*['"][^'"]*(?:\/mocks\/|\/testing|__tests__|@test\/)[^'"]*['"]/;

const PATH_ALIASES: Record<string, string> = {
    '@/': 'src/',
    '@': 'src/',
};

export type MockGroupStatus = 'identical' | 'near-duplicate' | 'divergent';

export interface AnalyzeTestMocksOptions {
    repoRoot: string;
    scanPaths?: readonly string[];
    minOccurrences?: number;
    minLines?: number;
    similarityThreshold?: number;
}

export interface MockOccurrence {
    filePath: string;
    line: number;
    lineCount: number;
    factoryHash: string | null;
    rawSpecifier: string;
    delegatesToHelper: boolean;
}

export interface SimilarPairRef {
    filePath: string;
    line: number;
}

export interface TopSimilarPair {
    left: SimilarPairRef;
    right: SimilarPairRef;
    score: number;
}

export interface MockModuleGroup {
    groupKey: string;
    specifierKind: 'package' | 'resolved-path';
    occurrences: MockOccurrence[];
    nonDelegatingOccurrences: MockOccurrence[];
    identical: boolean;
    status: MockGroupStatus;
    maxLineCount: number;
    topSimilarPair?: TopSimilarPair;
}

export interface AlreadyUsingHelperGroup {
    groupKey: string;
    specifierKind: 'package' | 'resolved-path';
    delegatingOccurrences: MockOccurrence[];
    allOccurrences: MockOccurrence[];
}

export interface AnalyzeTestMocksResult {
    groups: MockModuleGroup[];
    alreadyUsingHelpers: AlreadyUsingHelperGroup[];
    scannedFiles: number;
}

function unquoteStringLiteral(text: string): string {
    const trimmed = text.trim();
    if (
        (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith('`') && trimmed.endsWith('`'))
    ) {
        return trimmed.slice(1, -1);
    }

    return trimmed;
}

function normalizeFactoryBody(text: string): string {
    return text
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|\s)\/\/.*$/gm, '')
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/\)([}\]])/g, ') $1')
        .replace(/\s+/g, ' ')
        .trim();
}

export function factoryDelegatesToHelper(factoryText: string | null): boolean {
    if (factoryText === null) {
        return false;
    }

    return DELEGATES_TO_HELPER_PATTERN.test(factoryText);
}

export function tokenizeFactory(text: string): Set<string> {
    return new Set(normalizeFactoryBody(text).match(/[A-Za-z_$][\w$]*|[^\s]/g) ?? []);
}

export function jaccardSimilarity(left: Set<string>, right: Set<string>): number {
    if (left.size === 0 && right.size === 0) {
        return 1;
    }

    if (left.size === 0 || right.size === 0) {
        return 0;
    }

    let intersection = 0;
    for (const token of left) {
        if (right.has(token)) {
            intersection += 1;
        }
    }

    return intersection / (left.size + right.size - intersection);
}

export function factoryJaccardSimilarity(leftFactory: string, rightFactory: string): number {
    return jaccardSimilarity(tokenizeFactory(leftFactory), tokenizeFactory(rightFactory));
}

export function hashFactoryBody(factoryText: string | null): string | null {
    if (factoryText === null) {
        return null;
    }

    const normalized = normalizeFactoryBody(factoryText);
    if (normalized.length === 0) {
        return null;
    }

    return createHash('sha256').update(normalized).digest('hex').slice(0, 12);
}

function resolveRelativeSpecifier(specifier: string, sourceFilePath: string, repoRoot: string): string {
    const sourceDir = path.dirname(sourceFilePath);
    const resolved = path.resolve(sourceDir, specifier);
    return path.relative(repoRoot, resolved);
}

export function resolveMockModuleKey(
    rawSpecifier: string,
    sourceFilePath: string,
    repoRoot: string
): { groupKey: string; specifierKind: 'package' | 'resolved-path' } {
    const specifier = unquoteStringLiteral(rawSpecifier);

    if (specifier.startsWith('.')) {
        return {
            groupKey: resolveRelativeSpecifier(specifier, sourceFilePath, repoRoot),
            specifierKind: 'resolved-path',
        };
    }

    for (const [alias, target] of Object.entries(PATH_ALIASES)) {
        if (specifier === alias.replace(/\/$/, '') || specifier.startsWith(alias)) {
            const rest = specifier.startsWith(alias) ? specifier.slice(alias.length) : '';
            return {
                groupKey: path.join(target, rest).replace(/\\/g, '/'),
                specifierKind: 'resolved-path',
            };
        }
    }

    return { groupKey: specifier, specifierKind: 'package' };
}

function isMockCall(expressionText: string): boolean {
    return expressionText === 'vi.mock' || expressionText === 'jest.mock';
}

function collectMockOccurrences(sourceFile: SourceFile): (MockOccurrence & { factoryText: string | null })[] {
    const occurrences: (MockOccurrence & { factoryText: string | null })[] = [];
    const filePath = sourceFile.getFilePath();

    for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
        const expressionText = call.getExpression().getText();
        if (!isMockCall(expressionText)) {
            continue;
        }

        const args = call.getArguments();
        if (args.length === 0) {
            continue;
        }

        const rawSpecifier = args[0].getText();
        const factoryArg = args[1];
        const factoryText = factoryArg ? factoryArg.getText() : null;
        const fullMockText = call.getText();
        const lineCount = fullMockText.split('\n').length;

        occurrences.push({
            filePath,
            line: call.getStartLineNumber(),
            lineCount,
            factoryHash: hashFactoryBody(factoryText),
            rawSpecifier,
            delegatesToHelper: factoryDelegatesToHelper(factoryText),
            factoryText,
        });
    }

    return occurrences;
}

interface RawModuleGroup {
    groupKey: string;
    specifierKind: 'package' | 'resolved-path';
    occurrences: (MockOccurrence & { factoryText: string | null })[];
    maxLineCount: number;
}

function computeGroupStatusFromFactories(
    occurrences: (MockOccurrence & { factoryText: string | null })[],
    similarityThreshold: number
): { status: MockGroupStatus; identical: boolean; topSimilarPair?: TopSimilarPair } {
    if (occurrences.length < 2) {
        return { status: 'divergent', identical: false };
    }

    const stripped = occurrences.map(({ factoryText: _factoryText, ...occurrence }) => occurrence);
    const hashes = new Set(stripped.map((occurrence) => occurrence.factoryHash ?? '__none__'));
    if (hashes.size === 1) {
        return { status: 'identical', identical: true };
    }

    let topScore = 0;
    let topSimilarPair: TopSimilarPair | undefined;

    for (let leftIndex = 0; leftIndex < occurrences.length; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < occurrences.length; rightIndex += 1) {
            const left = occurrences[leftIndex];
            const right = occurrences[rightIndex];
            if (!left || !right || !left.factoryText || !right.factoryText) {
                continue;
            }

            const score = factoryJaccardSimilarity(left.factoryText, right.factoryText);
            if (score > topScore) {
                topScore = score;
                topSimilarPair = {
                    left: { filePath: left.filePath, line: left.line },
                    right: { filePath: right.filePath, line: right.line },
                    score,
                };
            }
        }
    }

    const status: MockGroupStatus = topScore >= similarityThreshold ? 'near-duplicate' : 'divergent';
    return { status, identical: false, topSimilarPair };
}

function groupOccurrences(
    allOccurrences: (MockOccurrence & {
        factoryText: string | null;
        groupKey: string;
        specifierKind: 'package' | 'resolved-path';
    })[],
    minOccurrences: number,
    minLines: number,
    similarityThreshold: number
): Pick<AnalyzeTestMocksResult, 'groups' | 'alreadyUsingHelpers'> {
    const byKey = new Map<string, RawModuleGroup>();

    for (const occurrence of allOccurrences) {
        if (occurrence.lineCount < minLines) {
            continue;
        }

        const existing = byKey.get(occurrence.groupKey);
        if (!existing) {
            byKey.set(occurrence.groupKey, {
                groupKey: occurrence.groupKey,
                specifierKind: occurrence.specifierKind,
                occurrences: [occurrence],
                maxLineCount: occurrence.lineCount,
            });
            continue;
        }

        existing.occurrences.push(occurrence);
        existing.maxLineCount = Math.max(existing.maxLineCount, occurrence.lineCount);
    }

    const groups: MockModuleGroup[] = [];
    const alreadyUsingHelpers: AlreadyUsingHelperGroup[] = [];

    for (const rawGroup of byKey.values()) {
        if (rawGroup.occurrences.length < minOccurrences) {
            continue;
        }

        const occurrences = rawGroup.occurrences.map(({ factoryText: _factoryText, ...occurrence }) => occurrence);
        const nonDelegatingOccurrences = occurrences.filter((occurrence) => !occurrence.delegatesToHelper);
        const delegatingOccurrences = occurrences.filter((occurrence) => occurrence.delegatesToHelper);

        if (nonDelegatingOccurrences.length < minOccurrences) {
            alreadyUsingHelpers.push({
                groupKey: rawGroup.groupKey,
                specifierKind: rawGroup.specifierKind,
                delegatingOccurrences,
                allOccurrences: occurrences,
            });
            continue;
        }

        const nonDelegatingWithFactory = rawGroup.occurrences.filter((occurrence) => !occurrence.delegatesToHelper);
        const { status, identical, topSimilarPair } = computeGroupStatusFromFactories(
            nonDelegatingWithFactory,
            similarityThreshold
        );

        groups.push({
            groupKey: rawGroup.groupKey,
            specifierKind: rawGroup.specifierKind,
            occurrences,
            nonDelegatingOccurrences,
            identical,
            status,
            maxLineCount: rawGroup.maxLineCount,
            topSimilarPair,
        });
    }

    const sortGroups = <
        T extends { groupKey: string; allOccurrences?: MockOccurrence[]; occurrences?: MockOccurrence[] },
    >(
        left: T,
        right: T
    ): number => {
        const leftCount = left.allOccurrences?.length ?? left.occurrences?.length ?? 0;
        const rightCount = right.allOccurrences?.length ?? right.occurrences?.length ?? 0;
        if (rightCount !== leftCount) {
            return rightCount - leftCount;
        }

        return left.groupKey.localeCompare(right.groupKey);
    };

    return {
        groups: groups.sort(sortGroups),
        alreadyUsingHelpers: alreadyUsingHelpers.sort(sortGroups),
    };
}

function walkDirectory(directoryPath: string, onFile: (filePath: string) => void): void {
    for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
        const entryPath = path.join(directoryPath, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'coverage') {
                continue;
            }
            walkDirectory(entryPath, onFile);
            continue;
        }

        if (entry.isFile()) {
            onFile(entryPath);
        }
    }
}

export function listTestFiles(repoRoot: string, scanPaths: readonly string[]): string[] {
    const files: string[] = [];

    for (const scanPath of scanPaths) {
        const absoluteScanPath = path.join(repoRoot, scanPath);
        if (!fs.existsSync(absoluteScanPath)) {
            continue;
        }

        walkDirectory(absoluteScanPath, (filePath) => {
            if (/\.(test|spec)\.(ts|tsx)$/.test(filePath)) {
                files.push(filePath);
            }
        });
    }

    return files;
}

export function analyzeTestMocks(options: AnalyzeTestMocksOptions): AnalyzeTestMocksResult {
    const scanPaths = options.scanPaths ?? DEFAULT_SCAN_PATHS;
    const minOccurrences = options.minOccurrences ?? 2;
    const minLines = options.minLines ?? 8;
    const similarityThreshold = options.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;
    const testFiles = listTestFiles(options.repoRoot, scanPaths);

    const project = new Project({
        skipAddingFilesFromTsConfig: true,
        compilerOptions: {
            allowJs: true,
        },
    });

    const sourceFiles = project.addSourceFilesAtPaths(testFiles);
    const taggedOccurrences: (MockOccurrence & {
        factoryText: string | null;
        groupKey: string;
        specifierKind: 'package' | 'resolved-path';
    })[] = [];

    for (const sourceFile of sourceFiles) {
        for (const occurrence of collectMockOccurrences(sourceFile)) {
            const { groupKey, specifierKind } = resolveMockModuleKey(
                occurrence.rawSpecifier,
                occurrence.filePath,
                options.repoRoot
            );
            taggedOccurrences.push({ ...occurrence, groupKey, specifierKind });
        }
    }

    const { groups, alreadyUsingHelpers } = groupOccurrences(
        taggedOccurrences,
        minOccurrences,
        minLines,
        similarityThreshold
    );

    return {
        groups,
        alreadyUsingHelpers,
        scannedFiles: sourceFiles.length,
    };
}

function formatStatusLabel(group: MockModuleGroup): string {
    if (group.status === 'near-duplicate' && group.topSimilarPair) {
        const percent = Math.round(group.topSimilarPair.score * 100);
        return `near-duplicate (max ${percent}%)`;
    }

    return group.status;
}

function formatSimilarPair(repoRoot: string, pair: TopSimilarPair): string {
    const left = path.relative(repoRoot, pair.left.filePath);
    const right = path.relative(repoRoot, pair.right.filePath);
    const percent = Math.round(pair.score * 100);
    return `- Closest pair (${percent}%): \`${left}:${pair.left.line}\` ↔ \`${right}:${pair.right.line}\``;
}

export function formatReport(
    result: AnalyzeTestMocksResult,
    options: { repoRoot: string; minOccurrences: number; minLines: number; similarityThreshold?: number }
): string {
    const similarityThreshold = options.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;
    const lines: string[] = [
        '# Test mock usage report',
        '',
        `Scanned **${result.scannedFiles}** test files.`,
        `Thresholds: >= **${options.minOccurrences}** non-delegating occurrences, >= **${options.minLines}** lines per mock, near-duplicate >= **${Math.round(similarityThreshold * 100)}%** similarity.`,
        '',
    ];

    if (result.groups.length === 0) {
        lines.push('No extraction candidates matched the thresholds.');
    } else {
        for (const group of result.groups) {
            lines.push(
                `## ${group.groupKey}`,
                '',
                `- Kind: ${group.specifierKind}`,
                `- Status: **${formatStatusLabel(group)}**`,
                `- Occurrences: ${group.occurrences.length} (${group.nonDelegatingOccurrences.length} non-delegating)`,
                `- Max lines: ${group.maxLineCount}`
            );

            if (group.topSimilarPair && group.status !== 'identical') {
                lines.push(formatSimilarPair(options.repoRoot, group.topSimilarPair));
            }

            lines.push(
                '',
                '| File | Line | Lines | Delegates | Factory hash |',
                '| ---- | ---- | ----- | --------- | ------------ |'
            );

            for (const occurrence of group.occurrences) {
                const relativePath = path.relative(options.repoRoot, occurrence.filePath);
                const delegates = occurrence.delegatesToHelper ? 'yes' : 'no';
                lines.push(
                    `| \`${relativePath}\` | ${occurrence.line} | ${occurrence.lineCount} | ${delegates} | ${occurrence.factoryHash ?? '—'} |`
                );
            }

            lines.push('');
        }
    }

    if (result.alreadyUsingHelpers.length > 0) {
        lines.push('## Already using shared mock helpers', '');
        lines.push('These module groups have fewer than the required non-delegating inline mocks.', '');

        for (const group of result.alreadyUsingHelpers) {
            lines.push(`### ${group.groupKey}`, '');
            lines.push(
                `- Kind: ${group.specifierKind}`,
                `- Total occurrences: ${group.allOccurrences.length}`,
                `- Delegating to shared helper: ${group.delegatingOccurrences.length}`,
                '',
                '| File | Line | Lines | Delegates |',
                '| ---- | ---- | ----- | --------- |'
            );

            for (const occurrence of group.allOccurrences) {
                const relativePath = path.relative(options.repoRoot, occurrence.filePath);
                const delegates = occurrence.delegatesToHelper ? 'yes' : 'no';
                lines.push(`| \`${relativePath}\` | ${occurrence.line} | ${occurrence.lineCount} | ${delegates} |`);
            }

            lines.push('');
        }
    }

    if (result.groups.length === 0 && result.alreadyUsingHelpers.length === 0) {
        lines.push('No duplicate multi-line mocks matched the thresholds.');
    }

    return `${lines.join('\n')}\n`;
}
