import type { ReactElement } from 'react';

import Logo from '@/c/components/shared/icons/Logo.tsx';
import LocaleSelector from '@/c/components/shared/LocaleSelector/LocaleSelector.tsx';
import ThemeToggle from '@/c/components/shared/ThemeToggle/ThemeToggle.tsx';

export const Header = (): ReactElement => {
    return (
        <header
            className={
                'bg-header-bg border-b-header-border fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b-1 px-4'
            }
        >
            <div className="flex items-center">
                <Logo aria-hidden className="h-8 w-8" />
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                <LocaleSelector />
                <ThemeToggle className={'font-semibold'} />
            </div>
        </header>
    );
};
