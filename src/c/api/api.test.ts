import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockFetch, mockGetSession, mockSetSessionAccessToken, mockRenewAccessToken } = vi.hoisted(() => ({
    mockFetch: vi.fn(),
    mockGetSession: vi.fn(),
    mockSetSessionAccessToken: vi.fn(),
    mockRenewAccessToken: vi.fn(),
}));

vi.mock('@/c/session', () => ({
    getAccessToken: vi.fn(() => 'at-123'),
    getSession: mockGetSession,
    setSessionAccessToken: mockSetSessionAccessToken,
}));

vi.mock('@/c/services/UsersAuthService', () => ({
    default: {
        getInstance: () => ({
            renewAccessToken: mockRenewAccessToken,
        }),
    },
}));

vi.mock('@/c/logout', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/env.ts', () => ({
    default: { apiBasePath: 'https://api.test.com' },
}));

vi.stubGlobal('fetch', mockFetch);

describe('api module', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('request function prepends base URL and applies middlewares', async () => {
        mockFetch.mockResolvedValue(new Response('ok', { status: 200 }));

        const { request } = await import('./api');
        const response = await request('/test', { method: 'GET' });

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.test.com/test',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: expect.stringContaining('Bearer'),
                }),
            })
        );
        expect(response.status).toBe(200);
    });

    it('default export is an HttpClient instance', async () => {
        const apiModule = await import('./api');
        expect(apiModule.default).toBeDefined();
        expect(apiModule.default.get).toBeDefined();
        expect(apiModule.default.post).toBeDefined();
    });
});
