import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendAdminMeetingRequestEmail, sendUserApprovalEmail } from '../utils/emailService';

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
        isSuperTrusted: true,
        superTrustedStatus: true,
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
          email: `${userId}@clerk.dev`,
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
          isSuperTrusted: true,
          superTrustedStatus: true,
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

export const syncUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { email, name } = req.body;
    
    // Default values if frontend doesn't send them
    const safeEmail = email || `${userId}@clerk.dev`;
    const safeName = name || 'RentMate User';

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: safeEmail,
        name: safeName
      },
      create: {
        id: userId,
        email: safeEmail,
        name: safeName,
        password: 'clerk-managed'
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadKyc = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { faceUrl, fullName } = req.body;

    if (!faceUrl) {
      return res.status(400).json({ error: 'faceUrl is required' });
    }

    if (fullName) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: fullName }
      });
    }

    const existingVerification = await prisma.verification.findUnique({
      where: { userId },
    });

    if (existingVerification) {
      const updated = await prisma.verification.update({
        where: { userId },
        data: {
          status: 'PENDING',
          faceUrl,
        } as any,
      });
      return res.json({ message: 'Face verification submitted for review', verification: updated });
    }

    const verification = await prisma.verification.create({
      data: {
        userId,
        status: 'PENDING',
        faceUrl,
      } as any,
    });

    res.json({ message: 'Face verification submitted for review', verification });
  } catch (error) {
    console.error('Error uploading face verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const requestSuperTrusted = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId as string;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        superTrustedStatus: 'PENDING'
      } as any,
      select: { name: true, email: true }
    });

    // Send email to admin
    await sendAdminMeetingRequestEmail(user.name, user.email, userId);

    res.json({ message: 'Super Trusted meeting requested successfully', user });
  } catch (error) {
    console.error('Error requesting super trusted:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const approveSuperTrusted = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId as string;
    
    // In a real app, you would verify the requester is actually an ADMIN
    // const adminId = req.auth?.userId;
    // const admin = await prisma.user.findUnique({ where: { id: adminId } });
    // if (admin?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isSuperTrusted: true,
        superTrustedStatus: 'APPROVED'
      } as any,
      select: { name: true, email: true }
    });

    // Send congratulatory email to user
    await sendUserApprovalEmail(user.name, user.email);

    res.json({ message: 'User approved for Super Trusted badge', user });
  } catch (error) {
    console.error('Error approving super trusted:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateRole = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { role } = req.body;
    
    if (!role || (role !== 'TENANT' && role !== 'OWNER')) {
      return res.status(400).json({ error: 'Invalid role. Must be TENANT or OWNER' });
    }

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { role },
      create: {
        id: userId,
        email: `${userId}@clerk.dev`,
        name: 'RentMate User',
        password: 'clerk-managed',
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSavedProperties = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const saved = await prisma.savedProperty.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            media: true,
            amenities: true,
            owner: {
              select: { name: true, isSuperTrusted: true, verification: { select: { status: true } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(saved);
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
