import React, { useCallback, useMemo } from 'react';

import { BarChart, HomeIcon, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import SidebarDesktopNav from '@/c/components/shared/SidebarMenu/SidebarDesktopNav.tsx';
import type { SidebarMenuItems } from '@/c/components/shared/SidebarMenu/SidebarDesktopNavItems.tsx';
import SidebarMobileNav from '@/c/components/shared/SidebarMenu/SidebarMobileNav.tsx';
import useViewManager from '@/c/contexts/ViewManager/useViewManager.ts';

import type { Locale } from '../../../../i18n/locales.ts';

const iconSize = 18;
const toggleIconSize = iconSize + 2;

export const SidebarMenu: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { viewManager, setViewManager } = useViewManager();
    const { pathname } = useLocation();
    const locale = i18n.language as Locale;
    const expanded = viewManager.lsidebar.expanded;

    const menuItems: SidebarMenuItems = useMemo(
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

    const { topMenuItems, bottomMenuItems } = useMemo(() => {
        const top: SidebarMenuItems = {};
        const bottom: SidebarMenuItems = {};

        for (const [key, value] of Object.entries(menuItems)) {
            if (value.group === 'top') {
                top[key as keyof SidebarMenuItems] = value;
            } else {
                bottom[key as keyof SidebarMenuItems] = value;
            }
        }

        return { topMenuItems: top, bottomMenuItems: bottom };
    }, [menuItems]);

    return (
        <>
            <SidebarDesktopNav
                bottomMenuItems={bottomMenuItems}
                expanded={expanded}
                locale={locale}
                pathname={pathname}
                toggleIconSize={toggleIconSize}
                topMenuItems={topMenuItems}
                onToggleExpanded={toggleExpanded}
            />
            <SidebarMobileNav locale={locale} menuItems={menuItems} pathname={pathname} />
        </>
    );
};
