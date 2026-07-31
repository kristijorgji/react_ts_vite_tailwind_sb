import React, { useCallback, useRef, useState } from 'react';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import LocaleSelectorMenu from '@/c/components/shared/LocaleSelector/LocaleSelectorMenu.tsx';
import useClickOutside from '@/c/hooks/core/useClickOutside.ts';
import { LOCALE_FLAGS, type Locale, SUPPORTED_LOCALES, getLocalesSelectionItems } from '@/i18n/locales';

const languages = getLocalesSelectionItems();

type Props = {
    className?: string;
};

const LocaleSelector: React.FC<Props> = ({ className }) => {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const close = useCallback(() => setOpen(false), []);

    useClickOutside(dropdownRef, close);

    const currentLocale = i18n.language as Locale;
    const currentFlag = LOCALE_FLAGS[currentLocale] || LOCALE_FLAGS[SUPPORTED_LOCALES[0]];

    const changeLanguage = useCallback(
        (locale: Locale) => {
            void i18n.changeLanguage(locale);
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
                <span className="text-base">{currentFlag}</span>
                <span className="hidden uppercase sm:inline">{currentLocale}</span>
                <ChevronDown className={clsx('transition-transform', open && 'rotate-180')} size={14} />
            </button>

            {open && (
                <LocaleSelectorMenu currentLocale={currentLocale} languages={languages} onSelect={changeLanguage} />
            )}
        </div>
    );
};

export default LocaleSelector;
