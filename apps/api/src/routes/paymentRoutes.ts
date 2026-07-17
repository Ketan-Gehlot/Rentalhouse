import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { createListingOrder, verifyListingPayment } from '../controllers/paymentController';

const router = Router();

// Protect all payment routes
router.use(authenticateJWT);

router.post('/create-listing-order', createListingOrder);
router.post('/verify', verifyListingPayment);

export default router;
