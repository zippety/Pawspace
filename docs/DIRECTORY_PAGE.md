# Directory Page Documentation

## Overview
The Directory Page is a key component of PawSpace that displays available dog parks and spaces on both a map and in a list format. The page is split into two main sections:
1. Left side: Interactive map and search bar
2. Right side: Listings of dog parks with filters

## Current State

### Components
- `DirectoryPage.tsx`: Main component that renders the map and listings
- `leaflet-setup.ts`: Utility file for Leaflet map configuration
- `leaflet.css`: Custom styles for the map

### Features Implemented
1. **Search Bar**
   - Input field for location/date search
   - Search icon

2. **Map Integration**
   - Leaflet map implementation
   - Custom marker setup
   - Sample park locations plotted

3. **Listings Section**
   - Filter pills for various categories
   - Card layout for each listing
   - Image display with counter
   - "Top spot" badge for featured listings
   - Share and favorite buttons

### Known Issues

1. **Map Display Issues**
   - Map is currently not rendering properly
   - Marker icons returning 404 errors
   - Attempted fixes:
     - Updated CDN links for marker icons to use unpkg.com
     - Enhanced CSS positioning and z-index values
     - Still investigating root cause

2. **Sample Data**
   - Currently using hardcoded sample data
   - Need to integrate with backend API
   - Image paths need to be updated

## Next Steps

1. **Map Fixes**
   - Debug map rendering issues
   - Verify all Leaflet dependencies are correctly imported
   - Test marker icon loading
   - Consider alternative map providers if issues persist

2. **Data Integration**
   - Set up API endpoints for fetching park data
   - Implement real-time filtering
   - Add pagination for listings

3. **UI Enhancements**
   - Add loading states
   - Implement error handling
   - Add responsive design for mobile views

## Dependencies
- React Leaflet
- Leaflet.js
- Tailwind CSS

## Related Files
- `/src/components/DirectoryPage.tsx`
- `/src/utils/leaflet-setup.ts`
- `/src/styles/leaflet.css`

## Notes
- Map implementation is based on OpenStreetMap with Leaflet
- Current layout is desktop-first
- Filter functionality is UI-only at this stage
