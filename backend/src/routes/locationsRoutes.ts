import { Router } from 'express';
import { getCities, getStates } from '../controllers/locationsController';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/states', authMiddleware, getStates);
router.get('/cities/:uf', authMiddleware, getCities);

export default router;
