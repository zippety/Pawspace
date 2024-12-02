import { captureException } from '@sentry/react';

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
    // Log the error
    this.logError(error, context);

    // Send to error tracking service
    this.reportError(error, context);

    // Handle specific error types
    if (error instanceof TypeError) {
      console.warn('Type error occurred:', error.message);
    } else if (error.name === 'NetworkError') {
      // Handle network errors
      this.handleNetworkError(error);
    }
  }

  private logError(error: Error, context: ErrorContext): void {
    const errorEntry = {
      timestamp: new Date(),
      error,
      context
    };

    this.errorLog.push(errorEntry);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in component:', context.component);
      console.error('Action:', context.action);
      console.error('Error:', error);
      console.error('Stack:', error.stack);
    }
  }

  private reportError(error: Error, context: ErrorContext): void {
    // Send to Sentry
    captureException(error, {
      tags: {
        component: context.component,
        action: context.action
      },
      extra: {
        ...context.metadata,
        userId: context.userId
      }
    });
  }

  private handleNetworkError(error: Error): void {
    // Implement retry logic for network errors
    // TODO: Add exponential backoff retry mechanism
  }

  // Get recent errors for debugging
  getRecentErrors(limit: number = 10): Array<{
    timestamp: Date;
    error: Error;
    context: ErrorContext;
  }> {
    return this.errorLog.slice(-limit);
  }

  // Clear error log
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
        metadata: { errorInfo }
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
        metadata
      });
    }
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
