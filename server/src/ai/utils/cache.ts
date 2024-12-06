import { Cache } from 'memory-cache';
import { AIError, AI_ERROR_CODES } from './ErrorHandler';

interface RateLimitInfo {
    count: number;
    lastReset: number;
    nextAllowedTime?: number;
}

/**
 * Cache manager for AI service responses and rate limiting
 */
export class CacheManager {
    private cache: Cache<string, any>;
    private rateLimitCache: Cache<string, RateLimitInfo>;
    private readonly DEFAULT_WINDOW_MS = 3600000; // 1 hour

    constructor() {
        this.cache = new Cache();
        this.rateLimitCache = new Cache();
    }

    /**
     * Set a value in the cache with optional TTL
     */
    set(key: string, value: any, ttlMs?: number) {
        this.cache.put(key, value, ttlMs);
    }

    /**
     * Get a value from the cache
     */
    get(key: string): any {
        return this.cache.get(key);
    }

    /**
     * Check and update rate limit for a given key
     * @throws AIError if rate limit is exceeded
     */
    checkRateLimit(key: string, limit: number, windowMs: number = this.DEFAULT_WINDOW_MS): void {
        const now = Date.now();
        let info = this.rateLimitCache.get(key) || { count: 0, lastReset: now };

        // Reset count if window has passed
        if (now - info.lastReset >= windowMs) {
            info = { count: 0, lastReset: now };
        }

        if (info.count >= limit) {
            const remainingMs = windowMs - (now - info.lastReset);
            info.nextAllowedTime = now + remainingMs;
            this.rateLimitCache.put(key, info);
            
            throw new AIError(
                `Rate limit exceeded. Try again in ${Math.ceil(remainingMs / 1000)} seconds`,
                AI_ERROR_CODES.RATE_LIMIT_EXCEEDED.code,
                429,
                AI_ERROR_CODES.RATE_LIMIT_EXCEEDED.severity,
                {
                    key,
                    limit,
                    windowMs,
                    nextAllowedTime: info.nextAllowedTime
                },
                true // retryable
            );
        }

        info.count++;
        this.rateLimitCache.put(key, info, windowMs);
    }

    /**
     * Get time until rate limit reset
     */
    getTimeUntilReset(key: string): number | null {
        const info = this.rateLimitCache.get(key);
        if (!info?.nextAllowedTime) return null;
        
        const remainingMs = info.nextAllowedTime - Date.now();
        return remainingMs > 0 ? remainingMs : null;
    }

    /**
     * Clear rate limit for a key
     */
    clearRateLimit(key: string) {
        this.rateLimitCache.del(key);
    }

    /**
     * Delete a value from the cache
     */
    delete(key: string) {
        this.cache.del(key);
    }

    /**
     * Clear all caches
     */
    clear() {
        this.cache.clear();
        this.rateLimitCache.clear();
    }

    /**
     * Clear all rate limits
     */
    clearAllRateLimits() {
        this.rateLimitCache.clear();
    }

    /**
     * Delete all values from the cache
     */
    deleteAll() {
        this.cache.clear();
    }
}
