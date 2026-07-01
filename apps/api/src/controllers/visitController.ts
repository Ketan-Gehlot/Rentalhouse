import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// POST /api/visits
export const requestVisit = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.auth?.userId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const { propertyId, date, time } = req.body;

    if (!propertyId || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if the tenant is trying to request a visit on their own property
    if (property.ownerId === tenantId) {
      return res.status(400).json({ error: 'Cannot request a visit on your own property' });
    }

    // Check for existing pending/accepted request for this property by this tenant
    const existingRequest = await prisma.visitRequest.findFirst({
      where: {
        propertyId,
        tenantId,
        status: { in: ['PENDING', 'ACCEPTED'] }
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have an active visit request for this property' });
    }

    const visit = await prisma.visitRequest.create({
      data: {
        tenantId,
        propertyId,
        date: new Date(date),
        time
      }
    });

    res.status(201).json(visit);
  } catch (error) {
    console.error('Error requesting visit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/visits/property/:propertyId
export const getPropertyVisitRequests = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.auth?.userId;
    if (!ownerId) return res.status(401).json({ error: 'Unauthorized' });

    const propertyId = req.params.propertyId as string;

    // Verify ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || property.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const visits = await prisma.visitRequest.findMany({
      where: { propertyId },
      include: {
        tenant: {
          select: { name: true, email: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(visits);
  } catch (error) {
    console.error('Error fetching property visits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/visits/owner/all
export const getOwnerVisitRequests = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.auth?.userId;
    if (!ownerId) return res.status(401).json({ error: 'Unauthorized' });

    const visits = await prisma.visitRequest.findMany({
      where: {
        property: { ownerId }
      },
      include: {
        tenant: {
          select: { name: true, email: true, phone: true }
        },
        property: {
          select: { title: true, city: true, media: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(visits);
  } catch (error) {
    console.error('Error fetching owner visits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/visits/tenant
export const getTenantVisitRequests = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.auth?.userId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const visits = await prisma.visitRequest.findMany({
      where: { tenantId },
      include: {
        property: {
          select: { title: true, city: true, owner: { select: { name: true, phone: true } }, media: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(visits);
  } catch (error) {
    console.error('Error fetching tenant visits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/visits/:id/status
export const updateVisitStatus = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.auth?.userId;
    if (!ownerId) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;
    const { status } = req.body;

    if (!['ACCEPTED', 'REJECTED', 'RESCHEDULED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const visit = await prisma.visitRequest.findUnique({
      where: { id },
      include: { property: true }
    });

    if (!visit) {
      return res.status(404).json({ error: 'Visit request not found' });
    }

    if ((visit as any).property.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedVisit = await prisma.visitRequest.update({
      where: { id },
      data: { status }
    });

    res.json(updatedVisit);
  } catch (error) {
    console.error('Error updating visit status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
