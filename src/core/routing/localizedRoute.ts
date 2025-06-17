import { addOrUpdateUrlQueryParameters } from '@/c/utils/http.ts';
import { ROUTES, type RouteId } from '@/core/routing/routes.ts';

import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales.ts';
import config, { type Config } from '../config.ts';

export function localizeRoutePath(
    locale: Locale,
    routeId: RouteId,
    params?: {
        urlParams?: Record<string, string | number>;
        query?: Record<string, string | number>;
        hash?: string;
    } | null,
    { useLocaleInPath, usePrefixForDefaultLocale }: Config['localization'] = config.localization
): string {
    let localizedRawPath = ROUTES[DEFAULT_LOCALE][routeId].href;
    if (ROUTES[locale] && ROUTES[locale][routeId]) {
        localizedRawPath = ROUTES[locale][routeId].href;
    }

    if (useLocaleInPath && (usePrefixForDefaultLocale || locale !== DEFAULT_LOCALE)) {
        localizedRawPath = `/${locale}${localizedRawPath}`;
    }

    return formPath({
        pathname: localizedRawPath,
        ...(params ?? {}),
    });
}

export type FormPathParams = {
    pathname: string;
    urlParams?: Record<string, string | number>;
    query?: Record<string, string | number>;
    hash?: string;
};

export function formPath(route: FormPathParams): string {
    let r = route.pathname;

    const pattern = /:([^:/]+)/g;
    const urlTokens = [];

    let match = null;
    while ((match = pattern.exec(r))) {
        urlTokens.push(match[1]);
    }

    if (route.urlParams) {
        const urlParams = JSON.parse(JSON.stringify(route.urlParams)) as Record<string, string>;
        for (const paramKey of urlTokens) {
            r = r.replace(`:${paramKey}`, urlParams[paramKey]);
            delete urlParams[paramKey];
        }
    }

    r = route.query ? addOrUpdateUrlQueryParameters(r, route.query as Record<string, string>) : r;

    if (route.hash) {
        const normalizedHash = route.hash.startsWith('#') ? route.hash.slice(1) : route.hash;
        r += `#${normalizedHash}`;
    }

    return r;
}
