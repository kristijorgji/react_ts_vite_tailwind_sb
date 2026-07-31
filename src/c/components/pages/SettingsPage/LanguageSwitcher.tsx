import React, { useCallback, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import LanguageIndicator from '@/c/components/pages/SettingsPage/LanguageIndicator.tsx';
import LanguageSwitcherMenu from '@/c/components/pages/SettingsPage/LanguageSwitcherMenu.tsx';
import ChevronDown from '@/c/components/shared/icons/ChevronDown.tsx';
import useClickOutside from '@/c/hooks/core/useClickOutside.ts';

import { type Locale, getLocalesSelectionItems } from '../../../../i18n/locales.ts';

const languages = getLocalesSelectionItems();

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const close = useCallback(() => setOpen(false), []);

    useClickOutside(dropdownRef, close);

    const currentLanguage = languages.find((lang) => lang.value === i18n.language) || languages[0];

    const changeLanguage = (code: Locale): void => {
        void i18n.changeLanguage(code);
        setOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative inline-block min-w-14 text-left">
            <button
                data-testid="language-switcher"
                aria-expanded={open}
                aria-haspopup="true"
                className="flex items-center justify-between font-semibold"
                type="button"
                onClick={() => setOpen(!open)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-btn-primary-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-btn-primary)')}
            >
                <span className="flex items-center">
                    <LanguageIndicator code={currentLanguage.value} />
                    {currentLanguage.text}
                </span>
                <ChevronDown style={{ width: 18, height: 18, marginLeft: 12 }} />
            </button>

            {open && (
                <LanguageSwitcherMenu
                    languages={languages}
                    selectedLanguage={i18n.language}
                    onSelect={changeLanguage}
                />
            )}
        </div>
    );
};

export default LanguageSwitcher;
