import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignInPage from '../SignInPage';
import api from '../api/axiosConfig';

jest.mock('./api/axiosConfig');

test('renders sign-in form', () => {
    render(
        <MemoryRouter>
            <SignInPage />
        </MemoryRouter>
    );

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});

test('submits form and redirects on successful login', async () => {
    api.post.mockResolvedValueOnce({
        data: { token: 'fake-token', userId: 'fake-userId' }
    });

    render(
        <MemoryRouter>
            <SignInPage />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Logged in successfully/i)).toBeInTheDocument();
});

test('shows error on failed login', async () => {
    api.post.mockRejectedValueOnce({ response: { data: 'Invalid credentials' } });

    render(
        <MemoryRouter>
            <SignInPage />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Error logging in: Invalid credentials/i)).toBeInTheDocument();
});
