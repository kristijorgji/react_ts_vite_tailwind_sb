import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type AfterMiddleware, type BeforeMiddleware, type FetchFn, fetchFn } from './http';

describe('fetchFn', () => {
    const baseUrl = 'https://api.example.com';
    let mockFetch: ReturnType<typeof vi.fn<FetchFn>>;

    beforeEach(() => {
        mockFetch = vi.fn<FetchFn>().mockResolvedValue(new Response('ok'));
    });

    it('prepends baseUrl to the request path', async () => {
        const fn = fetchFn(mockFetch, baseUrl);
        await fn('/users');
        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', undefined);
    });

    it('passes init options through', async () => {
        const fn = fetchFn(mockFetch, baseUrl);
        const init: RequestInit = { method: 'POST', body: '{}' };
        await fn('/users', init);
        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', init);
    });

    it('applies before middlewares in order', async () => {
        const addAuth: BeforeMiddleware = (ri) => ({
            ...ri,
            headers: { ...ri.headers, Authorization: 'Bearer token' },
        });
        const addContentType: BeforeMiddleware = (ri) => ({
            ...ri,
            headers: { ...ri.headers, 'Content-Type': 'application/json' },
        });

        const fn = fetchFn(mockFetch, baseUrl, { before: [addAuth, addContentType] });
        await fn('/users', { method: 'GET' });

        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer token',
                'Content-Type': 'application/json',
            },
        });
    });

    it('calls after middlewares with the response', async () => {
        const response = new Response('data');
        mockFetch.mockResolvedValue(response);

        const afterMiddleware: AfterMiddleware = vi.fn();
        const fn = fetchFn(mockFetch, baseUrl, { after: [afterMiddleware] });
        const result = await fn('/data');

        expect(afterMiddleware).toHaveBeenCalledWith(response);
        expect(result).toBe(response);
    });

    it('works without middlewares', async () => {
        const fn = fetchFn(mockFetch, baseUrl);
        await fn('/test');
        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', undefined);
    });

    it('works with empty middleware arrays', async () => {
        const fn = fetchFn(mockFetch, baseUrl, { before: [], after: [] });
        await fn('/test', { method: 'GET' });
        expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', { method: 'GET' });
    });
});
