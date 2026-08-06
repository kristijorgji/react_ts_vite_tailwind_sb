interface ReactI18nextMockOptions {
    language?: string;
    getLanguage?: () => string;
    changeLanguage?: (...args: unknown[]) => unknown;
    includeT?: boolean;
}

type I18nMock = {
    readonly language: string;
    changeLanguage?: (...args: unknown[]) => unknown;
};

type TranslationResult = {
    t: (key: string) => string;
    i18n: I18nMock;
};

/** Vitest module mock for `react-i18next` — identity `t` passthrough and optional language. */
export function createReactI18nextMockModule(options: ReactI18nextMockOptions = {}): {
    useTranslation: () => TranslationResult | Omit<TranslationResult, 't'>;
} {
    const includeT = options.includeT !== false;

    return {
        // eslint-disable-next-line react-x/no-unnecessary-use-prefix -- mirrors react-i18next API
        useTranslation: () => {
            const i18n: I18nMock = {
                get language() {
                    return options.getLanguage?.() ?? options.language ?? 'en';
                },
                ...(options.changeLanguage ? { changeLanguage: options.changeLanguage } : {}),
            };

            if (includeT) {
                return {
                    t: (key: string) => key,
                    i18n,
                };
            }

            return { i18n };
        },
    };
}
