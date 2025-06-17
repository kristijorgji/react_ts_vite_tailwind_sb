import React from 'react';

import { getAccessToken } from '@/c/session';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import { ROUTES_IDS } from '@/core/routing/routes.ts';

import i18n from '../../../i18n/i18n.ts';
import type { Locale } from '../../../i18n/locales.ts';

export default function withAuth<P>(Component: React.ComponentType<P>): React.ComponentType<P> {
    return class withAuth extends React.Component<P, P> {
        render() {
            const apiToken = getAccessToken();
            if (apiToken === null) {
                redirectToLogin();
                return null;
            }

            return <Component {...this.props} />;
        }
    };
}

function redirectToLogin() {
    window.location.href = localizeRoutePath(i18n.language as Locale, ROUTES_IDS.LOGIN);
}
