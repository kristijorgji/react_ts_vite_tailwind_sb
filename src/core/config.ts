export type Config = {
    localization: {
        useLocaleInPath: boolean;
        usePrefixForDefaultLocale: boolean;
    };
};

export default {
    localization: {
        useLocaleInPath: false,
        usePrefixForDefaultLocale: false,
    },
} as const satisfies Config;
