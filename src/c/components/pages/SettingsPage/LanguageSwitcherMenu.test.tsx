import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LanguageSwitcherMenu from '@/c/components/pages/SettingsPage/LanguageSwitcherMenu.tsx';
import type { Locale } from '@/i18n/locales.ts';

vi.mock('@/c/components/pages/SettingsPage/LanguageIndicator.tsx', () => ({
    default: ({ code }: { code: string }) => <span>{code}</span>,
}));

type LanguageOption = {
    value: Locale;
    text: string;
};

describe('LanguageSwitcherMenu', () => {
    const languages: LanguageOption[] = [
        { value: 'en', text: 'English' },
        { value: 'de', text: 'Deutsch' },
    ];

    it('highlights the selected language and invokes onSelect', () => {
        const onSelect = vi.fn();
        render(<LanguageSwitcherMenu languages={languages} selectedLanguage="en" onSelect={onSelect} />);

        const items = screen.getAllByRole('menuitem');
        expect(items[0]).toHaveClass('bg-accent');
        expect(items[1]).not.toHaveClass('bg-accent');

        fireEvent.click(items[1]);
        expect(onSelect).toHaveBeenCalledWith('de');
    });

    it('applies hover styles only for unselected options', () => {
        render(<LanguageSwitcherMenu languages={languages} selectedLanguage="en" onSelect={vi.fn()} />);

        const [selected, unselected] = screen.getAllByRole('menuitem');

        fireEvent.mouseEnter(selected);
        expect(selected.style.backgroundColor).toBe('');

        fireEvent.mouseEnter(unselected);
        expect(unselected.style.backgroundColor).toBe('var(--color-btn-primary-hover)');

        fireEvent.mouseLeave(unselected);
        expect(unselected.style.backgroundColor).toBe('transparent');

        fireEvent.mouseLeave(selected);
        expect(selected.style.backgroundColor).toBe('');
    });
});
