import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>

          <p className="text-gray-600 mb-6">
            We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 w-full">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="font-mono text-sm text-red-800 break-all">
                  {error.message}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={resetError}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
