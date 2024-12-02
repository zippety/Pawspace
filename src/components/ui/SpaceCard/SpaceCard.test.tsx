import { render, screen, fireEvent } from '@testing-library/react';
import { SpaceCard } from './SpaceCard';

describe('SpaceCard', () => {
  const mockProps = {
    title: 'Spacious Backyard',
    description: 'A beautiful space for your dog to play',
    price: 25,
    imageUrl: '/images/space.jpg',
    rating: 4.5,
    location: 'San Francisco, CA',
    onSelect: vi.fn(),
  };

  it('renders all props correctly', () => {
    render(<SpaceCard {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProps.price}/hour`)).toBeInTheDocument();
    expect(screen.getByText(mockProps.location)).toBeInTheDocument();
    expect(screen.getByText(mockProps.rating)).toBeInTheDocument();

    const image = screen.getByAltText(mockProps.title);
    expect(image).toHaveAttribute('src', mockProps.imageUrl);
  });

  it('calls onSelect when clicked', () => {
    render(<SpaceCard {...mockProps} />);
    fireEvent.click(screen.getByTestId('space-card'));
    expect(mockProps.onSelect).toHaveBeenCalled();
  });

  it('renders without rating when not provided', () => {
    const propsWithoutRating = { ...mockProps, rating: undefined };
    render(<SpaceCard {...propsWithoutRating} />);
    expect(screen.queryByText('★')).not.toBeInTheDocument();
  });
});
