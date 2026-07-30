import type React from 'react';

import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ApiLoginResponse } from '@/c/types/api.ts';

import type { loginHandlerI18n } from './useLoginHandler';
import useLoginHandler from './useLoginHandler';

const { mockRequest, mockSetSession } = vi.hoisted(() => ({
    mockRequest: vi.fn(),
    mockSetSession: vi.fn(),
}));

vi.mock('@/c/api/api', () => ({
    request: mockRequest,
}));

vi.mock('@/c/session', () => ({
    setSession: mockSetSession,
}));

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en', includeT: false });
});

const i18nMessages: loginHandlerI18n = {
    internalError: 'Internal error',
    invalidData: 'Invalid data',
    invalidCredentials: 'Invalid credentials',
    emailValidation: { required: 'Email required', email: 'Invalid email' },
    passwordValidation: { matches: 'Password too short' },
};

describe('useLoginHandler', () => {
    const setInProgress = vi.fn();

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns email/password setters and submit handler', () => {
        const { result } = renderHook(() => useLoginHandler(setInProgress, i18nMessages));
        expect(result.current.setEmail).toBeDefined();
        expect(result.current.setPassword).toBeDefined();
        expect(result.current.onLoginSubmit).toBeDefined();
    });

    it('setEmail with rerender flag triggers re-render and exposes updated email', () => {
        const { result } = renderHook(() => useLoginHandler(setInProgress, i18nMessages));
        act(() => {
            result.current.setEmail('test@example.com', true);
        });
        expect(result.current.email).toBe('test@example.com');
    });

    it('sets validation error for invalid email', async () => {
        const { result } = renderHook(() => useLoginHandler(setInProgress, i18nMessages));

        act(() => {
            result.current.setEmail('');
            result.current.setPassword('secret123');
        });

        const event = {
            nativeEvent: { preventDefault: vi.fn() },
        } as unknown as React.FormEvent;

        await act(async () => {
            await result.current.onLoginSubmit(event);
        });

        expect(result.current.error).toBe('Email required');
        expect(setInProgress).toHaveBeenCalledWith(false);
    });

    it('sets validation error for short password', async () => {
        const { result } = renderHook(() => useLoginHandler(setInProgress, i18nMessages));

        act(() => {
            result.current.setEmail('user@example.com');
            result.current.setPassword('');
        });

        const event = {
            nativeEvent: { preventDefault: vi.fn() },
        } as unknown as React.FormEvent;

        await act(async () => {
            await result.current.onLoginSubmit(event);
        });

        expect(result.current.error).toBeDefined();
        expect(setInProgress).toHaveBeenCalledWith(false);
    });

    it('calls API and sets session on 200 response', async () => {
        const responseData: ApiLoginResponse = {
            userId: 'u1',
            accessToken: 'at',
            accessTokenExpiresAt: '2027-01-01',
            refreshToken: 'rt',
            refreshTokenExpiresAt: '2027-01-01',
            sessionId: 's1',
        };

        mockRequest.mockResolvedValue(new Response(JSON.stringify(responseData), { status: 200 }));

        const { result } = renderHook(() => useLoginHandler(setInProgress, i18nMessages));

        act(() => {
            result.current.setEmail('user@example.com');
            result.current.setPassword('secret123');
        });

        const event = {
            nativeEvent: { preventDefault: vi.fn() },
        } as unknown as React.FormEvent;

        await act(async () => {
            await result.current.onLoginSubmit(event);
        });

        expect(mockRequest).toHaveBeenCalled();
        expect(mockSetSession).toHaveBeenCalled();
    });

    it('sets error on 401 response', async () => {
        mockRequest.mockResolvedValue(new Response('{}', { status: 401 }));

        const { result } = renderHook(() => useLoginHandler(setInProgress, i18nMessages));

        act(() => {
            result.current.setEmail('user@example.com');
            result.current.setPassword('wrongpassword');
        });

        const event = {
            nativeEvent: { preventDefault: vi.fn() },
        } as unknown as React.FormEvent;

        await act(async () => {
            await result.current.onLoginSubmit(event);
        });

        expect(result.current.error).toBe('Invalid credentials');
    });

    it('sets error on 400 response with validation errors', async () => {
        mockRequest.mockResolvedValue(
            new Response(JSON.stringify({ errors: { email: { message: 'Bad email' } } }), { status: 400 })
        );

        const { result } = renderHook(() => useLoginHandler(setInProgress, i18nMessages));

        act(() => {
            result.current.setEmail('user@example.com');
            result.current.setPassword('secret123');
        });

        const event = {
            nativeEvent: { preventDefault: vi.fn() },
        } as unknown as React.FormEvent;

        await act(async () => {
            await result.current.onLoginSubmit(event);
        });

        expect(result.current.error).toContain('Bad email');
    });

    it('sets internal error on 500 response', async () => {
        mockRequest.mockResolvedValue(new Response('{}', { status: 500 }));

        const { result } = renderHook(() => useLoginHandler(setInProgress, i18nMessages));

        act(() => {
            result.current.setEmail('user@example.com');
            result.current.setPassword('secret123');
        });

        const event = {
            nativeEvent: { preventDefault: vi.fn() },
        } as unknown as React.FormEvent;

        await act(async () => {
            await result.current.onLoginSubmit(event);
        });

        expect(result.current.error).toBe('Internal error');
    });

    it('initializes email with prefilled value', () => {
        const { result } = renderHook(() => useLoginHandler(setInProgress, i18nMessages, 'pre@fill.com'));
        expect(result.current.email).toBe('pre@fill.com');
    });
});
