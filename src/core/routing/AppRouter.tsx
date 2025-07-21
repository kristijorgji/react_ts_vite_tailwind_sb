import React, { useEffect, useMemo } from 'react';

import { Route, Routes } from 'react-router-dom';

import NotFoundPage from '@/c/components/pages/NotFoundPage/NotFoundPage.tsx';
import { isApiLoggedIn } from '@/c/session.ts';
import config from '@/core/config';
import createAllReactRoutes from '@/core/routing/createAllReactRoutes.ts';
import { ROUTES } from '@/core/routing/routes.ts';
import { ROUTE_CONFIGS } from '@/core/routing/routesConfig.tsx';
import useNormalizeDefaultLocalePath from '@/core/routing/useNormalizeDefaultLocalePath.ts';
import { useSyncRouteWithLocale } from '@/core/routing/useSyncRouteWithLocale.ts';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/locales.ts';

import { RouterContext } from './RouterContext.tsx';

export default function AppRouter(): React.ReactElement {
    useSyncRouteWithLocale(config.localization, DEFAULT_LOCALE, ROUTES);
    useNormalizeDefaultLocalePath(config.localization, DEFAULT_LOCALE, ROUTES[DEFAULT_LOCALE]);

    useEffect(() => {
        const isLoggedIn = isApiLoggedIn();
        const root = document.getElementById('root');
        if (root) {
            root.classList.toggle('logged-in', isLoggedIn);
        }
    }, []);

    const reactRoutes = createAllReactRoutes(config.localization, DEFAULT_LOCALE, SUPPORTED_LOCALES, ROUTE_CONFIGS);

    const routerContextValue = useMemo(
        () => ({
            config: config.localization,
            defaultLocale: DEFAULT_LOCALE,
            routes: ROUTES,
        }),
        []
    );

    return (
        <RouterContext value={routerContextValue}>
            <Routes>
                {reactRoutes}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </RouterContext>
    );
}
