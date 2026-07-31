import { type RefObject } from 'react';

import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useClickOutside from './useClickOutside';

describe('useClickOutside', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('calls onOutside when mousedown is outside the element', () => {
        const onOutside = vi.fn();
        const element = document.createElement('div');
        document.body.appendChild(element);
        const ref: RefObject<HTMLDivElement | null> = { current: element };

        renderHook(() => useClickOutside(ref, onOutside));

        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(onOutside).toHaveBeenCalledTimes(1);

        element.remove();
    });

    it('does not call onOutside when mousedown is inside the element', () => {
        const onOutside = vi.fn();
        const element = document.createElement('div');
        document.body.appendChild(element);
        const ref: RefObject<HTMLDivElement | null> = { current: element };

        renderHook(() => useClickOutside(ref, onOutside));

        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(onOutside).not.toHaveBeenCalled();

        element.remove();
    });
});
