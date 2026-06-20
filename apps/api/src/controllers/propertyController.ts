import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// POST /api/properties
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const {
      title,
      description,
      propertyType,
      bhkType,
      rent,
      deposit,
      maintenance,
      address,
      city,
      state,
      pincode,
      lat,
      lng,
      availableFrom,
      tenantPreference,
      furnishing,
      amenities, // Array of strings
      media, // Array of strings (Firebase URLs)
    } = req.body;

    const property = await prisma.property.create({
      data: {
        ownerId: userId,
        title,
        description,
        propertyType,
        bhkType,
        rent: parseFloat(rent),
        deposit: parseFloat(deposit),
        maintenance: maintenance ? parseFloat(maintenance) : 0,
        address,
        city,
        state,
        pincode,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        availableFrom: new Date(availableFrom),
        tenantPreference,
        furnishing,
        amenities: {
          create: amenities?.map((name: string) => ({ amenityName: name })) || [],
        },
        media: {
          create: media?.map((url: string) => ({ url, type: 'IMAGE' })) || [],
        },
      },
      include: {
        amenities: true,
        media: true,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/properties
export const getProperties = async (req: AuthRequest, res: Response) => {
  try {
    const { city, propertyType, minRent, maxRent } = req.query;

    const filter: any = { status: 'ACTIVE' };
    
    if (city) filter.city = { contains: city as string };
    if (propertyType) filter.propertyType = propertyType as string;
    
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.gte = parseFloat(minRent as string);
      if (maxRent) filter.rent.lte = parseFloat(maxRent as string);
    }

    const properties = await prisma.property.findMany({
      where: filter,
      include: {
        media: true,
        amenities: true,
        owner: {
          select: { name: true, verification: { select: { status: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/properties/my-listings
export const getMyListings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const properties = await prisma.property.findMany({
      where: { ownerId: userId },
      include: {
        media: true,
        amenities: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(properties);
  } catch (error) {
    console.error('Error fetching user properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/properties/:id
export const getPropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        media: true,
        amenities: true,
        owner: {
          select: { 
            id: true,
            name: true, 
            createdAt: true,
            verification: { select: { status: true } } 
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
