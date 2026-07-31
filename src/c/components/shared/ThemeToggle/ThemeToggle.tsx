import React from 'react';

import { useTranslation } from 'react-i18next';

import useTheme from '@/c/contexts/Theme/useTheme.ts';

type Props = {
    className?: string;
};

const ThemeToggle: React.FC<Props> = ({ className }) => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    return (
        <button data-testid="theme-toggle" className={className} type={'button'} onClick={toggleTheme}>
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            {theme === 'dark' ? `☀️ ${t('common:light')}` : `🌙 ${t('common:dark')}`}
        </button>
    );
};
export default ThemeToggle;
