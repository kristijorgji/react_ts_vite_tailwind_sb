import React from 'react';

import type { Config } from '@/core/config';
import createAllReactRoutes from '@/core/routing/createAllReactRoutes';

import type { Locale } from '../../i18n/locales.ts';

vi.mock('@/core/routing/createLocalizedRoute', async () => {
    return {
        default: vi.fn((locale, routeId, element) => {
            return <div data-testid={`${locale}-${routeId}`}>{element}</div>;
        }),
    };
});

const mockCreateLocalizedRoute = (await import('@/core/routing/createLocalizedRoute')).default as ReturnType<
    typeof vi.fn
>;

describe('createAllReactRoutes', () => {
    const routeConfigs: Record<string, React.ReactNode> = {
        INDEX: <div>Home</div>,
        SETTINGS: <div>Settings</div>,
    };

    const NoLocaleInPathConfig = {
        useLocaleInPath: false,
        usePrefixForDefaultLocale: false,
    };

    const supportedLocales: Locale[] = ['en', 'de'];
    const defaultLocale: Locale = 'en';

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create correct routes when useLocaleInPath is false', () => {
        const config: Config['localization'] = {
            useLocaleInPath: false,
            usePrefixForDefaultLocale: false,
        };

        const routes = createAllReactRoutes(config, defaultLocale, supportedLocales, routeConfigs);

        // Should create:
        // - 2 routes for default locale without prefix (SETTINGS, HOME)
        // - 0 routes for default locale with prefix (because useLocaleInPath is false)
        // - 2 for 'de' locale without prefix
        expect(routes).toHaveLength(4);
        expect(mockCreateLocalizedRoute).toHaveBeenCalledTimes(4);
        expect(mockCreateLocalizedRoute.mock.calls).toEqual([
            ['en', 'INDEX', routeConfigs.INDEX, NoLocaleInPathConfig],
            ['en', 'SETTINGS', routeConfigs.SETTINGS, NoLocaleInPathConfig],
            ['de', 'INDEX', routeConfigs.INDEX, config],
            ['de', 'SETTINGS', routeConfigs.SETTINGS, config],
        ]);
    });

    it('should include defaultLocale in also localized routes when useLocaleInPath is true', () => {
        const config: Config['localization'] = {
            useLocaleInPath: true,
            usePrefixForDefaultLocale: true,
        };

        const routes = createAllReactRoutes(config, defaultLocale, supportedLocales, routeConfigs);

        // Should create: 6
        // - 2 routes for default locale without prefix (SETTINGS, HOME)
        // - 2 routes for default locale with prefix (to allow switching between with and without prefix based on usePrefixForDefaultLocale in the other hooks)
        // - 2 for 'de' locale with prefix
        expect(routes).toHaveLength(6);
        expect(mockCreateLocalizedRoute).toHaveBeenCalledTimes(6);
        expect(mockCreateLocalizedRoute.mock.calls).toEqual([
            ['en', 'INDEX', routeConfigs.INDEX, NoLocaleInPathConfig],
            ['en', 'SETTINGS', routeConfigs.SETTINGS, NoLocaleInPathConfig],
            ['en', 'INDEX', routeConfigs.INDEX, config],
            ['en', 'SETTINGS', routeConfigs.SETTINGS, config],
            ['de', 'INDEX', routeConfigs.INDEX, config],
            ['de', 'SETTINGS', routeConfigs.SETTINGS, config],
        ]);
    });
});
