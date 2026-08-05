import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AnalyticsPage from '@/c/components/pages/AnalyticsPage/AnalyticsPage.tsx';

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en' });
});

vi.mock('@/c/hooks/usePageTitle.ts', () => ({
    default: vi.fn(),
}));

describe('AnalyticsPage', () => {
    it('renders analytics title', () => {
        render(<AnalyticsPage />);
        expect(screen.getByText('common:pages.analytics.title')).toBeInTheDocument();
    });
});
