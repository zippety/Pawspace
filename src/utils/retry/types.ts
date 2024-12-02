/**
 * Function that determines delay between retry attempts
 */
export type RetryStrategy = (attempt: number, baseDelay: number) => number;

/**
 * Available retry strategy types
 */
export type RetryStrategyType = 'exponential' | 'fibonacci' | 'decorrelated';

/**
 * Configuration for retry behavior
 */
export interface RetryConfig {
  // Maximum number of retry attempts
  maxAttempts: number;

  // Base delay in milliseconds
  baseDelay: number;

  // Type of retry strategy to use
  strategy: RetryStrategyType;

  // Optional list of error types that should trigger retry
  retryableErrors?: Array<new (...args: any[]) => Error>;

  // Optional callback for retry attempts
  onRetry?: (error: Error, attempt: number) => void;

  // Maximum delay cap in milliseconds
  maxDelay?: number;
}
