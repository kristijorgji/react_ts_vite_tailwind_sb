import React from 'react';

import clsx from 'clsx';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

import {
    SidebarDesktopNavItems,
    type SidebarMenuItems,
} from '@/c/components/shared/SidebarMenu/SidebarDesktopNavItems.tsx';

import type { Locale } from '../../../../i18n/locales.ts';

type Props = {
    locale: Locale;
    topMenuItems: SidebarMenuItems;
    bottomMenuItems: SidebarMenuItems;
    expanded: boolean;
    pathname: string;
    toggleIconSize: number;
    onToggleExpanded: () => void;
};

const SidebarDesktopNav: React.FC<Props> = ({
    locale,
    topMenuItems,
    bottomMenuItems,
    expanded,
    pathname,
    toggleIconSize,
    onToggleExpanded,
}) => (
    <aside
        className={clsx(
            'border-r-header-border bg-header-bg z-60 hidden h-screen flex-col border-r transition-all duration-100 md:flex',
            expanded ? 'w-40 min-w-40' : 'w-20 min-w-20'
        )}
    >
        <button
            className={clsx(
                'flex h-14 rounded-none bg-transparent p-3 hover:font-bold focus:outline-none',
                expanded ? 'justify-end' : 'justify-center'
            )}
            type="button"
            onClick={onToggleExpanded}
        >
            {!expanded ? <ChevronsRight size={toggleIconSize} /> : <ChevronsLeft size={toggleIconSize} />}
        </button>

        <nav className={clsx('flex flex-1 flex-col justify-between', expanded ? '' : 'items-center')}>
            <div>
                <SidebarDesktopNavItems
                    expanded={expanded}
                    locale={locale}
                    menuItems={topMenuItems}
                    pathname={pathname}
                />
            </div>
            <div className="mb-2">
                <SidebarDesktopNavItems
                    expanded={expanded}
                    locale={locale}
                    menuItems={bottomMenuItems}
                    pathname={pathname}
                />
            </div>
        </nav>
    </aside>
);

export default SidebarDesktopNav;
