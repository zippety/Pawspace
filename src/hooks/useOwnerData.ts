import { useState, useEffect } from 'react';
import { UserProfile, HostStats } from '../types/user';
import { useUserStore } from '../store/userStore';
import { RetryConfig } from '../utils/retry/types';
import { getRetryStrategy } from '../utils/retry/strategies';
import ErrorTracker from '../utils/errorTracking';

interface OwnerData {
  owner: UserProfile | null;
  hostStats: HostStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  strategy: 'exponential',
  retryableErrors: [
    TypeError, // Network errors
    SyntaxError, // Parse errors
  ],
  onRetry: (error, attempt) => {
    ErrorTracker.logError(error, 'useOwnerData.retry', {
      attempt,
      component: 'PropertyOwnerInfo',
    });
  },
  maxDelay: 10000,
};

export function useOwnerData(ownerId: string, config: Partial<RetryConfig> = {}): OwnerData {
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [hostStats, setHostStats] = useState<HostStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { fetchUserProfile, fetchHostStats } = useUserStore();
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  const retryStrategy = getRetryStrategy(retryConfig.strategy);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < retryConfig.maxAttempts) {
      try {
        const [ownerData, statsData] = await Promise.all([
          fetchUserProfile(ownerId),
          fetchHostStats(ownerId),
        ]);

        setOwner(ownerData);
        setHostStats(statsData);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        const shouldRetry = retryConfig.retryableErrors?.some(
          ErrorType => lastError instanceof ErrorType
        );

        if (!shouldRetry || attempt === retryConfig.maxAttempts - 1) {
          throw lastError;
        }

        retryConfig.onRetry?.(lastError, attempt);
        const delay = retryStrategy(attempt, retryConfig.baseDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
      }
    }

    throw lastError;
  };

  const refetch = async () => {
    try {
      await fetchData();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      ErrorTracker.logError(error, 'useOwnerData', {
        ownerId,
        component: 'PropertyOwnerInfo',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [ownerId]);

  return {
    owner,
    hostStats,
    isLoading,
    error,
    refetch,
  };
}
