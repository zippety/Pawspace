import React, { useState } from 'react';
import { format } from 'date-fns';
import { Star, Flag, ThumbsUp, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { PropertyReview } from '../../types/property';
import { cn } from '../../utils/cn';
import { ReviewStatistics } from './ReviewStatistics';

interface ReviewListProps {
  reviews: PropertyReview[];
  onReport?: (reviewId: string) => void;
  onHelpful?: (reviewId: string) => void;
  className?: string;
}

export function ReviewList({
  reviews,
  onReport,
  onHelpful,
  className,
}: ReviewListProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'recent' | 'highest' | 'lowest'>('all');
  const [showReportModal, setShowReportModal] = useState<string | null>(null);

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const filteredReviews = [...reviews].sort((a, b) => {
    switch (filter) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={cn(
              'w-4 h-4 transition-colors duration-200',
              index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-500">Be the first to review this property!</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Review Statistics */}
      <ReviewStatistics reviews={reviews} className="mb-8" />

      {/* Filters */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </h3>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="all">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const hasLongContent = review.comment.length > 250;

          return (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={review.userAvatar || '/default-avatar.png'}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{review.userName}</h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {/* Review Content */}
              <div className="space-y-4">
                <div className={cn(
                  'prose prose-sm max-w-none text-gray-700',
                  !isExpanded && hasLongContent && 'line-clamp-3'
                )}>
                  {review.comment}
                </div>

                {hasLongContent && (
                  <button
                    onClick={() => toggleExpanded(review.id)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <span>{isExpanded ? 'Show less' : 'Show more'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Review image ${index + 1}`}
                        className="rounded-lg object-cover w-full h-32 hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                )}

                {/* Host Response */}
                {review.hostResponse && (
                  <div className="mt-4 pl-4 border-l-4 border-primary-100 bg-primary-50/50 p-4 rounded-r-lg">
                    <p className="font-medium text-gray-900 mb-2">Response from host:</p>
                    <p className="text-gray-700">{review.hostResponse}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Responded on {format(new Date(review.hostResponseDate!), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => onHelpful?.(review.id)}
                      className="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpfulCount || 0})</span>
                    </button>
                    <button
                      onClick={() => setShowReportModal(review.id)}
                      className="flex items-center space-x-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                      <span>Report</span>
                    </button>
                  </div>
                  {review.verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified Stay
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Review</h3>
            <p className="text-gray-500 mb-4">
              Please select a reason for reporting this review:
            </p>
            <div className="space-y-2">
              {['Inappropriate content', 'Spam', 'Fake review', 'Other'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    onReport?.(showReportModal);
                    setShowReportModal(null);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(null)}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
