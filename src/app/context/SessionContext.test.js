import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SessionProvider, useSession } from './SessionContext';
import { useSessionStatus } from '../hooks/useSessionStatus'; 

jest.mock('../hooks/useSessionStatus');

const MockComponent = () => {
  const { user, loading, error } = useSession();
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? user.name : 'No User'}</div>
      <div data-testid="error">{error ? error.message : 'No Error'}</div>
    </div>
  );
};

describe('SessionContext', () => {
  it('should initialize with loading state', () => {
    useSessionStatus.mockReturnValue({ sessionData: null, loading: true, error: null });
    render(
      <SessionProvider>
        <MockComponent />
      </SessionProvider>
    );
    expect(screen.getByTestId('loading').textContent).toBe('true');
    expect(screen.getByTestId('user').textContent).toBe('No User');
  });

  it('should update user state when session data is available', async () => {
    const mockUser = { name: 'John Doe' };
    useSessionStatus.mockReturnValue({ sessionData: { user: mockUser }, loading: false, error: null });
    render(
      <SessionProvider>
        <MockComponent />
      </SessionProvider>
    );
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('user').textContent).toBe(mockUser.name);
  });

  it('should handle errors correctly', async () => {
    const mockError = { message: 'Error occurred' };
    useSessionStatus.mockReturnValue({ sessionData: null, loading: false, error: mockError });
    render(
      <SessionProvider>
        <MockComponent />
      </SessionProvider>
    );
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('error').textContent).toBe(mockError.message);
  });

  it('should provide correct context value', async () => {
    const mockUser = { name: 'John Doe' };
    useSessionStatus.mockReturnValue({ sessionData: { user: mockUser }, loading: false, error: null });
    render(
      <SessionProvider>
        <MockComponent />
      </SessionProvider>
    );
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('user').textContent).toBe(mockUser.name);
  });
});