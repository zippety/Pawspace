import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingHistory } from '../BookingHistory';

// Mock booking data
const mockBookings = [
  {
    id: '1',
    spaceName: 'Cozy Dog Park',
    date: '2024-02-01',
    status: 'upcoming',
    price: 25,
    duration: 60,
  },
  {
    id: '2',
    spaceName: 'Pet Play Area',
    date: '2024-01-15',
    status: 'completed',
    price: 30,
    duration: 90,
  },
];

// Mock API call
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockBookings),
    ok: true,
  })
) as jest.Mock;

describe('BookingHistory', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders loading state initially', () => {
    render(<BookingHistory />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays bookings after loading', async () => {
    render(<BookingHistory />);

    await waitFor(() => {
      expect(screen.getByText('Cozy Dog Park')).toBeInTheDocument();
      expect(screen.getByText('Pet Play Area')).toBeInTheDocument();
    });
  });

  it('filters bookings correctly', async () => {
    render(<BookingHistory />);

    await waitFor(() => {
      expect(screen.getByText('Cozy Dog Park')).toBeInTheDocument();
    });

    // Click completed filter
    fireEvent.click(screen.getByText(/completed/i));

    expect(screen.getByText('Pet Play Area')).toBeInTheDocument();
    expect(screen.queryByText('Cozy Dog Park')).not.toBeInTheDocument();
  });

  it('handles booking cancellation', async () => {
    render(<BookingHistory />);

    await waitFor(() => {
      expect(screen.getByText('Cozy Dog Park')).toBeInTheDocument();
    });

    const cancelButton = screen.getAllByText(/cancel/i)[0];
    fireEvent.click(cancelButton);

    // Should show confirmation dialog
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    // Confirm cancellation
    fireEvent.click(screen.getByText(/confirm/i));

    await waitFor(() => {
      expect(screen.getByText(/booking cancelled/i)).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    // Mock API error
    (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject('API Error'));

    render(<BookingHistory />);

    await waitFor(() => {
      expect(screen.getByText(/error loading bookings/i)).toBeInTheDocument();
    });

    // Test retry functionality
    const retryButton = screen.getByText(/retry/i);
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('displays empty state when no bookings', async () => {
    // Mock empty response
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
        ok: true,
      })
    );

    render(<BookingHistory />);

    await waitFor(() => {
      expect(screen.getByText(/no bookings found/i)).toBeInTheDocument();
    });
  });
});
