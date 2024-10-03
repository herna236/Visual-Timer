import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TimerControl from '../TimerControl';
import api from '../api/axiosConfig';

jest.mock('./api/axiosConfig');

describe('TimerControl Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userId', 'fake-userId');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders timer control inputs', () => {
    render(
      <MemoryRouter>
        <TimerControl />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Minutes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Seconds/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument();
  });

  test('starts timer with valid inputs', async () => {
    api.get.mockResolvedValueOnce({
      data: { trialPeriodOver: false, hasPaid: false }
    });
    api.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <TimerControl />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Minutes/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Seconds/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(await screen.findByText(/Time left: 70 seconds/i)).toBeInTheDocument();
  });

  test('alerts user if trial period is over for timers over 60 seconds', async () => {
    api.get.mockResolvedValueOnce({
      data: { trialPeriodOver: true, hasPaid: false }
    });

    render(
      <MemoryRouter>
        <TimerControl />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Minutes/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Seconds/i), { target: { value: '61' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    expect(await screen.findByText(/Your trial period is over/i)).toBeInTheDocument();
  });

  test('pauses and resumes timer', async () => {
    jest.useFakeTimers();
    api.get.mockResolvedValueOnce({
      data: { trialPeriodOver: false, hasPaid: false }
    });
    api.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <TimerControl />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Minutes/i), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/Seconds/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    // Fast-forward time
    jest.advanceTimersByTime(2000); // 2 seconds

    expect(screen.getByText(/Time left: 3 seconds/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Pause/i }));

    // Fast-forward time (should not decrease)
    jest.advanceTimersByTime(3000);

    expect(screen.getByText(/Time left: 3 seconds/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Resume/i }));

    // Fast-forward time again
    jest.advanceTimersByTime(2000); // 2 seconds

    expect(screen.getByText(/Time left: 1 seconds/i)).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('resets timer', async () => {
    api.get.mockResolvedValueOnce({
      data: { trialPeriodOver: false, hasPaid: false }
    });
    api.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <TimerControl />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Minutes/i), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/Seconds/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start/i }));

    await waitFor(() => expect(screen.getByText(/Time left: 5 seconds/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

    expect(screen.getByLabelText(/Minutes/i).value).toBe('');
    expect(screen.getByLabelText(/Seconds/i).value).toBe('');
  });

  test('handles logout', () => {
    const { container } = render(
      <MemoryRouter>
        <TimerControl />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

    expect(container.innerHTML).toBe('');
  });
});
