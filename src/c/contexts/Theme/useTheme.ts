import { use } from 'react';

import { ThemeContext, type ThemeContextValue } from '@/c/contexts/Theme/ThemeContext.tsx';

export default function useTheme(): ThemeContextValue {
    const value = use(ThemeContext);
    if (!value) {
        throw new Error('useTheme must be used within ThemeContextProvider');
    }
    return value;
}
