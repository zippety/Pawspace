import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { logger } from '../utils/logger';

interface ErrorHandlerConfig {
  retryAttempts?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  showToast?: boolean;
  logError?: boolean;
}

export function useAutoErrorHandler(config: ErrorHandlerConfig = {}) {
  const {
    retryAttempts = 3,
    retryDelay = 1000,
    onError,
    showToast = true,
    logError = true,
  } = config;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error, context?: any) => {
    if (logError) {
      logger.error('Component error:', { error, context });
    }

    if (showToast) {
      toast.error(error.message);
    }

    setError(error);
    onError?.(error);
  }, [logError, showToast, onError]);

  const wrapAsync = useCallback(
    async <T extends (...args: any[]) => Promise<any>>(
      fn: T,
      context?: string
    ): Promise<ReturnType<T>> => {
      let attempts = 0;
      setIsLoading(true);
      setError(null);

      const executeAttempt = async (): Promise<ReturnType<T>> => {
        try {
          const result = await fn();
          setIsLoading(false);
          return result;
        } catch (err) {
          attempts++;
          const error = err as Error;

          if (attempts < retryAttempts) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return executeAttempt();
          }

          handleError(error, { context, attempts });
          setIsLoading(false);
          throw error;
        }
      };

      return executeAttempt();
    },
    [retryAttempts, retryDelay, handleError]
  );

  return {
    wrapAsync,
    isLoading,
    error,
    setError,
  };
}

// Usage example:
/*
function MyComponent() {
  const { wrapAsync, isLoading, error } = useAutoErrorHandler({
    retryAttempts: 2,
    showToast: true,
    onError: (error) => {
      // Custom error handling
    }
  });

  const handleSubmit = async (data: FormData) => {
    await wrapAsync(
      async () => {
        // Your async operation here
        await api.submitData(data);
      },
      'form-submission'
    );
  };

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <ErrorMessage error={error} />}
      <form onSubmit={handleSubmit}>
        {/* form content *//*}
      </form>
    </div>
  );
}
*/
