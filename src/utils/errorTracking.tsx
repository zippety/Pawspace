import React from 'react';
import { captureException } from '@sentry/react';

export interface ErrorLog {
  timestamp: Date;
  component: string;
  errorType: string;
  message: string;
  stackTrace?: string;
  userAction?: string;
  context?: Record<string, any>;
  severity?: ErrorSeverity;
  retryAttempt?: number;
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHORIZATION = 'authorization',
  RATE_LIMIT = 'rate_limit',
  INTERNAL = 'internal',
}

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffFactor?: number;
}

class ErrorTracker {
  private static rateLimits: Map<string, { count: number; resetTime: number }> = new Map();

  static async logError(
    error: Error,
    component: string,
    context?: Record<string, any>
  ): Promise<void> {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      component,
      errorType: error.name,
      message: error.message,
      stackTrace: error.stack,
      context,
      severity: this.determineSeverity(error),
    };

    // Send to Sentry with enhanced context
    captureException(error, {
      extra: {
        ...errorLog,
        errorCategory: this.determineCategory(error),
      },
      tags: {
        component,
        severity: errorLog.severity,
        category: this.determineCategory(error),
      },
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', errorLog);
    }
  }

  static createError(
    message: string,
    component: string,
    category: ErrorCategory = ErrorCategory.INTERNAL
  ): Error {
    const error = new Error(message);
    error.name = `${category}:${component}`;
    return error;
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    component: string,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      delayMs = 1000,
      backoffFactor = 2,
    } = options;

    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          const delay = delayMs * Math.pow(backoffFactor, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));

          this.logError(lastError, component, {
            retryAttempt: attempt,
            nextRetryDelay: delay,
          });
        }
      }
    }

    throw lastError!;
  }

  static checkRateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const limitInfo = this.rateLimits.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > limitInfo.resetTime) {
      limitInfo.count = 1;
      limitInfo.resetTime = now + windowMs;
    } else if (limitInfo.count >= limit) {
      return false;
    } else {
      limitInfo.count++;
    }

    this.rateLimits.set(key, limitInfo);
    return true;
  }

  private static determineSeverity(error: Error): ErrorSeverity {
    if (error instanceof TypeError || error instanceof ReferenceError) {
      return ErrorSeverity.HIGH;
    }
    if (error.name.includes('Network')) {
      return ErrorSeverity.MEDIUM;
    }
    if (error.name.includes('Validation')) {
      return ErrorSeverity.LOW;
    }
    return ErrorSeverity.MEDIUM;
  }

  private static determineCategory(error: Error): ErrorCategory {
    if (error.name.includes('Network')) return ErrorCategory.NETWORK;
    if (error.name.includes('Auth')) return ErrorCategory.AUTHORIZATION;
    if (error.name.includes('Validation')) return ErrorCategory.VALIDATION;
    if (error.name.includes('RateLimit')) return ErrorCategory.RATE_LIMIT;
    return ErrorCategory.INTERNAL;
  }
}

export const withErrorBoundary = (component: string) => ({
  onError: (error: Error, info: { componentStack: string }) => {
    ErrorTracker.logError(error, component, {
      componentStack: info.componentStack,
      severity: ErrorSeverity.HIGH,
    });
  },
  fallback: ({ error }: { error: Error }) => (
    <React.Fragment>
      <div className="p-4 rounded-lg bg-red-50 text-red-800">
        <h3 className="font-semibold">Something went wrong</h3>
        <p className="text-sm mt-1">
          {process.env.NODE_ENV === 'development'
            ? error.message
            : 'Please try again later or contact support if the problem persists.'}
        </p>
      </div>
    </React.Fragment>
  ),
});

export default ErrorTracker;
