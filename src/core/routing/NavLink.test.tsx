import React from 'react';

import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { NavLink as ReactRouterNavLink } from 'react-router-dom';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import NavLink from '@/core/routing/NavLink';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/locales.ts';

import type { TestRouteId } from '../../../__tests__/data/routes.ts';

vi.mock('react-i18next', () => ({
    useTranslation: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
    return {
        ...(await importOriginal<typeof import('react-router-dom')>()),
        NavLink: vi.fn((props) => {
            return React.createElement(
                'a',
                {
                    'data-testid': 'mock-navlink',
                    href: props.to,
                    ...props,
                },
                props.children
            );
        }),
    };
});

vi.mock('@/core/routing/localizedRoute.ts', () => ({
    localizeRoutePath: vi.fn(),
}));

const MockReactRouterNavLink = ReactRouterNavLink as unknown as Mock;
const mockUseTranslation = useTranslation as unknown as Mock;
const mockLocalizeRoutePath = localizeRoutePath as unknown as Mock;

describe('NavLink', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseTranslation.mockReturnValue({ i18n: { language: DEFAULT_LOCALE } });

        // Provide a sensible default mock implementation for localizeRoutePath
        mockLocalizeRoutePath.mockImplementation((locale, routeId, params) => {
            let path = `/${locale}/${routeId}`;
            if (params?.urlParams) {
                path += `/${Object.values(params.urlParams).join('/')}`;
            }
            if (params?.query) {
                path += `?${new URLSearchParams(params.query as Record<string, string>).toString()}`;
            }
            if (params?.hash) {
                path += `#${params.hash}`;
            }
            return path;
        });
    });

    // Test Case 1: Renders with href prop
    it('should render ReactRouterNavLink with the provided href when href prop is used', () => {
        const testHref = '/some-external-link';
        render(<NavLink href={testHref}>External Link</NavLink>);

        expect(MockReactRouterNavLink).toHaveBeenCalledTimes(1);
        expect(MockReactRouterNavLink).toHaveBeenCalledWith(
            expect.objectContaining({
                to: testHref,
                children: 'External Link',
            }),
            undefined
        );

        const linkElement = screen.getByTestId('mock-navlink');
        expect(linkElement).toHaveAttribute('href', testHref);
        expect(linkElement).toHaveTextContent('External Link');
    });

    // Test Case 2: Renders with routeId prop
    it('should render ReactRouterNavLink with localized path when routeId prop is used', () => {
        const testRouteId: TestRouteId = 'LOGIN';
        const testParams = { urlParams: { id: '123' }, query: { ref: 'abc' } };
        const expectedLocalizedPath = '/en/LOGIN/123?ref=abc'; // Based on mockLocalizeRoutePath

        render(
            <NavLink routeId={testRouteId} params={testParams}>
                Login Page
            </NavLink>
        );

        expect(mockLocalizeRoutePath).toHaveBeenCalledTimes(1);
        expect(mockLocalizeRoutePath).toHaveBeenCalledWith(DEFAULT_LOCALE, testRouteId, testParams);

        expect(MockReactRouterNavLink).toHaveBeenCalledTimes(1);
        expect(MockReactRouterNavLink).toHaveBeenCalledWith(
            expect.objectContaining({
                to: expectedLocalizedPath,
                children: 'Login Page',
            }),
            undefined
        );

        const linkElement = screen.getByTestId('mock-navlink');
        expect(linkElement).toHaveAttribute('href', expectedLocalizedPath);
        expect(linkElement).toHaveTextContent('Login Page');
    });

    // Test Case 3: Passes down other NavLinkProps
    it('should pass down other NavLinkProps correctly', () => {
        const testHref = '/dashboard';
        render(
            <NavLink href={testHref} className="custom-link" end style={{ color: 'blue' }}>
                Dashboard
            </NavLink>
        );

        expect(MockReactRouterNavLink).toHaveBeenCalledWith(
            expect.objectContaining({
                to: testHref,
                className: 'custom-link',
                end: true,
                style: { color: 'blue' },
                children: 'Dashboard',
            }),
            undefined
        );
    });

    // Test Case 4: Handles language change (simulated via rerender)
    it('should re-localize path when i18n language changes', () => {
        const testRouteId: TestRouteId = 'LOGIN';
        const initialPath = '/en/login';
        const germanPath = '/de/anmelden';

        // Initial render: language is DEFAULT_LOCALE
        mockLocalizeRoutePath.mockReturnValueOnce(initialPath);
        const { rerender } = render(<NavLink routeId={testRouteId}>About Us</NavLink>);

        expect(mockLocalizeRoutePath).toHaveBeenCalledTimes(1);
        expect(mockLocalizeRoutePath).toHaveBeenCalledWith(DEFAULT_LOCALE, testRouteId, undefined);
        expect(screen.getByTestId('mock-navlink')).toHaveAttribute('href', initialPath);

        // Simulate language change to 'de' and re-render the component
        mockUseTranslation.mockReturnValue({ i18n: { language: LOCALES.GERMAN } });
        mockLocalizeRoutePath.mockReturnValueOnce(germanPath); // Set return for the next call
        rerender(<NavLink routeId={testRouteId}>About Us</NavLink>);

        // Expect localizeRoutePath to be called again with the new language
        expect(mockLocalizeRoutePath).toHaveBeenCalledTimes(2);
        expect(mockLocalizeRoutePath).toHaveBeenCalledWith(LOCALES.GERMAN, testRouteId, undefined);
        expect(screen.getByTestId('mock-navlink')).toHaveAttribute('href', germanPath);
    });

    // Test Case 5: Prioritizes routeId over href if both are provided
    it('should prioritize routeId over href if both are provided', () => {
        const testRouteId: TestRouteId = 'SETTINGS';
        const testHref = '/should-be-ignored';
        render(
            <NavLink routeId={testRouteId} href={testHref}>
                Settings
            </NavLink>
        );

        expect(mockLocalizeRoutePath).toHaveBeenCalledTimes(1);
        expect(mockLocalizeRoutePath).toHaveBeenCalledWith(DEFAULT_LOCALE, testRouteId, undefined);
        expect(MockReactRouterNavLink).toHaveBeenCalledWith(
            expect.objectContaining({
                to: '/en/SETTINGS', // Expect path from routeId, not href
            }),
            undefined
        );
    });

    // Test Case 6: No params provided for routeId
    it('should handle routeId without params correctly', () => {
        const testRouteId: TestRouteId = 'LOGIN';
        render(<NavLink routeId={testRouteId}>Login</NavLink>);

        expect(mockLocalizeRoutePath).toHaveBeenCalledTimes(1);
        expect(mockLocalizeRoutePath).toHaveBeenCalledWith(DEFAULT_LOCALE, testRouteId, undefined);
        expect(MockReactRouterNavLink).toHaveBeenCalledWith(
            expect.objectContaining({
                to: '/en/LOGIN',
            }),
            undefined
        );
    });
});
