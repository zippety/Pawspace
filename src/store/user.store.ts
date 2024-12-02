import { create } from 'zustand';
import { createAutoErrorHandler, WithAutoError } from './middleware/autoErrorHandler';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  profile: UserProfile | null;
  preferences: Record<string, any>;
}

interface UserActions {
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (prefs: Record<string, any>) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

type UserStore = UserState & UserActions;

// Create the store with automatic error handling
export const useUserStore = create<WithAutoError<UserStore>>()(
  createAutoErrorHandler(
    'userStore', // store name for logging
    (set) => ({
      // Initial state
      profile: null,
      preferences: {},

      // Actions
      updateProfile: async (profile) => {
        // This will automatically have error handling, retries, and logging
        const response = await fetch('/api/profile', {
          method: 'PATCH',
          body: JSON.stringify(profile),
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedProfile = await response.json();
        set({ profile: updatedProfile });
      },

      updatePreferences: async (prefs) => {
        const response = await fetch('/api/preferences', {
          method: 'PATCH',
          body: JSON.stringify(prefs),
        });

        if (!response.ok) {
          throw new Error('Failed to update preferences');
        }

        const updatedPrefs = await response.json();
        set({ preferences: updatedPrefs });
      },

      fetchProfile: async () => {
        const response = await fetch('/api/profile');

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profile = await response.json();
        set({ profile });
      },
    }),
    {
      retryAttempts: 3,
      retryDelay: 1000,
      ignoredErrors: ['Network timeout'], // Errors containing this string will be ignored
    }
  )
);
