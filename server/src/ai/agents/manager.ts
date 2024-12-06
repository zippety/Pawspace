import { AIErrorHandler } from '../utils/ErrorHandler';
import { ProfileManager } from '../profiles/manager';
import { SpaceManager } from '../spaces/manager';
import { MetricsCollector } from '../utils/metrics';
import { CacheManager } from '../utils/cache';

export class AgentManager {
    private errorHandler: AIErrorHandler;
    private metrics: MetricsCollector;
    private cache: CacheManager;
    private agents: Map<string, any>;

    constructor(
        private profileManager: ProfileManager,
        private spaceManager: SpaceManager
    ) {
        this.errorHandler = new AIErrorHandler();
        this.metrics = new MetricsCollector();
        this.cache = new CacheManager();
        this.agents = new Map();

        this.initializeAgents();
    }

    private initializeAgents() {
        // Register core agents
        this.registerAgent('profile_manager', this.profileManager);
        this.registerAgent('space_manager', this.spaceManager);

        // Initialize monitoring for each agent
        this.agents.forEach((agent, id) => {
            this.errorHandler.registerAgent(id);
        });
    }

    /**
     * Register a new AI agent
     */
    registerAgent(id: string, agent: any) {
        this.agents.set(id, agent);
        this.errorHandler.registerAgent(id);
    }

    /**
     * Get metrics for all agents
     */
    async getAllMetrics() {
        const metrics: Record<string, any> = {};
        
        for (const [id, _] of this.agents) {
            metrics[id] = await this.errorHandler.getAgentMetrics(id);
        }

        return metrics;
    }

    /**
     * Get metrics for a specific agent
     */
    async getAgentMetrics(agentId: string) {
        return this.errorHandler.getAgentMetrics(agentId);
    }

    /**
     * Get system-wide metrics
     */
    async getSystemMetrics() {
        return this.errorHandler.getSystemMetrics();
    }

    /**
     * Get recommendations for all agents
     */
    async getRecommendations() {
        const recommendations: Record<string, any> = {};
        
        for (const [id, _] of this.agents) {
            const patterns = await this.errorHandler.monitor.analyzeErrorPatterns(id);
            if (patterns) {
                recommendations[id] = patterns;
            }
        }

        return recommendations;
    }

    /**
     * Check health of all agents
     */
    async checkHealth() {
        const health: Record<string, any> = {};
        
        for (const [id, agent] of this.agents) {
            const metrics = await this.errorHandler.getAgentMetrics(id);
            health[id] = {
                status: metrics.successRate > 0.9 ? 'healthy' : 'degraded',
                successRate: metrics.successRate,
                avgResponseTime: metrics.avgResponseTime
            };
        }

        return health;
    }
}
