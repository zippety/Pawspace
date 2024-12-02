export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  amenities: string[];
  price: {
    hourly: number;
    daily?: number;
  };
  images: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
