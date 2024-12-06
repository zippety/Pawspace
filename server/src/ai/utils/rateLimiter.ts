/**
 * Simple rate limiter using a sliding window
 */
export class RateLimiter {
    private requests: Map<string, number[]>;
    private windowMs: number;
    private maxRequests: number;

    constructor(maxRequests: number = 60, windowMs: number = 60000) {
        this.requests = new Map();
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    /**
     * Check if a key has exceeded its rate limit
     */
    isRateLimited(key: string): boolean {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        // Get existing timestamps for this key
        let timestamps = this.requests.get(key) || [];

        // Remove old timestamps outside the window
        timestamps = timestamps.filter(time => time > windowStart);

        // Check if we're over the limit
        if (timestamps.length >= this.maxRequests) {
            return true;
        }

        // Add new timestamp and update
        timestamps.push(now);
        this.requests.set(key, timestamps);
        return false;
    }

    /**
     * Get remaining requests for a key
     */
    getRemainingRequests(key: string): number {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        const timestamps = this.requests.get(key) || [];
        const validTimestamps = timestamps.filter(time => time > windowStart);
        return Math.max(0, this.maxRequests - validTimestamps.length);
    }

    /**
     * Get time until reset for a key
     */
    getTimeUntilReset(key: string): number {
        const timestamps = this.requests.get(key) || [];
        if (timestamps.length === 0) {
            return 0;
        }
        const oldestTimestamp = Math.min(...timestamps);
        return Math.max(0, oldestTimestamp + this.windowMs - Date.now());
    }

    /**
     * Clear rate limit data for a key
     */
    clearKey(key: string): void {
        this.requests.delete(key);
    }
}
