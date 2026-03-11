import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import HttpClient from './HttpClient';

describe('HttpClient', () => {
    let mockRequest: Mock;
    let client: HttpClient;

    beforeEach(() => {
        mockRequest = vi.fn();
        client = new HttpClient(mockRequest);
    });

    it('get sends GET request', async () => {
        mockRequest.mockResolvedValue(new Response());
        await client.get('/api/test');
        expect(mockRequest).toHaveBeenCalledWith('/api/test', { method: 'GET' });
    });

    it('getJson sends GET and parses JSON', async () => {
        const data = { id: 1, name: 'test' };
        mockRequest.mockResolvedValue(new Response(JSON.stringify(data)));
        const result = await client.getJson('/api/test');
        expect(result).toEqual(data);
    });

    it('post sends POST with JSON body', async () => {
        mockRequest.mockResolvedValue(new Response());
        const body = { email: 'test@test.com' };
        await client.post('/api/login', body);
        expect(mockRequest).toHaveBeenCalledWith('/api/login', {
            method: 'POST',
            body: JSON.stringify(body),
        });
    });

    it('post sends POST with FormData body', async () => {
        mockRequest.mockResolvedValue(new Response());
        const formData = new FormData();
        formData.append('file', 'test');
        await client.post('/api/upload', formData);
        expect(mockRequest).toHaveBeenCalledWith('/api/upload', {
            method: 'POST',
            body: formData,
        });
    });

    it('post merges extra RequestInit options', async () => {
        mockRequest.mockResolvedValue(new Response());
        const body = { data: 'test' };
        const ri: RequestInit = { headers: { Authorization: 'Bearer abc' } };
        await client.post('/api/test', body, ri);
        expect(mockRequest).toHaveBeenCalledWith('/api/test', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { Authorization: 'Bearer abc' },
        });
    });

    it('put sends PUT with JSON body', async () => {
        mockRequest.mockResolvedValue(new Response());
        const body = { name: 'updated' };
        await client.put('/api/users/1', body);
        expect(mockRequest).toHaveBeenCalledWith('/api/users/1', {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    });

    it('patch sends PATCH with JSON body', async () => {
        mockRequest.mockResolvedValue(new Response());
        const body = { name: 'patched' };
        await client.patch('/api/users/1', body);
        expect(mockRequest).toHaveBeenCalledWith('/api/users/1', {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    });

    it('delete sends DELETE with JSON body', async () => {
        mockRequest.mockResolvedValue(new Response());
        const body = { id: 1 };
        await client.delete('/api/users/1', body);
        expect(mockRequest).toHaveBeenCalledWith('/api/users/1', {
            method: 'DELETE',
            body: JSON.stringify(body),
        });
    });

    describe('url', () => {
        it('replaces path parameters from array', () => {
            const result = client.url('/users/{id}/posts/{postId}', ['123', '456']);
            expect(result).toBe('/users/123/posts/456');
        });

        it('appends query parameters', () => {
            const result = client.url('/users', undefined, { page: '1', limit: '10' });
            expect(result).toBe('/users?page=1&limit=10');
        });

        it('replaces path params and appends query params', () => {
            const result = client.url('/users/{id}', ['42'], { include: 'posts' });
            expect(result).toBe('/users/42?include=posts');
        });

        it('throws when path param count mismatches', () => {
            expect(() => client.url('/users/{id}', ['1', '2'])).toThrow(
                "Number of path parameters doesn't match the required number"
            );
        });

        it('works with no params', () => {
            const result = client.url('/users');
            expect(result).toBe('/users');
        });

        it('encodes special characters in the URI', () => {
            const result = client.url('/search/{q}', ['hello world']);
            expect(result).toBe('/search/hello%20world');
        });
    });
});
