import React, { type JSX } from 'react';

import { isApiLoggedIn } from '@/c/session';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import { ROUTES_IDS } from '@/core/routing/routes.ts';

import i18n from '../../../i18n/i18n.ts';
import type { Locale } from '../../../i18n/locales.ts';

export default function withGuestOnly<P extends JSX.IntrinsicAttributes>(
    WrappedComponent: React.ComponentType<P>
): (props: P) => null | JSX.Element {
    const withGuestOnly = (props: P) => {
        if (isApiLoggedIn()) {
            window.location.href = localizeRoutePath(i18n.language as Locale, ROUTES_IDS.INDEX);
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    withGuestOnly.WrappedComponent = WrappedComponent;

    return withGuestOnly;
}
