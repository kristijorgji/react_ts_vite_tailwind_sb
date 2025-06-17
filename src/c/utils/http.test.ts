import {
    addOrUpdateUrlQueryParameter,
    addOrUpdateUrlQueryParameters,
    removeGivenQueryParams,
    searchParamsToRecord,
} from './http';

describe('addOrUpdateUrlQueryParameter', () => {
    it('adds a new query parameter to a URL with no query', () => {
        const result = addOrUpdateUrlQueryParameter('https://example.com', 'foo', 'bar');
        expect(result).toBe('https://example.com?foo=bar');
    });

    it('adds a new parameter to a URL with existing query', () => {
        const result = addOrUpdateUrlQueryParameter('https://example.com?page=1', 'foo', 'bar');
        expect(result).toBe('https://example.com?page=1&foo=bar');
    });

    it('updates an existing parameter', () => {
        const result = addOrUpdateUrlQueryParameter('https://example.com?foo=old', 'foo', 'new');
        expect(result).toBe('https://example.com?foo=new');
    });

    it('removes parameter when value is empty', () => {
        const result = addOrUpdateUrlQueryParameter('https://example.com?foo=bar', 'foo', '');
        expect(result).toBe('https://example.com');
    });

    it('preserves hash fragments when adding', () => {
        const result = addOrUpdateUrlQueryParameter('https://example.com#section1', 'foo', 'bar');
        expect(result).toBe('https://example.com?foo=bar#section1');
    });

    it('preserves hash fragments when updating', () => {
        const result = addOrUpdateUrlQueryParameter('https://example.com?foo=old#hash', 'foo', 'new');
        expect(result).toBe('https://example.com?foo=new#hash');
    });

    it('removes parameter and preserves other parameters', () => {
        const result = addOrUpdateUrlQueryParameter('https://example.com?a=1&b=2&foo=bar', 'foo', '');
        expect(result).toBe('https://example.com?a=1&b=2');
    });

    it('encodes parameter value correctly', () => {
        const result = addOrUpdateUrlQueryParameter('https://example.com', 'message', 'hello world');
        expect(result).toBe('https://example.com?message=hello%20world');
    });
});

describe('addOrUpdateUrlQueryParameters', () => {
    it('adds multiple parameters to a clean URL', () => {
        const result = addOrUpdateUrlQueryParameters('https://example.com', {
            foo: 'bar',
            baz: 'qux',
        });
        expect(result).toBe('https://example.com?foo=bar&baz=qux');
    });

    it('updates existing parameters', () => {
        const result = addOrUpdateUrlQueryParameters('https://example.com?foo=old', {
            foo: 'new',
            baz: 'qux',
        });
        expect(result).toBe('https://example.com?foo=new&baz=qux');
    });

    it('removes a parameter when value is empty', () => {
        const result = addOrUpdateUrlQueryParameters('https://example.com?foo=bar&baz=qux', {
            foo: '',
            baz: 'updated',
        });
        expect(result).toBe('https://example.com?baz=updated');
    });

    it('preserves hash fragment', () => {
        const result = addOrUpdateUrlQueryParameters('https://example.com#section', {
            foo: 'bar',
        });
        expect(result).toBe('https://example.com?foo=bar#section');
    });

    it('handles an empty params object gracefully', () => {
        const result = addOrUpdateUrlQueryParameters('https://example.com?foo=bar', {});
        expect(result).toBe('https://example.com?foo=bar');
    });
});

describe('removeGivenQueryParams', () => {
    it('removes a single query parameter', () => {
        const url = 'https://example.com?page=1&token=abc';
        const result = removeGivenQueryParams(url, ['token']);
        expect(result).toBe('https://example.com?page=1');
    });

    it('removes multiple query parameters', () => {
        const url = 'https://example.com?page=1&token=abc&sort=asc';
        const result = removeGivenQueryParams(url, ['token', 'sort']);
        expect(result).toBe('https://example.com?page=1');
    });

    it('removes all query parameters when all are listed', () => {
        const url = 'https://example.com?page=1&token=abc';
        const result = removeGivenQueryParams(url, ['page', 'token']);
        expect(result).toBe('https://example.com');
    });

    it('leaves URL unchanged if none of the keys are present', () => {
        const url = 'https://example.com?page=1';
        const result = removeGivenQueryParams(url, ['token']);
        expect(result).toBe('https://example.com?page=1');
    });

    it('handles URL with hash fragment', () => {
        const url = 'https://example.com?page=1&token=abc#section';
        const result = removeGivenQueryParams(url, ['token']);
        expect(result).toBe('https://example.com?page=1#section');
    });

    it('handles URL with no query string', () => {
        const url = 'https://example.com';
        const result = removeGivenQueryParams(url, ['page']);
        expect(result).toBe('https://example.com');
    });

    it('preserves the order of remaining query params', () => {
        const url = 'https://example.com?a=1&b=2&c=3';
        const result = removeGivenQueryParams(url, ['b']);
        expect(result).toBe('https://example.com?a=1&c=3');
    });

    it('handles empty keys array gracefully', () => {
        const url = 'https://example.com?a=1&b=2';
        const result = removeGivenQueryParams(url, []);
        expect(result).toBe('https://example.com?a=1&b=2');
    });
});

describe('searchParamsToRecord', () => {
    it('converts numeric strings to numbers', () => {
        const params = new URLSearchParams('page=2&limit=10');
        const result = searchParamsToRecord(params);
        expect(result).toEqual({ page: 2, limit: 10 });
    });

    it('keeps non-numeric strings as strings', () => {
        const params = new URLSearchParams('sort=asc&filter=active');
        const result = searchParamsToRecord(params);
        expect(result).toEqual({ sort: 'asc', filter: 'active' });
    });

    it('preserves empty values as empty strings', () => {
        const params = new URLSearchParams('empty=');
        const result = searchParamsToRecord(params);
        expect(result).toEqual({ empty: '' });
    });

    it('handles mixed numeric and non-numeric values', () => {
        const params = new URLSearchParams('page=2&sort=asc');
        const result = searchParamsToRecord(params);
        expect(result).toEqual({ page: 2, sort: 'asc' });
    });

    it('handles negative numbers and decimals', () => {
        const params = new URLSearchParams('offset=-3.5&count=10');
        const result = searchParamsToRecord(params);
        expect(result).toEqual({ offset: -3.5, count: 10 });
    });

    it('does not coerce strings like "001" or "12abc" to numbers', () => {
        const params = new URLSearchParams('code=001&value=12abc');
        const result = searchParamsToRecord(params);
        expect(result).toEqual({ code: '001', value: '12abc' });
    });
});
