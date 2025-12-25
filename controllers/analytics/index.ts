import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";

export const getUserAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        xp: true,
        streak: true,
        _count: {
          select: {
            projects: true,
            submissions: true,
            achievements: true
          }
        }
      }
    });

    const projectCompletion = await prisma.userProject.groupBy({
      by: ["status"],
      where: { userId },
      _count: true
    });

    res.json({
      success: true,
      data: {
        stats: user,
        projectCompletion
      }
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const totalUsers = await prisma.user.count();
    const totalProjects = await prisma.project.count();
    const totalSubmissions = await prisma.submission.count();
    
    const popularProjects = await prisma.project.findMany({
      orderBy: { submissionCount: "desc" },
      take: 5,
      select: { title: true, submissionCount: true }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProjects,
        totalSubmissions,
        popularProjects
      }
    });
  } catch (error: any) {
    next(error);
  }
};
