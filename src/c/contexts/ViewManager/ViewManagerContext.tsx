import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import type { ViewManager } from '@/c/components/shared/templates/types.ts';

export type ViewManagerContextValue = {
    viewManager: ViewManager;
    setViewManager: Dispatch<SetStateAction<ViewManager>>;
};

export const ViewManagerContext = createContext<ViewManagerContextValue | undefined>(undefined);
ViewManagerContext.displayName = 'ViewManagerContext';
