import { useState, useEffect } from 'react';

interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

interface GeolocationHook {
  position: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationHook {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
  }, []);

  return { position, error, loading };
}
