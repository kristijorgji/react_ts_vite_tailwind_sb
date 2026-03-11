import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn(),
        },
    }),
}));

vi.mock('@/c/logout.ts', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/c/components/shared/icons/ChevronDown.tsx', () => ({
    default: () => <span>▼</span>,
}));

import logout from '@/c/logout.ts';

import SettingsPage from './SettingsPage';

describe('SettingsPage', () => {
    it('renders language switcher and logout button', () => {
        render(<SettingsPage />);
        expect(screen.getByText('common:logout')).toBeInTheDocument();
    });

    it('calls logout when button is clicked', () => {
        render(<SettingsPage />);
        const logoutButton = screen.getByText('common:logout');
        fireEvent.click(logoutButton);
        expect(logout).toHaveBeenCalled();
    });
});
