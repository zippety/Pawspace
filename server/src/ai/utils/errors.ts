export class AIServiceError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly details?: any
    ) {
        super(message);
        this.name = 'AIServiceError';
    }
}

export const AI_ERROR_CODES = {
    INITIALIZATION_FAILED: 'AI_INIT_FAILED',
    PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
    PROFILE_CREATE_FAILED: 'PROFILE_CREATE_FAILED',
    PROFILE_UPDATE_FAILED: 'PROFILE_UPDATE_FAILED',
    PROFILE_DELETE_FAILED: 'PROFILE_DELETE_FAILED',
    SEARCH_FAILED: 'SEARCH_FAILED',
    INVALID_INPUT: 'INVALID_INPUT'
};
