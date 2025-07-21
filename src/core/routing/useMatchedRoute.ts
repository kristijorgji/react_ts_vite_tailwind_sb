import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import findRoute from '@/core/routing/findRoute.ts';
import { useRouterContext } from '@/core/routing/RouterContext.tsx';
import type { Locale } from '@/i18n/locales.ts';

type FindRouteResult = ReturnType<typeof findRoute>;

export default function useMatchedRoute(): FindRouteResult {
    const { i18n } = useTranslation();
    const location = useLocation();
    const routerContext = useRouterContext();

    return useMemo<FindRouteResult>(() => {
        const currentLocale: Locale = i18n.language as Locale;

        return findRoute(
            routerContext.config,
            routerContext.defaultLocale,
            routerContext.routes,
            currentLocale,
            location
        );
    }, [i18n.language, location, routerContext.config, routerContext.defaultLocale, routerContext.routes]);
}
