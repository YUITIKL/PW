import { Router } from 'express';
import { getStates, getCities } from '../controllers/locationsController';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/states', getStates);
router.get('/cities/:uf', getCities);

export default router;