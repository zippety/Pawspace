import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { toast } from 'react-toastify'; // Make sure to install this package

export const useAuthError = () => {
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  useEffect(() => {
    if (error) {
      // Show error in UI
      toast.error(error.message || 'An authentication error occurred');

      // Clear error after showing it
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return { error, clearError };
};

// Usage example:
/*
function LoginComponent() {
  const { signIn } = useAuthStore();
  useAuthError(); // This will handle showing errors automatically

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
    } catch (error) {
      // The error is already handled by useAuthError
      // You can add additional error handling here if needed
    }
  };
}
*/
