import { RetryStrategy } from './types';
import { errorAnalytics } from '../analytics';

const DEFAULT_MAX_DELAY = 30000; // 30 seconds

/**
 * Exponential backoff strategy with jitter
 * Increases delay exponentially and adds random jitter to prevent thundering herd
 */
export const exponentialBackoff: RetryStrategy = (attempt: number, baseDelay: number = 1000): number => {
  const exp = Math.min(attempt, 6); // Cap at 2^6 to avoid excessive delays
  const jitter = Math.random() * 0.3 + 0.85; // Random between 0.85 and 1.15
  return Math.min(baseDelay * Math.pow(2, exp) * jitter, DEFAULT_MAX_DELAY);
};

/**
 * Fibonacci backoff strategy
 * More gradual than exponential, good for operations that might succeed with slightly longer waits
 */
export const fibonacciBackoff: RetryStrategy = (attempt: number, baseDelay: number = 1000): number => {
  const fib = (n: number): number => {
    if (n <= 1) return n;
    let prev = 0, curr = 1;
    for (let i = 2; i <= n; i++) {
      const next = prev + curr;
      prev = curr;
      curr = next;
    }
    return curr;
  };
  return Math.min(baseDelay * fib(attempt), DEFAULT_MAX_DELAY);
};

/**
 * Decorrelated jitter strategy
 * Helps prevent synchronized retries in distributed systems
 */
export const decorrelatedJitter: RetryStrategy = (attempt: number, baseDelay: number = 1000): number => {
  const cap = Math.min(baseDelay * Math.pow(2, attempt), DEFAULT_MAX_DELAY);
  return Math.random() * (cap - baseDelay) + baseDelay;
};

/**
 * Get retry strategy based on configuration
 */
export const getRetryStrategy = (strategy: string): RetryStrategy => {
  switch (strategy) {
    case 'exponential':
      return exponentialBackoff;
    case 'fibonacci':
      return fibonacciBackoff;
    case 'decorrelated':
      return decorrelatedJitter;
    default:
      errorAnalytics.trackError({
        errorType: 'InvalidRetryStrategy',
        message: `Unknown retry strategy: ${strategy}. Falling back to exponential backoff.`,
        metadata: { strategy }
      });
      return exponentialBackoff;
  }
};
