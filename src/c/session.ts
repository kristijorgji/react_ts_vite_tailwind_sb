import { STORAGE_KEYS } from '@/c/services/storage';
import type { ApiLoginResponse } from '@/c/types/api.ts';

import storage from './storage';

export function setSession(data: ApiLoginResponse): boolean {
    storage.setItem(STORAGE_KEYS.SESSION, data);
    return true;
}

export function clearSession(): void {
    window.localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function setSessionAccessToken(at: { accessToken: string; accessTokenExpiresAt: string }): void {
    const existing = JSON.parse((storage.getItem(STORAGE_KEYS.SESSION) ?? '{}') as string) as ApiLoginResponse;
    const session: ApiLoginResponse = {
        ...existing,
        accessToken: at.accessToken,
        accessTokenExpiresAt: at.accessTokenExpiresAt,
    };
    storage.setItem(STORAGE_KEYS.SESSION, session);
}

export function getSession(): ApiLoginResponse | null {
    if (!(typeof window !== 'undefined' && window && window.localStorage)) {
        return null;
    }

    const session = storage.getItem(STORAGE_KEYS.SESSION);
    if (session === null) {
        return null;
    }

    return JSON.parse(session as string) as ApiLoginResponse;
}

export function getAccessToken(): string | null {
    return getSession()?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
    return getSession()?.refreshToken ?? null;
}

export function isApiLoggedIn(): boolean {
    return typeof window !== 'undefined' && window && window.localStorage.getItem(STORAGE_KEYS.SESSION) !== null;
}
