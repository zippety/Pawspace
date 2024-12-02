import React from 'react';
import { Property } from '../../types/property';
import { DollarSign, Maximize2, ShieldCheck, AlertCircle } from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  return (
    <div className="space-y-8">
      {/* Description */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">About this space</h2>
        <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
      </section>

      {/* Key Details */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start">
            <DollarSign className="w-6 h-6 mr-3 text-blue-600" />
            <div>
              <h3 className="font-medium">Price</h3>
              <p className="text-gray-600">${property.pricePerHour}/hour</p>
            </div>
          </div>

          <div className="flex items-start">
            <Maximize2 className="w-6 h-6 mr-3 text-blue-600" />
            <div>
              <h3 className="font-medium">Space Size</h3>
              <p className="text-gray-600">{property.size} sq ft</p>
            </div>
          </div>

          <div className="flex items-start">
            <ShieldCheck className="w-6 h-6 mr-3 text-blue-600" />
            <div>
              <h3 className="font-medium">Safety Features</h3>
              <ul className="text-gray-600 list-disc list-inside">
                <li>Secure fencing</li>
                <li>First aid kit</li>
                <li>Emergency contact available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Rules and Requirements</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Dog Size Restrictions</h3>
              <div className="flex flex-wrap gap-2">
                {property.rules.dogSizeRestrictions?.map((size) => (
                  <span
                    key={size}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize"
                  >
                    {size}
                  </span>
                )) || <span className="text-gray-600">No size restrictions</span>}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Requirements</h3>
              <ul className="space-y-2 text-gray-600">
                {property.rules.vaccineRequired && (
                  <li className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                    Vaccination required
                  </li>
                )}
                {property.rules.spayNeuterRequired && (
                  <li className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                    Spay/Neuter required
                  </li>
                )}
              </ul>
            </div>
          </div>

          {property.rules.additionalRules?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Additional Rules</h3>
              <ul className="space-y-2">
                {property.rules.additionalRules.map((rule, index) => (
                  <li key={index} className="flex items-start text-gray-600">
                    <AlertCircle className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Amenities */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {property.amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-start">
              {amenity.icon && (
                <span className="mr-3 text-blue-600" dangerouslySetInnerHTML={{ __html: amenity.icon }} />
              )}
              <div>
                <h3 className="font-medium">{amenity.name}</h3>
                {amenity.description && (
                  <p className="text-sm text-gray-600">{amenity.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
