import React from 'react';

import { type Config } from '@/core/config';
import createLocalizedRoute from '@/core/routing/createLocalizedRoute.tsx';
import { type RouteId } from '@/core/routing/routes.ts';
import { type Locale } from '@/i18n/locales.ts';

const NoLocaleInPathConfig: Config['localization'] = {
    useLocaleInPath: false,
    usePrefixForDefaultLocale: false,
};

export default function createAllReactRoutes(
    config: Config['localization'],
    defaultLocale: Locale,
    supportedLocales: readonly Locale[],
    routeConfigs: Record<RouteId, React.ReactNode>
): React.ReactElement[] {
    const reactRoutes: React.ReactElement[] = [];

    /**
     * Add default locale routes without a prefix.
     * This ensures that `useProperDefaultLocalePath` can properly redirect
     * from prefixed paths like `/en/settings` to `/settings` and the other way around based on
     * `usePrefixForDefaultLocale` value
     */
    reactRoutes.push(
        ...Object.entries(routeConfigs).map(([routeId, element]) =>
            createLocalizedRoute(defaultLocale, routeId as RouteId, element, NoLocaleInPathConfig)
        )
    );

    /**
     * Do not repeat the same routes as above for the defaultLocale if we have config.useLocaleInPath = false
     */
    const forLocales =
        config.useLocaleInPath === false ? supportedLocales.filter((l) => l !== defaultLocale) : supportedLocales;
    /**
     * Add other locale routes so we can open them on first page load, example /einstellungen
     */
    reactRoutes.push(
        ...forLocales.flatMap((locale) =>
            Object.entries(routeConfigs).map(([routeId, element]) =>
                createLocalizedRoute(locale as Locale, routeId as RouteId, element, config)
            )
        )
    );

    return reactRoutes;
}
