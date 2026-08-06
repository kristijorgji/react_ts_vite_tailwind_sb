import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import type { SidebarMenuItems } from '@/c/components/shared/SidebarMenu/SidebarDesktopNavItems.tsx';
import SidebarMobileNav from '@/c/components/shared/SidebarMenu/SidebarMobileNav.tsx';
import { ROUTES_IDS } from '@/core/routing/routes.ts';

vi.mock('@/core/routing/localizedRoute.ts', () => ({
    localizeRoutePath: (_locale: string, routeId: string) => `/${routeId.toLowerCase()}`,
}));

describe('SidebarMobileNav', () => {
    const menuItems: SidebarMenuItems = {
        [ROUTES_IDS.INDEX]: {
            icon: <span>H</span>,
            label: 'Home',
            group: 'top',
        },
        [ROUTES_IDS.SETTINGS]: {
            icon: <span>S</span>,
            label: 'Settings',
            group: 'bottom',
        },
    };

    it('highlights the active mobile nav item', () => {
        render(
            <MemoryRouter>
                <SidebarMobileNav locale="en" menuItems={menuItems} pathname="/index" />
            </MemoryRouter>
        );

        expect(screen.getByRole('button', { name: /Home/ })).toHaveClass('text-accent');
        expect(screen.getByRole('button', { name: /Settings/ })).not.toHaveClass('text-accent');
    });
});
