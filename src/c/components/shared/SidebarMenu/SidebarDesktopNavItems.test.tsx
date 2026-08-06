import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { SidebarDesktopNavItems } from '@/c/components/shared/SidebarMenu/SidebarDesktopNavItems.tsx';
import type { SidebarMenuItems } from '@/c/components/shared/SidebarMenu/SidebarDesktopNavItems.tsx';
import { ROUTES_IDS } from '@/core/routing/routes.ts';

vi.mock('@/core/routing/localizedRoute.ts', () => ({
    localizeRoutePath: (_locale: string, routeId: string) => `/${routeId.toLowerCase()}`,
}));

describe('SidebarDesktopNavItems', () => {
    const menuItems: SidebarMenuItems = {
        [ROUTES_IDS.SETTINGS]: {
            icon: <span>⚙</span>,
            label: 'Settings',
            group: 'top',
        },
    };

    it('renders expanded items and highlights the active path', () => {
        render(
            <MemoryRouter>
                <div>
                    {SidebarDesktopNavItems({
                        locale: 'en',
                        menuItems,
                        expanded: true,
                        pathname: '/settings',
                    })}
                </div>
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: /Settings/ });
        expect(button).toHaveClass('text-accent');
        expect(button).toHaveClass('py-4');
    });

    it('renders collapsed items without the active accent when path differs', () => {
        render(
            <MemoryRouter>
                <div>
                    {SidebarDesktopNavItems({
                        locale: 'en',
                        menuItems,
                        expanded: false,
                        pathname: '/other',
                    })}
                </div>
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: /Settings/ });
        expect(button).not.toHaveClass('text-accent');
        expect(button).toHaveClass('flex-col');
    });
});
