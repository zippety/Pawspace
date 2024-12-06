import { PineconeStore } from '@langchain/pinecone';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { Space, SpaceMatchingResult } from './types';
import { PetProfile } from '../profiles/types';
import { AIErrorHandler } from '../utils/ErrorHandler';
import { createAIError } from '../utils/ErrorHandler';

export class SpaceManager {
    private errorHandler: AIErrorHandler;
    private readonly AGENT_ID = 'space_manager';

    constructor(
        private vectorStore: PineconeStore,
        private embeddings: HuggingFaceTransformersEmbeddings
    ) {
        this.errorHandler = new AIErrorHandler();
        this.errorHandler.registerAgent(this.AGENT_ID);
    }

    private formatSpaceText(space: Space): string {
        return `Space Details:
            ID: ${space.id}
            Name: ${space.name}
            Type: ${space.type}
            Size: ${space.size.width}x${space.size.length}${space.size.height ? 'x' + space.size.height : ''}
            Features: ${space.features.join(', ')}
            Capacity: ${space.capacity}
            Restrictions: ${space.restrictions?.join(', ') || 'None'}
            Amenities: ${space.amenities.join(', ')}
            Environment: 
                Temperature: ${space.environment.temperature ? `${space.environment.temperature.min}-${space.environment.temperature.max}°` : 'Not specified'}
                Lighting: ${space.environment.lighting || 'Not specified'}
                Noise Level: ${space.environment.noise || 'Not specified'}`;
    }

    /**
     * Add a new space to the vector store
     */
    async addSpace(space: Space): Promise<void> {
        try {
            const spaceText = this.formatSpaceText(space);
            const embedding = await this.embeddings.embedQuery(spaceText);
            
            await this.vectorStore.addDocuments([{
                pageContent: spaceText,
                metadata: { 
                    type: 'space',
                    id: space.id,
                    ...space 
                }
            }]);

            this.errorHandler.monitor.recordOperation(this.AGENT_ID, 0, true);
        } catch (error) {
            throw createAIError('SPACE_ADD_ERROR', `Failed to add space: ${error.message}`);
        }
    }

    /**
     * Find matching spaces for a pet profile
     */
    async findMatchingSpaces(profile: PetProfile, limit: number = 5): Promise<SpaceMatchingResult[]> {
        const startTime = Date.now();
        try {
            // Create a query combining pet's needs and characteristics
            const query = `Find a space suitable for:
                ${profile.type} named ${profile.name}
                Breed: ${profile.breed}
                Age: ${profile.age}
                Personality: ${profile.personality}
                Special Requirements: ${profile.requirements}`;

            const results = await this.vectorStore.similaritySearch(query, limit, {
                filter: { type: 'space' }
            });

            const matchingResults: SpaceMatchingResult[] = results.map(result => {
                const space = result.metadata as Space;
                const matchingFeatures = this.analyzeMatchingFeatures(space, profile);
                const considerations = this.generateConsiderations(space, profile);

                return {
                    spaceId: space.id,
                    score: result.score || 0,
                    matchingFeatures,
                    considerations
                };
            });

            this.errorHandler.monitor.recordOperation(
                this.AGENT_ID,
                Date.now() - startTime,
                true
            );

            return matchingResults;
        } catch (error) {
            this.errorHandler.monitor.recordOperation(
                this.AGENT_ID,
                Date.now() - startTime,
                false,
                error
            );
            throw createAIError('SPACE_MATCH_ERROR', `Failed to find matching spaces: ${error.message}`);
        }
    }

    /**
     * Analyze which features of a space match a pet's needs
     */
    private analyzeMatchingFeatures(space: Space, profile: PetProfile): string[] {
        const matchingFeatures: string[] = [];

        // Size considerations
        if (profile.type === 'dog' && space.size.width * space.size.length >= 100) {
            matchingFeatures.push('Adequate space for dog activities');
        }

        // Environment matching
        if (profile.requirements?.includes('quiet') && space.environment.noise === 'quiet') {
            matchingFeatures.push('Quiet environment');
        }

        // Feature matching
        space.features.forEach(feature => {
            if (profile.requirements?.includes(feature.toLowerCase())) {
                matchingFeatures.push(`Has required feature: ${feature}`);
            }
        });

        return matchingFeatures;
    }

    /**
     * Generate considerations for a space-pet match
     */
    private generateConsiderations(space: Space, profile: PetProfile): string[] {
        const considerations: string[] = [];

        // Temperature considerations
        if (space.environment.temperature) {
            if (profile.type === 'dog' && space.environment.temperature.max > 85) {
                considerations.push('Space may get too warm for extended dog activities');
            }
        }

        // Space restrictions
        if (space.restrictions?.length > 0) {
            considerations.push(`Space has restrictions: ${space.restrictions.join(', ')}`);
        }

        // Capacity considerations
        if (space.capacity < 2) {
            considerations.push('Limited capacity space - best for individual pet activities');
        }

        return considerations;
    }

    /**
     * Get monitoring metrics for the space management system
     */
    async getMetrics() {
        return this.errorHandler.getAgentMetrics(this.AGENT_ID);
    }
}
