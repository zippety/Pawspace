import type { DogPark } from '../types';

interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  minSize: number;
  searchRadius: number;
  amenities: string[];
}

export function filterSpaces(spaces: DogPark[], filters: FilterOptions): DogPark[] {
  return spaces.filter(space => {
    const meetsPrice = space.price >= filters.minPrice && space.price <= filters.maxPrice;
    const meetsSize = space.size >= filters.minSize;
    const meetsAmenities = filters.amenities.length === 0 ||
      filters.amenities.every(amenity => space.amenities.includes(amenity));

    return meetsPrice && meetsSize && meetsAmenities;
  });
}
