/**
 * Metrics collector for AI service monitoring
 */
export class MetricsCollector {
    private metrics: Map<string, number[]>;
    private counters: Map<string, number>;

    constructor() {
        this.metrics = new Map();
        this.counters = new Map();
    }

    /**
     * Increment a counter metric
     */
    incrementCounter(name: string, value: number = 1) {
        const current = this.counters.get(name) || 0;
        this.counters.set(name, current + value);
    }

    /**
     * Record a value for a metric
     */
    recordValue(name: string, value: number) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        this.metrics.get(name)?.push(value);
    }

    /**
     * Get metrics for a specific time range
     */
    async getMetrics(timeRange: { start: Date; end: Date }) {
        const result: Record<string, any> = {
            counters: {},
            metrics: {}
        };

        // Add counter values
        for (const [name, value] of this.counters.entries()) {
            result.counters[name] = value;
        }

        // Calculate statistics for metrics
        for (const [name, values] of this.metrics.entries()) {
            if (values.length > 0) {
                result.metrics[name] = {
                    count: values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    avg: values.reduce((a, b) => a + b, 0) / values.length
                };
            }
        }

        return result;
    }

    /**
     * Reset all metrics
     */
    reset() {
        this.metrics.clear();
        this.counters.clear();
    }
}
