import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import IndexPage from '@/c/components/pages/IndexPage/IndexPage.tsx';
import { LoadableData } from '@/c/data/types/LoadableData.tsx';

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en' });
});

vi.mock('@/c/hooks/usePageTitle.ts', () => ({
    default: vi.fn(),
}));

vi.mock('@/c/contexts/User/useUser.ts', () => ({
    default: () => ({
        data: LoadableData.value({ name: 'Ada' }),
    }),
}));

describe('IndexPage', () => {
    it('renders the greeting with the current user name', () => {
        render(<IndexPage />);
        expect(screen.getByText('common:welcome')).toBeInTheDocument();
    });
});
