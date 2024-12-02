import React from 'react';
import { Property } from '../types/property';
import { MapPin, Star, Share2, Heart } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];

  return (
    <div
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onClick?.(property)}
    >
      <div className="relative">
        {/* Image Carousel */}
        <div className="relative h-64">
          <img
            src={primaryImage?.url}
            alt={primaryImage?.alt || property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
            1 of {property.images.length}
          </div>

          {/* Top spot badge */}
          {property.isTopSpot && (
            <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Top spot
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button className="p-2 bg-white rounded-full hover:bg-gray-100">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 bg-white rounded-full hover:bg-gray-100">
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{property.title}</h3>

          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
            <div className="flex items-center">
              {property.amenities.includes('Fully Fenced') && (
                <span className="flex items-center mr-3">
                  <img src="/fence-icon.svg" className="w-4 h-4 mr-1" />
                  Fully Fenced
                </span>
              )}
              <span className="flex items-center">
                <img src="/area-icon.svg" className="w-4 h-4 mr-1" />
                {property.size} acres
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">{property.rating}</span>
              <span className="text-sm text-gray-500">({property.reviewCount})</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {property.location.city}, {property.location.state} • {property.location.distance} from you
              </span>
            </div>
          </div>

          <div className="mt-2 text-lg font-semibold">
            ${property.pricePerHour}/hour
          </div>
        </div>
      </div>
    </div>
  );
};
