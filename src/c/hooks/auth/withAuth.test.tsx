import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as sessionModule from '@/c/session';

import withAuth from './withAuth';

vi.mock('@/c/session', () => ({
    getAccessToken: vi.fn(),
}));

vi.mock('../../../i18n/i18n.ts', () => ({
    default: { language: 'en' },
}));

const TestComponent = () => <div data-testid="protected">Protected Content</div>;
const ProtectedComponent = withAuth(TestComponent);

describe('withAuth', () => {
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

    it('renders wrapped component when user has access token', () => {
        vi.mocked(sessionModule.getAccessToken).mockReturnValue('valid-token');
        render(<ProtectedComponent />);
        expect(screen.getByTestId('protected')).toBeInTheDocument();
    });

    it('redirects to login when no access token', () => {
        vi.mocked(sessionModule.getAccessToken).mockReturnValue(null);
        const { container } = render(<ProtectedComponent />);
        expect(container.innerHTML).toBe('');
    });
});
