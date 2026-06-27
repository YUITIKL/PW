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
} from '../controllers/dashboardController';
import authMiddleware from '../middlewares/auth';

const router = Router();

// Rotas de usuário comum
router.get('/', authMiddleware, getDashboards);
router.get('/mine', authMiddleware, getMyDashboards);
router.get('/shared', authMiddleware, getSharedWithMe);
router.post('/:id/share', authMiddleware, shareDashboard);
router.delete('/:id/share', authMiddleware, unshareDashboard);

// Rotas admin
router.post('/', authMiddleware, createDashboard);
router.put('/:id', authMiddleware, updateDashboard);
router.delete('/:id', authMiddleware, deleteDashboard);

export default router;