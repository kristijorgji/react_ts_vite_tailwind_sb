export const LOCALES = {
    ENGLISH: 'en',
    GERMAN: 'de',
} as const;

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

export const DEFAULT_LOCALE = LOCALES.ENGLISH;

export const SUPPORTED_LOCALES: Locale[] = Object.keys(LOCALES).map((k) => LOCALES[k as keyof typeof LOCALES]);

const LOCALES_TEXTS: Record<Locale, string> = {
    en: 'English',
    de: 'Deutsch',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
    en: '🇺🇸',
    de: '🇩🇪',
};

export function getLocalesSelectionItems(localesTexts?: Record<Locale, string>): {
    value: Locale;
    text: string;
}[] {
    const lt = localesTexts ?? LOCALES_TEXTS;

    return Object.keys(LOCALES).reduce<
        {
            value: Locale;
            text: string;
        }[]
    >((p, lk) => {
        // @ts-ignore
        const locale = LOCALES[lk] as unknown as Locale;

        p.push({
            value: locale,
            text: lt[locale],
        });
        return p;
    }, []);
}
