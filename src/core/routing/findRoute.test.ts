import type { Location } from 'react-router-dom';
import { describe, expect } from 'vitest';

import findRoute, { type FindRouteResult } from '@/core/routing/findRoute.ts';
import type { LocalizedRouteMap } from '@/core/routing/routes.ts';

import { TEST_ROUTES } from '../../../__tests__/data/routes.ts';

describe('findRoute', () => {
    const prefixedEnLocation: Location = {
        pathname: '/en/settings',
        search: '?q=test',
        hash: '#section',
        state: {},
        key: '',
    };

    const nonPrefixedEnLocation: Location = {
        pathname: '/settings',
        search: '?q=test',
        hash: '#section',
        state: {},
        key: '',
    };

    const expectedFoundSettingsRoute: FindRouteResult = {
        params: {
            hash: '#section',
            query: {
                q: 'test',
            },
            urlParams: {},
        },
        routeId: 'SETTINGS',
    };

    it('normalizes trailing slash in the index route when having /{locale} instead of /{locale}/', () => {
        expect(
            findRoute(
                {
                    useLocaleInPath: true,
                    usePrefixForDefaultLocale: false,
                },
                'en',
                TEST_ROUTES as LocalizedRouteMap,
                'en',
                {
                    ...prefixedEnLocation,
                    pathname: `/en`,
                }
            )
        ).toEqual({
            params: {
                hash: '#section',
                query: {
                    q: 'test',
                },
                urlParams: {},
            },
            routeId: 'INDEX',
        });
    });

    describe('handles default locale', () => {
        describe('when using locale in path', () => {
            it('finds the configured route when using no prefix for the default locale', () => {
                expect(
                    findRoute(
                        {
                            useLocaleInPath: true,
                            usePrefixForDefaultLocale: false,
                        },
                        'en',
                        TEST_ROUTES as LocalizedRouteMap,
                        'en',
                        prefixedEnLocation
                    )
                ).toEqual(expectedFoundSettingsRoute);
            });

            it('finds the configured route when using prefix for the default locale', () => {
                expect(
                    findRoute(
                        {
                            useLocaleInPath: true,
                            usePrefixForDefaultLocale: true,
                        },
                        'en',
                        TEST_ROUTES as LocalizedRouteMap,
                        'en',
                        prefixedEnLocation
                    )
                ).toEqual(expectedFoundSettingsRoute);
            });

            it('finds the route when path ends in trailing slash', () => {
                expect(
                    findRoute(
                        {
                            useLocaleInPath: true,
                            usePrefixForDefaultLocale: false,
                        },
                        'en',
                        TEST_ROUTES as LocalizedRouteMap,
                        'en',
                        {
                            ...prefixedEnLocation,
                            pathname: '/settings/',
                        }
                    )
                ).toEqual(expectedFoundSettingsRoute);

                expect(
                    findRoute(
                        {
                            useLocaleInPath: true,
                            usePrefixForDefaultLocale: true,
                        },
                        'en',
                        TEST_ROUTES as LocalizedRouteMap,
                        'en',
                        {
                            ...prefixedEnLocation,
                            pathname: '/en/settings/',
                        }
                    )
                ).toEqual(expectedFoundSettingsRoute);
            });
        });

        describe('when not using locale in path', () => {
            it('finds the configured route when using no prefix for the default locale', () => {
                expect(
                    findRoute(
                        {
                            useLocaleInPath: false,
                            usePrefixForDefaultLocale: false,
                        },
                        'en',
                        TEST_ROUTES as LocalizedRouteMap,
                        'en',
                        nonPrefixedEnLocation
                    )
                ).toEqual(expectedFoundSettingsRoute);
            });

            it('finds the configured route when using prefix for the default locale', () => {
                expect(
                    findRoute(
                        {
                            useLocaleInPath: false,
                            usePrefixForDefaultLocale: true,
                        },
                        'en',
                        TEST_ROUTES as LocalizedRouteMap,
                        'en',
                        nonPrefixedEnLocation
                    )
                ).toEqual(expectedFoundSettingsRoute);
            });
        });

        it('finds the route when path ends in trailing slash', () => {
            expect(
                findRoute(
                    {
                        useLocaleInPath: false,
                        usePrefixForDefaultLocale: false,
                    },
                    'en',
                    TEST_ROUTES as LocalizedRouteMap,
                    'en',
                    {
                        ...nonPrefixedEnLocation,
                        pathname: '/settings/',
                    }
                )
            ).toEqual(expectedFoundSettingsRoute);
        });
    });

    describe('handles non default locale', () => {
        it('when using locale in path', () => {
            for (const pathname of ['/de/einstellungen', '/de/einstellungen/']) {
                expect(
                    findRoute(
                        {
                            useLocaleInPath: true,
                            usePrefixForDefaultLocale: false,
                        },
                        'en',
                        TEST_ROUTES as LocalizedRouteMap,
                        'de',
                        {
                            ...prefixedEnLocation,
                            pathname: pathname,
                        }
                    )
                ).toEqual(expectedFoundSettingsRoute);
            }
        });

        it('when not using locale in path', () => {
            for (const pathname of ['/einstellungen', '/einstellungen/']) {
                expect(
                    findRoute(
                        {
                            useLocaleInPath: false,
                            usePrefixForDefaultLocale: true,
                        },
                        'en',
                        TEST_ROUTES as LocalizedRouteMap,
                        'de',
                        {
                            ...prefixedEnLocation,
                            pathname: pathname,
                        }
                    )
                ).toEqual(expectedFoundSettingsRoute);
            }
        });
    });

    it('return null when it cannot find a route', () => {
        expect(
            findRoute(
                {
                    useLocaleInPath: true,
                    usePrefixForDefaultLocale: true,
                },
                'en',
                TEST_ROUTES as LocalizedRouteMap,
                'de',
                {
                    ...prefixedEnLocation,
                    pathname: '/not-existing',
                }
            )
        ).toBe(null);
    });
});
