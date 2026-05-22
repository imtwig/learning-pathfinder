import { Router, Request, Response } from 'express';
import { Webhook } from 'svix';
import prisma from '../services/prisma.js';
import logger from '../utils/logger.js';

const router = Router();

// Clerk webhook handler for user synchronization
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET not configured');
    }

    const svixHeaders = {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    };

    const webhook = new Webhook(webhookSecret);
    const payload = webhook.verify(JSON.stringify(req.body), svixHeaders);

    const { type, data } = payload as any;

    switch (type) {
      case 'user.created':
        await prisma.user.create({
          data: {
            clerkUserId: data.id,
            email: data.email_addresses[0].email_address,
            firstName: data.first_name || null,
            lastName: data.last_name || null,
            role: 'STAFF', // Default role
          },
        });
        logger.info({ userId: data.id }, 'User created from Clerk webhook');
        break;

      case 'user.updated':
        await prisma.user.update({
          where: { clerkUserId: data.id },
          data: {
            email: data.email_addresses[0].email_address,
            firstName: data.first_name || null,
            lastName: data.last_name || null,
          },
        });
        logger.info({ userId: data.id }, 'User updated from Clerk webhook');
        break;

      case 'user.deleted':
        await prisma.user.update({
          where: { clerkUserId: data.id },
          data: { isActive: false },
        });
        logger.info({ userId: data.id }, 'User deactivated from Clerk webhook');
        break;
    }

    res.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Webhook error');
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

export default router;
