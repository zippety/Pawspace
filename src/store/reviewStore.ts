import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { PropertyReview } from '../types/property';

interface ReviewState {
  reviews: Record<string, PropertyReview[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchReviews: (propertyId: string) => Promise<void>;
  addReview: (propertyId: string, review: Omit<PropertyReview, 'id' | 'createdAt'>) => Promise<void>;
  updateReview: (propertyId: string, reviewId: string, update: Partial<PropertyReview>) => Promise<void>;
  deleteReview: (propertyId: string, reviewId: string) => Promise<void>;
  markHelpful: (propertyId: string, reviewId: string) => Promise<void>;
  reportReview: (propertyId: string, reviewId: string, reason: string) => Promise<void>;
  addHostResponse: (propertyId: string, reviewId: string, response: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: {},
  isLoading: false,
  error: null,

  fetchReviews: async (propertyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('property_reviews')
        .select(`
          *,
          users (
            id,
            full_name,
            avatar_url
          ),
          review_images (
            id,
            url
          )
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReviews: PropertyReview[] = data.map(review => ({
        id: review.id,
        propertyId: review.property_id,
        userId: review.user_id,
        userName: review.users.full_name,
        userAvatar: review.users.avatar_url,
        rating: review.rating,
        comment: review.comment,
        images: review.review_images,
        createdAt: review.created_at,
        visitDate: review.visit_date,
        verified: review.verified,
        helpfulCount: review.helpful_count,
        hostResponse: review.host_response,
        hostResponseDate: review.host_response_date
      }));

      set(state => ({
        reviews: {
          ...state.reviews,
          [propertyId]: formattedReviews
        },
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addReview: async (propertyId, review) => {
    set({ isLoading: true, error: null });
    try {
      const { data: reviewData, error: reviewError } = await supabase
        .from('property_reviews')
        .insert([
          {
            property_id: propertyId,
            user_id: review.userId,
            rating: review.rating,
            comment: review.comment,
            visit_date: review.visitDate,
            verified: review.verified
          }
        ])
        .select()
        .single();

      if (reviewError) throw reviewError;

      // Upload images if any
      if (review.images && review.images.length > 0) {
        const imagePromises = review.images.map(async (image) => {
          const { data: imageData, error: imageError } = await supabase
            .from('review_images')
            .insert([
              {
                review_id: reviewData.id,
                url: image.url
              }
            ]);

          if (imageError) throw imageError;
          return imageData;
        });

        await Promise.all(imagePromises);
      }

      // Refresh reviews
      await get().fetchReviews(propertyId);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateReview: async (propertyId, reviewId, update) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('property_reviews')
        .update({
          rating: update.rating,
          comment: update.comment,
          // Add other fields as needed
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Refresh reviews
      await get().fetchReviews(propertyId);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteReview: async (propertyId, reviewId) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('property_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      // Update local state
      set(state => ({
        reviews: {
          ...state.reviews,
          [propertyId]: state.reviews[propertyId].filter(r => r.id !== reviewId)
        },
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  markHelpful: async (propertyId, reviewId) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.rpc('increment_review_helpful', {
        review_id: reviewId
      });

      if (error) throw error;

      // Refresh reviews
      await get().fetchReviews(propertyId);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  reportReview: async (propertyId, reviewId, reason) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('review_reports')
        .insert([
          {
            review_id: reviewId,
            reason: reason
          }
        ]);

      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addHostResponse: async (propertyId, reviewId, response) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('property_reviews')
        .update({
          host_response: response,
          host_response_date: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Refresh reviews
      await get().fetchReviews(propertyId);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));
