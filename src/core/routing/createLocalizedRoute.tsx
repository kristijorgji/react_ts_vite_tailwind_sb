import React from 'react';

import { Route } from 'react-router-dom';

import type { Config } from '@/core/config.ts';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import type { RouteId } from '@/core/routing/routes.ts';
import type { Locale } from '@/i18n/locales.ts';

export default function createLocalizedRoute(
    locale: Locale,
    routeId: RouteId,
    element: React.ReactNode,
    config: Config['localization']
): React.ReactElement {
    return <Route key={routeId} path={localizeRoutePath(locale, routeId, null, config)} element={element} />;
}
