import React from 'react';

import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import { type RouteId } from '@/core/routing/routes.ts';

import type { Locale } from '../../../../i18n/locales.ts';

export type SidebarMenuItems = Partial<
    Record<
        RouteId,
        {
            icon: React.ReactElement;
            label: string;
            group: 'top' | 'bottom';
        }
    >
>;

type Props = {
    locale: Locale;
    menuItems: SidebarMenuItems;
    expanded: boolean;
    pathname: string;
};

export function SidebarDesktopNavItems({ locale, menuItems, expanded, pathname }: Props): React.ReactElement[] {
    return Object.entries(menuItems).map(([routeId, entry]) => {
        const localizedPath = localizeRoutePath(locale, routeId as RouteId, null);

        return (
            <NavLink key={routeId} to={localizedPath}>
                <button
                    className={clsx(
                        'flex w-full items-center gap-3 rounded-none bg-transparent px-3 py-2 hover:font-bold',
                        expanded ? 'py-4' : 'flex-col justify-center py-2',
                        pathname === localizedPath ? 'text-accent' : ''
                    )}
                    type="button"
                >
                    {entry.icon}
                    <span className={clsx('text-xs', expanded ? 'text-sm opacity-100' : 'text-center text-[10px]')}>
                        {entry.label}
                    </span>
                </button>
            </NavLink>
        );
    });
}
