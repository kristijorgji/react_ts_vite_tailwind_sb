import { describe, expect, it } from 'vitest';

import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import { ROUTES_IDS } from '@/core/routing/routes.ts';

describe('localizeRoutePath (app-bound)', () => {
    it('builds paths with the app default localization config', () => {
        expect(localizeRoutePath('en', ROUTES_IDS.SETTINGS)).toBe('/settings');
        expect(localizeRoutePath('en', ROUTES_IDS.DEMO, { urlParams: { id: '1' } })).toBe('/demo/1');
    });

    it('honors an explicit localization config override', () => {
        expect(
            localizeRoutePath('en', ROUTES_IDS.SETTINGS, null, {
                useLocaleInPath: true,
                usePrefixForDefaultLocale: true,
            })
        ).toBe('/en/settings');
    });
});
