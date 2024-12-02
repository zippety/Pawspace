import type { PetLocation } from '../types';

export const mockLocations: PetLocation[] = [
  {
    id: '1',
    name: 'High Park Dog Park',
    description: 'Large off-leash area with trails and water access',
    type: 'PARK',
    coordinates: {
      lat: 43.6465,
      lng: -79.4637
    },
    rating: 4.8,
    price: 10,
    amenities: ['Fenced', 'Water Access', 'Parking'],
    images: [],
    address: '1873 Bloor St W, Toronto, ON'
  },
  {
    id: '2',
    name: 'Trinity Bellwoods Dog Bowl',
    description: 'Popular off-leash area in the heart of downtown',
    type: 'PARK',
    coordinates: {
      lat: 43.6476,
      lng: -79.4197
    },
    rating: 4.5,
    price: 8,
    amenities: ['Fenced', 'Benches', 'Water Fountain'],
    images: [],
    address: '790 Queen St W, Toronto, ON'
  },
  {
    id: '3',
    name: 'Pawsome Indoor Training',
    description: 'Climate-controlled indoor facility with agility equipment',
    type: 'INDOOR',
    coordinates: {
      lat: 43.6544,
      lng: -79.4055
    },
    rating: 4.9,
    price: 15,
    amenities: ['Climate Control', 'Agility Equipment', 'Training Classes'],
    images: [],
    address: '123 Spadina Ave, Toronto, ON'
  }
];
