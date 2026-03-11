import { use } from 'react';

import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ThemeContext } from '@/c/contexts/Theme/ThemeContext';

import { ThemeProvider } from './ThemeProvider';

function TestConsumer() {
    const { theme, toggleTheme, resetToSystemTheme, hasBeenSetExplicitlyByUser } = use(ThemeContext);
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <span data-testid="explicit">{String(hasBeenSetExplicitlyByUser)}</span>
            <button onClick={toggleTheme}>toggle</button>
            <button onClick={resetToSystemTheme}>reset</button>
        </div>
    );
}

describe('ThemeProvider', () => {
    it('provides initial theme', () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme')).toHaveTextContent(/light|dark/);
    });

    it('toggles theme on toggleTheme', () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        const initial = screen.getByTestId('theme').textContent;
        act(() => {
            screen.getByText('toggle').click();
        });
        const toggled = screen.getByTestId('theme').textContent;
        expect(toggled).not.toBe(initial);
    });

    it('resets to system theme', () => {
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        act(() => {
            screen.getByText('toggle').click();
        });
        expect(screen.getByTestId('explicit')).toHaveTextContent('true');

        act(() => {
            screen.getByText('reset').click();
        });
        expect(screen.getByTestId('explicit')).toHaveTextContent('false');
    });

    it('reads stored theme from localStorage', () => {
        vi.mocked(localStorage.getItem).mockReturnValue('dark');
        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
});
