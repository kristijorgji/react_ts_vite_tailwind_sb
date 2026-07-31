import { type RefObject, useEffect } from 'react';

/**
 * Invokes `onOutside` when a mousedown occurs outside `ref`.
 */
export default function useClickOutside(ref: RefObject<HTMLElement | null>, onOutside: () => void): void {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onOutside();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref, onOutside]);
}
