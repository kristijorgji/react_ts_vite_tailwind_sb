import React, { useEffect, useMemo, useState } from 'react';

import { ThemeContext } from '@/c/contexts/Theme/ThemeContext.tsx';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return <ThemeContext value={contextValue}>{children}</ThemeContext>;
};
