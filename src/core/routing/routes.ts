import { DEFAULT_LOCALE, LOCALES, type Locale } from '../../i18n/locales.ts';

export const ROUTES_IDS = {
    INDEX: 'INDEX',
    LOGIN: 'LOGIN',
    ANALYTICS: 'ANALYTICS',
    SETTINGS: 'SETTINGS',
    DEMO: 'DEMO',
} as const;

export type RouteId = (typeof ROUTES_IDS)[keyof typeof ROUTES_IDS];

export type LocaleRouteMap = Record<RouteId, { href: string }>;

export type LocalizedRouteMap = {
    [DEFAULT_LOCALE]: LocaleRouteMap;
} & Partial<Record<Exclude<Locale, typeof DEFAULT_LOCALE>, Partial<LocaleRouteMap>>>;

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
