import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import config from '@/core/config';

import { DEFAULT_LOCALE } from './locales';
import { SUPPORTED_LOCALES } from './locales.ts';

const isDev = import.meta.env.DEV;

i18n.use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: DEFAULT_LOCALE,
        supportedLngs: SUPPORTED_LOCALES,
        defaultNS: ['common'],
        debug: isDev,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        detection: {
            order: [...(config.localization.useLocaleInPath ? ['path'] : ['localStorage']), 'navigator'],
            ...(config.localization.useLocaleInPath
                ? {
                      lookupFromPathIndex: 0,
                  }
                : {}),
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage'],
        },
    });

export default i18n;
