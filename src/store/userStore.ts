import { create } from 'zustand';
import { startTransaction } from '../utils/sentry';
import { supabase } from '../utils/supabase';
import { UserProfile, HostStats, UserReview } from '../types/user';
import ErrorTracker from '../utils/errorTracking';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

interface UserState {
  currentUser: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchUserProfile: (userId: string) => Promise<UserProfile>;
  fetchHostStats: (userId: string) => Promise<HostStats>;
  fetchUserReviews: (userId: string) => Promise<UserReview[]>;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  contactHost: (hostId: string, message: string) => Promise<void>;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(
  operation: () => Promise<T>,
  component: string,
  context?: Record<string, any>
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === MAX_RETRIES) {
        await ErrorTracker.logError(lastError, component, {
          ...context,
          attempts: attempt,
        });
        throw lastError;
      }

      await sleep(RETRY_DELAY * attempt);
    }
  }

  throw lastError!;
};

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  isLoading: false,
  error: null,

  fetchUserProfile: async (userId: string) => {
    const transaction = startTransaction({
      name: 'fetchUserProfile',
      data: { userId },
    });

    try {
      set({ isLoading: true, error: null });

      const profile = await withRetry(
        async () => {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (error) throw error;
          return data;
        },
        'fetchUserProfile',
        { userId }
      );

      const badges = await withRetry(
        async () => {
          const { data, error } = await supabase
            .from('user_badges')
            .select('*')
            .eq('userId', userId);

          if (error) throw error;
          return data;
        },
        'fetchUserProfile.badges',
        { userId }
      );

      const userProfile: UserProfile = {
        ...profile,
        badges: badges || [],
      };

      set({ error: null });
      transaction?.finish();
      return userProfile;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
      transaction?.finish();
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHostStats: async (userId: string) => {
    const transaction = startTransaction({
      name: 'fetchHostStats',
      data: { userId },
    });

    try {
      set({ isLoading: true, error: null });

      const bookingStats = await withRetry(
        async () => {
          const { data, error } = await supabase
            .rpc('get_host_booking_stats', { host_id: userId });

          if (error) throw error;
          return data;
        },
        'fetchHostStats.bookingStats',
        { userId }
      );

      const responseStats = await withRetry(
        async () => {
          const { data, error } = await supabase
            .rpc('get_host_response_stats', { host_id: userId });

          if (error) throw error;
          return data;
        },
        'fetchHostStats.responseStats',
        { userId }
      );

      const ratingStats = await withRetry(
        async () => {
          const { data, error } = await supabase
            .rpc('get_host_rating_stats', { host_id: userId });

          if (error) throw error;
          return data;
        },
        'fetchHostStats.ratingStats',
        { userId }
      );

      const stats: HostStats = {
        totalBookings: bookingStats.total_bookings,
        completedBookings: bookingStats.completed_bookings,
        cancelledBookings: bookingStats.cancelled_bookings,
        averageResponseTime: responseStats.average_response_time,
        responseRate: responseStats.response_rate,
        totalEarnings: bookingStats.total_earnings,
        rating: ratingStats.average_rating,
        reviewCount: ratingStats.review_count,
      };

      set({ error: null });
      transaction?.finish();
      return stats;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
      transaction?.finish();
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserReviews: async (userId: string) => {
    const transaction = startTransaction({
      name: 'fetchUserReviews',
      data: { userId },
    });

    try {
      set({ isLoading: true, error: null });

      const reviews = await withRetry(
        async () => {
          const { data, error } = await supabase
            .from('user_reviews')
            .select(`
              *,
              reviewer:reviewerId (
                id,
                fullName,
                avatar
              )
            `)
            .eq('userId', userId)
            .order('createdAt', { ascending: false });

          if (error) throw error;
          return data;
        },
        'fetchUserReviews',
        { userId }
      );

      const userReviews: UserReview[] = reviews.map(review => ({
        ...review,
        reviewerName: review.reviewer.fullName,
        reviewerAvatar: review.reviewer.avatar,
      }));

      set({ error: null });
      transaction?.finish();
      return userReviews;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
      transaction?.finish();
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const transaction = startTransaction({
      name: 'updateUserProfile',
      data: { userId, updates },
    });

    try {
      set({ isLoading: true, error: null });

      await withRetry(
        async () => {
          const { error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', userId);

          if (error) throw error;
        },
        'updateUserProfile',
        { userId, updates }
      );

      set({ error: null });
      transaction?.finish();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
      transaction?.finish();
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  contactHost: async (hostId: string, message: string) => {
    const transaction = startTransaction({
      name: 'contactHost',
      data: { hostId },
    });

    try {
      set({ isLoading: true, error: null });

      // Rate limiting check
      const rateLimitKey = `contact_host_${hostId}_${Date.now()}`;
      const { data: rateLimit } = await supabase
        .from('rate_limits')
        .select('count')
        .eq('key', rateLimitKey)
        .single();

      if (rateLimit?.count >= 5) {
        throw ErrorTracker.createError(
          'Too many messages sent. Please try again later.',
          'contactHost'
        );
      }

      await withRetry(
        async () => {
          const { error } = await supabase.from('messages').insert({
            from_user_id: get().currentUser?.id,
            to_user_id: hostId,
            message,
            status: 'sent',
          });

          if (error) throw error;
        },
        'contactHost',
        { hostId, messageLength: message.length }
      );

      set({ error: null });
      transaction?.finish();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      set({ error: err.message });
      transaction?.finish();
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
