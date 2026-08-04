import { useEffect, useState } from 'react';

import { act, render } from '@testing-library/react';
import { type Location } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

import * as localizedRoute from '@/core/routing/localizedRoute.ts';
import { type LocalizedRouteMap } from '@/core/routing/routes.ts';

import { TEST_ROUTES, TEST_ROUTES_IDS } from '@test/data/routes';

import { useSyncRouteWithLocale } from './useSyncRouteWithLocale';
import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales.ts';
import type { Config } from '../config';

let mockLanguage: Locale = DEFAULT_LOCALE;
const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock('react-i18next', async () => {
    const { createReactI18nextPartialMock } = await import('@test/mocks/react-i18next');
    return createReactI18nextPartialMock({ getLanguage: () => mockLanguage });
});

const defaultLocation: Location = {
    pathname: '/en/settings',
    search: '?q=test',
    hash: '#section',
    state: {},
    key: '',
};
let mockLocation = defaultLocation;
vi.mock('react-router-dom', async () => {
    const { createReactRouterDomPartialMock } = await import('@test/mocks/react-router-dom');
    return createReactRouterDomPartialMock({
        useNavigate: () => mockNavigate,
        useLocation: () => mockLocation,
    });
});

vi.mock('@/core/routing/localizedRoute', () => ({
    localizeRoutePath: vi.fn(),
}));

describe('useSyncRouteWithLocale', () => {
    let mockRoutes: LocalizedRouteMap;
    const mockLocalizeRouteReturn = 'mockLocalizeRouteReturn';
    const mockLocalizationConfig: Config['localization'] = {
        useLocaleInPath: true,
        usePrefixForDefaultLocale: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockLocation = defaultLocation;
        mockRoutes = TEST_ROUTES;

        (localizedRoute.localizeRoutePath as Mock).mockReturnValue(mockLocalizeRouteReturn);
    });

    function TestComponentThatChangesLocale({
        initialLocale,
        localizationConfig,
        changeToLocale,
    }: {
        initialLocale: Locale;
        localizationConfig: Config['localization'];
        changeToLocale: Locale;
    }) {
        const [lang, setLang] = useState(initialLocale);

        // Override mocks to reflect dynamic language and navigate
        useEffect(() => {
            // After initial render, simulate locale change
            setTimeout(() => {
                mockLanguage = changeToLocale;
                setLang(changeToLocale);
            }, 0);
        }, [changeToLocale]);

        useSyncRouteWithLocale(localizationConfig, DEFAULT_LOCALE, mockRoutes);

        return <div>{lang}</div>;
    }

    describe('navigates to localized path when locale changes', async () => {
        async function assertNavigationOnLocaleChange(
            mocks: {
                pathname: string;
                initialLocale: Locale;
                changeToLocale: Locale;
                localizationConfig: Config['localization'];
            },
            expected: {
                routeId: string | null;
                urlParams?: Record<string, string | number>;
            } = {
                routeId: TEST_ROUTES_IDS.SETTINGS,
            }
        ) {
            mockLanguage = mocks.initialLocale;
            mockLocation = {
                ...mockLocation,
                pathname: mocks.pathname,
            };

            render(
                <TestComponentThatChangesLocale
                    changeToLocale={mocks.changeToLocale}
                    initialLocale={mocks.initialLocale}
                    localizationConfig={mocks.localizationConfig}
                />
            );

            // Wait for locale change effect
            await act(() => new Promise((r) => setTimeout(r, 0)));

            if (expected.routeId) {
                expect(localizedRoute.localizeRoutePath).toHaveBeenCalledWith(
                    mocks.changeToLocale,
                    expected.routeId,
                    {
                        urlParams: expected.urlParams ?? {},
                        hash: '#section',
                        query: {
                            q: 'test',
                        },
                    },
                    mocks.localizationConfig
                );

                expect(mockNavigate).toHaveBeenCalledWith(mockLocalizeRouteReturn, { replace: true });
            } else {
                expect(localizedRoute.localizeRoutePath).not.toHaveBeenCalled();
                expect(mockNavigate).not.toHaveBeenCalled();
            }
        }

        describe('switching from default locale to non default', () => {
            describe('useLocaleInPath is true', () => {
                it('handles prefixed default locale when usePrefixForDefaultLocale is true', async () => {
                    await assertNavigationOnLocaleChange({
                        pathname: '/en/settings',
                        initialLocale: 'en',
                        changeToLocale: 'de',
                        localizationConfig: {
                            useLocaleInPath: true,
                            usePrefixForDefaultLocale: true,
                        },
                    });
                });

                it('handles prefixed default locale path when usePrefixForDefaultLocale is false', async () => {
                    await assertNavigationOnLocaleChange({
                        pathname: '/en/settings',
                        initialLocale: 'en',
                        changeToLocale: 'de',
                        localizationConfig: mockLocalizationConfig,
                    });
                });

                it('redirects /<default-locale>(/) to / when usePrefixForDefaultLocale is true', async () => {
                    await assertNavigationOnLocaleChange(
                        {
                            pathname: '/en',
                            initialLocale: 'en',
                            changeToLocale: 'de',
                            localizationConfig: {
                                ...mockLocalizationConfig,
                                usePrefixForDefaultLocale: true,
                            },
                        },
                        {
                            routeId: TEST_ROUTES_IDS.INDEX,
                        }
                    );

                    await assertNavigationOnLocaleChange(
                        {
                            pathname: '/en/',
                            initialLocale: 'en',
                            changeToLocale: 'de',
                            localizationConfig: {
                                ...mockLocalizationConfig,
                                usePrefixForDefaultLocale: true,
                            },
                        },
                        {
                            routeId: TEST_ROUTES_IDS.INDEX,
                        }
                    );
                });

                it('redirects /<default-locale>(/) to / when usePrefixForDefaultLocale is false', async () => {
                    await assertNavigationOnLocaleChange(
                        {
                            pathname: '/en',
                            initialLocale: 'en',
                            changeToLocale: 'de',
                            localizationConfig: mockLocalizationConfig,
                        },
                        {
                            routeId: TEST_ROUTES_IDS.INDEX,
                        }
                    );

                    await assertNavigationOnLocaleChange(
                        {
                            pathname: '/en/',
                            initialLocale: 'en',
                            changeToLocale: 'de',
                            localizationConfig: mockLocalizationConfig,
                        },
                        {
                            routeId: TEST_ROUTES_IDS.INDEX,
                        }
                    );
                });

                it('handles non-prefixed default locale when usePrefixForDefaultLocale is false', async () => {
                    await assertNavigationOnLocaleChange({
                        pathname: '/settings',
                        initialLocale: 'en',
                        changeToLocale: 'de',
                        localizationConfig: mockLocalizationConfig,
                    });
                });

                it('does not navigate when we have path with non-prefixed default locale and usePrefixForDefaultLocale is true', async () => {
                    await assertNavigationOnLocaleChange(
                        {
                            pathname: '/settings',
                            initialLocale: 'en',
                            changeToLocale: 'de',
                            localizationConfig: {
                                useLocaleInPath: true,
                                usePrefixForDefaultLocale: true,
                            },
                        },
                        {
                            routeId: null,
                        }
                    );
                });
            });

            it('works with non-prefixed default locale and useLocaleInPath is false', async () => {
                await assertNavigationOnLocaleChange({
                    pathname: '/settings',
                    initialLocale: 'en',
                    changeToLocale: 'de',
                    localizationConfig: {
                        useLocaleInPath: false,
                        usePrefixForDefaultLocale: true,
                    },
                });
            });
        });

        describe('switching from non-default to default locale', () => {
            it('works when current path is only /<non-default-locale>/ locale and redirects to index page', async () => {
                await assertNavigationOnLocaleChange(
                    {
                        pathname: '/de/',
                        initialLocale: 'de',
                        changeToLocale: 'en',
                        localizationConfig: mockLocalizationConfig,
                    },
                    {
                        routeId: 'INDEX',
                    }
                );
            });

            it('works when current path is only /<non-default-locale> locale and redirects to index page', async () => {
                await assertNavigationOnLocaleChange(
                    {
                        pathname: '/de',
                        initialLocale: 'de',
                        changeToLocale: 'en',
                        localizationConfig: mockLocalizationConfig,
                    },
                    {
                        routeId: 'INDEX',
                    }
                );
            });

            it('uses default locale fallback route if we have no route specific for the non-default locale', async () => {
                mockRoutes = {
                    en: {
                        // @ts-expect-error intentional unknown route key for fallback coverage
                        MAGIC: {
                            href: '/magic',
                        },
                    },
                };
                await assertNavigationOnLocaleChange(
                    {
                        pathname: '/de/magic',
                        initialLocale: 'de',
                        changeToLocale: 'en',
                        localizationConfig: mockLocalizationConfig,
                    },
                    {
                        routeId: 'MAGIC',
                    }
                );
            });

            it('works when we open non-locale prefixed path', async () => {
                await assertNavigationOnLocaleChange(
                    {
                        pathname: '/de/anmelden',
                        initialLocale: 'de',
                        changeToLocale: 'en',
                        localizationConfig: mockLocalizationConfig,
                    },
                    {
                        routeId: 'LOGIN',
                    }
                );
            });

            it('does not navigate when we have disabled useLocaleInPath and we are using locale-prefixed path', async () => {
                await assertNavigationOnLocaleChange(
                    {
                        pathname: '/de/anmelden',
                        initialLocale: 'de',
                        changeToLocale: 'en',
                        localizationConfig: {
                            useLocaleInPath: false,
                            usePrefixForDefaultLocale: true,
                        },
                    },
                    {
                        routeId: null,
                    }
                );
            });

            it('works with path parameters', async () => {
                await assertNavigationOnLocaleChange(
                    {
                        pathname: '/de/d/23',
                        initialLocale: 'de',
                        changeToLocale: 'en',
                        localizationConfig: mockLocalizationConfig,
                    },
                    {
                        routeId: 'DEMO',
                        urlParams: {
                            id: '23',
                        },
                    }
                );
            });
        });
    });

    it('does not navigate if locale has not changed', () => {
        function TestComponent() {
            useSyncRouteWithLocale(mockLocalizationConfig, DEFAULT_LOCALE, mockRoutes);
            return <div>Test</div>;
        }

        render(<TestComponent />);

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
