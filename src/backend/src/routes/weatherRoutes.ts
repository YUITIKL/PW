import { Router } from 'express';
import { getFilteredMeasurements } from '../controllers/measurementController';

const router = Router();

router.get('/', getFilteredMeasurements);

export default router;