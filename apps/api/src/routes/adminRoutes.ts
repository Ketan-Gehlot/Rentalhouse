import { Router } from 'express';
import { authenticateJWT, isAdmin } from '../middlewares/authMiddleware';
import {
  getAllUsers,
  approveSuperTrusted,
  getAllProperties,
  deleteProperty
} from '../controllers/adminController';

const router = Router();

// Protect all admin routes
router.use(authenticateJWT);
router.use(isAdmin);

router.get('/users', getAllUsers);
router.patch('/users/:id/super-trusted', approveSuperTrusted);
router.get('/properties', getAllProperties);
router.delete('/properties/:id', deleteProperty);

export default router;
