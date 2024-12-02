export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  joinedDate: string;
  verificationStatus: 'pending' | 'verified' | 'unverified';
  responseRate?: number;
  responseTime?: number; // in minutes
  languages?: string[];
  hostingSince?: string;
  totalProperties?: number;
  averageRating?: number;
  totalReviews?: number;
  badges?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate: string;
  }[];
}

export interface HostStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageResponseTime: number; // in minutes
  responseRate: number; // percentage
  totalEarnings: number;
  rating: number;
  reviewCount: number;
}

export interface UserReview {
  id: string;
  userId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  reviewerName: string;
  reviewerAvatar?: string;
}
