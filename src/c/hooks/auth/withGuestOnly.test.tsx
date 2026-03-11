import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as sessionModule from '@/c/session';

import withGuestOnly from './withGuestOnly';

vi.mock('@/c/session', () => ({
    isApiLoggedIn: vi.fn(),
}));

vi.mock('../../../i18n/i18n.ts', () => ({
    default: { language: 'en' },
}));

const GuestPage = () => <div data-testid="guest">Guest Content</div>;
const GuestOnlyPage = withGuestOnly(GuestPage);

describe('withGuestOnly', () => {
    let originalHref: string;

    beforeEach(() => {
        originalHref = window.location.href;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: originalHref },
        });
    });

    it('renders wrapped component when user is NOT logged in', () => {
        vi.mocked(sessionModule.isApiLoggedIn).mockReturnValue(false);
        render(<GuestOnlyPage />);
        expect(screen.getByTestId('guest')).toBeInTheDocument();
    });

    it('redirects when user IS logged in', () => {
        vi.mocked(sessionModule.isApiLoggedIn).mockReturnValue(true);
        const { container } = render(<GuestOnlyPage />);
        expect(container.innerHTML).toBe('');
    });

    it('exposes WrappedComponent', () => {
        expect((GuestOnlyPage as unknown as { WrappedComponent: unknown }).WrappedComponent).toBe(GuestPage);
    });
});
