import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  createProperty,
  getProperties,
  getMyListings,
  getPropertyById,
  updateProperty,
} from '../controllers/propertyController';

const router = Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.post('/', authenticateJWT, createProperty);
router.get('/user/my-listings', authenticateJWT, getMyListings);
router.put('/:id', authenticateJWT, updateProperty);

export default router;
