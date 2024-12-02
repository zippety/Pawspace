import { captureException } from '@sentry/react';
import React from 'react';

export interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: Array<{
    timestamp: Date;
    error: Error;
    context: ErrorContext;
  }> = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error, context: ErrorContext): void {
    this.logError(error, context);
    this.reportError(error, context);
  }

  private logError(error: Error, context: ErrorContext): void {
    const errorEntry = {
      timestamp: new Date(),
      error,
      context,
    };
    this.errorLog.push(errorEntry);
    console.error('Error:', error);
    console.error('Context:', context);
  }

  private reportError(error: Error, context: ErrorContext): void {
    captureException(error, {
      extra: context,
    });
  }

  handleNetworkError(error: Error): void {
    this.handleError(error, {
      component: 'NetworkLayer',
      action: 'apiRequest',
      metadata: {
        message: error.message,
        stack: error.stack,
      },
    });
  }

  getRecentErrors(limit: number = 10): Array<{
    timestamp: Date;
    error: Error;
    context: ErrorContext;
  }> {
    return this.errorLog.slice(-limit);
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Error boundary component
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return class ErrorBoundary extends React.Component<P, { hasError: boolean }> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(): { hasError: boolean } {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
      ErrorHandler.getInstance().handleError(error, {
        component: componentName,
        action: 'render',
        metadata: { errorInfo },
      });
    }

    render(): React.ReactNode {
      if (this.state.hasError) {
        return (
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="text-red-800 font-medium">Something went wrong</h3>
            <p className="text-red-600">We're working on fixing this issue.</p>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

// Hook for functional components
export function useErrorHandler(component: string) {
  return {
    handleError: (error: Error, action: string, metadata?: Record<string, any>) => {
      ErrorHandler.getInstance().handleError(error, {
        component,
        action,
        metadata,
      });
    },
  };
}

// Utility function to wrap async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: ErrorContext
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    ErrorHandler.getInstance().handleError(error as Error, context);
    throw error;
  }
}
