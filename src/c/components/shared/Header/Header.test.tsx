import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@/c/contexts/Theme/ThemeProvider';

import { Header } from './Header';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn(),
        },
    }),
}));

describe('Header', () => {
    it('renders header correctly (snapshot)', () => {
        const { asFragment } = render(
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders locale selector and theme toggle', () => {
        render(
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        );

        expect(screen.getByLabelText('common:selectLanguage')).toBeInTheDocument();

        const themeButton = screen.getByRole('button', { name: /dark|light/i });
        expect(themeButton).toBeInTheDocument();

        fireEvent.click(themeButton);
        expect(themeButton.textContent?.toLowerCase()).toMatch(/light|dark/);
    });
});
