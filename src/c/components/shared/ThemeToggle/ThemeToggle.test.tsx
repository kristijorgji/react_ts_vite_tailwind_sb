import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '@/c/contexts/Theme/ThemeProvider.tsx';

import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
    it('toggles theme when clicked', async () => {
        const user = userEvent.setup();
        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>
        );

        const button = screen.getByTestId('theme-toggle');
        expect(button).toBeInTheDocument();

        // Default assumption: starts with "🌙 Dark"
        expect(button.textContent).toMatch(/dark/i);

        await user.click(button);

        // After toggle, should switch to Light
        expect(button.textContent).toMatch(/light/i);

        await user.click(button);

        // After toggle, should toggle back to Dark
        expect(button.textContent).toMatch(/dark/i);
    });
});
