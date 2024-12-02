import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { getMarkerIcon } from '../../utils/mapIcons';
import type { PetLocation } from '../../types';

interface LocationMarkerProps {
  location: PetLocation;
  onClick: () => void;
}

export function LocationMarker({ location, onClick }: LocationMarkerProps) {
  const icon = getMarkerIcon(location.type);

  return (
    <Marker
      position={[location.coordinates.lat, location.coordinates.lng]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <div className="p-3">
          <h3 className="font-semibold text-lg">{location.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{location.description}</p>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              ${location.price}/hour
            </span>
            <span className="inline-block ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              ★ {location.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
