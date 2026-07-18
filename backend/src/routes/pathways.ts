import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../services/prisma.js';
import { mockAuthenticate } from '../middleware/mockAuth.js';
import { NotFoundError } from '../utils/errors.js';

const router = Router();

// Get all pathways
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pathways = await prisma.pathway.findMany({
      where: { isActive: true },
      include: {
        schemaLevels: {
          orderBy: { levelOrder: 'asc' },
        },
      },
    });

    res.json({ data: pathways });
  } catch (error) {
    next(error);
  }
});

// Get current user's pathway
router.get('/my-pathway', mockAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignment = await prisma.pathwayAssignment.findFirst({
      where: {
        userId: req.user!.id,
        status: 'ACTIVE',
      },
      include: {
        pathway: {
          include: {
            schemaLevels: {
              orderBy: { levelOrder: 'asc' },
            },
            competencies: {
              orderBy: { name: 'asc' },
            },
          },
        },
        schemaLevel: true,
      },
    });

    if (!assignment) {
      throw new NotFoundError('No active pathway assignment found');
    }

    res.json({ data: assignment });
  } catch (error) {
    next(error);
  }
});

// Get competencies for a pathway
router.get('/:pathwayId/competencies', mockAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pathwayId } = req.params;

    const competencies = await prisma.competency.findMany({
      where: { pathwayId },
      orderBy: { name: 'asc' },
    });

    res.json({ data: competencies });
  } catch (error) {
    next(error);
  }
});

// Get courses for a schema level
// Updated: 2026-07-18 - Ensure proper course filtering
router.get('/levels/:levelId/courses', mockAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { levelId } = req.params;

    const courses = await prisma.schemaLevelCourse.findMany({
      where: { schemaLevelId: levelId },
      include: {
        course: true,
      },
      orderBy: { orderIndex: 'asc' },
    });

    res.json({ data: courses.map(slc => slc.course) });
  } catch (error) {
    next(error);
  }
});

export default router;
