import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import LanguageSwitcher from './LanguageSwitcher';

const { mockChangeLanguage } = vi.hoisted(() => ({
    mockChangeLanguage: vi.fn(),
}));

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({
        language: 'en',
        changeLanguage: mockChangeLanguage,
        includeT: false,
    });
});

vi.mock('@/c/components/shared/icons/ChevronDown.tsx', () => ({
    default: () => <span data-testid="chevron">▼</span>,
}));

describe('LanguageSwitcher', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<LanguageSwitcher />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('toggles dropdown on click', () => {
        render(<LanguageSwitcher />);
        const button = screen.getByRole('button', { expanded: false });
        fireEvent.click(button);
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('changes language when option selected', () => {
        render(<LanguageSwitcher />);
        const toggleButton = screen.getByRole('button', { expanded: false });
        fireEvent.click(toggleButton);
        const menuItems = screen.getAllByRole('menuitem');
        fireEvent.click(menuItems[1]);
        expect(mockChangeLanguage).toHaveBeenCalled();
    });

    it('closes dropdown on outside click', () => {
        render(<LanguageSwitcher />);
        const toggleButton = screen.getByRole('button', { expanded: false });
        fireEvent.click(toggleButton);
        expect(screen.getByRole('menu')).toBeInTheDocument();

        fireEvent.mouseDown(document.body);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
});
