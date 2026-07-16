import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { PrismaClient } from '@prisma/client';
import { sendWelcomeEmail } from '../utils/emailService';

const prisma = new PrismaClient();

export const clerkWebhook = async (req: Request, res: Response) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get headers and body
  const headers = req.headers;
  const payload = req.body;

  // Get Svix headers for verification
  const svix_id = headers['svix-id'] as string;
  const svix_timestamp = headers['svix-timestamp'] as string;
  const svix_signature = headers['svix-signature'] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({
      success: false,
      message: 'Error: Missing svix headers',
    });
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  let evt: any;

  // Verify payload
  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err: any) {
    console.error('Error: Could not verify webhook:', err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Handle the webhook event
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { email_addresses, first_name, last_name, phone_numbers } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();
    const phone = phone_numbers?.[0]?.phone_number || null;

    if (!email) {
      return res.status(400).json({ error: 'No email found in webhook' });
    }

    // Secure Admin Promotion via Environment Variables
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    const role = adminEmails.includes(email.toLowerCase()) ? 'ADMIN' : 'TENANT';

    try {
      await prisma.user.create({
        data: {
          id, // Use Clerk's ID as our primary key
          email,
          name: name || 'User',
          password: 'clerk-managed', // Dummy password since Clerk handles it
          phone,
          role,
        },
      });
      console.log(`User created successfully with ID: ${id}`);
      
      // Send welcome email
      await sendWelcomeEmail(name || 'User', email);
      
    } catch (error) {
      console.error('Error saving user to database:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Webhook received',
  });
};
