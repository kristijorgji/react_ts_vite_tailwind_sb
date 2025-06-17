import { type LocalizedRouteMap } from '@/core/routing/routes.ts';

import { LOCALES } from '../../src/i18n/locales';

export const TEST_ROUTES_IDS = {
    INDEX: 'INDEX',
    LOGIN: 'LOGIN',
    ANALYTICS: 'ANALYTICS',
    SETTINGS: 'SETTINGS',
    DEMO: 'DEMO',
} as const;

export const TEST_ROUTES: LocalizedRouteMap = {
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
