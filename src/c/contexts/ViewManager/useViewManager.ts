import { use } from 'react';

import { ViewManagerContext, type ViewManagerContextValue } from './ViewManagerContext.tsx';

export default function useViewManager(): ViewManagerContextValue {
    return use(ViewManagerContext);
}
