export const APP_CONFIG = {
  // API Configuration
  API_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,

  // Map Configuration
  DEFAULT_MAP_CENTER: { lat: 43.6532, lng: -79.3832 }, // Toronto
  DEFAULT_MAP_ZOOM: 11,

  // Pagination
  ITEMS_PER_PAGE: 10,

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  // Cache Duration (in milliseconds)
  CACHE_DURATION: {
    PROPERTIES: 5 * 60 * 1000, // 5 minutes
    USER_PROFILE: 30 * 60 * 1000, // 30 minutes
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROPERTIES: '/properties',
  PROPERTY: (id: string) => `/properties/${id}`,
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  BOOKING: (id: string) => `/bookings/${id}`,
} as const;
