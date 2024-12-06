import { PineconeStore } from '@langchain/pinecone';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { jest } from '@jest/globals';

// Create mock instances with Jest mock functions
export const mockVectorStore = {
    addDocuments: jest.fn(),
    similaritySearch: jest.fn(),
    delete: jest.fn(),
} as unknown as jest.Mocked<PineconeStore>;

export const mockEmbeddings = {
    embedQuery: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
    embedDocuments: jest.fn().mockResolvedValue([[0.1, 0.2, 0.3]]),
} as unknown as jest.Mocked<HuggingFaceTransformersEmbeddings>;
