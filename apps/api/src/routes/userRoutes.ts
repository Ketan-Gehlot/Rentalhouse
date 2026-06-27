import { Router } from 'express';
import { getProfile, uploadKyc, updateRole, requestSuperTrusted, approveSuperTrusted } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Protect all routes below with JWT middleware
router.use(authenticateJWT);

router.get('/profile', getProfile);
router.post('/kyc', uploadKyc);
router.post('/super-trusted/request', requestSuperTrusted);
router.post('/super-trusted/approve/:userId', approveSuperTrusted);
router.patch('/role', updateRole);

export default router;
