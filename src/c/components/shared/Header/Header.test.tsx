import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@/c/contexts/Theme/ThemeProvider';

import { Header } from './Header';

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en', changeLanguage: vi.fn() });
});

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

        expect(screen.getByTestId('locale-selector')).toBeInTheDocument();

        const themeButton = screen.getByTestId('theme-toggle');
        expect(themeButton).toBeInTheDocument();

        fireEvent.click(themeButton);
        expect(themeButton.textContent?.toLowerCase()).toMatch(/light|dark/);
    });
});
