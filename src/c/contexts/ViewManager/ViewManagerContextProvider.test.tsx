import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import useViewManager from '@/c/contexts/ViewManager/useViewManager.ts';
import ViewManagerContextProvider from '@/c/contexts/ViewManager/ViewManagerContextProvider.tsx';

function Probe() {
    const { viewManager } = useViewManager();
    return <div data-testid="header-flag">{String(viewManager.header)}</div>;
}

describe('ViewManagerContextProvider', () => {
    it('provides the initial view manager value', () => {
        render(
            <ViewManagerContextProvider
                viewManager={{
                    header: true,
                    lsidebar: { show: false, expanded: false },
                }}
            >
                <Probe />
            </ViewManagerContextProvider>
        );
        expect(screen.getByTestId('header-flag')).toHaveTextContent('true');
    });
});
