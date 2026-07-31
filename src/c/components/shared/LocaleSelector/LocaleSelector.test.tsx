import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import LocaleSelector from './LocaleSelector';

const { mockChangeLanguage } = vi.hoisted(() => ({
    mockChangeLanguage: vi.fn(),
}));

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en', changeLanguage: mockChangeLanguage });
});

describe('LocaleSelector', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders with current locale flag', () => {
        render(<LocaleSelector />);
        expect(screen.getByTestId('locale-selector')).toBeInTheDocument();
    });

    it('opens dropdown on click', () => {
        render(<LocaleSelector />);
        fireEvent.click(screen.getByTestId('locale-selector'));
        expect(screen.getByTestId('locale-selector-menu')).toBeInTheDocument();
    });

    it('changes language when an option is selected', () => {
        render(<LocaleSelector />);
        fireEvent.click(screen.getByTestId('locale-selector'));
        const menuItems = screen.getAllByRole('menuitem');
        fireEvent.click(menuItems[1]);
        expect(mockChangeLanguage).toHaveBeenCalledWith('de');
    });

    it('closes dropdown on outside click', () => {
        render(<LocaleSelector />);
        fireEvent.click(screen.getByTestId('locale-selector'));
        expect(screen.getByTestId('locale-selector-menu')).toBeInTheDocument();
        fireEvent.mouseDown(document.body);
        expect(screen.queryByTestId('locale-selector-menu')).not.toBeInTheDocument();
    });

    it('highlights the currently selected language', () => {
        render(<LocaleSelector />);
        fireEvent.click(screen.getByTestId('locale-selector'));
        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems[0].className).toContain('bg-accent');
    });
});
