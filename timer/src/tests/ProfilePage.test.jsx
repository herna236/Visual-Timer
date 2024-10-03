import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../ProfilePage';
import api from '../api/axiosConfig';

jest.mock('./api/axiosConfig');

describe('ProfilePage Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders profile page and fetches user email', async () => {
    api.get.mockResolvedValueOnce({ data: { email: 'test@example.com' } });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email: test@example.com/i)).toBeInTheDocument();
  });

  test('displays error message if fetching email fails', async () => {
    api.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Failed to load user email/i)).toBeInTheDocument();
  });

  test('navigates to edit profile page', async () => {
    api.get.mockResolvedValueOnce({ data: { email: 'test@example.com' } });

    const { container } = render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));

    expect(container.innerHTML).toContain('/edit-profile'); // Adjust based on your routing logic
  });

  test('successfully deletes account and navigates back', async () => {
    api.get.mockResolvedValueOnce({ data: { email: 'test@example.com' } });
    api.delete.mockResolvedValueOnce({}); // Mock delete response

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Delete Account/i }));

    expect(await screen.findByText(/test@example.com was successfully deleted/i)).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
  });

  test('displays error message if account deletion fails', async () => {
    api.get.mockResolvedValueOnce({ data: { email: 'test@example.com' } });
    api.delete.mockRejectedValueOnce(new Error('Failed to delete'));

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Delete Account/i }));

    expect(await screen.findByText(/Failed to delete account/i)).toBeInTheDocument();
  });

  test('navigates back to timer control', async () => {
    api.get.mockResolvedValueOnce({ data: { email: 'test@example.com' } });

    const { container } = render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Go Back/i }));

    expect(container.innerHTML).toContain('/timer-control'); // Adjust based on your routing logic
  });
});
