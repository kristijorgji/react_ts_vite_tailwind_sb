import api from '@/c/api/api';
import paths from '@/c/api/paths';
import { clearDemoMode, isDemoMode } from '@/c/demo';
import { clearSession, getAccessToken, getRefreshToken } from '@/c/session';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import { ROUTES_IDS } from '@/core/routing/routes.ts';

import i18n from '../i18n/i18n.ts';
import type { Locale } from '../i18n/locales.ts';

function cleanupAndRedirect(redirectTo?: string): void {
    if (typeof window !== 'undefined') {
        clearDemoMode();
        clearSession();
        window.location.href = redirectTo || localizeRoutePath(i18n.language as Locale, ROUTES_IDS.LOGIN);
    }
}

export default function logout(redirectTo?: string): Promise<void> {
    return new Promise((resolve) => {
        if (isDemoMode()) {
            cleanupAndRedirect(redirectTo);
            resolve();
            return;
        }

        api.post(
            paths.logout,
            {
                refreshToken: getRefreshToken(),
            },
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            }
        ).finally(() => {
            cleanupAndRedirect(redirectTo);
            resolve();
        });
    });
}
