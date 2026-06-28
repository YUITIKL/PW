import { Router } from 'express';
import { getProfile, getAllUsers, updateProfile, updatePassword, deleteAccount } from '../controllers/userController';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.get('/users', authMiddleware, getAllUsers);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);
router.delete('/account', authMiddleware, deleteAccount);

export default router;