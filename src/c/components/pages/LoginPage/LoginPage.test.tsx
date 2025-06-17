import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';

import LoginPage from './LoginPage';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock useLoginHandler
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

        const emailInput = screen.getByLabelText('common:email');
        const passwordInput = screen.getByLabelText('common:password');
        const submitButton = screen.getByRole('button', { name: 'guest:login.signIn' });

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
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
});
