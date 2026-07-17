import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  createProperty,
  getProperties,
  getMyListings,
  getPropertyById,
  updateProperty,
  toggleSaveProperty,
  contactOwner,
} from '../controllers/propertyController';

const router = Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Authenticated routes
router.use(authenticateJWT);

router.post('/', createProperty);
router.get('/user/my-listings', getMyListings);
router.put('/:id', updateProperty);
router.post('/:id/save', toggleSaveProperty);
router.post('/:id/contact', contactOwner);

export default router;
