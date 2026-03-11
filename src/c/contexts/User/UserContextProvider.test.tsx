import { use } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockGetJson, mockIsLoggedIn } = vi.hoisted(() => ({
    mockGetJson: vi.fn(),
    mockIsLoggedIn: vi.fn(),
}));

vi.mock('@/c/api/api', () => ({
    default: { getJson: mockGetJson },
}));

vi.mock('@/c/session', () => ({
    isApiLoggedIn: mockIsLoggedIn,
}));

import { UserContext } from '@/c/contexts/User/UserContext';

import UserContextProvider from './UserContextProvider';

function TestConsumer() {
    const { data } = use(UserContext);
    if (data.loading) return <div data-testid="loading">Loading</div>;
    if (data.error) return <div data-testid="error">Error</div>;
    return <div data-testid="value">{data.value?.name}</div>;
}

describe('UserContextProvider', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading then resolves with user data', async () => {
        mockIsLoggedIn.mockReturnValue(true);
        mockGetJson.mockResolvedValue({ id: '1', name: 'John', email: 'john@test.com', config: { permissions: [] } });

        render(
            <UserContextProvider>
                <TestConsumer />
            </UserContextProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('value')).toHaveTextContent('John');
        });
    });

    it('shows error when user is not logged in', async () => {
        mockIsLoggedIn.mockReturnValue(false);

        render(
            <UserContextProvider>
                <TestConsumer />
            </UserContextProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
        });
    });

    it('shows error when API call fails', async () => {
        mockIsLoggedIn.mockReturnValue(true);
        mockGetJson.mockRejectedValue(new Error('API error'));

        render(
            <UserContextProvider>
                <TestConsumer />
            </UserContextProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
        });
    });
});
