import { afterEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '@/c/services/storage';

import {
    clearSession,
    getAccessToken,
    getRefreshToken,
    getSession,
    isApiLoggedIn,
    setSession,
    setSessionAccessToken,
} from './session';

const mockSession = {
    userId: 'u1',
    sessionId: 's1',
    accessToken: 'at-123',
    accessTokenExpiresAt: '2026-12-31',
    refreshToken: 'rt-456',
    refreshTokenExpiresAt: '2027-01-31',
};

describe('session', () => {
    afterEach(() => {
        localStorage.clear();
    });

    describe('setSession', () => {
        it('stores session data and returns true', () => {
            const result = setSession(mockSession);
            expect(result).toBe(true);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });

    describe('clearSession', () => {
        it('removes session from localStorage', () => {
            clearSession();
            expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION);
        });
    });

    describe('getSession', () => {
        it('returns parsed session when present', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockSession));
            const session = getSession();
            expect(session).toEqual(mockSession);
        });

        it('returns null when no session stored', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(null);
            const session = getSession();
            expect(session).toBeNull();
        });
    });

    describe('getAccessToken', () => {
        it('returns access token from session', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockSession));
            expect(getAccessToken()).toBe('at-123');
        });

        it('returns null when no session', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(null);
            expect(getAccessToken()).toBeNull();
        });
    });

    describe('getRefreshToken', () => {
        it('returns refresh token from session', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockSession));
            expect(getRefreshToken()).toBe('rt-456');
        });

        it('returns null when no session', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(null);
            expect(getRefreshToken()).toBeNull();
        });
    });

    describe('setSessionAccessToken', () => {
        it('updates access token in existing session', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockSession));
            setSessionAccessToken({
                accessToken: 'new-at',
                accessTokenExpiresAt: '2027-06-01',
            });
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });

    describe('isApiLoggedIn', () => {
        it('returns true when session exists', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockSession));
            expect(isApiLoggedIn()).toBe(true);
        });

        it('returns false when no session', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(null);
            expect(isApiLoggedIn()).toBe(false);
        });
    });
});
