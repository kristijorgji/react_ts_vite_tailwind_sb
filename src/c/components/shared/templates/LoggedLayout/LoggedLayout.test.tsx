import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LoggedLayout from '@/c/components/shared/templates/LoggedLayout/LoggedLayout.tsx';

vi.mock('@/c/components/shared/Header/Header.tsx', () => ({
    Header: () => <div data-testid="header" />,
}));

vi.mock('@/c/components/shared/SidebarMenu/SidebarMenu.tsx', () => ({
    SidebarMenu: () => <div data-testid="sidebar" />,
}));

vi.mock('@/c/contexts/User/UserContextProvider.tsx', () => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('LoggedLayout', () => {
    it('renders sidebar, header, and children', () => {
        render(
            <LoggedLayout>
                <span>page</span>
            </LoggedLayout>
        );
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('page')).toBeInTheDocument();
    });
});
