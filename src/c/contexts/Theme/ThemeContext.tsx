import { createContext } from 'react';

import type { ThemeValue } from '@/c/types/core.ts';

export type ThemeContextValue = {
    theme: ThemeValue;
    hasBeenSetExplicitlyByUser: boolean;
    toggleTheme: VoidFunction;
    resetToSystemTheme: VoidFunction;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
ThemeContext.displayName = 'ThemeContext';
