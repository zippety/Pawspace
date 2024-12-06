import { ProfileManager } from '../manager';
import { mockVectorStore, mockEmbeddings } from './mocks';
import { validProfile } from './testData';
import { AIError } from '../../utils/ErrorHandler';
import { AI_ERROR_CODES } from '../../utils/constants';
import { jest } from '@jest/globals';
import { Document } from '@langchain/core/documents';

describe('ProfileManager', () => {
    let profileManager: ProfileManager;

    beforeEach(() => {
        jest.clearAllMocks();
        profileManager = new ProfileManager(mockVectorStore, mockEmbeddings);
    });

    describe('addProfile', () => {
        it('should successfully add a valid profile', async () => {
            mockVectorStore.addDocuments.mockResolvedValueOnce([]);
            const result = await profileManager.addProfile(validProfile);
            
            expect(result).toMatchObject({
                ...validProfile,
                id: expect.any(String),
                embedding: expect.any(Array),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
        });

        it('should reject an invalid profile', async () => {
            const invalidData = {
                ...validProfile,
                type: 'invalid' // Invalid pet type
            };

            await expect(profileManager.addProfile(invalidData as any))
                .rejects
                .toThrow(AIError);
        });
    });

    describe('Error Handling', () => {
        it('should handle rate limit errors properly', async () => {
            mockVectorStore.addDocuments.mockRejectedValueOnce(
                new AIError(AI_ERROR_CODES.RATE_LIMIT_EXCEEDED.code, 'Rate limit exceeded', 60)
            );

            await expect(profileManager.addProfile(validProfile))
                .rejects
                .toMatchObject({
                    code: AI_ERROR_CODES.RATE_LIMIT_EXCEEDED.code,
                    severity: AI_ERROR_CODES.RATE_LIMIT_EXCEEDED.severity
                });
        });

        it('should handle validation errors with proper error codes', async () => {
            const invalidData = {
                ...validProfile,
                personality: null // Invalid personality data
            };

            await expect(profileManager.addProfile(invalidData as any))
                .rejects
                .toMatchObject({
                    code: AI_ERROR_CODES.VALIDATION_ERROR.code,
                    severity: AI_ERROR_CODES.VALIDATION_ERROR.severity
                });
        });

        it('should handle database errors properly', async () => {
            mockVectorStore.addDocuments.mockRejectedValueOnce(
                new Error('Database connection failed')
            );

            await expect(profileManager.addProfile(validProfile))
                .rejects
                .toMatchObject({
                    code: AI_ERROR_CODES.DATABASE_ERROR.code,
                    severity: AI_ERROR_CODES.DATABASE_ERROR.severity
                });
        });
    });

    describe('Error Handling and Edge Cases', () => {
        it('should handle vector store failures gracefully', async () => {
            mockVectorStore.addDocuments.mockRejectedValueOnce(
                new Error('Vector store connection failed')
            );

            await expect(profileManager.addProfile(validProfile))
                .rejects
                .toMatchObject({
                    code: AI_ERROR_CODES.VECTOR_STORE_ERROR.code
                });
        });

        it('should handle embedding generation failures', async () => {
            mockEmbeddings.embedQuery.mockRejectedValueOnce(
                new Error('Embedding generation failed')
            );

            await expect(profileManager.addProfile(validProfile))
                .rejects
                .toMatchObject({
                    code: AI_ERROR_CODES.EMBEDDING_ERROR.code
                });
        });

        it('should handle cache retrieval failures', async () => {
            const searchQuery = 'friendly dog';
            mockVectorStore.similaritySearch.mockRejectedValueOnce(
                new Error('Search failed')
            );

            await expect(profileManager.findSimilarProfiles(searchQuery))
                .rejects
                .toMatchObject({
                    code: AI_ERROR_CODES.SEARCH_ERROR.code
                });
        });

        it('should respect rate limits for profile searches', async () => {
            const searchQuery = 'friendly dog';
            // Simulate multiple rapid searches
            await profileManager.findSimilarProfiles(searchQuery);
            await profileManager.findSimilarProfiles(searchQuery);
            await profileManager.findSimilarProfiles(searchQuery);

            await expect(profileManager.findSimilarProfiles(searchQuery))
                .rejects
                .toMatchObject({
                    code: AI_ERROR_CODES.RATE_LIMIT_EXCEEDED.code
                });
        });

        it('should handle concurrent profile additions correctly', async () => {
            const profiles = [
                { ...validProfile, name: 'Dog1' },
                { ...validProfile, name: 'Dog2' },
                { ...validProfile, name: 'Dog3' }
            ];

            const results = await Promise.all(
                profiles.map(profile => profileManager.addProfile(profile))
            );

            expect(results).toHaveLength(3);
            expect(results.map(r => r.name)).toEqual(['Dog1', 'Dog2', 'Dog3']);
        });

        it('should handle malformed profile data gracefully', async () => {
            const malformedProfile = {
                ...validProfile,
                personality: null,
                medicalHistory: undefined
            };

            await expect(profileManager.addProfile(malformedProfile as any))
                .rejects
                .toMatchObject({
                    code: AI_ERROR_CODES.VALIDATION_ERROR.code
                });
        });
    });

    describe('Cache Management', () => {
        const mockProfile = {
            ...validProfile,
            id: 'test-id-1',
            embedding: [0.1, 0.2, 0.3],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const createMockDocument = (profile: any) => new Document({
            metadata: profile,
            pageContent: JSON.stringify(profile)
        });

        beforeEach(() => {
            mockVectorStore.similaritySearch.mockResolvedValue([
                createMockDocument(mockProfile)
            ]);
        });

        it('should cache profile search results', async () => {
            // First search
            const result1 = await profileManager.findSimilarProfiles('test-id-1');
            
            // Mock different results for second search
            mockVectorStore.similaritySearch.mockResolvedValueOnce([
                createMockDocument({ ...mockProfile, id: 'different-id' })
            ]);
            
            // Second search within cache time
            const result2 = await profileManager.findSimilarProfiles('test-id-1');
            
            // Results should be the same due to caching
            expect(result1).toEqual(result2);
            expect(mockVectorStore.similaritySearch).toHaveBeenCalledTimes(1);
        });

        it('should respect cache TTL', async () => {
            // First search
            const result1 = await profileManager.findSimilarProfiles('test-id-1');
            
            // Fast-forward time past cache TTL
            jest.advanceTimersByTime(60 * 60 * 1000); // 1 hour
            
            // Mock different results
            mockVectorStore.similaritySearch.mockResolvedValueOnce([
                createMockDocument({ ...mockProfile, id: 'new-id' })
            ]);
            
            // Second search after cache expiry
            const result2 = await profileManager.findSimilarProfiles('test-id-1');
            
            // Results should be different as cache expired
            expect(result1).not.toEqual(result2);
            expect(mockVectorStore.similaritySearch).toHaveBeenCalledTimes(2);
        });
    });
});
