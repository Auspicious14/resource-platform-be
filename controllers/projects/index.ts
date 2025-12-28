import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { Difficulty, DifficultyMode, ProjectStatus } from "@prisma/client";
import { upLoadFiles } from "../../middlewares/file";
import { checkAuth } from "../../middlewares/auth";

export const createProject = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const {
    title,
    description,
    difficultyLevel,
    technologies,
    categories,
    estimatedTime,
    learningObjectives,
    resourceLinks,
    starterRepoUrl,
    difficultyModes,
    coverImage,
    milestones,
  } = req.body;

  try {
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== "ADMIN" && user.role !== "CONTRIBUTOR")) {
      return res.status(403).json({
        success: false,
        message: "Only Admins or Contributors can create projects",
      });
    }

    let imageUrl = coverImage;
    if (coverImage && !coverImage.startsWith("http")) {
      imageUrl = await upLoadFiles(coverImage);
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        difficultyLevel: difficultyLevel as Difficulty,
        technologies,
        categories,
        estimatedTime,
        learningObjectives,
        resourceLinks: resourceLinks || [],
        starterRepoUrl,
        difficultyModes: difficultyModes || ["GUIDED", "STANDARD", "HARDCORE"],
        createdById: userId,
        milestones: {
          create: milestones?.map((m: any, index: number) => ({
            milestoneNumber: index + 1,
            title: m.title,
            description: m.description,
            hints: m.hints || [],
            validationCriteria: m.validationCriteria,
          })),
        },
      },
      include: {
        milestones: true,
      },
    });

    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  const updateData = req.body;

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    // Check permissions
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== "ADMIN" && project.createdById !== userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this project",
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: { milestones: true },
    });

    res.json({ success: true, data: updatedProject });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, message: "Only Admins can delete projects" });
    }

    await prisma.project.delete({ where: { id } });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  const { difficulty, tech, category, title } = req.query;

  try {
    const where: any = {};
    if (difficulty) where.difficultyLevel = difficulty as Difficulty;
    if (tech) where.technologies = { has: tech as string };
    if (category) where.categories = { has: category as string };
    if (title) where.title = { contains: title as string, mode: "insensitive" };

    const projects = await prisma.project.findMany({
      where,
      include: {
        createdBy: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await checkAuth(req);
    const project = (await prisma.project.findUnique({
      where: { id },
      include: {
        milestones: { orderBy: { milestoneNumber: "asc" } },
        createdBy: { select: { firstName: true, lastName: true } },
        userProjects: user ? { where: { userId: user.id } } : false,
      },
    })) as any;

    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    // If user is authenticated, fetch their progress and completed milestones for each mode
    let progressByMode: any = {};
    if (user && project.userProjects) {
      for (const up of project.userProjects) {
        const completedMilestones = await prisma.userMilestone.findMany({
          where: {
            userId: user.id,
            userProjectId: up.id,
          },
          select: { milestoneId: true },
        });

        progressByMode[up.difficultyModeChosen] = {
          status: up.status,
          completedMilestones: completedMilestones.map((m) => m.milestoneId),
          userProjectId: up.id,
        };
      }
    }

    res.json({
      success: true,
      data: {
        ...project,
        progressByMode,
        // For backward compatibility
        userProgress: project.userProjects?.[0] || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Progress Endpoints
export const startProject = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const userId = (req as any).user?.id;
  const { difficultyModeChosen } = req.body;

  try {
    const mode = (difficultyModeChosen as DifficultyMode) || "STANDARD";

    const existingProgress = await prisma.userProject.findUnique({
      where: {
        userId_projectId_difficultyModeChosen: {
          userId,
          projectId,
          difficultyModeChosen: mode,
        },
      },
    });

    if (existingProgress) {
      return res.status(400).json({
        success: false,
        message: "Project already started in this mode",
      });
    }

    const progress = await prisma.userProject.create({
      data: {
        userId,
        projectId,
        difficultyModeChosen: mode,
        status: "IN_PROGRESS",
      },
    });

    res.status(201).json({ success: true, data: progress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProgress = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const userId = (req as any).user?.id;
  const { status, repoUrl, difficultyMode } = req.body;

  try {
    const progress = await prisma.userProject.update({
      where: {
        userId_projectId_difficultyModeChosen: {
          userId,
          projectId,
          difficultyModeChosen: difficultyMode as DifficultyMode,
        },
      },
      data: { status: status as ProjectStatus, repoUrl },
    });

    res.json({ success: true, data: progress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const completeProject = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const userId = (req as any).user?.id;
  const { repoUrl, difficultyMode } = req.body;

  try {
    const progress = await prisma.userProject.update({
      where: {
        userId_projectId_difficultyModeChosen: {
          userId,
          projectId,
          difficultyModeChosen: difficultyMode as DifficultyMode,
        },
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        repoUrl,
      },
    });

    // Award XP (simple example)
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: 100 } },
    });

    // Update project completion rate
    const totalStarted = await prisma.userProject.count({
      where: { projectId },
    });
    const totalCompleted = await prisma.userProject.count({
      where: { projectId, status: "COMPLETED" },
    });

    await prisma.project.update({
      where: { id: projectId },
      data: {
        completionRate: (totalCompleted / totalStarted) * 100,
        submissionCount: { increment: 1 },
      },
    });

    res.json({ success: true, data: progress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProgress = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const progress = await prisma.userProject.findMany({
      where: { userId },
      include: {
        project: {
          select: { title: true, difficultyLevel: true },
        },
      },
    });

    res.json({ success: true, data: progress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submissions
export const submitProject = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const userId = (req as any).user?.id;
  const { repoUrl } = req.body;

  try {
    const submission = await prisma.submission.create({
      data: {
        userId,
        projectId,
        repoUrl,
      },
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const completeMilestone = async (req: Request, res: Response) => {
  const { id: projectId, milestoneId } = req.params;
  const userId = (req as any).user?.id;
  const { difficultyMode } = req.body;

  try {
    const userProject = await prisma.userProject.findUnique({
      where: {
        userId_projectId_difficultyModeChosen: {
          userId,
          projectId,
          difficultyModeChosen: difficultyMode as DifficultyMode,
        },
      },
    });

    if (!userProject) {
      return res.status(400).json({
        success: false,
        message: "Project not started by user in this mode",
      });
    }

    const existingMilestone = await prisma.userMilestone.findUnique({
      where: {
        userId_milestoneId_userProjectId: {
          userId,
          milestoneId,
          userProjectId: userProject.id,
        },
      },
    });

    if (existingMilestone) {
      return res.status(400).json({
        success: false,
        message: "Milestone already completed in this mode",
      });
    }

    const milestone = await prisma.userMilestone.create({
      data: {
        userId,
        milestoneId,
        userProjectId: userProject.id,
      },
    });

    res.status(201).json({ success: true, data: milestone });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProjects = async (req: Request, res: Response) => {
  try {
    const featuredProjects = await prisma.project.findMany({
      take: 4,
      orderBy: { submissionCount: "desc" },
      include: {
        createdBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    res.json({ success: true, data: featuredProjects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
