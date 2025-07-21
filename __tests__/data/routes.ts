import { DEFAULT_LOCALE, LOCALES, type Locale } from '../../src/i18n/locales';

export const TEST_ROUTES_IDS = {
    INDEX: 'INDEX',
    LOGIN: 'LOGIN',
    ANALYTICS: 'ANALYTICS',
    SETTINGS: 'SETTINGS',
    DEMO: 'DEMO',
} as const;

export type TestRouteId = (typeof TEST_ROUTES_IDS)[keyof typeof TEST_ROUTES_IDS];

type LocaleTestRouteMap = Record<TestRouteId, { href: string }>;

type LocalizedTestRouteMap = {
    [DEFAULT_LOCALE]: LocaleTestRouteMap;
} & Partial<Record<Exclude<Locale, typeof DEFAULT_LOCALE>, Partial<LocaleTestRouteMap>>>;

export const TEST_ROUTES: LocalizedTestRouteMap = {
    [LOCALES.ENGLISH]: {
        [TEST_ROUTES_IDS.INDEX]: {
            href: '/',
        },
        [TEST_ROUTES_IDS.LOGIN]: {
            href: '/login',
        },
        [TEST_ROUTES_IDS.ANALYTICS]: {
            href: '/analytics',
        },
        [TEST_ROUTES_IDS.SETTINGS]: {
            href: '/settings',
        },
        [TEST_ROUTES_IDS.DEMO]: {
            href: '/demo/:id',
        },
    },
    [LOCALES.GERMAN]: {
        [TEST_ROUTES_IDS.LOGIN]: {
            href: '/anmelden',
        },
        [TEST_ROUTES_IDS.ANALYTICS]: {
            href: '/analytik',
        },
        [TEST_ROUTES_IDS.SETTINGS]: {
            href: '/einstellungen',
        },
        [TEST_ROUTES_IDS.DEMO]: {
            href: '/d/:id',
        },
    },
} as const;
