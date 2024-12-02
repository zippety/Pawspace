import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { logger } from '../../utils/logger';
import { RetryConfig, RetryStrategyType, retryOperation } from '../../utils/retry';
import { reportError } from '../../utils/sentry';

type StoreAction = (...args: any[]) => any;
type StoreActions = Record<string, StoreAction>;

// Error metadata interface
interface ErrorMetadata {
  action: string;
  args: any[];
  timestamp: string;
  context?: Record<string, unknown>;
}

export interface AutoErrorState {
  error: Error | null;
  errorMetadata: ErrorMetadata | null;
  isLoading: boolean;
}

// Generic type for any store that uses auto error handling
export type WithAutoError<T extends object> = T & AutoErrorState;

interface AutoErrorConfig {
  retryAttempts?: number;
  retryDelay?: number;
  retryStrategy?: RetryStrategyType;
  ignoredErrors?: string[];
  maxDelay?: number;
}

export function createAutoErrorHandler<
  T extends object,
  Mutators extends [StoreMutatorIdentifier, unknown][] = []
>(
  storeName: string,
  storeCreator: StateCreator<WithAutoError<T>, Mutators>,
  errorConfig: AutoErrorConfig = {}
): StateCreator<WithAutoError<T>, Mutators> {
  const {
    retryAttempts = 3,
    retryDelay = 1000,
    retryStrategy = 'exponential',
    ignoredErrors = [],
    maxDelay = 30000,
  } = errorConfig;

  return (set, get, api) => {
    // Create the original store
    const store = storeCreator(set, get, api);

    // Wrap all functions with error handling
    const wrappedStore = Object.entries(store).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'function') {
          acc[key] = async (...args: any[]) => {
            const retryConfig: RetryConfig = {
              maxAttempts: retryAttempts,
              baseDelay: retryDelay,
              strategy: retryStrategy,
              maxDelay,
              onRetry: (error, attempt) => {
                logger.warn(`Retry attempt ${attempt} for ${storeName}.${key}:`, {
                  error,
                  args,
                });
              },
            };

            try {
              set({ isLoading: true, error: null, errorMetadata: null });

              const result = await retryOperation(
                async () => {
                  try {
                    return await value(...args);
                  } catch (error) {
                    const err = error as Error;
                    // Check if error should be ignored
                    if (ignoredErrors.some(ignored => err.message.includes(ignored))) {
                      logger.warn(`Ignored error in ${storeName}.${key}:`, err);
                      return;
                    }
                    throw err;
                  }
                },
                retryConfig
              );

              set({ isLoading: false });
              return result;
            } catch (error) {
              const lastError = error as Error;

              // Set final error state
              const errorMetadata: ErrorMetadata = {
                action: key,
                args,
                timestamp: new Date().toISOString(),
                context: {
                  attempts: retryAttempts,
                  storeName,
                  strategy: retryStrategy,
                },
              };

              // Report error to Sentry
              reportError(lastError, errorMetadata);

              set({
                error: lastError,
                errorMetadata,
                isLoading: false,
              });

              throw lastError;
            }
          };
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    return {
      ...wrappedStore,
      error: null,
      errorMetadata: null,
      isLoading: false,
    };
  };
}
