import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { CacheManager } from './cache';
import { createAIError } from './ErrorHandler';

export class EmbeddingsService {
    private cache: CacheManager;
    private retryCount: number = 0;
    private readonly MAX_RETRIES = 3;
    private readonly RETRY_DELAY = 1000; // 1 second

    constructor(
        private embeddings: HuggingFaceTransformersEmbeddings,
        private fallbackEmbeddings?: HuggingFaceTransformersEmbeddings
    ) {
        this.cache = new CacheManager();
    }

    /**
     * Get embeddings with caching, rate limiting, and retries
     */
    async getEmbeddings(text: string): Promise<number[]> {
        // Check cache first
        const cacheKey = `embeddings_${Buffer.from(text).toString('base64')}`;
        const cachedEmbeddings = this.cache.get(cacheKey);
        if (cachedEmbeddings) {
            return cachedEmbeddings;
        }

        try {
            // Check rate limit
            if (this.cache.checkRateLimit('huggingface_api', 60, 60000)) { // 60 requests per minute
                const embedding = await this.embeddings.embedQuery(text);
                this.cache.set(cacheKey, embedding, 3600000); // Cache for 1 hour
                this.retryCount = 0; // Reset retry count on success
                return embedding;
            } else {
                // If rate limited, try fallback
                if (this.fallbackEmbeddings) {
                    const embedding = await this.fallbackEmbeddings.embedQuery(text);
                    this.cache.set(cacheKey, embedding, 3600000);
                    return embedding;
                }
                throw createAIError('RATE_LIMIT_EXCEEDED', 'API rate limit exceeded');
            }
        } catch (error) {
            if (error.message.includes('rate limit exceeded') && this.retryCount < this.MAX_RETRIES) {
                this.retryCount++;
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * this.retryCount));
                return this.getEmbeddings(text);
            }
            throw error;
        }
    }

    /**
     * Get current rate limit status
     */
    getRateLimitStatus(): { remaining: number; resetTime: Date } {
        const used = this.cache.get('huggingface_api_count') || 0;
        return {
            remaining: 60 - used,
            resetTime: new Date(Date.now() + 60000) // Next minute
        };
    }
}
