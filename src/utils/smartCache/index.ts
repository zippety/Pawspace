import { RetryConfig } from '../retry/types';
import { getRetryStrategy } from '../retry/strategies';

interface CacheConfig {
  ttl: number;  // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
  prefetch?: boolean;
}

interface SmartRequestConfig {
  retry?: Partial<RetryConfig>;
  cache?: CacheConfig;
  priority?: 'high' | 'normal' | 'low';
}

class SmartCache {
  private static instance: SmartCache;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private prefetchQueue: Set<string> = new Set();
  private networkStatus: 'online' | 'offline' = 'online';

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange('online'));
      window.addEventListener('offline', () => this.handleNetworkChange('offline'));
    }
  }

  static getInstance(): SmartCache {
    if (!SmartCache.instance) {
      SmartCache.instance = new SmartCache();
    }
    return SmartCache.instance;
  }

  private handleNetworkChange(status: 'online' | 'offline') {
    this.networkStatus = status;
    if (status === 'online') {
      this.processPrefetchQueue();
    }
  }

  private async processPrefetchQueue() {
    const queue = Array.from(this.prefetchQueue);
    this.prefetchQueue.clear();

    for (const key of queue) {
      try {
        await this.revalidate(key);
      } catch (error) {
        console.error(`Failed to prefetch ${key}:`, error);
      }
    }
  }

  private async revalidate(key: string) {
    const cached = this.cache.get(key);
    if (!cached?.data) return;

    try {
      const freshData = await cached.data.refetch();
      this.cache.set(key, {
        data: freshData,
        timestamp: Date.now(),
      });
    } catch (error) {
      // Keep using cached data if revalidation fails
      console.warn(`Revalidation failed for ${key}, using cached data:`, error);
    }
  }

  async smartRequest<T>(
    key: string,
    request: () => Promise<T>,
    config: SmartRequestConfig = {}
  ): Promise<T> {
    const {
      retry = { maxAttempts: 3, strategy: 'exponential' },
      cache = { ttl: 5 * 60 * 1000 }, // 5 minutes default
      priority = 'normal',
    } = config;

    // Check cache first
    const cached = this.cache.get(key);
    const now = Date.now();
    if (cached && now - cached.timestamp < cache.ttl) {
      // If stale while revalidate is enabled, trigger background refresh
      if (cache.staleWhileRevalidate) {
        this.revalidate(key);
      }
      return cached.data;
    }

    // Handle offline mode
    if (this.networkStatus === 'offline') {
      if (cached) {
        this.prefetchQueue.add(key);
        return cached.data;
      }
      throw new Error('No cached data available and device is offline');
    }

    // Implement retry logic
    const retryStrategy = getRetryStrategy(retry.strategy || 'exponential');
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < (retry.maxAttempts || 3); attempt++) {
      try {
        const data = await request();
        this.cache.set(key, { data, timestamp: now });

        // If prefetch is enabled, schedule next prefetch
        if (cache.prefetch) {
          setTimeout(() => {
            this.revalidate(key);
          }, cache.ttl * 0.8); // Prefetch at 80% of TTL
        }

        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === (retry.maxAttempts || 3) - 1) {
          // On final attempt, try to return stale data if available
          if (cached) {
            console.warn(`Request failed, using stale data for ${key}:`, lastError);
            return cached.data;
          }
          throw lastError;
        }

        const delay = retryStrategy(attempt, 1000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  clearCache() {
    this.cache.clear();
    this.prefetchQueue.clear();
  }
}

export const smartCache = SmartCache.getInstance();

// Example usage:
// const data = await smartCache.smartRequest(
//   'user-123',
//   () => fetchUserProfile(123),
//   {
//     cache: { ttl: 60000, staleWhileRevalidate: true },
//     retry: { maxAttempts: 3, strategy: 'exponential' },
//     priority: 'high'
//   }
// );
