import React from 'react';

import clsx from 'clsx';

import { LOCALE_FLAGS, type Locale } from '@/i18n/locales';

type LocaleOption = {
    value: Locale;
    text: string;
};

type Props = {
    languages: LocaleOption[];
    currentLocale: Locale;
    onSelect: (locale: Locale) => void;
};

const LocaleSelectorMenu: React.FC<Props> = ({ languages, currentLocale, onSelect }) => (
    <div
        data-testid="locale-selector-menu"
        aria-orientation="vertical"
        className="border-header-border bg-header-bg absolute right-0 z-50 mt-2 min-w-36 overflow-hidden rounded-lg border shadow-lg"
        role="menu"
    >
        {languages.map(({ value, text }) => {
            const selected = value === currentLocale;
            return (
                <button
                    key={value}
                    className={clsx(
                        'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
                        selected
                            ? 'bg-accent font-bold text-white'
                            : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                    role="menuitem"
                    type="button"
                    onClick={() => onSelect(value)}
                >
                    <span className="text-base">{LOCALE_FLAGS[value]}</span>
                    <span>{text}</span>
                </button>
            );
        })}
    </div>
);

export default LocaleSelectorMenu;
