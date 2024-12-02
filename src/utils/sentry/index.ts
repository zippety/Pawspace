import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';
import { Replay } from '@sentry/replay';

interface UserContext {
  id?: string;
  email?: string;
  role?: string;
}

// Initialize Sentry with enhanced configuration
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          tracePropagationTargets: ['localhost', /^https:\/\/pawspaces\.ca/],
        }),
        new Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 0.2, // Adjust based on traffic
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      release: process.env.REACT_APP_VERSION || '0.0.0',
      beforeSend(event) {
        // Don't send events in development
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      },
      ignoreErrors: [
        // Add known errors that shouldn't be reported
        'Network request failed',
        'ResizeObserver loop limit exceeded',
      ],
    });
  }
};

// Set user context for better error tracking
export const setUserContext = (user: UserContext | null) => {
  if (process.env.NODE_ENV === 'production') {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } else {
      Sentry.setUser(null);
    }
  }
};

// Enhanced error reporting with more context
export const reportError = (
  error: Error,
  context?: Record<string, any>,
  level: Sentry.SeverityLevel = 'error'
) => {
  if (process.env.NODE_ENV === 'production') {
    // Add breadcrumb for better error context
    Sentry.addBreadcrumb({
      category: 'error',
      message: error.message,
      level,
    });

    Sentry.captureException(error, {
      level,
      extra: context,
      tags: {
        errorType: error.name,
        component: context?.component,
      },
    });
  }
  // Always log to console in development
  console.error('Error:', error, 'Context:', context);
};

// Start performance transaction
export const startTransaction = (name: string, op: string) => {
  if (process.env.NODE_ENV === 'production') {
    const transaction = Sentry.startTransaction({
      name,
      op,
    });
    Sentry.getCurrentHub().configureScope(scope => {
      scope.setSpan(transaction);
    });
    return transaction;
  }
  return null;
};

// Custom error boundary component with retry capability
export const withSentryErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallbackRender?: (props: { error: Error; resetError: () => void }) => React.ReactNode
) => {
  return Sentry.withErrorBoundary(WrappedComponent, {
    fallback: fallbackRender || (({ error, resetError }) => (
      <div className="error-boundary p-4 border border-red-300 rounded-md bg-red-50">
        <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
        <p className="mt-2 text-red-600">{error?.message || 'An unexpected error occurred'}</p>
        <button
          onClick={resetError}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    )),
    showDialog: true
  });
};
