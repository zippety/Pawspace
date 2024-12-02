import React from 'react';

/**
 * Props interface for the SpaceCard component
 * @interface SpaceCardProps
 * @property {string} title - The name of the pet-friendly space
 * @property {string} description - Brief description of the space
 * @property {number} price - Price per visit/hour in local currency
 * @property {string} imageUrl - URL to the space's primary image
 * @property {number} [rating] - Optional rating out of 5
 * @property {string} location - Physical address or location description
 * @property {() => void} [onSelect] - Optional callback when card is clicked
 */
interface SpaceCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rating?: number;
  location: string;
  onSelect?: () => void;
}

/**
 * SpaceCard displays a pet-friendly space with its details in a card format
 *
 * @component
 * @example
 * ```tsx
 * <SpaceCard
 *   title="Central Park Dog Run"
 *   description="Large off-leash area with water features"
 *   price={10}
 *   imageUrl="/images/park.jpg"
 *   rating={4.5}
 *   location="New York, NY"
 *   onSelect={() => console.log('Card clicked')}
 * />
 * ```
 */
export const SpaceCard: React.FC<SpaceCardProps> = ({
  title,
  description,
  price,
  imageUrl,
  rating,
  location,
  onSelect,
}) => {
  return (
    <div
      data-testid="space-card"
      className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={onSelect}
      role="article"
      aria-label={`Space listing for ${title}`}
    >
      <img
        src={imageUrl}
        alt={`View of ${title}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-primary font-medium">${price}/visit</span>
          {rating && (
            <span className="flex items-center text-yellow-500">
              ★ {rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">{location}</p>
      </div>
    </div>
  );
};

export default SpaceCard;
