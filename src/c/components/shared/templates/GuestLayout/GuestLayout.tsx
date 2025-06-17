import React, { type PropsWithChildren } from 'react';

import { Header } from '@/c/components/shared/Header/Header.tsx';
import type { ViewManager } from '@/c/components/shared/templates/types.ts';
import ViewManagerContextProvider from '@/c/contexts/ViewManager/ViewManagerContextProvider.tsx';

const viewManager: ViewManager = {
    header: true,
    lsidebar: {
        show: false,
        expanded: false,
    },
};

const GuestLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ViewManagerContextProvider viewManager={viewManager}>
            <div className="mt-14">
                <Header />
                <div id={'page-contents'}>{children}</div>
            </div>
        </ViewManagerContextProvider>
    );
};
export default GuestLayout;
