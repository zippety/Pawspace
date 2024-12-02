import { RetryConfig, RetryStrategy } from './types';
import { getRetryStrategy } from './strategies';
import { errorAnalytics } from '../analytics';

const DEFAULT_CONFIG: Partial<RetryConfig> = {
  maxAttempts: 3,
  baseDelay: 1000,
  strategy: 'exponential',
  maxDelay: 30000,
};

/**
 * Retry an operation with the specified strategy
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config } as RetryConfig;
  const strategy = getRetryStrategy(finalConfig.strategy);
  let lastError: Error;

  for (let attempt = 0; attempt < finalConfig.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      if (finalConfig.retryableErrors &&
          !finalConfig.retryableErrors.some(e => lastError instanceof e)) {
        throw lastError;
      }

      // Track retry attempt
      errorAnalytics.trackError({
        errorType: 'RetryAttempt',
        message: `Retry attempt ${attempt + 1} of ${finalConfig.maxAttempts}`,
        metadata: {
          attempt: attempt + 1,
          maxAttempts: finalConfig.maxAttempts,
          strategy: finalConfig.strategy,
          error: {
            name: lastError.name,
            message: lastError.message,
          },
        },
      });

      // Call onRetry callback if provided
      finalConfig.onRetry?.(lastError, attempt + 1);

      // If this was the last attempt, throw the error
      if (attempt === finalConfig.maxAttempts - 1) {
        throw lastError;
      }

      // Wait before next attempt
      const delay = strategy(attempt, finalConfig.baseDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

export * from './types';
export * from './strategies';
