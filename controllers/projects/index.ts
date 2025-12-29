import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { Difficulty, DifficultyMode, ProjectStatus } from "@prisma/client";
import { upLoadFiles, uploadBuffer } from "../../middlewares/file";
import { checkAuth } from "../../middlewares/auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const parseJsonIfNeeded = (value: any) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return value;
};

export const createProject = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  let {
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

  // Parse JSON fields if they are sent as strings (happens with FormData)
  technologies = parseJsonIfNeeded(technologies);
  categories = parseJsonIfNeeded(categories);
  learningObjectives = parseJsonIfNeeded(learningObjectives);
  resourceLinks = parseJsonIfNeeded(resourceLinks);
  difficultyModes = parseJsonIfNeeded(difficultyModes);
  milestones = parseJsonIfNeeded(milestones);

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
    if (req.file) {
      imageUrl = await uploadBuffer(req.file.buffer, `${title}-${Date.now()}`);
    } else if (coverImage && !coverImage.startsWith("http")) {
      imageUrl = await upLoadFiles(coverImage);
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: generateSlug(title),
        description,
        difficultyLevel: difficultyLevel as Difficulty,
        technologies: technologies || [],
        categories: categories || [],
        estimatedTime,
        learningObjectives: learningObjectives || [],
        resourceLinks: resourceLinks || [],
        starterRepoUrl,
        coverImage: imageUrl,
        difficultyModes: difficultyModes || ["GUIDED", "STANDARD", "HARDCORE"],
        createdBy: { connect: { id: userId } },
        milestones: {
          create: milestones?.map((m: any, index: number) => ({
            milestoneNumber: index + 1,
            title: m.title,
            description: m.description,
            hints: Array.isArray(m.hints) ? { GUIDED: m.hints } : m.hints || {},
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
  let { coverImage, ...updateData } = req.body;

  // Parse JSON fields in updateData if they are sent as strings
  if (updateData.technologies) updateData.technologies = parseJsonIfNeeded(updateData.technologies);
  if (updateData.categories) updateData.categories = parseJsonIfNeeded(updateData.categories);
  if (updateData.learningObjectives) updateData.learningObjectives = parseJsonIfNeeded(updateData.learningObjectives);
  if (updateData.resourceLinks) updateData.resourceLinks = parseJsonIfNeeded(updateData.resourceLinks);
  if (updateData.difficultyModes) updateData.difficultyModes = parseJsonIfNeeded(updateData.difficultyModes);
  if (updateData.milestones) updateData.milestones = parseJsonIfNeeded(updateData.milestones);

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

    let imageUrl = coverImage;
    if (req.file) {
      imageUrl = await uploadBuffer(req.file.buffer, `${project.title}-${Date.now()}`);
    } else if (coverImage && !coverImage.startsWith("http")) {
      imageUrl = await upLoadFiles(coverImage);
    }

    // Handle milestones separately if provided
    if (updateData.milestones) {
      // For simplicity in this update, we'll delete and recreate milestones if they are provided
      // In a real app, you might want to sync them more carefully
      await prisma.projectMilestone.deleteMany({ where: { projectId: id } });
      
      const milestones = updateData.milestones;
      delete updateData.milestones;
      
      updateData.milestones = {
        create: milestones.map((m: any, index: number) => ({
          milestoneNumber: index + 1,
          title: m.title,
          description: m.description,
          hints: Array.isArray(m.hints) ? { GUIDED: m.hints } : m.hints || {},
          validationCriteria: m.validationCriteria,
        })),
      };
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        coverImage: imageUrl,
      },
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

    const userProject = await prisma.userProject.create({
      data: {
        userId,
        projectId,
        difficultyModeChosen: mode,
        status: "IN_PROGRESS",
      },
    });

    res.status(201).json({ success: true, data: userProject });
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
          difficultyModeChosen: difficultyMode,
        },
      },
    });

    if (!userProject) {
      return res.status(404).json({
        success: false,
        message: "Project progress not found",
      });
    }

    const completedMilestone = await prisma.userMilestone.create({
      data: {
        userId,
        userProjectId: userProject.id,
        milestoneId,
      },
    });

    // Check if all milestones are completed
    const totalMilestones = await prisma.projectMilestone.count({
      where: { projectId },
    });
    const completedCount = await prisma.userMilestone.count({
      where: { userProjectId: userProject.id },
    });

    if (completedCount === totalMilestones) {
      await prisma.userProject.update({
        where: { id: userProject.id },
        data: { status: "COMPLETED" },
      });
    }

    res.json({ success: true, data: completedMilestone });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
