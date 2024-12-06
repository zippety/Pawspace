import { Router } from 'express';
import { AIService } from '../ai/config';
import { ProfileManager } from '../ai/profiles/manager';
import { AIServiceError, AI_ERROR_CODES } from '../ai/errors';
import { PetProfile } from '../ai/profiles/types';
import rateLimit from 'express-rate-limit';
import cache from 'memory-cache';

const router = Router();

// Rate limiting for AI endpoints
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

router.use(aiLimiter);

// Caching middleware
const cacheMiddleware = (duration: number) => {
    return (req: any, res: any, next: any) => {
        const key = '__express__' + req.originalUrl || req.url;
        const cachedBody = cache.get(key);
        
        if (cachedBody) {
            res.send(cachedBody);
            return;
        }
        
        res.sendResponse = res.send;
        res.send = (body: any) => {
            cache.put(key, body, duration * 1000);
            res.sendResponse(body);
        };
        next();
    };
};

// Initialize AI service and profile manager
let profileManager: ProfileManager;

const initializeAI = async () => {
    try {
        const aiService = new AIService();
        const { embeddings, vectorStore } = await aiService.initialize();
        profileManager = new ProfileManager(vectorStore, embeddings);
    } catch (error) {
        console.error('Failed to initialize AI service:', error);
        throw new AIServiceError(
            'Failed to initialize AI service',
            AI_ERROR_CODES.INITIALIZATION_FAILED,
            error
        );
    }
};

// Initialize on startup
initializeAI().catch(console.error);

// Add a pet profile
router.post('/profiles', async (req, res, next) => {
    try {
        const profile = await profileManager.addProfile(req.body);
        res.json(profile);
    } catch (error) {
        next(new AIServiceError(
            'Failed to create profile',
            AI_ERROR_CODES.PROFILE_CREATE_FAILED,
            error
        ));
    }
});

// Update a pet profile
router.put('/profiles/:id', async (req, res, next) => {
    try {
        const profile = await profileManager.updateProfile(req.params.id, req.body);
        res.json(profile);
    } catch (error) {
        next(new AIServiceError(
            'Failed to update profile',
            AI_ERROR_CODES.PROFILE_UPDATE_FAILED,
            error
        ));
    }
});

// Delete a pet profile
router.delete('/profiles/:id', async (req, res, next) => {
    try {
        await profileManager.deleteProfile(req.params.id);
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        next(new AIServiceError(
            'Failed to delete profile',
            AI_ERROR_CODES.PROFILE_DELETE_FAILED,
            error
        ));
    }
});

// Search for similar profiles
router.get('/profiles/search', cacheMiddleware(300), async (req, res, next) => {
    try {
        const { query, limit } = req.query;
        if (!query) {
            throw new AIServiceError(
                'Search query is required',
                AI_ERROR_CODES.INVALID_INPUT
            );
        }

        const results = await profileManager.findSimilarProfiles(
            query as string,
            limit ? parseInt(limit as string) : undefined
        );
        res.json(results);
    } catch (error) {
        next(new AIServiceError(
            'Failed to search profiles',
            AI_ERROR_CODES.SEARCH_FAILED,
            error
        ));
    }
});

export default router;
