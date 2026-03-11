import type { ApiLoginResponse } from '@/c/types/api';
import type { MeUser } from '@/c/types/api';

const DEMO_MODE_KEY = 'demo_mode';

export const DEMO_SESSION: ApiLoginResponse = {
    userId: 'demo-user-001',
    sessionId: 'demo-session-001',
    accessToken: 'demo-access-token',
    accessTokenExpiresAt: '2099-12-31T23:59:59Z',
    refreshToken: 'demo-refresh-token',
    refreshTokenExpiresAt: '2099-12-31T23:59:59Z',
};

export const DEMO_USER: MeUser = {
    id: 'demo-user-001',
    name: 'Demo User',
    email: 'demo@example.com',
    config: {
        permissions: ['read', 'write'],
    },
};

export function setDemoMode(): void {
    window.localStorage.setItem(DEMO_MODE_KEY, 'true');
}

export function clearDemoMode(): void {
    window.localStorage.removeItem(DEMO_MODE_KEY);
}

export function isDemoMode(): boolean {
    return window.localStorage.getItem(DEMO_MODE_KEY) === 'true';
}
