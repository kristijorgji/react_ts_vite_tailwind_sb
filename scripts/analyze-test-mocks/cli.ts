#!/usr/bin/env tsx
/**
 * Find near-duplicate mock/fixture blocks across test files for extraction.
 *
 * Package script: `pnpm analyze:test-mocks`
 * Writes `reports/test-mock-usage/report.md`.
 *
 * Environment:
 * - `MIN_OCCURRENCES` — minimum inline occurrences (default 2)
 * - `MIN_LINES` — minimum block size in lines (default 8)
 * - `SIMILARITY_THRESHOLD` — near-duplicate score 0–1 (default 0.8)
 *
 * @see .agents/skills/test-deduplication/SKILL.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    analyzeTestMocks,
    DEFAULT_SIMILARITY_THRESHOLD,
    formatReport,
} from './analyze-test-mocks.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const REPORT_DIR = path.join(ROOT, 'reports', 'test-mock-usage');
const REPORT_PATH = path.join(REPORT_DIR, 'report.md');

function parsePositiveInt(value: string | undefined, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSimilarityThreshold(value: string | undefined): number {
    if (!value) {
        return DEFAULT_SIMILARITY_THRESHOLD;
    }

    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 1) {
        return DEFAULT_SIMILARITY_THRESHOLD;
    }

    return parsed;
}

function formatGroupStatus(group: { status: string; topSimilarPair?: { score: number } }): string {
    if (group.status === 'near-duplicate' && group.topSimilarPair) {
        return `near-duplicate (${Math.round(group.topSimilarPair.score * 100)}%)`;
    }

    return group.status;
}

function main(): void {
    const minOccurrences = parsePositiveInt(process.env.MIN_OCCURRENCES, 2);
    const minLines = parsePositiveInt(process.env.MIN_LINES, 8);
    const similarityThreshold = parseSimilarityThreshold(process.env.SIMILARITY_THRESHOLD);

    const result = analyzeTestMocks({
        repoRoot: ROOT,
        minOccurrences,
        minLines,
        similarityThreshold,
    });

    const report = formatReport(result, {
        repoRoot: ROOT,
        minOccurrences,
        minLines,
        similarityThreshold,
    });
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(REPORT_PATH, report);

    console.info(`analyze-test-mocks: scanned ${result.scannedFiles} files`);
    console.info(`analyze-test-mocks: ${result.groups.length} extraction candidate(s)`);
    console.info(
        `analyze-test-mocks: ${result.alreadyUsingHelpers.length} group(s) already using shared helpers`
    );
    console.info(`analyze-test-mocks: wrote ${path.relative(ROOT, REPORT_PATH)}`);

    if (result.groups.length === 0 && result.alreadyUsingHelpers.length === 0) {
        console.info(`No duplicate mocks found spanning ${minLines} lines or more.`);
        return;
    }

    for (const group of result.groups) {
        console.info(
            `\n${group.groupKey} (${formatGroupStatus(group)}, ${group.nonDelegatingOccurrences.length} inline, max ${group.maxLineCount} lines)`
        );
        for (const occurrence of group.occurrences) {
            const delegateNote = occurrence.delegatesToHelper ? ' [delegates]' : '';
            console.info(
                `  - [${occurrence.lineCount} lines]${delegateNote} ${path.relative(ROOT, occurrence.filePath)}:${occurrence.line}`
            );
        }
    }
}

main();
