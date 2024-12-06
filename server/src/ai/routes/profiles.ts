import { Router } from 'express';
import { ProfileManager } from '../profiles/manager';
import { PetProfile } from '../profiles/types';
import { createAIError } from '../utils/ErrorHandler';

const router = Router();

export const initProfileRoutes = (profileManager: ProfileManager) => {
    // Add a new pet profile
    router.post('/', async (req, res, next) => {
        try {
            const profile: PetProfile = req.body;
            await profileManager.addProfile(profile);
            res.status(201).json({ message: 'Profile added successfully', id: profile.id });
        } catch (error) {
            next(createAIError('PROFILE_ADD_ERROR', error.message));
        }
    });

    // Find similar profiles
    router.get('/similar/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const { limit } = req.query;
            const results = await profileManager.findSimilarProfiles(
                id,
                limit ? parseInt(limit as string) : 5
            );
            res.json(results);
        } catch (error) {
            next(createAIError('PROFILE_SEARCH_ERROR', error.message));
        }
    });

    // Update a profile
    router.put('/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const profile: PetProfile = { ...req.body, id };
            await profileManager.updateProfile(profile);
            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            next(createAIError('PROFILE_UPDATE_ERROR', error.message));
        }
    });

    // Delete a profile
    router.delete('/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            await profileManager.deleteProfile(id);
            res.json({ message: 'Profile deleted successfully' });
        } catch (error) {
            next(createAIError('PROFILE_DELETE_ERROR', error.message));
        }
    });

    return router;
};

export const profileRoutes = router;
