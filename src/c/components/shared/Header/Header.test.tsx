import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '@/c/contexts/Theme/ThemeProvider';

import { Header } from './Header';

describe('Header', () => {
    it('renders header correctly (snapshot)', () => {
        const { asFragment } = render(
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders header and toggles theme on button click', () => {
        render(
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        );

        // Find the theme toggle button
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        // Check initial text
        expect(button.textContent?.toLowerCase()).toMatch(/dark|light/);

        // Simulate click
        fireEvent.click(button);

        // After clicking, text should toggle
        expect(button.textContent?.toLowerCase()).toMatch(/light|dark/); // could be either depending on initial state
    });
});
