import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";

export const getLearningPaths = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paths = await prisma.learningPath.findMany({
      include: {
        projects: {
          include: {
            project: {
              select: {
                title: true,
                difficultyLevel: true,
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    res.json({ success: true, data: paths });
  } catch (error: any) {
    next(error);
  }
};

export const getPathProgress = async (req: Request, res: Response, next: NextFunction) => {
  const { id: pathId } = req.params;
  const userId = (req as any).user?.id;

  try {
    const progress = await prisma.userPathProgress.findUnique({
      where: {
        userId_pathId: {
          userId,
          pathId,
        },
      },
      include: {
        path: {
          include: {
            projects: {
              include: { project: true },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
      },
    });

    res.json({ success: true, data: progress });
  } catch (error: any) {
    next(error);
  }
};

export const startPath = async (req: Request, res: Response, next: NextFunction) => {
  const { id: pathId } = req.params;
  const userId = (req as any).user?.id;

  try {
    const progress = await prisma.userPathProgress.upsert({
      where: {
        userId_pathId: {
          userId,
          pathId
        }
      },
      update: {},
      create: {
        userId,
        pathId,
        currentProjectIndex: 0,
      },
    });

    res.status(201).json({ success: true, data: progress });
  } catch (error: any) {
    next(error);
  }
};
