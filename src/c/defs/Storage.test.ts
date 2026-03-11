import { afterEach, describe, expect, it, vi } from 'vitest';

import Storage from './Storage';

describe('Storage', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('setItem stores a string value', () => {
        const s = new Storage();
        s.setItem('key', 'value');
        expect(localStorage.setItem).toHaveBeenCalledWith('key', 'value');
    });

    it('setItem stringifies object values', () => {
        const s = new Storage();
        const obj = { foo: 'bar' };
        s.setItem('key', obj);
        expect(localStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(obj));
    });

    it('setItem stringifies array values', () => {
        const s = new Storage();
        const arr = [{ id: 1 }];
        s.setItem('key', arr);
        expect(localStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(arr));
    });

    it('getItem retrieves value from localStorage', () => {
        const s = new Storage();
        vi.mocked(localStorage.getItem).mockReturnValue('stored-value');
        const result = s.getItem('key');
        expect(result).toBe('stored-value');
    });

    it('getItem returns null for missing keys', () => {
        const s = new Storage();
        vi.mocked(localStorage.getItem).mockReturnValue(null);
        const result = s.getItem('missing');
        expect(result).toBeNull();
    });

    it('removeItem removes from localStorage', () => {
        const s = new Storage();
        s.removeItem('key');
        expect(localStorage.removeItem).toHaveBeenCalledWith('key');
    });
});
