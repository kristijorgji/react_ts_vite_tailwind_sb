import React, { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LOCALE_FLAGS, type Locale, SUPPORTED_LOCALES, getLocalesSelectionItems } from '@/i18n/locales';

const languages = getLocalesSelectionItems();

type Props = {
    className?: string;
};

const LocaleSelector: React.FC<Props> = ({ className }) => {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLocale = i18n.language as Locale;
    const currentFlag = LOCALE_FLAGS[currentLocale] || LOCALE_FLAGS[SUPPORTED_LOCALES[0]];

    const changeLanguage = useCallback(
        (locale: Locale) => {
            i18n.changeLanguage(locale);
            setOpen(false);
        },
        [i18n]
    );

    return (
        <div ref={dropdownRef} className="relative">
            <button
                data-testid="locale-selector"
                aria-expanded={open}
                aria-haspopup="true"
                aria-label={t('common:selectLanguage')}
                className={clsx(
                    'flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
                    className
                )}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
            >
                {}
                <span className="text-base">{currentFlag}</span>
                <span className="hidden uppercase sm:inline">{currentLocale}</span>
                <ChevronDown className={clsx('transition-transform', open && 'rotate-180')} size={14} />
            </button>

            {open && (
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
                                onClick={() => changeLanguage(value)}
                            >
                                {}
                                <span className="text-base">{LOCALE_FLAGS[value]}</span>
                                <span>{text}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LocaleSelector;
