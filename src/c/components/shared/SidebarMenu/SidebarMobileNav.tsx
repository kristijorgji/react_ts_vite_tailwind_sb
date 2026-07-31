import React from 'react';

import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import type { SidebarMenuItems } from '@/c/components/shared/SidebarMenu/SidebarDesktopNavItems.tsx';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import { type RouteId } from '@/core/routing/routes.ts';

import type { Locale } from '../../../../i18n/locales.ts';

type Props = {
    locale: Locale;
    menuItems: SidebarMenuItems;
    pathname: string;
};

const SidebarMobileNav: React.FC<Props> = ({ locale, menuItems, pathname }) => (
    <nav className="border-t-header-border fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t p-2 md:hidden">
        {Object.entries(menuItems).map(([routeId, entry]) => {
            const localizedPath = localizeRoutePath(locale, routeId as RouteId, null);
            return (
                <NavLink key={routeId} to={localizedPath}>
                    <button
                        className={clsx(
                            'flex flex-col items-center bg-transparent hover:font-bold',
                            pathname === localizedPath ? 'text-accent' : ''
                        )}
                        type="button"
                    >
                        {entry.icon}
                        <span className="text-[10px]">{entry.label}</span>
                    </button>
                </NavLink>
            );
        })}
    </nav>
);

export default SidebarMobileNav;
