import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../services/prisma.js';
import { mockAuthenticate, mockAuthorize } from '../middleware/mockAuth.js';
import { NotFoundError } from '../utils/errors.js';

const router = Router();

// Get current user profile
router.get('/me', mockAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

// Update current user profile
router.patch('/me', mockAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { firstName, lastName },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

// List all users (admin only)
router.get(
  '/',
  mockAuthenticate,
  mockAuthorize('ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: { isActive: true },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where: { isActive: true } }),
      ]);

      res.json({
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
