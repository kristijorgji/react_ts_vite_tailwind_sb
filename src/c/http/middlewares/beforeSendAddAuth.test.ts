import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/c/session', () => ({
    getAccessToken: vi.fn(() => 'test-access-token'),
}));

import beforeSendAddAuth from './beforeSendAddAuth';

describe('beforeSendAddAuth', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('adds Authorization header with Bearer token', () => {
        const ri: RequestInit = { method: 'GET' };
        const result = beforeSendAddAuth(ri);
        expect(result.headers).toEqual(
            expect.objectContaining({
                Authorization: 'Bearer test-access-token',
            })
        );
    });

    it('preserves existing headers', () => {
        const ri: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        const result = beforeSendAddAuth(ri);
        expect(result.headers).toEqual(
            expect.objectContaining({
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-access-token',
            })
        );
    });

    it('preserves other RequestInit properties', () => {
        const ri: RequestInit = { method: 'POST', body: '{"data":true}' };
        const result = beforeSendAddAuth(ri);
        expect(result.method).toBe('POST');
        expect(result.body).toBe('{"data":true}');
    });
});
