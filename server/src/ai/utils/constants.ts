import { ErrorSeverity } from './ErrorHandler';

export const AI_ERROR_CODES = {
    RATE_LIMIT_EXCEEDED: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Rate limit exceeded for the AI service',
        severity: ErrorSeverity.HIGH
    },
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid data provided',
        severity: ErrorSeverity.HIGH
    },
    DATABASE_ERROR: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        severity: ErrorSeverity.HIGH
    },
    NOT_FOUND: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        severity: ErrorSeverity.MEDIUM
    },
    INTERNAL_ERROR: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        severity: ErrorSeverity.HIGH
    },
    VECTOR_STORE_ERROR: {
        code: 'VECTOR_STORE_ERROR',
        message: 'Vector store operation failed',
        severity: ErrorSeverity.HIGH
    },
    EMBEDDING_ERROR: {
        code: 'EMBEDDING_ERROR',
        message: 'Embedding generation failed',
        severity: ErrorSeverity.HIGH
    },
    SEARCH_ERROR: {
        code: 'SEARCH_ERROR',
        message: 'Search operation failed',
        severity: ErrorSeverity.HIGH
    },
    PROFILE_CREATE_FAILED: {
        code: 'PROFILE_CREATE_FAILED',
        message: 'Failed to create profile',
        severity: ErrorSeverity.HIGH
    },
    PROFILE_NOT_FOUND: {
        code: 'PROFILE_NOT_FOUND',
        message: 'Profile not found',
        severity: ErrorSeverity.MEDIUM
    },
    SEARCH_FAILED: {
        code: 'SEARCH_FAILED',
        message: 'Search operation failed',
        severity: ErrorSeverity.HIGH
    }
} as const;
