import { Request, Response, NextFunction } from 'express';
import { MetricsCollector } from './metrics';
import { CacheManager } from './cache';
import { AIAgentMonitor } from './monitor';

// Error severity levels
export enum ErrorSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

interface ErrorResponseData {
    code: string;
    message: string;
    severity: ErrorSeverity;
    timestamp: number;
    details?: any;
    retryable: boolean;
    retryAfter?: number;
}

interface ErrorResponse {
    error: ErrorResponseData;
    recommendations?: any;
}

// Custom error class for AI service errors
export class AIError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly statusCode: number = 500,
        public readonly severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        public readonly details?: any,
        public readonly retryable: boolean = false,
        public readonly timestamp?: number
    ) {
        super(message);
        this.name = 'AIError';
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            severity: this.severity,
            details: this.details,
            retryable: this.retryable,
            timestamp: this.timestamp
        };
    }
}

// Error codes with severity levels
export const AI_ERROR_CODES = {
    // Initialization errors
    INIT_FAILED: { code: 'AI_INIT_FAILED', severity: ErrorSeverity.CRITICAL },
    CONFIG_ERROR: { code: 'AI_CONFIG_ERROR', severity: ErrorSeverity.HIGH },
    
    // Profile errors
    PROFILE_NOT_FOUND: { code: 'PROFILE_NOT_FOUND', severity: ErrorSeverity.LOW },
    PROFILE_CREATE_FAILED: { code: 'PROFILE_CREATE_FAILED', severity: ErrorSeverity.MEDIUM },
    PROFILE_UPDATE_FAILED: { code: 'PROFILE_UPDATE_FAILED', severity: ErrorSeverity.MEDIUM },
    PROFILE_DELETE_FAILED: { code: 'PROFILE_DELETE_FAILED', severity: ErrorSeverity.MEDIUM },
    
    // Vector store errors
    VECTOR_STORE_ERROR: { code: 'VECTOR_STORE_ERROR', severity: ErrorSeverity.HIGH },
    EMBEDDING_FAILED: { code: 'EMBEDDING_FAILED', severity: ErrorSeverity.MEDIUM },
    SEARCH_FAILED: { code: 'SEARCH_FAILED', severity: ErrorSeverity.MEDIUM },
    
    // Rate limiting and validation
    RATE_LIMIT_EXCEEDED: { code: 'RATE_LIMIT_EXCEEDED', severity: ErrorSeverity.LOW },
    INVALID_INPUT: { code: 'INVALID_INPUT', severity: ErrorSeverity.LOW },
    INVALID_PROFILE: { code: 'INVALID_PROFILE', severity: ErrorSeverity.LOW }
};

// Error messages with retry information
export const ERROR_MESSAGES = {
    [AI_ERROR_CODES.INIT_FAILED.code]: {
        message: 'Failed to initialize AI service',
        retryable: true
    },
    [AI_ERROR_CODES.CONFIG_ERROR.code]: {
        message: 'Invalid AI service configuration',
        retryable: false
    },
    [AI_ERROR_CODES.PROFILE_NOT_FOUND.code]: {
        message: 'Pet profile not found',
        retryable: false
    },
    [AI_ERROR_CODES.PROFILE_CREATE_FAILED.code]: {
        message: 'Failed to create pet profile',
        retryable: true
    },
    [AI_ERROR_CODES.VECTOR_STORE_ERROR.code]: {
        message: 'Vector store operation failed',
        retryable: true
    },
    [AI_ERROR_CODES.EMBEDDING_FAILED.code]: {
        message: 'Failed to generate embeddings',
        retryable: true
    },
    [AI_ERROR_CODES.RATE_LIMIT_EXCEEDED.code]: {
        message: 'Rate limit exceeded for AI operations',
        retryable: true
    }
};

export class AIErrorHandler {
    private metrics: MetricsCollector;
    private cache: CacheManager;
    private monitor: AIAgentMonitor;

    constructor() {
        this.metrics = new MetricsCollector();
        this.cache = new CacheManager();
        this.monitor = new AIAgentMonitor(this.metrics, this.cache);
    }

    /**
     * Handle an AI-related error with monitoring and adaptation
     */
    async handleError(error: AIError, agentId?: string): Promise<ErrorResponse> {
        // Record error in metrics
        this.metrics.incrementCounter(`error_${error.code}`);
        
        if (agentId) {
            // Record operation in monitor
            await this.monitor.recordOperation(agentId, error.timestamp ? Date.now() - error.timestamp : 0, false, error);
            
            // Get recommendations for the agent
            const recommendations = await this.monitor.analyzeErrorPatterns(agentId);
            if (recommendations) {
                console.log(`Recommendations for ${agentId}:`, recommendations);
            }
        }

        // Handle rate limiting errors
        if (error.code === AI_ERROR_CODES.RATE_LIMIT_EXCEEDED.code) {
            const source = error.details?.key || 'unknown';
            const nextAllowedTime = error.details?.nextAllowedTime;
            
            if (nextAllowedTime) {
                const retryAfterMs = Math.max(0, nextAllowedTime - Date.now());
                return {
                    error: {
                        ...error.toJSON(),
                        retryAfter: Math.ceil(retryAfterMs / 1000)
                    },
                    recommendations: agentId ? await this.monitor.getRecommendedParams(agentId) : undefined
                };
            }
        }

        // Return structured error response
        return {
            error: error.toJSON(),
            recommendations: agentId ? await this.monitor.getRecommendedParams(agentId) : undefined
        };
    }

    /**
     * Register a new AI agent for monitoring
     */
    registerAgent(agentId: string) {
        this.monitor.registerAgent(agentId);
    }

    /**
     * Get performance metrics for an agent
     */
    getAgentMetrics(agentId: string) {
        return this.monitor.getAgentMetrics(agentId);
    }

    /**
     * Check if an operation should be rate limited
     */
    shouldRateLimit(source: string, limit: number = 60): boolean {
        return !this.cache.checkRateLimit(`ratelimit_${source}`, limit, 60000);
    }

    /**
     * Get overall system metrics
     */
    async getSystemMetrics() {
        return this.metrics.getMetrics({
            start: new Date(Date.now() - 3600000), // Last hour
            end: new Date()
        });
    }
}

// Helper function to create AI errors
export const createAIError = (
    code: keyof typeof AI_ERROR_CODES,
    details?: any,
    statusCode: number = 500
): AIError => {
    const errorConfig = AI_ERROR_CODES[code];
    const errorMessage = ERROR_MESSAGES[errorConfig.code];

    return new AIError(
        errorMessage.message,
        errorConfig.code,
        statusCode,
        errorConfig.severity,
        details,
        errorMessage.retryable
    );
};

// Error handler middleware with enhanced features
export const aiErrorHandler = (
    error: Error | AIError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorHandler = new AIErrorHandler();

    if (error instanceof AIError) {
        // Handle error with monitoring and adaptation
        errorHandler.handleError(error, req.query.agentId).then((response) => {
            // Return structured error response
            return res.status(error.statusCode).json(response);
        });
    } else {
        // Handle unexpected errors
        console.error('Unexpected Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR',
            severity: ErrorSeverity.HIGH,
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
