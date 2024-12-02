import React from 'react';
import { Property } from '../../types/property';
import { Star, MapPin, DogBowl, Clock } from 'lucide-react';

interface PropertyHeaderProps {
  property: Property;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

      <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          <span>
            {property.location.address}, {property.location.city}, {property.location.province}
          </span>
        </div>

        {property.rating && (
          <div className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            <span>
              {property.rating.toFixed(1)} ({property.reviewCount} reviews)
            </span>
          </div>
        )}

        <div className="flex items-center">
          <DogBowl className="w-5 h-5 mr-2" />
          <span>Up to {property.rules.maxDogs || 'unlimited'} dogs</span>
        </div>

        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          <span>{property.availability.length} available time slots</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {property.features.map((feature, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};
