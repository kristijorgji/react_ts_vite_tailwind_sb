import { renderHook } from '@testing-library/react';
import { type Mock, vi } from 'vitest';

import config from '@/core/config.ts';
import * as localizedRoute from '@/core/routing/localizedRoute.ts';
import useNavigate from '@/core/routing/useNavigate.ts';

import { type Locale } from '../../i18n/locales.ts';

const mockLanguage: Locale = 'de';
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

vi.mock('@/core/routing/localizedRoute', () => ({
    localizeRoutePath: vi.fn().mockReturnValue('dummy'),
}));

it('should call react useNavigate with the localized route path', () => {
    const { result } = renderHook(() => useNavigate());
    const navigate = result.current;

    const expectedParams = {
        urlParams: {
            id: 'abc',
        },
        query: {
            a: '23',
            b: '6c',
        },
    };

    const expectedNavigateOptions = {
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
