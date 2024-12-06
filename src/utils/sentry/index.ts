import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';
import { Replay } from '@sentry/replay';
import React from 'react';

interface UserContext {
  id?: string;
  email?: string;
  role?: string;
}

export function initSentry(): void {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing(),
        new Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
}

export function setUserContext(user: UserContext | null): void {
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

interface ErrorBoundaryProps {
  error: Error;
  resetError: () => void;
}

const DefaultErrorFallback = ({ error, resetError }: ErrorBoundaryProps): JSX.Element => (
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
);

// Custom error boundary component with retry capability
export function withSentryErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallbackRender?: React.ComponentType<ErrorBoundaryProps>
): React.ComponentType<P> {
  const FallbackComponent = fallbackRender || DefaultErrorFallback;
  return Sentry.withErrorBoundary(WrappedComponent, {
    fallback: (props: ErrorBoundaryProps) => <FallbackComponent {...props} />,
    showDialog: true,
  });
}
