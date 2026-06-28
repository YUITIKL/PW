import { Router } from 'express';
import {
    getDashboards,
    getMyDashboards,
    getSharedWithMe,
    shareDashboard,
    unshareDashboard,
    deleteDashboard,
    createDashboard,
    updateDashboard,
    favoriteDashboard,
    unfavoriteDashboard,
    getDashboardShares,
    getSavedDashboards
} from '../controllers/dashboardController';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/', authMiddleware, getDashboards);
router.get('/mine', authMiddleware, getMyDashboards);
router.get('/shared', authMiddleware, getSharedWithMe);
router.get('/saved', authMiddleware, getSavedDashboards);

router.post('/:id/share', authMiddleware, shareDashboard);
router.delete('/:id/share', authMiddleware, unshareDashboard);
router.post('/:id/favorite', authMiddleware, favoriteDashboard);
router.delete('/:id/favorite', authMiddleware, unfavoriteDashboard);
router.get('/:id/shares', authMiddleware, getDashboardShares);

router.post('/', authMiddleware, createDashboard);
router.put('/:id', authMiddleware, updateDashboard);
router.delete('/:id', authMiddleware, deleteDashboard);

export default router;