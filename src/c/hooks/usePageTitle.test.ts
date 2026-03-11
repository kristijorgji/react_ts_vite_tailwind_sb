import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import usePageTitle from './usePageTitle';

describe('usePageTitle', () => {
    it('sets document title on mount', () => {
        renderHook(() => usePageTitle('Test Page'));
        expect(document.title).toBe('Test Page');
    });

    it('updates document title when title changes', () => {
        const { rerender } = renderHook(({ title }) => usePageTitle(title), {
            initialProps: { title: 'First' },
        });
        expect(document.title).toBe('First');
        rerender({ title: 'Second' });
        expect(document.title).toBe('Second');
    });
});
