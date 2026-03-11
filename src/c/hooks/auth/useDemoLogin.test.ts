import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockSetSession, mockSetDemoMode } = vi.hoisted(() => ({
    mockSetSession: vi.fn(),
    mockSetDemoMode: vi.fn(),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: { language: 'en' },
    }),
}));

vi.mock('@/c/session', () => ({
    setSession: mockSetSession,
}));

vi.mock('@/c/demo', () => ({
    DEMO_SESSION: { userId: 'demo', accessToken: 'demo-token' },
    setDemoMode: mockSetDemoMode,
}));

vi.mock('@/env', () => ({
    isDev: true,
    default: { appEnv: 'local', log: { level: 'debug' }, apiBasePath: 'http://localhost' },
}));

import { useDemoLogin } from './useDemoLogin';

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
