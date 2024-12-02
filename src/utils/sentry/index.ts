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
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        tracePropagationTargets: ['localhost', /^https:\/\/pawspace\.vercel\.app/],
      }),
      new Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    beforeSend(event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Sentry Event:', event);
      }
      return event;
    },
  });
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

export function reportError(
  error: Error,
  context?: Record<string, any>,
  level: Sentry.SeverityLevel = 'error'
): void {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    scope.setLevel(level);
    Sentry.captureException(error);
  });

  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', error);
    if (context) {
      console.error('Context:', context);
    }
  }
}

// Custom error boundary component with retry capability
export function withSentryErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallbackRender?: (props: { error: Error; resetError: () => void }) => React.ReactNode
): React.ComponentType<P> {
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
    showDialog: true,
  });
}
