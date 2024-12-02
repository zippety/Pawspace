import React from 'react';
import { useMap } from 'react-leaflet';
import { Compass, Locate, ZoomIn, ZoomOut } from 'lucide-react';

export function MapControls() {
  const map = useMap();

  const handleLocate = () => {
    map.locate({ setView: true });
  };

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleLocate}
        className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
      >
        <Locate className="h-5 w-5 text-gray-600" />
      </button>
      <button
        onClick={() => map.zoomIn()}
        className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
      >
        <ZoomIn className="h-5 w-5 text-gray-600" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
      >
        <ZoomOut className="h-5 w-5 text-gray-600" />
      </button>
      <button
        onClick={() => map.setView([43.6532, -79.3832], 13)}
        className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
      >
        <Compass className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}
