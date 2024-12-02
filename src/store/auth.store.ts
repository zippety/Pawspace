import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { AuthStore } from './types';
import { withErrorHandling } from './middleware/error.middleware';
import { logger } from '../utils/logger';

const errorCallback = (errorState: { error: Error | null; errorInfo?: Record<string, unknown> }) => {
  if (errorState.error) {
    logger.error('Auth store error:', {
      error: errorState.error,
      info: errorState.errorInfo,
    });
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    withErrorHandling(
      (set, get) => ({
        // State
        user: null,
        session: null,
        loading: false,
        error: null,

        // Actions
        setUser: (user) => {
          try {
            set({ user });
          } catch (error) {
            set({ error: error as Error });
          }
        },

        setSession: (session) => {
          try {
            set({ session });
          } catch (error) {
            set({ error: error as Error });
          }
        },

        signIn: async (email, password) => {
          try {
            set({ loading: true, error: null });
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (error) throw error;
          } catch (error) {
            const authError = error as Error;
            logger.error('Sign in failed', authError);
            set({ error: authError });
            throw authError; // Re-throw for component handling
          } finally {
            set({ loading: false });
          }
        },

        signUp: async (email, password) => {
          try {
            set({ loading: true, error: null });
            const { error } = await supabase.auth.signUp({
              email,
              password,
            });
            if (error) throw error;
          } catch (error) {
            const authError = error as Error;
            logger.error('Sign up failed', authError);
            set({ error: authError });
            throw authError;
          } finally {
            set({ loading: false });
          }
        },

        signInWithGoogle: async () => {
          try {
            set({ loading: true, error: null });
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
            });
            if (error) throw error;
          } catch (error) {
            const authError = error as Error;
            logger.error('Google sign in failed', authError);
            set({ error: authError });
            throw authError;
          } finally {
            set({ loading: false });
          }
        },

        signOut: async () => {
          try {
            set({ loading: true, error: null });
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null, session: null });
          } catch (error) {
            const authError = error as Error;
            logger.error('Sign out failed', authError);
            set({ error: authError });
            throw authError;
          } finally {
            set({ loading: false });
          }
        },
      }),
      errorCallback
    ),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);
