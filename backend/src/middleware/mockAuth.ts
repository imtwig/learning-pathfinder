import { Request, Response, NextFunction } from 'express';
import prisma from '../services/prisma.js';
import { UnauthorizedError } from '../utils/errors.js';

/**
 * Mock authentication for prototype
 * Expects a userId in the Authorization header or query param
 * Format: Bearer <userId> OR ?userId=<userId>
 */
export const mockAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userId from header or query param
    let userId = req.headers.authorization?.replace('Bearer ', '');
    if (!userId) {
      userId = req.query.userId as string;
    }

    if (!userId) {
      throw new UnauthorizedError('No userId provided. Add ?userId=<id> or Authorization header');
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Mock role-based authorization
 * Checks if the authenticated user has the required role
 */
export const mockAuthorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new UnauthorizedError(`Access denied. Required role: ${allowedRoles.join(' or ')}`));
    }

    next();
  };
};
