import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ThemeContext } from '@/c/contexts/Theme/ThemeContext.tsx';
import type { ThemeValue } from '@/c/types/core.ts';

const LOCAL_STORAGE_THEME_KEY = 'theme';

const getInitialTheme = (): ThemeValue => {
    try {
        const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
        if (storedTheme) {
            return storedTheme === 'dark' ? 'dark' : 'light';
        }
    } catch (e) {
        console.error('ThemeProvider: Failed to read theme from localStorage:', e);
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeValue>(getInitialTheme);

    const [hasThemeBeenSetExplicitly, setHasThemeBeenSetExplicitly] = useState<boolean>(
        localStorage.getItem(LOCAL_STORAGE_THEME_KEY) !== null
    );

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        if (hasThemeBeenSetExplicitly) {
            try {
                localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
            } catch (e) {
                console.error('ThemeProvider: Failed to write theme to localStorage:', e);
            }
        }
    }, [theme, hasThemeBeenSetExplicitly]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            // Only update the theme if the user hasn't explicitly set a preference
            // This ensures user's choice overrides system preference
            if (!hasThemeBeenSetExplicitly) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [hasThemeBeenSetExplicitly]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            setHasThemeBeenSetExplicitly(true);
            return prev === 'light' ? 'dark' : 'light';
        });
    }, []);

    const resetToSystemTheme = useCallback(() => {
        setHasThemeBeenSetExplicitly(false);
        setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        try {
            localStorage.removeItem(LOCAL_STORAGE_THEME_KEY);
        } catch (e) {
            console.error('ThemeProvider: Failed to remove theme from localStorage:', e);
        }
    }, []);

    const contextValue = useMemo(
        () => ({ theme, hasBeenSetExplicitlyByUser: hasThemeBeenSetExplicitly, toggleTheme, resetToSystemTheme }),
        [hasThemeBeenSetExplicitly, resetToSystemTheme, theme, toggleTheme]
    );

    return <ThemeContext value={contextValue}>{children}</ThemeContext>;
};
