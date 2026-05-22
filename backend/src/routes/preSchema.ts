import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../services/prisma.js';
import { mockAuthenticate, authorize } from '../middleware/auth.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Get Pre-Schema steps for current user
router.get('/steps', mockAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignment = await prisma.pathwayAssignment.findFirst({
      where: {
        userId: req.user!.id,
        status: 'ACTIVE',
      },
      include: {
        schemaLevel: {
          include: {
            preSchemaSteps: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundError('No active pathway assignment');
    }

    // Get progress for each step
    const steps = assignment.schemaLevel.preSchemaSteps;
    const stepIds = steps.map(s => s.id);

    const progress = await prisma.userProgress.findMany({
      where: {
        userId: req.user!.id,
        pathwayAssignmentId: assignment.id,
        preSchemaStepId: { in: stepIds },
      },
      include: {
        proofUploads: true,
        managerReviews: {
          orderBy: { reviewedAt: 'desc' },
          take: 1,
        },
      },
    });

    const stepsWithProgress = steps.map(step => {
      const stepProgress = progress.find(p => p.preSchemaStepId === step.id);
      return {
        ...step,
        progress: stepProgress || null,
      };
    });

    res.json({ data: stepsWithProgress });
  } catch (error) {
    next(error);
  }
});

// Start a Pre-Schema step
router.post('/steps/:stepId/start', mockAuthenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stepId } = req.params;

    const assignment = await prisma.pathwayAssignment.findFirst({
      where: { userId: req.user!.id, status: 'ACTIVE' },
    });

    if (!assignment) {
      throw new NotFoundError('No active pathway assignment');
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_pathwayAssignmentId_preSchemaStepId: {
          userId: req.user!.id,
          pathwayAssignmentId: assignment.id,
          preSchemaStepId: stepId,
        },
      },
      update: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
      create: {
        userId: req.user!.id,
        pathwayAssignmentId: assignment.id,
        preSchemaStepId: stepId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    res.json({ data: progress });
  } catch (error) {
    next(error);
  }
});

// Submit Pre-Schema step with proof
router.post(
  '/steps/:stepId/submit',
  mockAuthenticate,
  upload.single('proof'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stepId } = req.params;
      const { notes } = req.body;

      const assignment = await prisma.pathwayAssignment.findFirst({
        where: { userId: req.user!.id, status: 'ACTIVE' },
      });

      if (!assignment) {
        throw new NotFoundError('No active pathway assignment');
      }

      // Update or create progress
      const progress = await prisma.userProgress.upsert({
        where: {
          userId_pathwayAssignmentId_preSchemaStepId: {
            userId: req.user!.id,
            pathwayAssignmentId: assignment.id,
            preSchemaStepId: stepId,
          },
        },
        update: {
          status: 'SUBMITTED',
          submittedAt: new Date(),
          notes,
        },
        create: {
          userId: req.user!.id,
          pathwayAssignmentId: assignment.id,
          preSchemaStepId: stepId,
          status: 'SUBMITTED',
          startedAt: new Date(),
          submittedAt: new Date(),
          notes,
        },
      });

      // If file was uploaded, create proof upload record
      if (req.file) {
        await prisma.proofUpload.create({
          data: {
            userProgressId: progress.id,
            fileName: req.file.originalname,
            fileSize: BigInt(req.file.size),
            fileType: req.file.mimetype,
            storageKey: req.file.filename,
            storageUrl: `/uploads/${req.file.filename}`,
            uploadedBy: req.user!.id,
          },
        });
      }

      res.json({ data: progress });
    } catch (error) {
      next(error);
    }
  }
);

// Get pending reviews for manager
router.get(
  '/pending-reviews',
  mockAuthenticate,
  authorize('MANAGER', 'ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get staff assigned to this manager
      const assignments = await prisma.managerAssignment.findMany({
        where: {
          managerUserId: req.user!.id,
          endedAt: null,
        },
        select: { staffUserId: true },
      });

      const staffIds = assignments.map(a => a.staffUserId);

      // Get submitted progress from assigned staff
      const pendingProgress = await prisma.userProgress.findMany({
        where: {
          userId: { in: staffIds },
          status: 'SUBMITTED',
        },
        include: {
          user: true,
          preSchemaStep: true,
          proofUploads: true,
          pathwayAssignment: {
            include: {
              pathway: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
      });

      res.json({ data: pendingProgress });
    } catch (error) {
      next(error);
    }
  }
);

// Manager reviews and approves/rejects submission
router.post(
  '/reviews',
  mockAuthenticate,
  authorize('MANAGER', 'ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userProgressId, decision, comments } = req.body;

      if (!['APPROVED', 'REJECTED', 'NEEDS_REVISION'].includes(decision)) {
        throw new ValidationError('Invalid decision');
      }

      const progress = await prisma.userProgress.findUnique({
        where: { id: userProgressId },
      });

      if (!progress) {
        throw new NotFoundError('Progress record not found');
      }

      // Create review record
      await prisma.managerReview.create({
        data: {
          userProgressId,
          reviewerId: req.user!.id,
          decision,
          comments,
        },
      });

      // Update progress status
      const newStatus = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED';
      const updatedProgress = await prisma.userProgress.update({
        where: { id: userProgressId },
        data: {
          status: newStatus,
          reviewedAt: new Date(),
          reviewedBy: req.user!.id,
        },
        include: {
          preSchemaStep: true,
          user: true,
        },
      });

      res.json({ data: updatedProgress });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
