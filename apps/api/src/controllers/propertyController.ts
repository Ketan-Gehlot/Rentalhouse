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
      listingType,
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
        status: 'DRAFT',
        listingType: listingType || 'RENT',
        rent: rent ? parseFloat(rent) : 0,
        deposit: deposit ? parseFloat(deposit) : 0,
        maintenance: maintenance ? parseFloat(maintenance) : 0,
        address,
        city,
        state: state || "",
        pincode,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
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
    const { city, propertyType, minRent, maxRent, listingType } = req.query;

    const filter: any = { status: 'ACTIVE' };
    
    if (city) filter.city = { contains: city as string };
    if (propertyType) filter.propertyType = propertyType as string;
    if (listingType) filter.listingType = listingType as string;
    
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
          select: { name: true, isSuperTrusted: true, verification: { select: { status: true } } }
        },
        savedBy: {
          select: { userId: true }
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
      where: { id: id as string },
      include: {
        media: true,
        amenities: true,
        owner: {
          select: { 
            id: true,
            name: true, 
            isSuperTrusted: true,
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

// PUT /api/properties/:id
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    // Verify ownership
    const existingProperty = await prisma.property.findUnique({
      where: { id: id as string }
    });

    if (!existingProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (existingProperty.ownerId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this property' });
    }

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
      status
    } = req.body;

    const property = await prisma.property.update({
      where: { id: id as string },
      data: {
        title,
        description,
        propertyType,
        bhkType,
        rent: rent !== undefined ? parseFloat(rent) : undefined,
        deposit: deposit !== undefined ? parseFloat(deposit) : undefined,
        maintenance: maintenance !== undefined ? parseFloat(maintenance) : undefined,
        address,
        city,
        state,
        pincode,
        lat: lat !== undefined ? parseFloat(lat) : undefined,
        lng: lng !== undefined ? parseFloat(lng) : undefined,
        availableFrom: availableFrom ? new Date(availableFrom) : undefined,
        tenantPreference,
        furnishing,
        status,
      },
    });

    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/properties/:id/save
export const toggleSaveProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const propertyId = req.params.id as string;

    const existingSaved = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    if (existingSaved) {
      await prisma.savedProperty.delete({
        where: { id: existingSaved.id },
      });
      return res.json({ message: 'Property removed from saved', isSaved: false });
    }

    const saved = await prisma.savedProperty.create({
      data: {
        userId,
        propertyId,
      },
    });

    res.json({ message: 'Property saved successfully', isSaved: true, saved });
  } catch (error) {
    console.error('Error toggling save property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/properties/:id/contact
import { sendOwnerContactEmail } from '../utils/emailService';
import { clerkClient } from '@clerk/clerk-sdk-node';

export const contactOwner = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const propertyId = req.params.id as string;

    // Fetch the buyer's details
    const buyer = await prisma.user.findUnique({ where: { id: userId } });
    if (!buyer) return res.status(404).json({ error: 'Buyer not found' });

    // Fetch the property and the owner's details
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true }
    });

    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (!property.owner) return res.status(404).json({ error: 'Owner not found' });

    let ownerEmail = property.owner.email;
    
    // Attempt to resolve real email if it's a dummy email
    if (ownerEmail.endsWith('@clerk.dev')) {
      try {
        const clerkUser = await clerkClient.users.getUser(property.owner.id);
        const primaryEmail = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;
        
        if (primaryEmail) {
          ownerEmail = primaryEmail;
          // Optimistically update the database with the real email
          await prisma.user.update({
            where: { id: property.owner.id },
            data: { email: primaryEmail }
          });
        } else {
          return res.status(400).json({ error: 'Owner does not have a valid email address configured.' });
        }
      } catch (err) {
        console.error('Failed to fetch from clerk API', err);
        // Fallback gracefully instead of trying to email a dummy address
        return res.status(400).json({ error: 'Owner email address could not be resolved.' });
      }
    }

    // Send the email
    const emailSent = await sendOwnerContactEmail(
      ownerEmail,
      property.owner.name,
      property.title,
      buyer.name,
      buyer.email,
      buyer.phone
    );

    if (emailSent) {
      res.json({ message: 'Contact request sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send contact email' });
    }
  } catch (error) {
    console.error('Error in contactOwner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
