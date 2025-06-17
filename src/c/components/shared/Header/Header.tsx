import ThemeToggle from '@/c/components/shared/ThemeToggle/ThemeToggle.tsx';

export const Header = () => {
    return (
        <header
            className={
                'bg-header-bg border-b-header-border fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b-1 px-4'
            }
        >
            {/* Left: Logo or Title */}
            <div className="text-lg font-semibold"></div>

            {/* Right */}
            <div className={'space-x-1'}>
                <ThemeToggle className={'font-semibold'} />
            </div>
        </header>
    );
};
