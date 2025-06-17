import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '@/c/contexts/Theme/ThemeProvider.tsx';

import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
    it('toggles theme when clicked', () => {
        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>
        );

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        // Default assumption: starts with "🌙 Dark"
        expect(button.textContent).toMatch(/dark/i);

        fireEvent.click(button);

        // After toggle, should switch to Light
        expect(button.textContent).toMatch(/light/i);

        fireEvent.click(button);

        // After toggle, should toggle back to Dark
        expect(button.textContent).toMatch(/dark/i);
    });
});
