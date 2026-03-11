import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { DEMO_SESSION, setDemoMode } from '@/c/demo';
import { setSession } from '@/c/session';
import { localizeRoutePath } from '@/core/routing/localizedRoute';
import { ROUTES_IDS } from '@/core/routing/routes';
import { isDev } from '@/env';
import type { Locale } from '@/i18n/locales';

export function useDemoLogin() {
    const { i18n } = useTranslation();

    const demoLogin = useCallback(() => {
        setDemoMode();
        setSession(DEMO_SESSION);
        window.location.href = localizeRoutePath(i18n.language as Locale, ROUTES_IDS.INDEX);
    }, [i18n.language]);

    return {
        isDemoAvailable: isDev,
        demoLogin,
    };
}
