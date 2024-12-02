import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SavedSpaces } from '../SavedSpaces';

// Mock saved spaces data
const mockSavedSpaces = [
  {
    id: '1',
    title: 'Sunny Dog Park',
    description: 'A beautiful park for your furry friends',
    price: 25,
    imageUrl: 'https://example.com/park1.jpg',
    rating: 4.5,
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    title: 'Indoor Play Area',
    description: 'Climate controlled indoor play space',
    price: 30,
    imageUrl: 'https://example.com/park2.jpg',
    rating: 4.8,
    location: 'San Francisco, CA',
  },
];

// Mock API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockSavedSpaces),
    ok: true,
  })
) as jest.Mock;

describe('SavedSpaces', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders loading state initially', () => {
    render(<SavedSpaces userId="123" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays saved spaces in grid view', async () => {
    render(<SavedSpaces userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Sunny Dog Park')).toBeInTheDocument();
      expect(screen.getByText('Indoor Play Area')).toBeInTheDocument();
    });

    // Check if prices are displayed
    expect(screen.getByText('$25/hour')).toBeInTheDocument();
    expect(screen.getByText('$30/hour')).toBeInTheDocument();
  });

  it('switches between grid and list views', async () => {
    render(<SavedSpaces userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Sunny Dog Park')).toBeInTheDocument();
    });

    // Switch to list view
    const listViewButton = screen.getByRole('button', { name: /list/i });
    fireEvent.click(listViewButton);

    // Verify list view layout
    const listItems = screen.getAllByRole('article');
    expect(listItems.length).toBe(2);

    // Switch back to grid view
    const gridViewButton = screen.getByRole('button', { name: /grid/i });
    fireEvent.click(gridViewButton);

    // Verify grid view layout
    const gridItems = screen.getAllByRole('article');
    expect(gridItems.length).toBe(2);
  });

  it('handles removing a saved space', async () => {
    render(<SavedSpaces userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Sunny Dog Park')).toBeInTheDocument();
    });

    // Mock successful removal
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    );

    // Click remove button for first space
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      // First space should be removed
      expect(screen.queryByText('Sunny Dog Park')).not.toBeInTheDocument();
      // Second space should still be visible
      expect(screen.getByText('Indoor Play Area')).toBeInTheDocument();
    });
  });

  it('displays empty state when no saved spaces', async () => {
    // Mock empty response
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
        ok: true,
      })
    );

    render(<SavedSpaces userId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/no saved spaces yet/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /find spaces/i })).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    // Mock API error
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch saved spaces'))
    );

    render(<SavedSpaces userId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/error loading saved spaces/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    // Test retry functionality
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('navigates to space details when clicked', async () => {
    render(<SavedSpaces userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Sunny Dog Park')).toBeInTheDocument();
    });

    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    fireEvent.click(viewDetailsButtons[0]);

    // Verify navigation was attempted
    // Note: In a real app, you'd need to mock router functionality
    expect(console.log).toHaveBeenCalledWith('Navigate to space details:', '1');
  });
});
