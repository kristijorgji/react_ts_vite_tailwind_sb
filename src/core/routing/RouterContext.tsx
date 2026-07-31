import { createContext, use } from 'react';

import type { Config } from '@/core/config.ts';
import type { LocalizedRouteMap } from '@/core/routing/routes.ts';
import type { Locale } from '@/i18n/locales.ts';

type RouterContextValue = {
    config: Config['localization'];
    defaultLocale: Locale;
    routes: LocalizedRouteMap;
};
export const RouterContext = createContext<RouterContextValue | undefined>(undefined);
RouterContext.displayName = 'RouterContext';

export const useRouterContext = (): RouterContextValue => {
    const value = use(RouterContext);
    if (!value) {
        throw new Error('useRouterContext must be used within RouterContext provider');
    }
    return value;
};
