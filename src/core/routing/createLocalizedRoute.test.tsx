import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, type RouteProps, Routes } from 'react-router-dom';
import { type Mock, beforeEach, describe, vi } from 'vitest';

import type { Config } from '@/core/config.ts';
import createLocalizedRoute from '@/core/routing/createLocalizedRoute.tsx';
import * as localizedRoute from '@/core/routing/localizedRoute.ts';

vi.mock('@/core/routing/localizedRoute', async () => ({
    ...(await vi.importActual('@/core/routing/localizedRoute')),
    localizeRoutePath: vi.fn(),
}));

describe('createLocalizedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return a Route element with correct path and element', async () => {
        const mockedReturnedLocalizedPath = '/en/magic-route';
        (localizedRoute.localizeRoutePath as Mock).mockReturnValue(mockedReturnedLocalizedPath);

        const DummyComponent = <div>Test KKK Component</div>;
        const config: Config['localization'] = {
            useLocaleInPath: true,
            usePrefixForDefaultLocale: false,
        };
        const route = createLocalizedRoute('en', 'SETTINGS', DummyComponent, config);

        const routeProps: RouteProps = route.props;

        expect(route.type).toBe(Route);
        expect(route.key).toBe('SETTINGS');
        expect(routeProps.path).toBe(mockedReturnedLocalizedPath);
        expect(routeProps.element).toBe(DummyComponent);

        render(
            <MemoryRouter initialEntries={[mockedReturnedLocalizedPath]}>
                <Routes>{route}</Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Test KKK Component')).toBeInTheDocument();
    });
});
