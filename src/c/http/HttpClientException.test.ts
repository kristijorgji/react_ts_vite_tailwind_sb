import { describe, expect, it } from 'vitest';

import HttpClientException from './HttpClientException';

describe('HttpClientException', () => {
    it('stores statusCode and responseData', () => {
        const exception = new HttpClientException(404, { error: 'not found' });
        expect(exception.statusCode).toBe(404);
        expect(exception.responseData).toEqual({ error: 'not found' });
        expect(exception.name).toBe('HttpClientException');
    });

    it('extends Error', () => {
        const exception = new HttpClientException(500, null);
        expect(exception).toBeInstanceOf(Error);
    });
});
