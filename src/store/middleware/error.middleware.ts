import { errorAnalytics } from '../../utils/analytics';
import { StateCreator, StoreMutatorIdentifier } from 'zustand';

export interface ErrorState {
  error: Error | null;
  errorInfo?: Record<string, unknown>;
}

export interface ErrorActions {
  setError: (error: Error | null, info?: Record<string, unknown>) => void;
  clearError: () => void;
}

type ErrorMutators = [
  ['zustand/devtools', never],
  ['zustand/persist', unknown]
];

export type ErrorSlice = ErrorState & ErrorActions;

export const createErrorSlice = <
  T extends ErrorState,
  Mutators extends [StoreMutatorIdentifier, unknown][] = ErrorMutators
>(
  callback?: (state: ErrorState) => void
): StateCreator<T, Mutators> =>
  (set, get) => ({
    error: null,
    errorInfo: undefined,

    setError: (error: Error | null, info?: Record<string, unknown>) => {
      set({ error, errorInfo: info } as Partial<T>, false);
      if (error) {
        // Track error in analytics
        errorAnalytics.trackError({
          errorType: error.name || 'UnknownError',
          message: error.message,
          metadata: info,
          stackTrace: error.stack,
        });
        // Call the original callback if provided
        if (callback) {
          callback({ error, errorInfo: info });
        }
      }
    },

    clearError: () => {
      set({ error: null, errorInfo: undefined } as Partial<T>, false);
    },
  } as T);

export const withErrorHandling = <
  T extends { error: Error | null },
  Mutators extends [StoreMutatorIdentifier, unknown][] = ErrorMutators
>(
  storeCreator: StateCreator<T, Mutators>,
  errorCallback?: (state: ErrorState) => void
): StateCreator<T, Mutators> =>
  (set, get, api) => {
    const errorSlice = createErrorSlice<T, Mutators>(errorCallback)(
      set as any,
      get as any,
      api as any
    );

    const store = storeCreator(
      (partial, replace) => {
        const currentState = get();
        const nextState = typeof partial === 'function'
          ? partial(currentState)
          : partial;

        // Clear error when state updates successfully
        if (!nextState.error && currentState.error) {
          // Track error resolution in analytics
          errorAnalytics.trackError({
            errorType: 'ErrorResolved',
            message: 'Error state cleared after successful state update',
            metadata: {
              previousError: currentState.error.message,
              stateUpdate: nextState
            }
          });
          set({ error: null } as Partial<T>, replace);
        }

        set(partial as Partial<T>, replace);
      },
      get,
      api
    );

    return {
      ...store,
      ...errorSlice,
    };
  };
