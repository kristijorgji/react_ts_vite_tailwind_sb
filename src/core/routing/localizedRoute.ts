import {
    type LocalizationConfig,
    type RouteParams,
    createLocalizedRouting,
    localizeRoutePath as packageLocalizeRoutePath,
} from '@kristijorgji/react-localized-routing';

import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales.ts';

import config from '../config.ts';
import { ROUTES, type RouteId } from './routes.ts';

const { localizeRoutePath: boundLocalizeRoutePath } = createLocalizedRouting({
    routes: ROUTES,
    defaultLocale: DEFAULT_LOCALE,
    config: config.localization,
});

/**
 * App-bound localize helper. Prefer this over the package function so call sites
 * do not pass ROUTES / DEFAULT_LOCALE / config every time.
 */
export function localizeRoutePath(
    locale: Locale,
    routeId: RouteId,
    params?: RouteParams,
    localizationConfig: LocalizationConfig = config.localization
): string {
    if (localizationConfig === config.localization) {
        return boundLocalizeRoutePath(locale, routeId, params);
    }

    return packageLocalizeRoutePath(ROUTES, DEFAULT_LOCALE, locale, routeId, params, localizationConfig);
}
