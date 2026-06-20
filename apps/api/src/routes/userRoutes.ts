import { Router } from 'express';
import { getProfile, uploadKyc } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Protect all routes below with JWT middleware
router.use(authenticateJWT);

router.get('/profile', getProfile);
router.post('/kyc', uploadKyc);

export default router;
