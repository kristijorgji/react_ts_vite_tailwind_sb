import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPost, mockClearSession } = vi.hoisted(() => ({
    mockPost: vi.fn(),
    mockClearSession: vi.fn(),
}));

vi.mock('@/c/api/api', () => ({
    default: { post: mockPost },
    request: vi.fn(),
}));

vi.mock('@/c/session', () => ({
    clearSession: mockClearSession,
    getAccessToken: vi.fn(() => 'mock-access-token'),
    getRefreshToken: vi.fn(() => 'mock-refresh-token'),
}));

vi.mock('../i18n/i18n.ts', () => ({
    default: { language: 'en' },
}));

import logout from './logout';

describe('logout', () => {
    let originalHref: string;

    beforeEach(() => {
        originalHref = window.location.href;
    });

    afterEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: originalHref },
        });
    });

    it('calls API logout and clears session', async () => {
        mockPost.mockResolvedValue(new Response());
        await logout();
        expect(mockPost).toHaveBeenCalled();
        expect(mockClearSession).toHaveBeenCalled();
    });

    it('redirects to custom URL when provided', async () => {
        mockPost.mockResolvedValue(new Response());
        await logout('/custom-redirect');
        expect(window.location.href).toBe('/custom-redirect');
    });
});
