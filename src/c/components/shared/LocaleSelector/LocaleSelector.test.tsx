import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            changeLanguage: mockChangeLanguage,
        },
    }),
}));

import LocaleSelector from './LocaleSelector';

describe('LocaleSelector', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders with current locale flag', () => {
        render(<LocaleSelector />);
        expect(screen.getByLabelText('common:selectLanguage')).toBeInTheDocument();
    });

    it('opens dropdown on click', () => {
        render(<LocaleSelector />);
        fireEvent.click(screen.getByLabelText('common:selectLanguage'));
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('changes language when an option is selected', () => {
        render(<LocaleSelector />);
        fireEvent.click(screen.getByLabelText('common:selectLanguage'));
        const menuItems = screen.getAllByRole('menuitem');
        fireEvent.click(menuItems[1]);
        expect(mockChangeLanguage).toHaveBeenCalledWith('de');
    });

    it('closes dropdown on outside click', () => {
        render(<LocaleSelector />);
        fireEvent.click(screen.getByLabelText('common:selectLanguage'));
        expect(screen.getByRole('menu')).toBeInTheDocument();
        fireEvent.mouseDown(document.body);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('highlights the currently selected language', () => {
        render(<LocaleSelector />);
        fireEvent.click(screen.getByLabelText('common:selectLanguage'));
        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems[0].className).toContain('bg-accent');
    });
});
