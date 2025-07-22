import '@testing-library/jest-dom';

import { type Mock, afterAll, afterEach, beforeAll, vi } from 'vitest';

// --- Mock window.matchMedia ---
const createMockMatchMedia = (query: string) => ({
    matches: query.includes('light'), // Default to preferring light
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
});

// Store the original matchMedia to restore later if needed
let originalMatchMedia: ((query: string) => MediaQueryList) | undefined;

beforeAll(() => {
    // Save original before defining mock
    originalMatchMedia = window.matchMedia;

    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn(createMockMatchMedia),
    });
});

afterEach(() => {
    // Reset the mock implementation for each test to ensure isolation
    (window.matchMedia as Mock).mockClear();
    (window.matchMedia as Mock).mockImplementation(createMockMatchMedia);
});

afterAll(() => {
    // Restore original matchMedia after all tests in this suite are done
    if (originalMatchMedia) {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: originalMatchMedia,
        });
    }
});

// --- Mock localStorage ---
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

// Store the original localStorage to restore later
let originalLocalStorage: Storage | undefined;

beforeAll(() => {
    // Save original before defining mock
    originalLocalStorage = window.localStorage;

    Object.defineProperty(window, 'localStorage', {
        writable: true,
        value: localStorageMock,
    });
});

afterEach(() => {
    // Clear localStorage mock before each test
    localStorageMock.clear();
});

afterAll(() => {
    // Restore original localStorage after all tests
    if (originalLocalStorage) {
        Object.defineProperty(window, 'localStorage', {
            writable: true,
            value: originalLocalStorage,
        });
    }
});
