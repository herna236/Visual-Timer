import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUpPage from '../SignUpPage';
import api from '../api/axiosConfig';

jest.mock('./api/axiosConfig');

test('renders sign-up form', () => {
    render(
        <MemoryRouter>
            <SignUpPage />
        </MemoryRouter>
    );

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});

test('submits form and redirects on successful registration', async () => {
    api.post.mockResolvedValueOnce({
        data: { token: 'fake-token', userId: 'fake-userId' }
    });

    render(
        <MemoryRouter>
            <SignUpPage />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    expect(await screen.findByText(/User registered successfully/i)).toBeInTheDocument();
});

test('shows error on failed registration', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: 'Email already exists' } } });

    render(
        <MemoryRouter>
            <SignUpPage />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    expect(await screen.findByText(/Error registering user: Email already exists/i)).toBeInTheDocument();
});
