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

function createMediaQueryList(
    matches: boolean,
    addEventListener: MediaQueryList['addEventListener'] = vi.fn()
): MediaQueryList {
    const mediaQuery: MediaQueryList = {
        matches,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener,
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    };
    return mediaQuery;
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

    it('falls back to system preference when localStorage read fails', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.mocked(localStorage.getItem).mockImplementation(() => {
            throw new Error('blocked');
        });
        vi.spyOn(window, 'matchMedia').mockReturnValue(createMediaQueryList(true));

        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(screen.getByTestId('explicit')).toHaveTextContent('false');
        errorSpy.mockRestore();
    });

    it('follows system theme changes when the user has not set a preference', () => {
        const listeners: Array<(e: { matches: boolean }) => void> = [];
        vi.mocked(localStorage.getItem).mockReturnValue(null);
        vi.spyOn(window, 'matchMedia').mockReturnValue(
            createMediaQueryList(false, (_event, listener) => {
                if (typeof listener === 'function') {
                    listeners.push(listener);
                }
            })
        );

        render(
            <ThemeProvider>
                <TestConsumer />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme')).toHaveTextContent('light');

        const darkChange: { matches: boolean } = { matches: true };
        act(() => {
            listeners.forEach((listener) => {
                listener(darkChange);
            });
        });
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
});
