import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpaceSearch } from './SpaceSearch';

describe('SpaceSearch', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('renders search form', () => {
    render(<SpaceSearch />);
    expect(screen.getByPlaceholderText('Location')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search spaces/i })).toBeInTheDocument();
  });

  it('submits search form and displays results', async () => {
    const mockSpaces = [
      {
        id: '1',
        title: 'Cozy Backyard',
        description: 'Perfect for small dogs',
        price: 25,
        imageUrl: '/images/space1.jpg',
        rating: 4.5,
        location: 'Toronto, ON',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockSpaces,
    });

    render(<SpaceSearch />);

    fireEvent.change(screen.getByPlaceholderText('Location'), {
      target: { value: 'Toronto' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /search spaces/i }));

    await waitFor(() => {
      expect(screen.getByText('Cozy Backyard')).toBeInTheDocument();
    });
  });

  it('handles search error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Search failed'));

    render(<SpaceSearch />);
    fireEvent.submit(screen.getByRole('button', { name: /search spaces/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to search spaces:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
