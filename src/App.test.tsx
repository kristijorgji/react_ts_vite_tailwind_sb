import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import App from '@/App.tsx';

vi.mock('@/core/routing/AppRouter.tsx', () => ({
    default: () => <div data-testid="app-router">AppRouter</div>,
}));

vi.mock('@/c/contexts/Theme/ThemeProvider.tsx', () => ({
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App', () => {
    it('renders the app router inside providers', () => {
        render(<App />);
        expect(screen.getByTestId('app-router')).toBeInTheDocument();
    });
});
