import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
    analyzeTestMocks,
    factoryDelegatesToHelper,
    factoryJaccardSimilarity,
    hashFactoryBody,
    resolveMockModuleKey,
} from './analyze-test-mocks';

const repoRoot = path.resolve(import.meta.dirname, '../..');

function makeTempDir(prefix: string): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

describe('hashFactoryBody', () => {
    it('returns the same hash for whitespace-equivalent factories', () => {
        const left = hashFactoryBody(`() => ({
            foo: jest.fn(),
        })`);
        const right = hashFactoryBody(`() => ({ foo: jest.fn() })`);

        expect(left).toBeTruthy();
        expect(left).toBe(right);
    });

    it('returns different hashes for different factories', () => {
        const left = hashFactoryBody('() => ({ foo: jest.fn() })');
        const right = hashFactoryBody('() => ({ bar: jest.fn() })');

        expect(left).not.toBe(right);
    });
});

describe('factoryDelegatesToHelper', () => {
    it('detects create*Mock* helper calls', () => {
        expect(factoryDelegatesToHelper('() => createAuthProviderMockModule(() => ({}))')).toBe(true);
    });

    it('detects dynamic imports from mock paths', () => {
        expect(
            factoryDelegatesToHelper("async () => { const m = await import('@test/mocks/routing'); return m; }")
        ).toBe(true);
    });

    it('returns false for inline factories', () => {
        expect(factoryDelegatesToHelper('() => ({ foo: jest.fn() })')).toBe(false);
    });
});

describe('factoryJaccardSimilarity', () => {
    it('scores near-identical factories highly', () => {
        const left = `() => ({
    PermissionStatus: { GRANTED: 'granted' },
    getPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
})`;
        const right = `() => ({
    PermissionStatus: { GRANTED: 'granted', DENIED: 'denied' },
    getPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
})`;

        expect(factoryJaccardSimilarity(left, right)).toBeGreaterThanOrEqual(0.8);
    });

    it('scores clearly different factories low', () => {
        const left = '() => ({ foo: jest.fn(), bar: jest.fn() })';
        const right = '() => ({ alpha: 1, beta: 2, gamma: 3 })';

        expect(factoryJaccardSimilarity(left, right)).toBeLessThan(0.5);
    });
});

describe('resolveMockModuleKey', () => {
    it('keeps package specifiers as package keys', () => {
        const resolved = resolveMockModuleKey(
            "'react-i18next'",
            path.join(repoRoot, 'src/c/hooks/foo.test.ts'),
            repoRoot
        );

        expect(resolved).toEqual({
            groupKey: 'react-i18next',
            specifierKind: 'package',
        } satisfies NonNullable<typeof resolved>);
    });

    it('resolves relative specifiers to repo-relative paths', () => {
        const resolved = resolveMockModuleKey(
            "'../../session'",
            path.join(repoRoot, 'src/c/hooks/auth/useDemoLogin.test.ts'),
            repoRoot
        );

        expect(resolved.groupKey).toBe('src/c/session');
        expect(resolved.specifierKind).toBe('resolved-path');
    });

    it('resolves @/ path aliases to src/', () => {
        const resolved = resolveMockModuleKey(
            "'@/c/logout'",
            path.join(repoRoot, 'src/c/components/pages/SettingsPage/SettingsPage.test.tsx'),
            repoRoot
        );

        expect(resolved.groupKey).toBe('src/c/logout');
        expect(resolved.specifierKind).toBe('resolved-path');
    });
});

describe('analyzeTestMocks', () => {
    let fixtureRoot = '';

    afterEach(() => {
        if (fixtureRoot) {
            fs.rmSync(fixtureRoot, { recursive: true, force: true });
            fixtureRoot = '';
        }
    });

    it('groups identical mocks across files and marks them identical', () => {
        fixtureRoot = makeTempDir('mock-analyze-');
        const scanRoot = path.join(fixtureRoot, 'src');
        const factory = `jest.mock('expo-notifications', () => ({
    PermissionStatus: { GRANTED: 'granted' },
    getPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
}));`;

        fs.mkdirSync(path.join(scanRoot, 'screens', 'a'), { recursive: true });
        fs.mkdirSync(path.join(scanRoot, 'screens', 'b'), { recursive: true });
        fs.writeFileSync(path.join(scanRoot, 'screens', 'a', 'A.test.ts'), factory);
        fs.writeFileSync(path.join(scanRoot, 'screens', 'b', 'B.test.ts'), factory);

        const result = analyzeTestMocks({
            repoRoot: fixtureRoot,
            scanPaths: ['src'],
            minOccurrences: 2,
            minLines: 4,
        });

        expect(result.groups).toHaveLength(1);
        expect(result.groups[0]?.groupKey).toBe('expo-notifications');
        expect(result.groups[0]?.identical).toBe(true);
        expect(result.groups[0]?.status).toBe('identical');
        expect(result.groups[0]?.occurrences).toHaveLength(2);
    });

    it('marks near-duplicate mocks for the same module', () => {
        fixtureRoot = makeTempDir('mock-analyze-');
        const scanRoot = path.join(fixtureRoot, 'src');
        const left = `jest.mock('expo-notifications', () => ({
    PermissionStatus: { GRANTED: 'granted' },
    getPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
}));`;
        const right = `jest.mock('expo-notifications', () => ({
    PermissionStatus: { GRANTED: 'granted', DENIED: 'denied' },
    getPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
}));`;

        fs.mkdirSync(path.join(scanRoot, 'screens', 'a'), { recursive: true });
        fs.mkdirSync(path.join(scanRoot, 'screens', 'b'), { recursive: true });
        fs.writeFileSync(path.join(scanRoot, 'screens', 'a', 'A.test.ts'), left);
        fs.writeFileSync(path.join(scanRoot, 'screens', 'b', 'B.test.ts'), right);

        const result = analyzeTestMocks({
            repoRoot: fixtureRoot,
            scanPaths: ['src'],
            minOccurrences: 2,
            minLines: 4,
        });

        expect(result.groups).toHaveLength(1);
        expect(result.groups[0]?.status).toBe('near-duplicate');
        expect(result.groups[0]?.topSimilarPair?.score).toBeGreaterThanOrEqual(0.8);
    });

    it('marks clearly different mocks as divergent', () => {
        fixtureRoot = makeTempDir('mock-analyze-');
        const scanRoot = path.join(fixtureRoot, 'src');
        const left = `jest.mock('expo-notifications', () => ({
    PermissionStatus: { GRANTED: 'granted' },
    getPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
}));`;
        const right = `jest.mock('expo-notifications', () => ({
    isDevice: true,
    launchCameraAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(),
}));`;

        fs.mkdirSync(path.join(scanRoot, 'screens', 'a'), { recursive: true });
        fs.mkdirSync(path.join(scanRoot, 'screens', 'b'), { recursive: true });
        fs.writeFileSync(path.join(scanRoot, 'screens', 'a', 'A.test.ts'), left);
        fs.writeFileSync(path.join(scanRoot, 'screens', 'b', 'B.test.ts'), right);

        const result = analyzeTestMocks({
            repoRoot: fixtureRoot,
            scanPaths: ['src'],
            minOccurrences: 2,
            minLines: 4,
        });

        expect(result.groups).toHaveLength(1);
        expect(result.groups[0]?.status).toBe('divergent');
    });

    it('respects a higher similarity threshold', () => {
        fixtureRoot = makeTempDir('mock-analyze-');
        const scanRoot = path.join(fixtureRoot, 'src');
        const left = `jest.mock('expo-notifications', () => ({
    PermissionStatus: { GRANTED: 'granted' },
    getPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
}));`;
        const right = `jest.mock('expo-notifications', () => ({
    PermissionStatus: { GRANTED: 'granted', DENIED: 'denied' },
    getPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
}));`;

        fs.mkdirSync(path.join(scanRoot, 'screens', 'a'), { recursive: true });
        fs.mkdirSync(path.join(scanRoot, 'screens', 'b'), { recursive: true });
        fs.writeFileSync(path.join(scanRoot, 'screens', 'a', 'A.test.ts'), left);
        fs.writeFileSync(path.join(scanRoot, 'screens', 'b', 'B.test.ts'), right);

        const result = analyzeTestMocks({
            repoRoot: fixtureRoot,
            scanPaths: ['src'],
            minOccurrences: 2,
            minLines: 4,
            similarityThreshold: 0.99,
        });

        expect(result.groups).toHaveLength(1);
        expect(result.groups[0]?.status).toBe('divergent');
    });

    it('moves helper-delegating groups to alreadyUsingHelpers', () => {
        fixtureRoot = makeTempDir('mock-analyze-');
        const scanRoot = path.join(fixtureRoot, 'src');
        const delegating = `jest.mock('expo-notifications', () => createExpoNotificationsMockModule());`;
        const inline = `jest.mock('expo-notifications', () => ({
    PermissionStatus: { GRANTED: 'granted' },
    getPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
}));`;

        fs.mkdirSync(path.join(scanRoot, 'screens', 'a'), { recursive: true });
        fs.mkdirSync(path.join(scanRoot, 'screens', 'b'), { recursive: true });
        fs.writeFileSync(path.join(scanRoot, 'screens', 'a', 'A.test.ts'), delegating);
        fs.writeFileSync(path.join(scanRoot, 'screens', 'b', 'B.test.ts'), inline);

        const result = analyzeTestMocks({
            repoRoot: fixtureRoot,
            scanPaths: ['src'],
            minOccurrences: 2,
            minLines: 1,
        });

        expect(result.groups).toHaveLength(0);
        expect(result.alreadyUsingHelpers).toHaveLength(1);
        expect(result.alreadyUsingHelpers[0]?.groupKey).toBe('expo-notifications');
        expect(result.alreadyUsingHelpers[0]?.delegatingOccurrences).toHaveLength(1);
    });

    it('filters out mocks below the line threshold', () => {
        fixtureRoot = makeTempDir('mock-analyze-');
        const scanRoot = path.join(fixtureRoot, 'src');
        const shortMock = `jest.mock('expo-device', () => ({ isDevice: true }));`;

        fs.mkdirSync(path.join(scanRoot, 'screens', 'a'), { recursive: true });
        fs.mkdirSync(path.join(scanRoot, 'screens', 'b'), { recursive: true });
        fs.writeFileSync(path.join(scanRoot, 'screens', 'a', 'A.test.ts'), shortMock);
        fs.writeFileSync(path.join(scanRoot, 'screens', 'b', 'B.test.ts'), shortMock);

        const result = analyzeTestMocks({
            repoRoot: fixtureRoot,
            scanPaths: ['src'],
            minOccurrences: 2,
            minLines: 8,
        });

        expect(result.groups).toHaveLength(0);
        expect(result.alreadyUsingHelpers).toHaveLength(0);
    });
});
