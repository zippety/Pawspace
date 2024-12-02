import React, { useState, useCallback } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { PropertyImage } from '../../types/property';
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { startTransaction, reportError } from '../../utils/sentry';

interface PropertyImageGalleryProps {
  images: PropertyImage[];
}

export const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ images }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Sort images to ensure primary image is first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.order - b.order;
  });

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages(prev => new Set([...prev, imageUrl]));
  }, []);

  const handleImageError = useCallback((error: Error, imageUrl: string) => {
    reportError(error, {
      component: 'PropertyImageGallery',
      imageUrl,
      context: 'Image loading failed'
    });
  }, []);

  const openLightbox = useCallback((index: number) => {
    const transaction = startTransaction('openLightbox', 'user-interaction');
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    transaction?.finish();
  }, []);

  if (images.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
        <img
          src={sortedImages[0].url}
          alt={sortedImages[0].alt}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${loadedImages.has(sortedImages[0].url) ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => handleImageLoad(sortedImages[0].url)}
          onError={(e) => handleImageError(e as unknown as Error, sortedImages[0].url)}
        />
        {!loadedImages.has(sortedImages[0].url) && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => openLightbox(index)}
                className={`
                  relative flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${index === currentImageIndex ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className={`
                    w-full h-full object-cover transition-opacity duration-300
                    ${loadedImages.has(image.url) ? 'opacity-100' : 'opacity-0'}
                  `}
                  onLoad={() => handleImageLoad(image.url)}
                  onError={(e) => handleImageError(e as unknown as Error, image.url)}
                />
                {!loadedImages.has(image.url) && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
            onClick={() => {
              const container = document.querySelector('.overflow-x-auto');
              if (container) {
                container.scrollLeft -= 200;
              }
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
            onClick={() => {
              const container = document.querySelector('.overflow-x-auto');
              if (container) {
                container.scrollLeft += 200;
              }
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={currentImageIndex}
        slides={sortedImages.map(image => ({
          src: image.url,
          alt: image.alt,
        }))}
        carousel={{
          finite: true,
        }}
        animation={{
          swipe: 250,
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
        }}
        render={{
          buttonPrev: images.length <= 1 ? () => null : undefined,
          buttonNext: images.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
};
