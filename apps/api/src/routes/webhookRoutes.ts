import { Router } from 'express';
import { clerkWebhook } from '../controllers/webhookController';
import express from 'express';

const router = Router();

// Clerk webhook requires raw body for verification
router.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

export default router;
