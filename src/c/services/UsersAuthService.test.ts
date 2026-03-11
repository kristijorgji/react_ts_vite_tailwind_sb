import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/c/api/api', () => ({
    default: {
        post: vi.fn(),
    },
}));

import api from '@/c/api/api';
import HttpClientException from '@/c/http/HttpClientException';

import UsersAuthService from './UsersAuthService';

describe('UsersAuthService', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('is a singleton', () => {
        const a = UsersAuthService.getInstance();
        const b = UsersAuthService.getInstance();
        expect(a).toBe(b);
    });

    it('renewAccessToken returns tokens on 200 response', async () => {
        const tokenData = {
            accessToken: 'new-at',
            accessTokenExpiresAt: '2027-01-01',
        };
        vi.mocked(api.post).mockResolvedValue(new Response(JSON.stringify(tokenData), { status: 200 }));

        const result = await UsersAuthService.getInstance().renewAccessToken('refresh-token');
        expect(result).toEqual(tokenData);
    });

    it('renewAccessToken throws HttpClientException on non-200', async () => {
        vi.mocked(api.post).mockResolvedValue(new Response(null, { status: 401 }));

        await expect(UsersAuthService.getInstance().renewAccessToken('bad-token')).rejects.toThrow(HttpClientException);
    });
});
