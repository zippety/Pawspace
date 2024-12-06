import { PineconeStore } from '@langchain/pinecone';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { Document } from '@langchain/core/documents';
import { AIError, AIErrorHandler } from '../utils/ErrorHandler';
import { AI_ERROR_CODES } from '../utils/constants';
import { CacheManager } from '../utils/cache';
import { PetProfile, ProfileMatch, SearchResult } from './types';
import { ProfileValidator } from './validator';
import { v4 as uuidv4 } from 'uuid';

export class ProfileManager {
    private cache: CacheManager;
    private errorHandler: AIErrorHandler;

    constructor(
        private vectorStore: PineconeStore,
        private embeddings: HuggingFaceTransformersEmbeddings
    ) {
        this.cache = new CacheManager();
        this.errorHandler = new AIErrorHandler();
    }

    /**
     * Add a new pet profile
     */
    async addProfile(profile: Omit<PetProfile, 'id' | 'embedding' | 'createdAt' | 'updatedAt'>): Promise<PetProfile> {
        try {
            // Validate profile data
            const errors = ProfileValidator.validate({
                ...profile,
                id: 'temp',
                embedding: [0], // Temporary embedding for validation
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            if (errors.length > 0) {
                throw new AIError(
                    AI_ERROR_CODES.VALIDATION_ERROR.code,
                    `Invalid profile data: ${errors.map(e => e.message).join(', ')}`
                );
            }

            // Generate embedding
            const embeddingArray = await this.embeddings.embedQuery(JSON.stringify(profile));
            const embedding = Array.from(embeddingArray);

            // Create full profile
            const fullProfile: PetProfile = {
                ...profile,
                id: uuidv4(),
                embedding,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Store in vector database
            await this.vectorStore.addDocuments([
                new Document({
                    pageContent: JSON.stringify(fullProfile),
                    metadata: { id: fullProfile.id }
                })
            ]);

            return fullProfile;
        } catch (error) {
            if (error instanceof AIError) {
                throw error;
            }
            throw new AIError(
                AI_ERROR_CODES.PROFILE_CREATE_FAILED.code,
                'Failed to create profile'
            );
        }
    }

    /**
     * Find similar profiles based on a search query
     */
    async findSimilarProfiles(query: string): Promise<SearchResult[]> {
        const cacheKey = `search:${query}`;
        try {
            // Check cache first
            const cached = await this.cache.get(cacheKey);
            if (cached) {
                return cached as SearchResult[];
            }

            // Generate embedding for search query
            const queryEmbedding = await this.embeddings.embedQuery(query);

            // Search vector store
            const results = await this.vectorStore.similaritySearch(query, 5);
            
            if (!results || results.length === 0) {
                throw new AIError(
                    AI_ERROR_CODES.PROFILE_NOT_FOUND.code,
                    'No matching profiles found'
                );
            }

            // Parse and format results
            const searchResults: SearchResult[] = results.map(doc => ({
                profile: JSON.parse(doc.pageContent),
                score: doc.metadata.score || 0
            }));

            // Cache results
            await this.cache.set(cacheKey, searchResults, 3600);

            return searchResults;
        } catch (error) {
            if (error instanceof AIError) {
                throw error;
            }
            throw new AIError(
                AI_ERROR_CODES.SEARCH_FAILED.code,
                'Failed to search profiles'
            );
        }
    }

    /**
     * Find similar profiles
     */
    async findSimilarProfilesById(profileId: string, limit: number = 5): Promise<SearchResult[]> {
        const cacheKey = `similar_${profileId}_${limit}`;
        try {
            // Check cache first
            const cached = await this.cache.get(cacheKey);
            if (cached) {
                return cached as SearchResult[];
            }

            // Get the source profile
            const sourceProfile = await this.getProfile(profileId);
            if (!sourceProfile) {
                throw new AIError(
                    AI_ERROR_CODES.PROFILE_NOT_FOUND.code,
                    'Source profile not found'
                );
            }

            // Search for similar profiles
            const results = await this.vectorStore.similaritySearch(
                JSON.stringify(sourceProfile),
                limit + 1 // Add 1 to account for the source profile
            );

            // Filter out the source profile and map results
            const searchResults: SearchResult[] = results
                .filter(doc => JSON.parse(doc.pageContent).id !== profileId)
                .map(doc => ({
                    profile: JSON.parse(doc.pageContent),
                    score: doc.metadata.score || 0
                }));

            // Cache results
            await this.cache.set(cacheKey, searchResults, 3600);

            return searchResults;
        } catch (error) {
            if (error instanceof AIError) {
                throw error;
            }
            throw new AIError(
                AI_ERROR_CODES.SEARCH_FAILED.code,
                'Failed to find similar profiles'
            );
        }
    }

    private async getProfile(profileId: string): Promise<PetProfile | null> {
        try {
            const results = await this.vectorStore.similaritySearch(
                `id:${profileId}`,
                1
            );

            if (results.length === 0) {
                return null;
            }

            return JSON.parse(results[0].pageContent);
        } catch (error) {
            throw new AIError(
                AI_ERROR_CODES.DATABASE_ERROR.code,
                'Failed to retrieve profile'
            );
        }
    }

    /**
     * Find matching traits between profiles
     */
    private findMatchingTraits(profile: PetProfile): string[] {
        const traits: string[] = [];

        // Compare personality traits
        if (profile.personality && profile.personality.length > 0) {
            traits.push(`Similar personality: ${profile.personality.join(', ')}`);
        }

        // Compare behavior traits
        if (profile.behavior?.traits && profile.behavior.traits.length > 0) {
            traits.push(`Similar behavior: ${profile.behavior.traits.join(', ')}`);
        }

        return traits;
    }
}
