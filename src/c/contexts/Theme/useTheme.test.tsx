import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '@/c/contexts/Theme/ThemeProvider.tsx';
import useTheme from '@/c/contexts/Theme/useTheme.ts';

function Probe() {
    const { theme } = useTheme();
    return <div data-testid="theme">{theme}</div>;
}

describe('useTheme', () => {
    it('returns the theme context value when inside ThemeProvider', () => {
        render(
            <ThemeProvider>
                <Probe />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme')).toHaveTextContent(/light|dark/);
    });

    it('throws when used outside ThemeProvider', () => {
        expect(() => render(<Probe />)).toThrow('useTheme must be used within ThemeContextProvider');
    });
});
