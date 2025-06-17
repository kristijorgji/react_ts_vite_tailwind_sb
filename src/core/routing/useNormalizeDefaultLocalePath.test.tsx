import { waitFor } from '@storybook/test';
import { render, renderHook } from '@testing-library/react';
import { type Location, useLocation } from 'react-router-dom';
import { type Mock, beforeEach, expect, it, vi } from 'vitest';

import type { Config } from '@/core/config';
import { type LocaleRouteMap } from '@/core/routing/routes.ts';

import useNormalizeDefaultLocalePath from './useNormalizeDefaultLocalePath';
import { TEST_ROUTES } from '../../../__tests__/data/routes.ts';
import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales.ts';

let mockLanguage: Locale = DEFAULT_LOCALE;
vi.mock('react-i18next', async () => {
    const actual = await vi.importActual<typeof import('react-i18next')>('react-i18next');
    return {
        ...actual,
        useTranslation: () => ({
            t: (key: string) => key,
            i18n: { language: mockLanguage },
        }),
    };
});

const mockNavigateFn = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigateFn,
        useLocation: vi.fn(),
    };
});

const dummyLocation: Location = {
    pathname: '/demo',
    search: '?q=test',
    hash: '#section',
    state: {},
    key: '',
};

const allRoutes = TEST_ROUTES;

function TestComponent({ config, defaultLocale }: { config: Config['localization']; defaultLocale: Locale }) {
    const location = useLocation();

    useNormalizeDefaultLocalePath(config, defaultLocale, allRoutes[defaultLocale] as LocaleRouteMap);

    return (
        <div>
            <span data-testid="pathname">{location.pathname}</span>
        </div>
    );
}

beforeEach(() => {
    vi.clearAllMocks();
    mockLanguage = DEFAULT_LOCALE;
});

it('should do nothing when the locale is not the default one', async () => {
    (useLocation as Mock).mockReturnValue({
        ...dummyLocation,
        pathname: '/settings',
    } satisfies Location);
    mockLanguage = 'de';

    render(
        <TestComponent
            config={{
                useLocaleInPath: true,
                usePrefixForDefaultLocale: true,
            }}
            defaultLocale={'en'}
        />
    );

    await waitFor(() => {
        expect(mockNavigateFn).not.toHaveBeenCalled();
    });
});

it('adds default locale prefix when usePrefixForDefaultLocale is true', async () => {
    (useLocation as Mock).mockReturnValue({
        ...dummyLocation,
        pathname: '/settings',
    } satisfies Location);

    render(
        <TestComponent
            config={{
                useLocaleInPath: true,
                usePrefixForDefaultLocale: true,
            }}
            defaultLocale={mockLanguage}
        />
    );

    await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledWith('/en/settings?q=test#section', { replace: true });
    });
});

it('should do nothing when the route cannot be found', async () => {
    (useLocation as Mock).mockReturnValue({
        ...dummyLocation,
        pathname: '/non-existing-route',
    } satisfies Location);

    render(
        <TestComponent
            config={{
                useLocaleInPath: true,
                usePrefixForDefaultLocale: true,
            }}
            defaultLocale={mockLanguage}
        />
    );

    await waitFor(() => {
        expect(mockNavigateFn).not.toHaveBeenCalled();
    });
});

it('adds default locale prefix when usePrefixForDefaultLocale is true and route has params, hash and query', async () => {
    (useLocation as Mock).mockReturnValue({
        ...dummyLocation,
        pathname: '/demo/1',
    } satisfies Location);

    render(
        <TestComponent
            config={{
                useLocaleInPath: true,
                usePrefixForDefaultLocale: true,
            }}
            defaultLocale={mockLanguage}
        />
    );

    await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledWith('/en/demo/1?q=test#section', { replace: true });
    });
});

it('removes default locale prefix when usePrefixForDefaultLocale is false', async () => {
    (useLocation as Mock).mockReturnValue({
        ...dummyLocation,
        pathname: '/en/settings',
    } satisfies Location);

    render(
        <TestComponent
            config={{
                useLocaleInPath: true,
                usePrefixForDefaultLocale: false,
            }}
            defaultLocale={mockLanguage}
        />
    );

    expect(mockNavigateFn).toHaveBeenCalledWith('/settings?q=test#section', { replace: true });
    await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledWith('/settings?q=test#section', { replace: true });
    });
});

it('should do nothing if we had a previously set locale', () => {
    (useLocation as Mock).mockReturnValue({
        ...dummyLocation,
        pathname: '/en/settings',
    } satisfies Location);
    mockLanguage = 'en';
    const { rerender } = renderHook(() =>
        useNormalizeDefaultLocalePath(
            {
                useLocaleInPath: true,
                usePrefixForDefaultLocale: false,
            },
            mockLanguage,
            allRoutes[mockLanguage] as LocaleRouteMap
        )
    );
    expect(mockNavigateFn).toHaveBeenCalledWith('/settings?q=test#section', { replace: true });

    mockNavigateFn.mockClear();
    rerender();
    expect(mockNavigateFn).not.toHaveBeenCalled();
});
