import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

// Mock authenticate is imported from mockAuth.ts
export { mockAuthenticate } from './mockAuth.js';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Requires one of: ${allowedRoles.join(', ')}. You have: ${req.user.role}`
        )
      );
    }

    next();
  };
};

// Check if manager can access staff member's data
export const canAccessStaffData = async (
  managerId: string,
  staffId: string
): Promise<boolean> => {
  const assignment = await prisma.managerAssignment.findFirst({
    where: {
      managerUserId: managerId,
      staffUserId: staffId,
      isPrimary: true,
      endedAt: null,
    },
  });

  return !!assignment;
};
