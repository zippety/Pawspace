import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { HuggingFaceInference } from '@langchain/community/llms/hf';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';

export const AI_CONFIG = {
    embeddings: {
        primary: {
            apiKey: process.env.HUGGINGFACE_API_KEY,
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            maxRetries: 3,
            rateLimit: {
                requests: 60,
                windowMs: 60000 // 1 minute
            }
        },
        fallback: {
            apiKey: process.env.HUGGINGFACE_FALLBACK_API_KEY,
            model: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
            maxRetries: 3,
            rateLimit: {
                requests: 60,
                windowMs: 60000
            }
        }
    },
    cache: {
        ttl: 3600000, // 1 hour
        checkPeriod: 600000 // 10 minutes
    },
    monitoring: {
        enabled: true,
        metricsInterval: 300000 // 5 minutes
    }
};

export class AIService {
    private pinecone: Pinecone;
    private embeddings: HuggingFaceTransformersEmbeddings;
    private llm: HuggingFaceInference;
    private vectorStore: PineconeStore;

    constructor() {
        this.pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!
        });

        this.embeddings = new HuggingFaceTransformersEmbeddings({
            modelName: AI_CONFIG.embeddings.primary.model
        });

        this.llm = new HuggingFaceInference({
            model: process.env.HF_MODEL || 'gpt2',
            apiKey: process.env.HUGGINGFACE_API_KEY
        });
    }

    async initialize() {
        try {
            const indexName = process.env.PINECONE_INDEX || 'pawspace';
            const indexList = await this.pinecone.listIndexes();

            if (!indexList.includes(indexName)) {
                await this.pinecone.createIndex({
                    name: indexName,
                    dimension: 384,
                    metric: 'cosine',
                    spec: {
                        serverless: {
                            cloud: 'aws',
                            region: process.env.PINECONE_REGION || 'us-east-1'
                        }
                    }
                });
            }

            const index = this.pinecone.index(indexName);
            this.vectorStore = await PineconeStore.fromExistingIndex(
                this.embeddings,
                { pineconeIndex: index }
            );

            return {
                llm: this.llm,
                embeddings: this.embeddings,
                vectorStore: this.vectorStore
            };
        } catch (error) {
            console.error('Failed to initialize AI components:', error);
            throw new Error('AI initialization failed');
        }
    }

    getLLM() {
        return this.llm;
    }

    getEmbeddings() {
        return this.embeddings;
    }

    getVectorStore() {
        return this.vectorStore;
    }
}
