import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import GuestLayout from '@/c/components/shared/templates/GuestLayout/GuestLayout.tsx';

vi.mock('@/c/components/shared/Header/Header.tsx', () => ({
    Header: () => <div data-testid="header" />,
}));

describe('GuestLayout', () => {
    it('renders header and children', () => {
        render(
            <GuestLayout>
                <span>child</span>
            </GuestLayout>
        );
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('child')).toBeInTheDocument();
    });
});
