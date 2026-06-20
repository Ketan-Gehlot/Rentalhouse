import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
        verification: true,
      },
    });

    if (!user) {
      // Auto-create user in local DB when they first visit profile
      // The name/email will come from the frontend via Clerk's useUser()
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId.substring(0, 8)}@clerk.dev`,
          name: 'RentMate User',
          password: 'clerk-managed',
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          createdAt: true,
          verification: true,
        },
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadKyc = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Mocking the Firebase upload by just accepting the request and creating a Verification record
    // In a real implementation, we would receive files via multer, upload to Firebase Storage, and save the URLs

    const existingVerification = await prisma.verification.findUnique({
      where: { userId },
    });

    if (existingVerification) {
      // Update existing
      const updated = await prisma.verification.update({
        where: { userId },
        data: {
          status: 'PENDING',
          aadhaarUrl: 'mock-firebase-url/aadhaar.pdf',
          panUrl: 'mock-firebase-url/pan.pdf',
        },
      });
      return res.json({ message: 'KYC documents submitted for review', verification: updated });
    }

    // Create new
    const verification = await prisma.verification.create({
      data: {
        userId,
        status: 'PENDING',
        aadhaarUrl: 'mock-firebase-url/aadhaar.pdf',
        panUrl: 'mock-firebase-url/pan.pdf',
      },
    });

    res.json({ message: 'KYC documents submitted for review', verification });
  } catch (error) {
    console.error('Error uploading KYC:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
