import React from 'react';
import ErrorTracker, { ErrorCategory, withErrorBoundary } from '@/utils/errorTracking';

interface ApiResponse {
  data: any;
  status: number;
}

const fetchDataWithRetry = async (): Promise<ApiResponse> => {
  return ErrorTracker.withRetry(
    async () => {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw ErrorTracker.createError(
          'Failed to fetch data',
          'DataFetcher',
          ErrorCategory.NETWORK
        );
      }
      return response.json();
    },
    'DataFetcher',
    { maxAttempts: 3, delayMs: 1000 }
  );
};

const handleUserAction = async (action: string) => {
  const rateLimit = ErrorTracker.checkRateLimit(
    `user-action-${action}`,
    5, // 5 attempts
    60000 // per minute
  );

  if (!rateLimit) {
    throw ErrorTracker.createError(
      'Too many attempts. Please try again later.',
      'UserAction',
      ErrorCategory.RATE_LIMIT
    );
  }

  // Proceed with action...
};

const ErrorTrackingExample: React.FC = () => {
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleClick = async () => {
    try {
      setError(null);
      await handleUserAction('fetch-data');
      const response = await fetchDataWithRetry();
      setData(response.data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      // Error will be automatically logged by ErrorTracker
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Error Tracking Example</h2>

      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Fetch Data
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      {data && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded">
          Data fetched successfully!
        </div>
      )}
    </div>
  );
};

// Wrap component with error boundary
export default withErrorBoundary('ErrorTrackingExample')(ErrorTrackingExample);
