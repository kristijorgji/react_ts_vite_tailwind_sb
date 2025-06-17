import type { Config } from '@/core/config.ts';
import { type FormPathParams, formPath } from '@/core/routing/localizedRoute.ts';

import { TEST_ROUTES } from '../../../__tests__/data/routes.ts';

describe('localizeRoutePath', () => {
    beforeAll(async () => {
        // Dynamically import the module to override the export
        const actual = await vi.importActual<typeof import('@/core/routing/routes.ts')>('@/core/routing/routes.ts');

        // Override ROUTES export
        Object.defineProperty(actual, 'ROUTES', {
            value: TEST_ROUTES,
            writable: true,
        });

        // Re-mock the module with the updated ROUTES
        vi.doMock('@/core/routing/routes.ts', () => actual);
    });

    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    function mockLocalizationConfig(config: Config['localization']): void {
        vi.doMock('@/core/config', async () => {
            const actual = await vi.importActual<typeof import('@/core/config')>('@/core/config');
            return {
                ...actual,
                default: {
                    ...actual.default,
                    localization: config,
                },
            };
        });
    }

    describe('should localize properly default locale', () => {
        it('when useLocaleInPath and usePrefixForDefaultLocale are true', async () => {
            mockLocalizationConfig({
                useLocaleInPath: true,
                usePrefixForDefaultLocale: true,
            });

            const { localizeRoutePath } = await import('@/core/routing/localizedRoute');
            expect(
                localizeRoutePath('en', 'DEMO', {
                    urlParams: {
                        id: 'mysuper7param',
                    },
                    query: {
                        a: 'abdf',
                        magicNR: 129978,
                    },
                    hash: 'abc',
                })
            ).toBe('/en/demo/mysuper7param?a=abdf&magicNR=129978#abc');
        });

        it('when useLocaleInPath is enabled and usePrefixForDefaultLocale is false', async () => {
            mockLocalizationConfig({
                useLocaleInPath: true,
                usePrefixForDefaultLocale: false,
            });

            const { localizeRoutePath } = await import('@/core/routing/localizedRoute');
            expect(
                localizeRoutePath('en', 'DEMO', {
                    urlParams: {
                        id: 'mysuper7param',
                    },
                    query: {
                        a: 'abdf',
                        magicNR: 129978,
                    },
                    hash: 'abc',
                })
            ).toBe('/demo/mysuper7param?a=abdf&magicNR=129978#abc');
        });

        it('should ignore usePrefixForDefaultLocale is true when we have disabled useLocaleInPath', async () => {
            mockLocalizationConfig({
                useLocaleInPath: false,
                usePrefixForDefaultLocale: true,
            });

            const { localizeRoutePath } = await import('@/core/routing/localizedRoute');
            expect(
                localizeRoutePath('en', 'DEMO', {
                    urlParams: {
                        id: 'mysuper7param',
                    },
                    query: {
                        a: 'abdf',
                        magicNR: 129978,
                    },
                    hash: 'abc',
                })
            ).toBe('/demo/mysuper7param?a=abdf&magicNR=129978#abc');
        });
    });

    describe('should localize properly non default locale', () => {
        it('should form prefixed-locale path when useLocaleInPath is true and any usePrefixForDefaultLocale', async () => {
            const assertResult = async () => {
                // the re-import is needed in order to fetch again the mocked static config
                const { localizeRoutePath } = await import('@/core/routing/localizedRoute');
                expect(
                    localizeRoutePath('de', 'DEMO', {
                        urlParams: {
                            id: 'mysuper7param',
                        },
                        query: {
                            a: 'abdf',
                            magicNR: 129978,
                        },
                        hash: 'abc',
                    })
                ).toBe('/de/d/mysuper7param?a=abdf&magicNR=129978#abc');
            };

            mockLocalizationConfig({
                useLocaleInPath: true,
                usePrefixForDefaultLocale: true,
            });
            await assertResult();

            mockLocalizationConfig({
                useLocaleInPath: true,
                usePrefixForDefaultLocale: false,
            });
            await assertResult();
        });

        it('should form path without locale prefix when useLocaleInPath is false and any usePrefixForDefaultLocale', async () => {
            const assertResult = async () => {
                const { localizeRoutePath } = await import('@/core/routing/localizedRoute');
                expect(
                    localizeRoutePath('de', 'DEMO', {
                        urlParams: {
                            id: 'mysuper7param',
                        },
                        query: {
                            a: 'abdf',
                            magicNR: 129978,
                        },
                        hash: 'abc',
                    })
                ).toBe('/d/mysuper7param?a=abdf&magicNR=129978#abc');
            };

            mockLocalizationConfig({
                useLocaleInPath: false,
                usePrefixForDefaultLocale: true,
            });
            await assertResult();

            mockLocalizationConfig({
                useLocaleInPath: false,
                usePrefixForDefaultLocale: false,
            });
            await assertResult();
        });
    });
});

describe('formPath', () => {
    const cases: [string, FormPathParams, string][] = [
        [
            'just_pathname',
            {
                pathname: '/superpage/',
            },
            '/superpage/',
        ],
        [
            'with_url_param_and_query_param',
            {
                pathname: '/superpage/:id',
                urlParams: {
                    id: '23233223',
                },
                query: {
                    super: 222,
                },
            },
            '/superpage/23233223?super=222',
        ],
        [
            'with_two_url_param',
            {
                pathname: '/superpage/:id/:test/haha',
                urlParams: {
                    id: '23233223',
                    test: 'mmmm',
                },
            },
            '/superpage/23233223/mmmm/haha',
        ],
        [
            'with_two_url_param_and_query_esc',
            {
                pathname: '/superpage/:id/:test/haha',
                urlParams: {
                    id: '23233223',
                    test: 'mmmm',
                },
                query: {
                    specialone: 'dddd&2+212=',
                    inhouse: 'true',
                },
            },
            '/superpage/23233223/mmmm/haha?specialone=dddd%262%2B212%3D&inhouse=true',
        ],
        [
            'should_escape_qp_value',
            {
                pathname: '/escape',
                query: {
                    returnUrl: 'https://test.dev/checkout?ref=bcplm&pid=6',
                },
            },
            '/escape?returnUrl=https%3A%2F%2Ftest.dev%2Fcheckout%3Fref%3Dbcplm%26pid%3D6',
        ],
        [
            'with_hash_and_query',
            {
                pathname: '/escape',
                query: {
                    dd: 'dd',
                },
                hash: 'kjkjkj',
            },
            '/escape?dd=dd#kjkjkj',
        ],
        [
            'with_param_hash_and_query',
            {
                pathname: '/demo/:id',
                urlParams: {
                    id: '1729',
                },
                hash: '#kj177795',
                query: {
                    gari: 2,
                    miri: 3,
                },
            },
            '/demo/1729?gari=2&miri=3#kj177795',
        ],
        [
            'with_wildcard_param',
            {
                pathname: '/mmm/:slug*',
                urlParams: {
                    'slug*': 'iam/the/slug',
                },
            },
            '/mmm/iam/the/slug',
        ],
        [
            'with_catchall_param',
            {
                pathname: '/p/:...slug',
                urlParams: {
                    '...slug': 'iam/the/slug',
                },
            },
            '/p/iam/the/slug',
        ],
    ];

    test.each(cases)('%s', (_, path, expected) => {
        expect(formPath(path)).toEqual(expected);
    });
});
