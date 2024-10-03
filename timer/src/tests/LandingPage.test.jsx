import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

test('renders landing page with welcome message and buttons', () => {
    render(
        <MemoryRouter>
            <LandingPage />
        </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to the visual timer app/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
});

test('displays alert message if present in URL', () => {
    render(
        <MemoryRouter initialEntries={['/?message=Test%20alert']}>
            <LandingPage />
        </MemoryRouter>
    );

    expect(screen.getByText(/Test alert/i)).toBeInTheDocument();
});
