import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AvailabilityCalendar } from '../AvailabilityCalendar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/nextjs';
import { format } from 'date-fns';

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Create a wrapper with react-query provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('AvailabilityCalendar', () => {
  const mockPropertyId = 'test-property-123';
  const mockDate = new Date('2024-01-15');
  const mockAvailabilityData = [
    {
      date: '2024-01-15',
      isAvailable: true,
      price: 100,
    },
    {
      date: '2024-01-16',
      isAvailable: false,
      price: 100,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAvailabilityData),
      })
    );

    render(<AvailabilityCalendar propertyId={mockPropertyId} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders calendar with availability data', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAvailabilityData),
      })
    );

    render(<AvailabilityCalendar propertyId={mockPropertyId} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('grid')).toBeInTheDocument(); // Calendar grid
  });

  it('handles fetch error and shows error message', async () => {
    const errorMessage = 'Failed to fetch availability';
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    render(<AvailabilityCalendar propertyId={mockPropertyId} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to load availability/i)).toBeInTheDocument();
    });

    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it('handles date selection and updates availability', async () => {
    // Mock successful fetch for initial data
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAvailabilityData),
        })
      )
      // Mock successful update
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

    const onDateSelect = jest.fn();

    render(
      <AvailabilityCalendar
        propertyId={mockPropertyId}
        onDateSelect={onDateSelect}
        selectedDate={mockDate}
      />,
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Find and click the date button
    const dateButton = screen.getByRole('button', {
      name: new RegExp(format(mockDate, 'MMMM d, yyyy'), 'i'),
    });
    fireEvent.click(dateButton);

    await waitFor(() => {
      expect(onDateSelect).toHaveBeenCalledWith(expect.any(Date));
    });
  });

  it('handles update error and shows error message', async () => {
    // Mock successful fetch for initial data
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAvailabilityData),
        })
      )
      // Mock failed update
      .mockImplementationOnce(() =>
        Promise.reject(new Error('Failed to update availability'))
      );

    render(
      <AvailabilityCalendar
        propertyId={mockPropertyId}
        selectedDate={mockDate}
      />,
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Find and click the date button
    const dateButton = screen.getByRole('button', {
      name: new RegExp(format(mockDate, 'MMMM d, yyyy'), 'i'),
    });
    fireEvent.click(dateButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to update availability/i)).toBeInTheDocument();
    });

    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it('retries failed requests', async () => {
    const errorMessage = 'Failed to fetch availability';
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)))
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAvailabilityData),
        })
      );

    render(<AvailabilityCalendar propertyId={mockPropertyId} />, {
      wrapper: createWrapper(),
    });

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to load availability/i)).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    // Wait for successful load
    await waitFor(() => {
      expect(screen.queryByText(/failed to load availability/i)).not.toBeInTheDocument();
    });

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('validates availability data schema', async () => {
    const invalidData = [
      {
        date: 'invalid-date', // Invalid date format
        isAvailable: true,
        price: 100,
      },
    ];

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(invalidData),
      })
    );

    render(<AvailabilityCalendar propertyId={mockPropertyId} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to load availability/i)).toBeInTheDocument();
    });

    expect(Sentry.captureException).toHaveBeenCalled();
  });
});
