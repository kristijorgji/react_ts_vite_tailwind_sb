import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import useDidMountEffect from './useDidMountEffect';

describe('useDidMountEffect', () => {
    it('calls the effect on mount', () => {
        const effect = vi.fn();
        renderHook(() => useDidMountEffect(effect));
        expect(effect).toHaveBeenCalledTimes(1);
    });

    it('does not call the effect on re-render', () => {
        const effect = vi.fn();
        const { rerender } = renderHook(() => useDidMountEffect(effect));
        rerender();
        rerender();
        expect(effect).toHaveBeenCalledTimes(1);
    });

    it('calls cleanup function on unmount', () => {
        const cleanup = vi.fn();
        const effect = vi.fn(() => cleanup);
        const { unmount } = renderHook(() => useDidMountEffect(effect));
        unmount();
        expect(cleanup).toHaveBeenCalledTimes(1);
    });
});
