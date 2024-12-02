import React from 'react';

export function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md z-[1000]">
      <h3 className="text-lg font-semibold mb-2">Legend</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Current Location</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span>Available Space</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
          <span>Selected Space</span>
        </div>
      </div>
    </div>
  );
}
