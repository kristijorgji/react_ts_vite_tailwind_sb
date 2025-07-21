import { act, renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { type Location, useLocation } from 'react-router-dom';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Config } from '@/core/config.ts';
import findRoute, { type FindRouteResult } from '@/core/routing/findRoute.ts';
import { useRouterContext } from '@/core/routing/RouterContext.tsx';
import useMatchedRoute from '@/core/routing/useMatchedRoute';
import { DEFAULT_LOCALE } from '@/i18n/locales.ts';

import { TEST_ROUTES, type TestRouteId } from '../../../__tests__/data/routes.ts';

vi.mock('react-i18next', () => ({
    useTranslation: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(),
}));

vi.mock('@/core/routing/RouterContext.tsx', () => ({
    useRouterContext: vi.fn(),
}));

vi.mock('@/core/routing/findRoute.ts', () => ({
    default: vi.fn(),
}));

const mockUseTranslation = useTranslation as unknown as Mock;
const mockUseLocation = useLocation as unknown as Mock;
const mockUseRouterContext = useRouterContext as unknown as Mock;
const mockFindRoute = findRoute as unknown as Mock;

const MOCK_ROUTER_CONFIG: Config['localization'] = {
    useLocaleInPath: true,
    usePrefixForDefaultLocale: false,
};
const MOCK_DEFAULT_LOCATION: Location = { pathname: '/settings', search: '', hash: '', state: null, key: 'default' };
const MOCK_DEFAULT_LOCALE = DEFAULT_LOCALE;
const MOCK_ROUTES = TEST_ROUTES;

describe('useMatchedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseTranslation.mockReturnValue({ i18n: { language: DEFAULT_LOCALE } });
        mockUseLocation.mockReturnValue(MOCK_DEFAULT_LOCATION); // Default location
        mockUseRouterContext.mockReturnValue({
            config: MOCK_ROUTER_CONFIG,
            defaultLocale: MOCK_DEFAULT_LOCALE,
            routes: MOCK_ROUTES,
        });
        // Default return for findRoute: usually null or an object indicating no match
        mockFindRoute.mockReturnValue(null);
    });

    // Test Case 1: Initial render with default values
    it('should call findRoute with initial dependencies and return its result', () => {
        const mockFoundRoute = { matched: true, params: {}, route: { path: '/' } };
        mockFindRoute.mockReturnValueOnce(mockFoundRoute); // Set return value for this specific call

        const { result } = renderHook(() => useMatchedRoute());

        expect(mockFindRoute).toHaveBeenCalledTimes(1);
        expect(mockFindRoute).toHaveBeenCalledWith(
            MOCK_ROUTER_CONFIG,
            MOCK_DEFAULT_LOCALE,
            MOCK_ROUTES,
            DEFAULT_LOCALE, // Initial language
            MOCK_DEFAULT_LOCATION
        );

        expect(result.current).toEqual(mockFoundRoute);
    });

    // Test Case 2: Hook re-computes when i18n.language changes
    it('should re-compute when i18n.language changes', () => {
        const initialFoundRoute: FindRouteResult<TestRouteId> = { routeId: 'SETTINGS', params: null };
        const newLanguageFoundRoute: FindRouteResult<TestRouteId> = { routeId: 'SETTINGS', params: null };

        mockFindRoute.mockReturnValueOnce(initialFoundRoute); // First call
        mockFindRoute.mockReturnValueOnce(newLanguageFoundRoute); // Second call

        const { result, rerender } = renderHook(() => useMatchedRoute());

        expect(result.current).toEqual(initialFoundRoute);
        expect(mockFindRoute).toHaveBeenCalledTimes(1);

        // Simulate language change
        mockUseTranslation.mockReturnValue({ i18n: { language: 'fr' } });
        act(() => rerender()); // Re-render the hook

        // Assert findRoute was called again with the new language
        expect(mockFindRoute).toHaveBeenCalledTimes(2);
        expect(mockFindRoute).toHaveBeenCalledWith(
            MOCK_ROUTER_CONFIG,
            MOCK_DEFAULT_LOCALE,
            MOCK_ROUTES,
            'fr', // New language
            MOCK_DEFAULT_LOCATION
        );
        expect(result.current).toEqual(newLanguageFoundRoute);
    });

    // Test Case 3: Hook re-computes when location changes
    it('should re-compute when location changes', () => {
        const initialFoundRoute: FindRouteResult<TestRouteId> = { routeId: 'SETTINGS', params: null };
        const newLocationFoundRoute: FindRouteResult<TestRouteId> = { routeId: 'LOGIN', params: null };

        mockFindRoute.mockReturnValueOnce(initialFoundRoute); // First call
        mockFindRoute.mockReturnValueOnce(newLocationFoundRoute); // Second call

        const { result, rerender } = renderHook(() => useMatchedRoute());

        expect(result.current).toEqual(initialFoundRoute);
        expect(mockFindRoute).toHaveBeenCalledTimes(1);

        // Simulate location change
        mockUseLocation.mockReturnValue({ pathname: '/login', search: '', hash: '', state: null, key: 'new' });
        act(() => rerender()); // Re-render the hook

        // Assert findRoute was called again with the new location
        expect(mockFindRoute).toHaveBeenCalledTimes(2);
        expect(mockFindRoute).toHaveBeenCalledWith(
            MOCK_ROUTER_CONFIG,
            MOCK_DEFAULT_LOCALE,
            MOCK_ROUTES,
            'en',
            { pathname: '/login', search: '', hash: '', state: null, key: 'new' } // New location
        );
        expect(result.current).toEqual(newLocationFoundRoute);
    });

    // Test Case 4: Hook re-computes when routerContext config changes
    it('should re-compute when routerContext config changes', () => {
        const initialFoundRoute: FindRouteResult<TestRouteId> = { routeId: 'SETTINGS', params: null };
        const newConfigFoundRoute: FindRouteResult<TestRouteId> = { routeId: 'LOGIN', params: null };
        const NEW_ROUTER_CONFIG: Config['localization'] = {
            useLocaleInPath: false,
            usePrefixForDefaultLocale: true,
        };

        mockFindRoute.mockReturnValueOnce(initialFoundRoute); // First call
        mockFindRoute.mockReturnValueOnce(newConfigFoundRoute); // Second call

        const { result, rerender } = renderHook(() => useMatchedRoute());

        expect(result.current).toEqual(initialFoundRoute);
        expect(mockFindRoute).toHaveBeenCalledTimes(1);

        // Simulate routerContext config change
        mockUseRouterContext.mockReturnValue({
            config: NEW_ROUTER_CONFIG, // Changed config
            defaultLocale: MOCK_DEFAULT_LOCALE,
            routes: MOCK_ROUTES,
        });
        act(() => rerender()); // Re-render the hook

        // Assert findRoute was called again with the new config
        expect(mockFindRoute).toHaveBeenCalledTimes(2);
        expect(mockFindRoute).toHaveBeenCalledWith(
            NEW_ROUTER_CONFIG, // New config
            MOCK_DEFAULT_LOCALE,
            MOCK_ROUTES,
            MOCK_DEFAULT_LOCALE,
            MOCK_DEFAULT_LOCATION
        );
        expect(result.current).toEqual(newConfigFoundRoute);
    });

    // Test Case 5: findRoute returns null (no match)
    it('should return null if findRoute returns null', () => {
        mockFindRoute.mockReturnValueOnce(null); // Explicitly return null

        const { result } = renderHook(() => useMatchedRoute());

        expect(result.current).toBeNull();
        expect(mockFindRoute).toHaveBeenCalledTimes(1);
    });

    // Test Case 6: Ensure findRoute is not called unnecessarily if dependencies don't change
    it('should NOT call findRoute if dependencies do not change on rerender', () => {
        const mockFoundRoute: FindRouteResult<TestRouteId> = { routeId: 'SETTINGS', params: null };
        mockFindRoute.mockReturnValue(mockFoundRoute); // Set default return

        const { rerender } = renderHook(() => useMatchedRoute());

        expect(mockFindRoute).toHaveBeenCalledTimes(1);

        // Rerender without changing any dependencies
        act(() => rerender());

        // findRoute should NOT have been called again
        expect(mockFindRoute).toHaveBeenCalledTimes(1);
    });
});
