import { Router } from 'express';
import { profileRoutes } from './profiles';
import { spaceRoutes } from './spaces';
import { monitoringRoutes } from './monitoring';

const router = Router();

// Mount sub-routers
router.use('/profiles', profileRoutes);
router.use('/spaces', spaceRoutes);
router.use('/monitoring', monitoringRoutes);

export default router;
