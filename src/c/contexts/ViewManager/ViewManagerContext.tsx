import { createContext } from 'react';

import type { ViewManager } from '@/c/components/shared/templates/types.ts';

export type ViewManagerContextValue = {
    viewManager: ViewManager;
    setViewManager: React.Dispatch<React.SetStateAction<ViewManager>>;
};

export const ViewManagerContext = createContext<ViewManagerContextValue | undefined>(undefined);
ViewManagerContext.displayName = 'ViewManagerContext';
