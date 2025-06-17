import React, { type PropsWithChildren } from 'react';

import { Header } from '@/c/components/shared/Header/Header.tsx';
import { SidebarMenu } from '@/c/components/shared/SidebarMenu/SidebarMenu.tsx';
import type { ViewManager } from '@/c/components/shared/templates/types.ts';
import UserContextProvider from '@/c/contexts/User/UserContextProvider.tsx';
import ViewManagerContextProvider from '@/c/contexts/ViewManager/ViewManagerContextProvider.tsx';

const viewManager: ViewManager = {
    header: true,
    lsidebar: {
        show: true,
        expanded: false,
    },
};

const LoggedLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ViewManagerContextProvider viewManager={viewManager}>
            <UserContextProvider>
                <div className={'flex'}>
                    <SidebarMenu />
                    <div className="mt-14">
                        <Header />
                        <div id={'page-contents'}>{children}</div>
                    </div>
                </div>
            </UserContextProvider>
        </ViewManagerContextProvider>
    );
};
export default LoggedLayout;
