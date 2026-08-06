import React, { useEffect, useMemo } from 'react';

import {
    LocalizedRouterProvider,
    createAllReactRoutes,
    useNormalizeDefaultLocalePath,
    useSyncRouteWithLocale,
} from '@kristijorgji/react-localized-routing';
import { Route, Routes } from 'react-router-dom';

import NotFoundPage from '@/c/components/pages/NotFoundPage/NotFoundPage.tsx';
import { isApiLoggedIn } from '@/c/session.ts';
import config from '@/core/config';
import { ROUTES } from '@/core/routing/routes.ts';
import { ROUTE_CONFIGS } from '@/core/routing/routesConfig.tsx';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/locales.ts';

export default function AppRouter(): React.ReactElement {
    useSyncRouteWithLocale(config.localization, DEFAULT_LOCALE, ROUTES);
    useNormalizeDefaultLocalePath(config.localization, DEFAULT_LOCALE, ROUTES[DEFAULT_LOCALE], ROUTES);

    useEffect(() => {
        const isLoggedIn = isApiLoggedIn();
        const root = document.getElementById('root');
        if (root) {
            root.classList.toggle('logged-in', isLoggedIn);
        }
    }, []);

    const reactRoutes = createAllReactRoutes(
        config.localization,
        DEFAULT_LOCALE,
        SUPPORTED_LOCALES,
        ROUTE_CONFIGS,
        ROUTES
    );

    const routerContextValue = useMemo(
        () => ({
            config: config.localization,
            defaultLocale: DEFAULT_LOCALE,
            routes: ROUTES,
        }),
        []
    );

    return (
        <LocalizedRouterProvider value={routerContextValue}>
            <Routes>
                {reactRoutes}
                <Route element={<NotFoundPage />} path="*" />
            </Routes>
        </LocalizedRouterProvider>
    );
}
