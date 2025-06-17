import { use } from 'react';

import { ThemeContext, type ThemeContextValue } from '@/c/contexts/Theme/ThemeContext.tsx';

export default function useTheme(): ThemeContextValue {
    return use(ThemeContext)!;
}
