import { type LocalizedRouteMap as PackageLocalizedRouteMap } from '@kristijorgji/react-localized-routing';

import { type DEFAULT_LOCALE, LOCALES, type Locale } from '../../i18n/locales.ts';

export const ROUTES_IDS = {
    INDEX: 'INDEX',
    LOGIN: 'LOGIN',
    ANALYTICS: 'ANALYTICS',
    SETTINGS: 'SETTINGS',
    DEMO: 'DEMO',
} as const;

export type RouteId = (typeof ROUTES_IDS)[keyof typeof ROUTES_IDS];

export type LocalizedRouteMap = PackageLocalizedRouteMap<Locale, RouteId, typeof DEFAULT_LOCALE>;

export const ROUTES: LocalizedRouteMap = {
    [LOCALES.ENGLISH]: {
        [ROUTES_IDS.INDEX]: {
            href: '/',
        },
        [ROUTES_IDS.LOGIN]: {
            href: '/login',
        },
        [ROUTES_IDS.ANALYTICS]: {
            href: '/analytics',
        },
        [ROUTES_IDS.SETTINGS]: {
            href: '/settings',
        },
        [ROUTES_IDS.DEMO]: {
            href: '/demo/:id',
        },
    },
} as const;
