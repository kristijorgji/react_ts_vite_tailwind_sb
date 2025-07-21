import React from 'react';

import { useTranslation } from 'react-i18next';
import { type NavLinkProps, NavLink as ReactRouterNavLink } from 'react-router-dom';

import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import type { RouteId } from '@/core/routing/routes.ts';
import type { Locale } from '@/i18n/locales.ts';

type WithRouteProps = {
    routeId: RouteId;
    params?: {
        urlParams?: Record<string, string | number>;
        query?: Record<string, string | number>;
        hash?: string;
    };
};

type WithHrefProps = {
    href: string;
};

type Props = Omit<NavLinkProps, 'to'> & (WithRouteProps | WithHrefProps);

const NavLink: React.FC<Props> = (p) => {
    const { i18n } = useTranslation();

    let props: NavLinkProps;

    if ((p as WithRouteProps).routeId) {
        const { routeId, params, ...rest } = p as Omit<NavLinkProps, 'to'> & WithRouteProps;
        props = {
            ...rest,
            to: localizeRoutePath(i18n.language as Locale, (p as WithRouteProps).routeId, (p as WithRouteProps).params),
        };
    } else {
        const { href, ...rest } = p as Omit<NavLinkProps, 'to'> & WithHrefProps;
        props = {
            ...rest,
            to: href,
        };
    }

    return <ReactRouterNavLink {...props} />;
};
export default NavLink;
