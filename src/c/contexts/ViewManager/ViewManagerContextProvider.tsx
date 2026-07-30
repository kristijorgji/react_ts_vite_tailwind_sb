import React, { type PropsWithChildren, useMemo, useState } from 'react';

import type { ViewManager } from '@/c/components/shared/templates/types.ts';
import { ViewManagerContext } from '@/c/contexts/ViewManager/ViewManagerContext.tsx';

const ViewManagerContextProvider: React.FC<PropsWithChildren<{ viewManager: ViewManager }>> = (p) => {
    const [viewManager, setViewManager] = useState<ViewManager>(p.viewManager);
    const contextValue = useMemo(() => ({ viewManager, setViewManager }), [viewManager]);

    return <ViewManagerContext children={p.children} value={contextValue} />;
};
export default ViewManagerContextProvider;
