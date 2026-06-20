import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  createProperty,
  getProperties,
  getMyListings,
  getPropertyById,
} from '../controllers/propertyController';

const router = Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.post('/', authenticateJWT, createProperty);
router.get('/user/my-listings', authenticateJWT, getMyListings);

export default router;
