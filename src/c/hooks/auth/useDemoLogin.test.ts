import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useDemoLogin } from './useDemoLogin';

const { mockSetSession, mockSetDemoMode } = vi.hoisted(() => ({
    mockSetSession: vi.fn(),
    mockSetDemoMode: vi.fn(),
}));

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en', includeT: false });
});

vi.mock('@/c/session', () => ({
    setSession: mockSetSession,
}));

vi.mock('@/c/demo', () => ({
    DEMO_SESSION: { userId: 'demo', accessToken: 'demo-token' },
    setDemoMode: mockSetDemoMode,
}));

vi.mock('@/env', () => ({
    default: {
        appEnv: 'local',
        log: { level: 'debug' },
        apiBasePath: 'http://localhost',
        isDev: true,
    },
}));

describe('useDemoLogin', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns isDemoAvailable as true in dev mode', () => {
        const { result } = renderHook(() => useDemoLogin());
        expect(result.current.isDemoAvailable).toBe(true);
    });

    it('demoLogin sets demo mode and session', () => {
        const { result } = renderHook(() => useDemoLogin());
        result.current.demoLogin();

        expect(mockSetDemoMode).toHaveBeenCalled();
        expect(mockSetSession).toHaveBeenCalledWith(expect.objectContaining({ userId: 'demo' }));
    });
});
