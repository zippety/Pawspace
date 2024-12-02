import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Property } from '../../types/property';
import { useReviewStore } from '../../store/reviewStore';
import { ReviewList } from '../reviews/ReviewList';
import { ReviewForm } from '../reviews/ReviewForm';
import { useUserStore } from '../../store/userStore';
import { usePropertyStore } from '../../store/propertyStore';
import { PropertyOwnerInfo } from './PropertyOwnerInfo';
import { PropertyAvailabilityCalendar } from './PropertyAvailabilityCalendar';

export function PropertyDetailView() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { property, fetchProperty } = usePropertyStore();
  const { user } = useUserStore();
  const {
    reviews,
    isLoading: isLoadingReviews,
    fetchReviews,
    addReview,
    markHelpful,
    reportReview
  } = useReviewStore();
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId);
      fetchReviews(propertyId);
    }
  }, [propertyId, fetchProperty, fetchReviews]);

  if (!property) {
    return <div>Loading...</div>;
  }

  const propertyReviews = reviews[propertyId] || [];
  const averageRating = propertyReviews.length > 0
    ? propertyReviews.reduce((acc, review) => acc + review.rating, 0) / propertyReviews.length
    : 0;

  const handleReviewSubmit = async (reviewData: {
    rating: number;
    comment: string;
    images: File[];
  }) => {
    if (!user || !propertyId) return;

    // Upload images first
    const imageUrls = await Promise.all(
      reviewData.images.map(async (file) => {
        const fileName = `${propertyId}/${user.id}/${Date.now()}-${file.name}`;
        // Implement your image upload logic here
        // Return the URL of the uploaded image
        return { url: 'placeholder-url', id: 'placeholder-id' };
      })
    );

    await addReview(propertyId, {
      userId: user.id,
      userName: user.fullName,
      userAvatar: user.avatarUrl,
      propertyId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      images: imageUrls,
      verified: true, // You might want to implement verification logic
      helpfulCount: 0
    });

    setShowReviewForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Property Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {property.title}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-gray-900">{averageRating.toFixed(1)}</span>
            <span className="ml-1 text-gray-500">
              ({propertyReviews.length} reviews)
            </span>
          </div>
          <span className="text-gray-500">·</span>
          <span className="text-gray-500">{property.location.city}, {property.location.state}</span>
        </div>
      </div>

      {/* Property Images */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {property.images.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.alt || `Property image ${index + 1}`}
            className="rounded-lg object-cover w-full h-64"
          />
        ))}
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <span className="text-gray-500">{amenity.icon}</span>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Reviews ({propertyReviews.length})
              </h2>
              {user && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Write a Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="mb-8">
                <ReviewForm onSubmit={handleReviewSubmit} />
              </div>
            )}

            {isLoadingReviews ? (
              <div>Loading reviews...</div>
            ) : (
              <ReviewList
                reviews={propertyReviews}
                onHelpful={markHelpful}
                onReport={reportReview}
              />
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Booking Calendar */}
          <div className="sticky top-8 space-y-8">
            <PropertyAvailabilityCalendar propertyId={propertyId} />
            <PropertyOwnerInfo ownerId={property.ownerId} />
          </div>
        </div>
      </div>
    </div>
  );
}
