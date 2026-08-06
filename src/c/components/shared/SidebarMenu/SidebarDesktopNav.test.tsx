import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import SidebarDesktopNav from '@/c/components/shared/SidebarMenu/SidebarDesktopNav.tsx';
import type { SidebarMenuItems } from '@/c/components/shared/SidebarMenu/SidebarDesktopNavItems.tsx';

vi.mock('@/core/routing/localizedRoute.ts', () => ({
    localizeRoutePath: (_locale: string, routeId: string) => `/${routeId.toLowerCase()}`,
}));

describe('SidebarDesktopNav', () => {
    const topMenuItems: SidebarMenuItems = {
        INDEX: { icon: <span>H</span>, label: 'Home', group: 'top' },
    };
    const bottomMenuItems: SidebarMenuItems = {
        SETTINGS: { icon: <span>S</span>, label: 'Settings', group: 'bottom' },
    };

    it('renders expanded layout and toggles when the chevron is clicked', () => {
        const onToggleExpanded = vi.fn();
        render(
            <MemoryRouter>
                <SidebarDesktopNav
                    bottomMenuItems={bottomMenuItems}
                    expanded
                    locale="en"
                    pathname="/index"
                    toggleIconSize={20}
                    topMenuItems={topMenuItems}
                    onToggleExpanded={onToggleExpanded}
                />
            </MemoryRouter>
        );

        const aside = screen.getByRole('complementary');
        expect(aside).toHaveClass('w-40');
        fireEvent.click(aside.querySelector('button'));
        expect(onToggleExpanded).toHaveBeenCalledOnce();
    });

    it('renders collapsed layout', () => {
        render(
            <MemoryRouter>
                <SidebarDesktopNav
                    bottomMenuItems={bottomMenuItems}
                    expanded={false}
                    locale="en"
                    pathname="/other"
                    toggleIconSize={20}
                    topMenuItems={topMenuItems}
                    onToggleExpanded={vi.fn()}
                />
            </MemoryRouter>
        );

        expect(screen.getByRole('complementary')).toHaveClass('w-20');
    });
});
