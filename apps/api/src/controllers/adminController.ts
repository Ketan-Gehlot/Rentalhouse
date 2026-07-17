import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// GET /api/admin/users
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        verification: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/admin/users/:id/super-trusted
export const approveSuperTrusted = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.superTrustedStatus !== 'PENDING') {
      return res.status(400).json({ error: 'User has not requested Super Trusted status or is already approved' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isSuperTrusted: true,
        superTrustedStatus: 'APPROVED'
      }
    });

    res.json({ message: 'User granted Super Trusted status successfully', user: updatedUser });
  } catch (error) {
    console.error('Error approving super trusted:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/admin/properties
export const getAllProperties = async (req: AuthRequest, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        media: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/admin/properties/:id
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = req.params.id as string;
    
    // Check if it exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await prisma.property.delete({
      where: { id: propertyId }
    });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
