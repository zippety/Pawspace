import React from 'react';
import { Star } from 'lucide-react';
import { PropertyReview } from '../../types/property';
import { cn } from '../../utils/cn';

interface ReviewStatisticsProps {
  reviews: PropertyReview[];
  className?: string;
}

export function ReviewStatistics({ reviews, className }: ReviewStatisticsProps) {
  const totalReviews = reviews.length;
  if (totalReviews === 0) return null;

  // Calculate rating distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = 5 - i;
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = (count / totalReviews) * 100;
    return { rating, count, percentage };
  });

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;

  // Calculate rating categories
  const categories = {
    cleanliness: reviews.reduce((acc, r) => acc + (r.rating >= 4 ? 1 : 0), 0) / totalReviews * 100,
    communication: reviews.reduce((acc, r) => acc + (r.rating >= 4 ? 1 : 0), 0) / totalReviews * 100,
    accuracy: reviews.reduce((acc, r) => acc + (r.rating >= 4 ? 1 : 0), 0) / totalReviews * 100,
    location: reviews.reduce((acc, r) => acc + (r.rating >= 4 ? 1 : 0), 0) / totalReviews * 100,
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overall Rating */}
      <div className="flex items-start justify-between">
        <div className="text-center">
          <div className="flex items-center space-x-2">
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
            <Star className="w-8 h-8 text-yellow-400 fill-current" />
          </div>
          <p className="text-sm text-gray-500 mt-1">{totalReviews} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-grow max-w-md ml-8">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-2 mb-2">
              <span className="w-12 text-sm text-gray-600">{rating} stars</span>
              <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-12 text-sm text-gray-500 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Categories */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        {Object.entries(categories).map(([category, score]) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium capitalize">{category}</span>
              <span className="text-sm text-gray-500">{score.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
