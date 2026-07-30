import { renderHook } from '@testing-library/react';
import { type NavigateOptions } from 'react-router-dom';
import { type Mock, vi } from 'vitest';

import config from '@/core/config.ts';
import * as localizedRoute from '@/core/routing/localizedRoute.ts';
import type { RouteParams } from '@/core/routing/localizedRoute.ts';
import useNavigate from '@/core/routing/useNavigate.ts';

import { type Locale } from '../../i18n/locales.ts';

const mockLanguage: Locale = 'de';
const { mockNavigateFn } = vi.hoisted(() => ({
    mockNavigateFn: vi.fn(),
}));

vi.mock('react-i18next', async () => {
    const { createReactI18nextPartialMock } = await import('@test/mocks/react-i18next');
    return createReactI18nextPartialMock({ getLanguage: () => mockLanguage });
});

vi.mock('react-router-dom', async () => {
    const { createReactRouterDomPartialMock } = await import('@test/mocks/react-router-dom');
    return createReactRouterDomPartialMock({
        useNavigate: () => mockNavigateFn,
        useLocation: vi.fn(),
    });
});

vi.mock('@/core/routing/localizedRoute', () => ({
    localizeRoutePath: vi.fn().mockReturnValue('dummy'),
}));

it('should call react useNavigate with the localized route path', () => {
    const { result } = renderHook(() => useNavigate());
    const navigate = result.current;

    const expectedParams: RouteParams = {
        urlParams: {
            id: 'abc',
        },
        query: {
            a: '23',
            b: '6c',
        },
    };

    const expectedNavigateOptions: NavigateOptions = {
        replace: true,
    };

    navigate('DEMO', expectedParams, expectedNavigateOptions);

    expect(localizedRoute.localizeRoutePath as Mock).toHaveBeenCalledWith(
        'de',
        'DEMO',
        expectedParams,
        config.localization
    );
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith('dummy', expectedNavigateOptions);
});
