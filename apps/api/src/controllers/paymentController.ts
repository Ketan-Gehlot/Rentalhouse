import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const prisma = new PrismaClient();

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are missing from environment variables');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// POST /api/payments/create-listing-order
export const createListingOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ error: 'Property ID is required' });

    // Verify property belongs to user
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.ownerId !== userId) {
      return res.status(403).json({ error: 'Property not found or unauthorized' });
    }

    if (property.paymentStatus === 'PAID') {
      return res.status(400).json({ error: 'Listing fee already paid for this property' });
    }

    const amount = 499; // ₹499 listing fee

    const razorpay = getRazorpayInstance();

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_prop_${propertyId}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Create a pending payment record
    await prisma.payment.create({
      data: {
        userId,
        propertyId,
        amount,
        razorpayOrderId: order.id,
        status: 'PENDING'
      }
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment order' });
  }
};

// POST /api/payments/verify
export const verifyListingPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay secret missing');
    }

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Find the payment
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    // Update payment and property
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          status: 'SUCCESS'
        }
      }),
      prisma.property.update({
        where: { id: payment.propertyId! },
        data: {
          paymentStatus: 'PAID',
          status: 'ACTIVE'
        }
      })
    ]);

    res.json({ message: 'Payment verified and property activated successfully!' });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ error: error.message || 'Failed to verify payment' });
  }
};
