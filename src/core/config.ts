import type { LocalizationConfig } from '@kristijorgji/react-localized-routing';

type Config = {
    localization: LocalizationConfig;
};

export default {
    localization: {
        useLocaleInPath: false,
        usePrefixForDefaultLocale: false,
    },
} as const satisfies Config;
