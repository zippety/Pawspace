import { useState, useEffect } from 'react';

interface ImageState {
  src: string;
  isLoading: boolean;
  error: string | null;
  blur: string | null;
}

interface UseOptimizedImageOptions {
  quality?: number;
  size?: {
    width: number;
    height: number;
  };
  placeholder?: string;
  priority?: boolean;
}

const defaultOptions: UseOptimizedImageOptions = {
  quality: 75,
  size: {
    width: 800,
    height: 600,
  },
  priority: false,
};

export const useOptimizedImage = (
  originalSrc: string,
  options: UseOptimizedImageOptions = defaultOptions
) => {
  const [imageState, setImageState] = useState<ImageState>({
    src: options.placeholder || '',
    isLoading: true,
    error: null,
    blur: options.placeholder || null,
  });

  useEffect(() => {
    if (!originalSrc) {
      setImageState(prev => ({
        ...prev,
        error: 'No image source provided',
        isLoading: false,
      }));
      return;
    }

    const loadImage = async () => {
      try {
        // Generate optimized URL with quality and size parameters
        const url = new URL(originalSrc);
        url.searchParams.set('q', options.quality?.toString() || '75');
        url.searchParams.set('w', options.size?.width?.toString() || '800');
        url.searchParams.set('h', options.size?.height?.toString() || '600');

        // If priority is true, preload the image
        if (options.priority) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = url.toString();
          document.head.appendChild(link);
        }

        // Load the image
        const img = new Image();
        img.src = url.toString();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        setImageState({
          src: url.toString(),
          isLoading: false,
          error: null,
          blur: null,
        });
      } catch (error) {
        setImageState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to load image',
          isLoading: false,
        }));
      }
    };

    loadImage();
  }, [originalSrc, options.quality, options.size?.width, options.size?.height, options.priority]);

  return imageState;
};

// Image cache for storing preloaded images
const imageCache = new Map<string, string>();

// Helper function to preload multiple images
export const preloadImages = (urls: string[], options: UseOptimizedImageOptions = defaultOptions) => {
  urls.forEach(url => {
    if (!imageCache.has(url)) {
      const img = new Image();
      const optimizedUrl = new URL(url);
      optimizedUrl.searchParams.set('q', options.quality?.toString() || '75');
      optimizedUrl.searchParams.set('w', options.size?.width?.toString() || '800');
      optimizedUrl.searchParams.set('h', options.size?.height?.toString() || '600');

      img.src = optimizedUrl.toString();
      imageCache.set(url, optimizedUrl.toString());
    }
  });
};

// Helper function to clear the image cache
export const clearImageCache = () => {
  imageCache.clear();
};
