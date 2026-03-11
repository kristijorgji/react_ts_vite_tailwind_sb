import { describe, expect, it } from 'vitest';

import { LoadableData } from './LoadableData';

describe('LoadableData', () => {
    it('creates with constructor', () => {
        const ld = new LoadableData({ value: 'hello', loading: false, error: null });
        expect(ld.value).toBe('hello');
        expect(ld.loading).toBe(false);
        expect(ld.error).toBeNull();
    });

    describe('value factory', () => {
        it('creates a loaded state with value', () => {
            const ld = LoadableData.value(42);
            expect(ld.value).toBe(42);
            expect(ld.loading).toBe(false);
            expect(ld.error).toBeNull();
        });
    });

    describe('error factory', () => {
        it('creates an error state', () => {
            const err = new Error('failed');
            const ld = LoadableData.error(err);
            expect(ld.value).toBeNull();
            expect(ld.loading).toBe(false);
            expect(ld.error).toBe(err);
        });

        it('creates an error state with fallback value', () => {
            const err = new Error('failed');
            const ld = LoadableData.error(err, 'fallback');
            expect(ld.value).toBe('fallback');
            expect(ld.error).toBe(err);
        });
    });

    describe('loading factory', () => {
        it('creates a loading state', () => {
            const ld = LoadableData.loading();
            expect(ld.value).toBeNull();
            expect(ld.loading).toBe(true);
            expect(ld.error).toBeNull();
        });
    });
});
