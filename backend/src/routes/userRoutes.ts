import { Router } from 'express';
import { getProfile, updateProfile, updatePassword, deleteAccount } from '../controllers/userController';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);
router.delete('/account', authMiddleware, deleteAccount);

export default router;