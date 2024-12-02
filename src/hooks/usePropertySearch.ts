import { useState, useEffect, useMemo } from 'react';
import { usePropertyStore } from '../store/propertyStore';
import { Property, PropertyFilter } from '../types/property';
import { smartCache } from '../utils/smartCache';
import debounce from 'lodash/debounce';
import ErrorTracker, { ErrorCategory } from '../utils/errorTracking';

interface UsePropertySearchResult {
  properties: Property[];
  isLoading: boolean;
  error: Error | null;
  totalResults: number;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

const ITEMS_PER_PAGE = 20;
const SEARCH_RATE_LIMIT = {
  limit: 30,    // 30 searches
  window: 60000 // per minute
};

export function usePropertySearch(filters: PropertyFilter): UsePropertySearchResult {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const {
    properties,
    loading: isLoading,
    error,
    fetchProperties,
  } = usePropertyStore();

  // Create a cache key based on filters
  const cacheKey = useMemo(() => {
    const filterKey = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
      .join('|');
    return `properties_${filterKey}_page${page}`;
  }, [filters, page]);

  // Enhanced search function with error tracking and retry logic
  const performSearch = async (searchFilters: PropertyFilter, pageNum: number) => {
    // Check rate limit
    if (!ErrorTracker.checkRateLimit('property-search', SEARCH_RATE_LIMIT.limit, SEARCH_RATE_LIMIT.window)) {
      throw ErrorTracker.createError(
        'Too many search requests. Please wait a moment before trying again.',
        'PropertySearch',
        ErrorCategory.RATE_LIMIT
      );
    }

    return ErrorTracker.withRetry(
      async () => {
        const result = await smartCache.smartRequest(
          cacheKey,
          async () => {
            const response = await fetchProperties({
              ...searchFilters,
              pagination: {
                page: pageNum,
                limit: ITEMS_PER_PAGE,
              },
            });
            return response;
          },
          {
            cache: {
              ttl: 5 * 60 * 1000, // 5 minutes
              staleWhileRevalidate: true,
              prefetch: true,
            },
            retry: {
              maxAttempts: 3,
              strategy: 'exponential',
            },
          }
        );

        if (!result || !result.properties) {
          throw ErrorTracker.createError(
            'Invalid search response received',
            'PropertySearch',
            ErrorCategory.INTERNAL
          );
        }

        return result;
      },
      'PropertySearch',
      {
        maxAttempts: 3,
        delayMs: 1000,
        backoffFactor: 2,
      }
    );
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchFilters: PropertyFilter, pageNum: number) => {
        try {
          const result = await performSearch(searchFilters, pageNum);
          setTotalResults(result.total);
          setHasMore(result.properties.length === ITEMS_PER_PAGE);
        } catch (error) {
          // Error is already tracked by ErrorTracker.withRetry
          console.error('Search error:', error);
        }
      }, 300),
    [cacheKey, fetchProperties]
  );

  // Effect to handle search
  useEffect(() => {
    setPage(1); // Reset page when filters change
    debouncedSearch(filters, 1);

    return () => {
      debouncedSearch.cancel();
    };
  }, [filters, debouncedSearch]);

  // Load more function with error tracking
  const loadMore = async () => {
    if (!hasMore || isLoading) return;

    try {
      const nextPage = page + 1;
      setPage(nextPage);
      await debouncedSearch(filters, nextPage);
    } catch (error) {
      ErrorTracker.logError(
        error as Error,
        'PropertySearch',
        { action: 'loadMore', page: page + 1, filters }
      );
      throw error;
    }
  };

  // Refresh function with error tracking
  const refresh = async () => {
    try {
      setPage(1);
      smartCache.clearCache();
      await debouncedSearch(filters, 1);
    } catch (error) {
      ErrorTracker.logError(
        error as Error,
        'PropertySearch',
        { action: 'refresh', filters }
      );
      throw error;
    }
  };

  return {
    properties,
    isLoading,
    error,
    totalResults,
    hasMore,
    loadMore,
    refresh,
  };
}
