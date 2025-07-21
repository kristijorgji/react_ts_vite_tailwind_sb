import { useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import type { Config } from '@/core/config';
import findRoute from '@/core/routing/findRoute.ts';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import { type Locale } from '@/i18n/locales.ts';

import { type LocalizedRouteMap } from './routes';

/**
 * Synchronizes the current route with the selected locale.
 *
 * This hook detects when the user switches languages (e.g., from "en" to "de")
 * and redirects to the equivalent localized path in the new locale, if available.
 *
 * Example:
 *    If the user is on "/settings" (English) and switches to German, they are redirected to "/einstellungen".
 *
 * This helps prevent 404 errors caused by locale-specific route mismatches.
 *
 * ⚠️ Use this hook **only once** at the top level of your application (e.g., in `AppRouter`).
 * Running it in multiple places may result in redundant redirects or inconsistent routing behavior.
 *
 * Note: This hook does not currently preserve dynamic path segments or query parameters.
 */
export function useSyncRouteWithLocale(
    config: Config['localization'],
    defaultLocale: Locale,
    routes: LocalizedRouteMap
): void {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Ref to store the previous locale so we can compare changes
    const prevLocaleRef = useRef<Locale | null>(null);

    useEffect(() => {
        const newLocale: Locale = i18n.language as Locale;

        // If locale changed
        if (prevLocaleRef.current && prevLocaleRef.current !== newLocale) {
            const prevLocale = prevLocaleRef.current;

            const route = findRoute(config, defaultLocale, routes, prevLocale, location);

            if (route) {
                navigate(localizeRoutePath(newLocale, route.routeId, route.params, config), { replace: true });
            }
        }

        prevLocaleRef.current = newLocale;
    }, [config, defaultLocale, routes, i18n.language, navigate, location]);
}
