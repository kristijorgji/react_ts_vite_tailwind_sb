import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import DemoPage from '@/c/components/pages/DemoPage.tsx';

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en' });
});

vi.mock('@/c/components/pages/SettingsPage/LanguageSwitcher.tsx', () => ({
    default: () => <div data-testid="language-switcher" />,
}));

describe('DemoPage', () => {
    it('renders the route id param', () => {
        render(
            <MemoryRouter initialEntries={['/demo/abc']}>
                <Routes>
                    <Route element={<DemoPage />} path="/demo/:id" />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('abc')).toBeInTheDocument();
        expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    });
});
