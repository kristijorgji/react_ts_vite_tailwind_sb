import { createContext } from 'react';

import type { ThemeValue } from '@/c/types/core.ts';

export type ThemeContextValue = {
    theme: ThemeValue;
    toggleTheme: VoidFunction;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
ThemeContext.displayName = 'ThemeContext';
