import { MetricsCollector } from './metrics';
import { CacheManager } from './cache';
import { AIError } from './ErrorHandler';

interface AgentMetrics {
    successRate: number;
    avgResponseTime: number;
    errorFrequency: Record<string, number>;
    lastErrors: AIError[];
}

interface AdaptiveThreshold {
    metric: string;
    baseline: number;
    current: number;
    adjustmentFactor: number;
}

/**
 * AI Agent Monitor for tracking performance and adapting behavior
 */
export class AIAgentMonitor {
    private metrics: MetricsCollector;
    private cache: CacheManager;
    private agentStats: Map<string, AgentMetrics>;
    private thresholds: Map<string, AdaptiveThreshold>;
    private learningRate: number = 0.1;

    constructor(metrics: MetricsCollector, cache: CacheManager) {
        this.metrics = metrics;
        this.cache = cache;
        this.agentStats = new Map();
        this.thresholds = new Map();
    }

    /**
     * Initialize monitoring for a new agent
     */
    registerAgent(agentId: string) {
        this.agentStats.set(agentId, {
            successRate: 1.0,
            avgResponseTime: 0,
            errorFrequency: {},
            lastErrors: []
        });

        // Set initial adaptive thresholds
        this.thresholds.set(`${agentId}_rateLimit`, {
            metric: 'requests_per_minute',
            baseline: 60,
            current: 60,
            adjustmentFactor: 1.0
        });
    }

    /**
     * Record an agent operation
     */
    recordOperation(agentId: string, duration: number, success: boolean, error?: AIError) {
        const stats = this.agentStats.get(agentId);
        if (!stats) return;

        // Update metrics
        this.metrics.recordValue(`${agentId}_duration`, duration);
        stats.avgResponseTime = (stats.avgResponseTime * 0.9) + (duration * 0.1);

        if (success) {
            this.metrics.incrementCounter(`${agentId}_success`);
            stats.successRate = (stats.successRate * 0.9) + (1.0 * 0.1);
        } else if (error) {
            this.metrics.incrementCounter(`${agentId}_error`);
            stats.successRate = stats.successRate * 0.9;
            stats.errorFrequency[error.code] = (stats.errorFrequency[error.code] || 0) + 1;
            stats.lastErrors = [...stats.lastErrors.slice(-9), error];
            
            // Adapt thresholds based on errors
            this.adaptThresholds(agentId, error);
        }
    }

    /**
     * Adapt thresholds based on performance and errors
     */
    private adaptThresholds(agentId: string, error: AIError) {
        const threshold = this.thresholds.get(`${agentId}_rateLimit`);
        if (!threshold) return;

        // Adjust rate limiting based on error type
        if (error.code === 'RATE_LIMIT_EXCEEDED') {
            threshold.adjustmentFactor *= (1 - this.learningRate);
        } else if (error.code === 'TIMEOUT') {
            threshold.adjustmentFactor *= (1 - this.learningRate * 0.5);
        }

        threshold.current = threshold.baseline * threshold.adjustmentFactor;
    }

    /**
     * Get current agent performance metrics
     */
    getAgentMetrics(agentId: string): AgentMetrics | undefined {
        return this.agentStats.get(agentId);
    }

    /**
     * Get recommended parameters based on learned behavior
     */
    getRecommendedParams(agentId: string) {
        const threshold = this.thresholds.get(`${agentId}_rateLimit`);
        return {
            rateLimit: threshold?.current || 60,
            timeout: this.calculateOptimalTimeout(agentId)
        };
    }

    /**
     * Calculate optimal timeout based on response time history
     */
    private calculateOptimalTimeout(agentId: string): number {
        const stats = this.agentStats.get(agentId);
        if (!stats) return 30000; // default 30s
        
        // Use 95th percentile of response time as timeout
        return Math.ceil(stats.avgResponseTime * 1.5);
    }

    /**
     * Analyze error patterns for an agent
     */
    analyzeErrorPatterns(agentId: string) {
        const stats = this.agentStats.get(agentId);
        if (!stats) return null;

        const totalErrors = Object.values(stats.errorFrequency).reduce((a, b) => a + b, 0);
        const patterns = Object.entries(stats.errorFrequency).map(([code, count]) => ({
            code,
            frequency: count / totalErrors,
            isRecurring: count > 3
        }));

        return {
            patterns,
            recommendedActions: this.generateRecommendations(patterns)
        };
    }

    /**
     * Generate recommendations based on error patterns
     */
    private generateRecommendations(patterns: Array<{ code: string; frequency: number; isRecurring: boolean }>) {
        const recommendations = new Set<string>();

        patterns.forEach(({ code, frequency, isRecurring }) => {
            if (code === 'RATE_LIMIT_EXCEEDED' && frequency > 0.2) {
                recommendations.add('Consider implementing more aggressive rate limiting');
            }
            if (code === 'TIMEOUT' && isRecurring) {
                recommendations.add('Review timeout settings and optimize response times');
            }
            if (code === 'MODEL_ERROR' && frequency > 0.1) {
                recommendations.add('Implement fallback models or retry mechanisms');
            }
        });

        return Array.from(recommendations);
    }
}
