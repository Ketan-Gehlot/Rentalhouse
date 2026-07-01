import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  requestVisit,
  getPropertyVisitRequests,
  getOwnerVisitRequests,
  getTenantVisitRequests,
  updateVisitStatus
} from '../controllers/visitController';

const router = Router();

// All visit routes require authentication
router.use(authenticateJWT);

// Tenant routes
router.post('/', requestVisit);
router.get('/tenant', getTenantVisitRequests);

// Owner routes
router.get('/owner/all', getOwnerVisitRequests);
router.get('/property/:propertyId', getPropertyVisitRequests);
router.patch('/:id/status', updateVisitStatus);

export default router;
