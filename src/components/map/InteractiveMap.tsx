import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocationsStore } from '../../store/locationsStore';
import { LocationMarker } from './LocationMarker';
import { MapControls } from './MapControls';
import { MapFilters } from './MapFilters';
import { MapLegend } from './MapLegend';
import { MapSearchBox } from './MapSearchBox';
import { useUserStore } from '../../store/userStore';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = { lat: 43.6532, lng: -79.3832 }; // Toronto coordinates

export function InteractiveMap({ onLoad }: { onLoad?: () => void }) {
  const { locations, selectedLocation, setSelectedLocation } = useLocationsStore();
  const { addVisitedLocation } = useUserStore();

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId);
    addVisitedLocation(locationId);
  };

  const handlePlaceSelect = ({ lat, lng }: { lat: number; lng: number }) => {
    // You can implement custom behavior here when a place is selected
    console.log('Selected place:', { lat, lng });
  };

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      {/* Search box container */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-[1000]">
        <MapSearchBox
          onPlaceSelect={handlePlaceSelect}
          className="w-full shadow-lg"
        />
      </div>

      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={true}
        whenReady={() => onLoad?.()}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <LocationMarker
            key={location.id}
            location={location}
            onClick={() => handleLocationClick(location.id)}
          />
        ))}

        <MapControls />
        <MapLegend />
      </MapContainer>

      <div className="absolute bottom-4 right-4 z-[1000] w-96">
        <MapFilters />
      </div>

      {selectedLocation && (
        <div className="absolute bottom-4 right-4 z-[1000] w-96">
          <LocationDetails locationId={selectedLocation} />
        </div>
      )}
    </div>
  );
}
