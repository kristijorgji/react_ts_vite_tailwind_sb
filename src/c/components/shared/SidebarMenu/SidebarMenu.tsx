import React, { useCallback, useMemo } from 'react';

import clsx from 'clsx';
import { BarChart, ChevronsLeft, ChevronsRight, HomeIcon, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

import useViewManager from '@/c/contexts/ViewManager/useViewManager.ts';
import { localizeRoutePath } from '@/core/routing/localizedRoute.ts';
import { type RouteId } from '@/core/routing/routes.ts';

import type { Locale } from '../../../../i18n/locales.ts';

type MenuItems = Partial<
    Record<
        RouteId,
        {
            icon: React.ReactElement;
            label: string;
            group: 'top' | 'bottom';
        }
    >
>;

const iconSize = 18;
const toggleIconSize = iconSize + 2;

export const SidebarMenu: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { viewManager, setViewManager } = useViewManager();
    const { pathname } = useLocation();

    const menuItems: MenuItems = useMemo(
        () => ({
            INDEX: {
                icon: <HomeIcon size={iconSize} />,
                label: t('common:menu.home'),
                group: 'top',
            },
            ANALYTICS: {
                icon: <BarChart size={iconSize} />,
                label: t('common:menu.analytics'),
                group: 'top',
            },
            SETTINGS: {
                icon: <Settings size={iconSize} />,
                label: t('common:menu.settings'),
                group: 'bottom',
            },
        }),
        [t]
    );

    const toggleExpanded = useCallback(() => {
        setViewManager({
            ...viewManager,
            lsidebar: {
                ...viewManager.lsidebar,
                expanded: !viewManager.lsidebar.expanded,
            },
        });
    }, [setViewManager, viewManager]);

    const expanded = viewManager.lsidebar.expanded;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={clsx(
                    'border-r-header-border bg-header-bg z-60 hidden h-screen flex-col border-r transition-all duration-100 md:flex',
                    expanded ? 'w-40 min-w-40' : 'w-20 min-w-20'
                )}
            >
                {/* Toggle Button */}
                <button
                    type={'button'}
                    onClick={toggleExpanded}
                    className={clsx(
                        'flex h-14 rounded-none bg-transparent p-3 hover:font-bold focus:outline-none',
                        expanded ? 'justify-end' : 'justify-center'
                    )}
                >
                    {!expanded ? <ChevronsRight size={toggleIconSize} /> : <ChevronsLeft size={toggleIconSize} />}
                </button>

                {/* Nav Items */}
                <nav className={clsx('flex flex-1 flex-col justify-between', expanded ? '' : 'items-center')}>
                    {(() => {
                        const topMenuItems: MenuItems = {};
                        const bottomMenuItems: MenuItems = {};

                        for (const [key, value] of Object.entries(menuItems)) {
                            if (value.group === 'top') {
                                topMenuItems[key] = value;
                            } else {
                                bottomMenuItems[key] = value;
                            }
                        }

                        return (
                            <>
                                <div>
                                    {renderDesktopMenuItems({
                                        locale: i18n.language as Locale,
                                        menuItems: topMenuItems,
                                        expanded: expanded,
                                        pathname: pathname,
                                    })}
                                </div>
                                <div className={'mb-2'}>
                                    {renderDesktopMenuItems({
                                        locale: i18n.language as Locale,
                                        menuItems: bottomMenuItems,
                                        expanded: expanded,
                                        pathname: pathname,
                                    })}
                                </div>
                            </>
                        );
                    })()}
                </nav>
            </aside>

            {/* Mobile Bottom Menu */}
            <nav className="border-t-header-border fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t p-2 md:hidden">
                {Object.entries(menuItems).map(([routeId, entry]) => {
                    const localizedPath = localizeRoutePath(i18n.language as Locale, routeId as RouteId, null);
                    return (
                        <NavLink key={routeId} to={localizedPath}>
                            <button
                                type={'button'}
                                className={clsx(
                                    'flex flex-col items-center bg-transparent hover:font-bold',
                                    pathname === localizedPath ? 'text-accent' : ''
                                )}
                            >
                                {entry.icon}
                                <span className="text-[10px]">{entry.label}</span>
                            </button>
                        </NavLink>
                    );
                })}
            </nav>
        </>
    );
};

function renderDesktopMenuItems({
    locale,
    menuItems,
    expanded,
    pathname,
}: {
    locale: Locale;
    menuItems: MenuItems;
    expanded: boolean;
    pathname: string;
}): React.ReactElement[] {
    return Object.entries(menuItems).map(([routeId, entry]) => {
        const localizedPath = localizeRoutePath(locale, routeId as RouteId, null);

        return (
            <NavLink key={routeId} to={localizedPath}>
                <button
                    type={'button'}
                    className={clsx(
                        'flex w-full items-center gap-3 rounded-none bg-transparent px-3 py-2 hover:font-bold',
                        expanded ? 'py-4' : 'flex-col justify-center py-2',
                        pathname === localizedPath ? 'text-accent' : ''
                    )}
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
