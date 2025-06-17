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
        <button onClick={toggleTheme} className={className} type={'button'}>
            {theme === 'dark' ? `☀️ ${t('common:light')}` : `🌙 ${t('common:dark')}`}
        </button>
    );
};
export default ThemeToggle;
