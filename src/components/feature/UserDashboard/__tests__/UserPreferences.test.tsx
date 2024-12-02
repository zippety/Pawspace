import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserPreferences } from '../UserPreferences';

// Mock preferences data
const mockPreferences = {
  searchRadius: 10,
  priceRange: {
    min: 20,
    max: 100,
  },
  amenities: ['parking', 'water', 'fenced'],
  spaceTypes: ['park', 'indoor'],
  dogs: [
    {
      id: '1',
      name: 'Max',
      breed: 'Golden Retriever',
      age: 3,
      size: 'large',
    },
  ],
};

// Mock API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockPreferences),
    ok: true,
  })
) as jest.Mock;

describe('UserPreferences', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('loads and displays user preferences', async () => {
    render(<UserPreferences />);

    await waitFor(() => {
      // Check if search radius is displayed
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();

      // Check if price range is displayed
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();

      // Check if amenities are selected
      expect(screen.getByRole('checkbox', { name: /parking/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /water/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /fenced/i })).toBeChecked();

      // Check if space types are selected
      expect(screen.getByRole('checkbox', { name: /park/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /indoor/i })).toBeChecked();

      // Check if dog profile is displayed
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    });
  });

  it('updates search radius', async () => {
    render(<UserPreferences />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });

    const radiusInput = screen.getByLabelText(/search radius/i);
    userEvent.clear(radiusInput);
    userEvent.type(radiusInput, '20');

    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"searchRadius":20'),
      }));
    });
  });

  it('updates price range', async () => {
    render(<UserPreferences />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    });

    const minPriceInput = screen.getByLabelText(/minimum price/i);
    const maxPriceInput = screen.getByLabelText(/maximum price/i);

    userEvent.clear(minPriceInput);
    userEvent.type(minPriceInput, '30');
    userEvent.clear(maxPriceInput);
    userEvent.type(maxPriceInput, '150');

    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"priceRange":{"min":30,"max":150}'),
      }));
    });
  });

  it('toggles amenities', async () => {
    render(<UserPreferences />);

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /parking/i })).toBeChecked();
    });

    // Uncheck parking
    fireEvent.click(screen.getByRole('checkbox', { name: /parking/i }));

    // Check new amenity
    fireEvent.click(screen.getByRole('checkbox', { name: /lighting/i }));

    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"amenities":["water","fenced","lighting"]'),
      }));
    });
  });

  it('adds new dog profile', async () => {
    render(<UserPreferences />);

    await waitFor(() => {
      expect(screen.getByText('Max')).toBeInTheDocument();
    });

    // Click add dog button
    fireEvent.click(screen.getByText(/add dog/i));

    // Fill in new dog details
    userEvent.type(screen.getByLabelText(/dog name/i), 'Bella');
    userEvent.type(screen.getByLabelText(/breed/i), 'Labrador');
    userEvent.type(screen.getByLabelText(/age/i), '2');
    userEvent.selectOptions(screen.getByLabelText(/size/i), 'medium');

    fireEvent.click(screen.getByText(/save dog/i));

    await waitFor(() => {
      expect(screen.getByText('Bella')).toBeInTheDocument();
      expect(screen.getByText('Labrador')).toBeInTheDocument();
    });
  });

  it('handles validation errors', async () => {
    render(<UserPreferences />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });

    // Enter invalid search radius
    const radiusInput = screen.getByLabelText(/search radius/i);
    userEvent.clear(radiusInput);
    userEvent.type(radiusInput, '-5');

    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(screen.getByText(/search radius must be positive/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to save preferences'))
    );

    render(<UserPreferences />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(screen.getByText(/failed to save preferences/i)).toBeInTheDocument();
    });
  });
});
