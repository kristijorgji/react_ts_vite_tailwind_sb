import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';

import LoginPage from './LoginPage';

vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en' });
});

vi.mock('@/c/hooks/auth/useDemoLogin', () => ({
    useDemoLogin: () => ({
        isDemoAvailable: true,
        demoLogin: vi.fn(),
    }),
}));

const mockSetEmail = vi.fn();
const mockSetPassword = vi.fn();
const mockOnLoginSubmit = vi.fn((e) => e.preventDefault());

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form and handles input + submit', () => {
        vi.mock('@/c/components/pages/LoginPage/useLoginHandler.ts', () => ({
            default: () => ({
                setEmail: mockSetEmail,
                setPassword: mockSetPassword,
                onLoginSubmit: mockOnLoginSubmit,
                error: '',
            }),
        }));
        render(<LoginPage />);

        const emailInput = screen.getByTestId('login-email');
        const passwordInput = screen.getByTestId('login-password');
        const submitButton = screen.getByTestId('login-submit');

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });

        expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
        expect(mockSetPassword).toHaveBeenCalledWith('123456');

        fireEvent.click(submitButton);
        expect(mockOnLoginSubmit).toHaveBeenCalled();
    });

    it('displays error when present', async () => {
        vi.mock('@/c/components/pages/LoginPage/useLoginHandler.ts', () => ({
            default: () => ({
                setEmail: mockSetEmail,
                setPassword: mockSetPassword,
                onLoginSubmit: mockOnLoginSubmit,
                error: 'Invalid credentials',
            }),
        }));

        const { default: LoginPageWithError } = await import('./LoginPage');

        render(<LoginPageWithError />);
        expect(screen.getByTestId('login-error')).toHaveTextContent('Invalid credentials');
    });

    it('renders demo login button when available', () => {
        render(<LoginPage />);
        expect(screen.getByTestId('login-demo')).toBeInTheDocument();
    });
});
