import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { SidebarMenu } from '@/c/components/shared/SidebarMenu/SidebarMenu.tsx';
import type { ViewManager } from '@/c/components/shared/templates/types.ts';

const { mockSetViewManager, mockViewManager } = vi.hoisted(() => {
    const viewManager: ViewManager = {
        header: true,
        lsidebar: { show: true, expanded: false },
    };
    return {
        mockViewManager: viewManager,
        mockSetViewManager: vi.fn(),
    };
});

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en' });
});

vi.mock('@/c/contexts/ViewManager/useViewManager.ts', () => ({
    default: () => ({
        viewManager: mockViewManager,
        setViewManager: mockSetViewManager,
    }),
}));

vi.mock('@/core/routing/localizedRoute.ts', () => ({
    localizeRoutePath: (_locale: string, routeId: string) => `/${routeId.toLowerCase()}`,
}));

describe('SidebarMenu', () => {
    it('renders desktop and mobile nav and toggles expansion', () => {
        render(
            <MemoryRouter>
                <SidebarMenu />
            </MemoryRouter>
        );

        expect(screen.getByRole('complementary')).toBeInTheDocument();
        expect(screen.getAllByText('common:menu.home').length).toBeGreaterThan(0);
        expect(screen.getAllByText('common:menu.settings').length).toBeGreaterThan(0);

        const toggle = screen.getByRole('complementary').querySelector('button');
        expect(toggle).toBeTruthy();
        fireEvent.click(toggle);
        expect(mockSetViewManager).toHaveBeenCalledWith({
            ...mockViewManager,
            lsidebar: { ...mockViewManager.lsidebar, expanded: true },
        });
    });
});
