import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import NotFoundPage from '@/c/components/pages/NotFoundPage/NotFoundPage.tsx';

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en' });
});

vi.mock('@/c/hooks/usePageTitle.ts', () => ({
    default: vi.fn(),
}));

describe('NotFoundPage', () => {
    it('renders not-found content', () => {
        render(<NotFoundPage />);
        expect(screen.getByText('common:notFoundPage.content')).toBeInTheDocument();
    });
});
