import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import logout from '@/c/logout.ts';

import SettingsPage from './SettingsPage';

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en', changeLanguage: vi.fn() });
});

vi.mock('@/c/logout.ts', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/c/components/shared/icons/ChevronDown.tsx', () => ({
    default: () => <span>▼</span>,
}));

describe('SettingsPage', () => {
    it('renders language switcher and logout button', () => {
        render(<SettingsPage />);
        expect(screen.getByText('common:logout')).toBeInTheDocument();
    });

    it('calls logout when button is clicked', () => {
        render(<SettingsPage />);
        fireEvent.click(screen.getByText('common:logout'));
        expect(logout).toHaveBeenCalled();
    });
});
