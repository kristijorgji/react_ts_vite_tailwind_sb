import React, { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import ChevronDown from '@/c/components/shared/icons/ChevronDown.tsx';

import { LOCALES, type Locale, getLocalesSelectionItems } from '../../../../i18n/locales.ts';

const languages = getLocalesSelectionItems();

const LanguageIndicator: React.FC<{ code: Locale }> = ({ code }) => {
    const color = code === LOCALES.ENGLISH ? '#00BFFF' : '#32CD32';

    return (
        <span
            aria-hidden="true"
            className={'rounded-50% mr-2 inline-block h-2.5 w-2.5'}
            style={{
                backgroundColor: color,
                borderRadius: '50%',
            }}
        />
    );
};

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLanguage = languages.find((lang) => lang.value === i18n.language) || languages[0];

    const toggleDropdown = () => setOpen(!open);

    const changeLanguage = (code: Locale) => {
        i18n.changeLanguage(code);
        setOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative inline-block min-w-14 text-left">
            <button
                data-testid="language-switcher"
                aria-expanded={open}
                aria-haspopup="true"
                className={'flex items-center justify-between font-semibold'}
                type="button"
                onClick={toggleDropdown}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-btn-primary-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-btn-primary)')}
            >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageIndicator code={currentLanguage.value} />
                    {currentLanguage.text}
                </span>

                <ChevronDown style={{ width: 18, height: 18, marginLeft: 12 }} />
            </button>

            {/* Dropdown menu */}
            {open && (
                <div
                    data-testid="language-switcher-menu"
                    aria-orientation="vertical"
                    className={'border-header-border bg-bg absolute right-0 z-50 mt-1 w-full rounded-lg border'}
                    role="menu"
                    style={{
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    {languages.map(({ value, text }) => {
                        const selected = value === i18n.language;
                        return (
                            <button
                                key={value}
                                className={clsx(
                                    'flex w-full items-center rounded-none border-none px-4 py-2',
                                    selected ? 'bg-accent font-bold text-white' : 'bg-transparent font-semibold'
                                )}
                                role="menuitem"
                                type={'button'}
                                onClick={() => changeLanguage(value)}
                                onMouseEnter={(e) => {
                                    if (!selected)
                                        e.currentTarget.style.backgroundColor = 'var(--color-btn-primary-hover)';
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
            )}
        </div>
    );
};

export default LanguageSwitcher;
