import React from 'react';

import clsx from 'clsx';

import LanguageIndicator from '@/c/components/pages/SettingsPage/LanguageIndicator.tsx';

import { type Locale } from '../../../../i18n/locales.ts';

type LanguageOption = {
    value: Locale;
    text: string;
};

type Props = {
    languages: LanguageOption[];
    selectedLanguage: string;
    onSelect: (code: Locale) => void;
};

const LanguageSwitcherMenu: React.FC<Props> = ({ languages, selectedLanguage, onSelect }) => (
    <div
        data-testid="language-switcher-menu"
        aria-orientation="vertical"
        className="border-header-border bg-bg absolute right-0 z-50 mt-1 w-full rounded-lg border"
        role="menu"
        style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
    >
        {languages.map(({ value, text }) => {
            const selected = value === selectedLanguage;
            return (
                <button
                    key={value}
                    className={clsx(
                        'flex w-full items-center rounded-none border-none px-4 py-2',
                        selected ? 'bg-accent font-bold text-white' : 'bg-transparent font-semibold'
                    )}
                    role="menuitem"
                    type="button"
                    onClick={() => onSelect(value)}
                    onMouseEnter={(e) => {
                        if (!selected) {
                            e.currentTarget.style.backgroundColor = 'var(--color-btn-primary-hover)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!selected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    <LanguageIndicator code={value} />
                    {text}
                </button>
            );
        })}
    </div>
);

export default LanguageSwitcherMenu;
