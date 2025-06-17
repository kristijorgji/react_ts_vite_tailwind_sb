import { useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

import { searchParamsToRecord } from '@/c/utils/http.ts';
import type { Config } from '@/core/config';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';

import { type LocalizedRouteMap, type RouteId } from './routes';
import { type Locale } from '../../i18n/locales.ts';

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

            let normalizedCurrentPath = location.pathname;

            /**
             * Normalize the path in case user had opened current path /{locale} instead of /{locale}/
             */
            if (config.useLocaleInPath) {
                if (normalizedCurrentPath === `/${prevLocale}`) {
                    normalizedCurrentPath = `/${prevLocale}/`;
                }
            }

            /**
             * Remove default locale from the url in n case we have disabled usePrefixForDefaultLocale
             * but user stills opens in browser url with prefix
             * example /en/settings -> /settings
             */
            if (config.useLocaleInPath && !config.usePrefixForDefaultLocale && prevLocale === defaultLocale) {
                normalizedCurrentPath = normalizedCurrentPath.replace(`/${prevLocale}/`, '/');
            }

            /*
                Start with the default locale's routes and override locale specific routes
                This allows us to avoid redefining routes that are identical across locales
                (e.g "/" or other shared routes)
             */
            const routesForLocale = {
                ...routes[defaultLocale],
                ...routes[prevLocale],
            };

            // Find which route ID corresponds to the current path in the previous locale and if it matches the path params
            for (const [routeId, route] of Object.entries(routesForLocale)) {
                const routeHref =
                    config.useLocaleInPath && (config.usePrefixForDefaultLocale || prevLocale !== defaultLocale)
                        ? `/${prevLocale}${route.href}`
                        : route.href;

                const match = matchPath({ path: routeHref, end: true }, normalizedCurrentPath);

                if (match) {
                    navigate(
                        localizeRoutePath(
                            newLocale,
                            routeId as RouteId,
                            {
                                urlParams: match.params,
                                query: searchParamsToRecord(new URLSearchParams(location.search)),
                                hash: location.hash,
                            },
                            config
                        ),
                        { replace: true }
                    );
                    break;
                }
            }
        }

        prevLocaleRef.current = newLocale;
    }, [config, defaultLocale, routes, i18n.language, location.hash, location.pathname, location.search, navigate]);
}
