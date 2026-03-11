import { describe, expect, it } from 'vitest';

import beforeSendContentJson, { isFormData } from './beforeSendContentJson';

describe('isFormData', () => {
    it('returns true for FormData', () => {
        const fd = new FormData();
        expect(isFormData(fd)).toBe(true);
    });

    it('returns false for plain objects', () => {
        expect(isFormData({ key: 'value' })).toBeFalsy();
    });

    it('returns false for undefined', () => {
        expect(isFormData(undefined)).toBeFalsy();
    });

    it('returns false for null', () => {
        expect(isFormData(null)).toBeFalsy();
    });

    it('returns true for object with append function (duck typing)', () => {
        expect(isFormData({ append: () => {} })).toBe(true);
    });
});

describe('beforeSendContentJson', () => {
    it('adds JSON content headers for regular requests', () => {
        const ri: RequestInit = { method: 'POST', body: '{}' };
        const result = beforeSendContentJson(ri);
        expect(result.headers).toEqual(
            expect.objectContaining({
                Accept: 'application/json',
                'Content-Type': 'application/json',
            })
        );
    });

    it('preserves existing headers', () => {
        const ri: RequestInit = {
            method: 'POST',
            body: '{}',
            headers: { Authorization: 'Bearer token' },
        };
        const result = beforeSendContentJson(ri);
        expect(result.headers).toEqual(
            expect.objectContaining({
                Authorization: 'Bearer token',
                Accept: 'application/json',
                'Content-Type': 'application/json',
            })
        );
    });

    it('returns ri unchanged when body is FormData', () => {
        const fd = new FormData();
        const ri: RequestInit = { method: 'POST', body: fd };
        const result = beforeSendContentJson(ri);
        expect(result).toBe(ri);
    });
});
