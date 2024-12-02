import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { InteractiveMap } from '../map/InteractiveMap';
import { LocationsSidebar } from './LocationsSidebar';
import { MapSearchBox } from '../map/MapSearchBox';

export function MapLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen
            ? 'w-full md:w-[400px] h-1/2 md:h-full'
            : 'w-0 h-0'
        } transition-all duration-300 ease-in-out relative bg-white shadow-lg z-10`}
      >
        <LocationsSidebar isOpen={isSidebarOpen} isMobile={isMobile} />
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`${
            isMobile
              ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-90'
              : '-right-4 top-1/2 -translate-y-1/2'
          } absolute z-50 bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:bg-gray-50`}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Map Container */}
      <div
        className={`relative flex-1 ${isSidebarOpen && isMobile ? 'h-1/2' : 'h-full'} md:h-full transition-all duration-300`}
      >
        {isMapLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="mt-2 text-gray-600">Loading map...</span>
            </div>
          </div>
        )}
        <InteractiveMap onLoad={() => setIsMapLoading(false)} />

        {/* Floating Search Box - Always on top */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-[1000]">
          <MapSearchBox
            onPlaceSelect={() => {}}
            className="w-full shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
