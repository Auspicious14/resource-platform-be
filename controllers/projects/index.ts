import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { Difficulty, DifficultyMode, ProjectStatus } from "@prisma/client";
import { checkAuth } from "../../middlewares/auth";
import { upLoadFiles, uploadBuffer } from "../../middlewares/file";
import { generateSlug, parseIfString } from "../../utils/helper";
import { getGeminiResponse } from "../../utils/gemini";

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

  // Parse JSON strings from FormData
  technologies = parseIfString(technologies);
  categories = parseIfString(categories);
  learningObjectives = parseIfString(learningObjectives);
  resourceLinks = parseIfString(resourceLinks);
  difficultyModes = parseIfString(difficultyModes);
  milestones = parseIfString(milestones);

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
      imageUrl = await uploadBuffer(req.file.buffer, req.file.originalname);
    } else if (coverImage && !coverImage.startsWith("http")) {
      imageUrl = await upLoadFiles(coverImage);
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: generateSlug(title),
        description,
        difficultyLevel: difficultyLevel as Difficulty,
        technologies,
        categories,
        estimatedTime,
        learningObjectives,
        resourceLinks: resourceLinks || [],
        starterRepoUrl,
        difficultyModes: difficultyModes || ["GUIDED", "STANDARD", "HARDCORE"],
        createdBy: { connect: { id: userId } },
        coverImage: imageUrl,
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
      include: { milestones: true },
    });

    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  let updateData = req.body;

  updateData.technologies = parseIfString(updateData.technologies);
  updateData.categories = parseIfString(updateData.categories);
  updateData.learningObjectives = parseIfString(updateData.learningObjectives);
  updateData.resourceLinks = parseIfString(updateData.resourceLinks);
  updateData.difficultyModes = parseIfString(updateData.difficultyModes);

  const milestonesData = parseIfString(updateData.milestones);
  delete updateData.milestones;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { milestones: true, userProjects: true },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || (user.role !== "ADMIN" && project.createdById !== userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this project",
      });
    }

    if (req.file) {
      updateData.coverImage = await uploadBuffer(
        req.file.buffer,
        req.file.originalname
      );
    } else if (
      updateData.coverImage &&
      !updateData.coverImage.startsWith("http")
    ) {
      updateData.coverImage = await upLoadFiles(updateData.coverImage);
    }

    // Update slug if title changed
    if (updateData.title && updateData.title !== project.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    // Clean up any undefined or empty string values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === "") {
        delete updateData[key];
      }
    });

    // Update project with milestones handled separately
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        ...(milestonesData && {
          milestones: {
            deleteMany: {},
            create: milestonesData
              .filter((m: any) => m.title && m.description)
              .map((m: any, index: number) => ({
                milestoneNumber: index + 1,
                title: m.title,
                description: m.description,
                hints: typeof m.hints === "object" ? m.hints : {},
                validationCriteria:
                  typeof m.validationCriteria === "string"
                    ? m.validationCriteria
                    : JSON.stringify(m.validationCriteria || {}),
              })),
          },
        }),
      },
      include: {
        milestones: {
          orderBy: { milestoneNumber: "asc" },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        userProjects: { where: { userId: user.id } },
      },
    });

    // Build progressByMode
    let progressByMode: any = {};
    let userProgress = null;

    if (updatedProject.userProjects && updatedProject.userProjects.length > 0) {
      for (const up of updatedProject.userProjects) {
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
          startedAt: up.startedAt,
          completedAt: up.completedAt,
        };
      }

      userProgress =
        updatedProject.userProjects[updatedProject.userProjects.length - 1];
    }

    res.json({
      success: true,
      data: {
        ...updatedProject,
        progressByMode,
        userProgress,
      },
    });
  } catch (error: any) {
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        milestones: { orderBy: { milestoneNumber: "asc" } },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        userProjects: user ? { where: { userId: user.id } } : false,
      },
    });

    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    // If user is authenticated, fetch their progress and completed milestones for each mode
    let progressByMode: any = {};
    let userProgress = null;

    if (user && project.userProjects && project.userProjects.length > 0) {
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
          startedAt: up.startedAt,
          completedAt: up.completedAt,
        };
      }

      // Set the most recent userProject as the default userProgress
      userProgress = project.userProjects[project.userProjects.length - 1];
    }

    res.json({
      success: true,
      data: {
        ...project,
        progressByMode,
        userProgress,
      },
    });
  } catch (error: any) {
    console.error("Get project error:", error);
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

export const submitCode = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { projectId, milestoneId, code, language } = req.body;

  try {
    // Fetch milestone details for validation criteria
    const milestone = await prisma.projectMilestone.findUnique({
      where: { id: milestoneId },
      include: { project: true },
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    // AI-powered code review
    const reviewPrompt = `
You are a code reviewer for a learning platform. Review this code submission:

Project: ${milestone.project.title}
Milestone: ${milestone.title}
Description: ${milestone.description}
Validation Criteria: ${milestone.validationCriteria || "General best practices"}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Does this code meet the milestone requirements? (YES/NO)
2. Code quality score (0-100)
3. Specific feedback on what's good
4. Areas for improvement
5. Security concerns (if any)

Format as JSON:
{
  "meetsRequirements": boolean,
  "score": number,
  "strengths": string[],
  "improvements": string[],
  "securityIssues": string[]
}
`;

    const reviewResult = await getGeminiResponse(reviewPrompt);

    // Parse AI response
    let parsedReview;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = reviewResult.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : reviewResult;
      parsedReview = JSON.parse(jsonStr);
    } catch (e) {
      parsedReview = {
        meetsRequirements: false,
        score: 0,
        strengths: [],
        improvements: ["Unable to parse AI review"],
        securityIssues: [],
      };
    }

    // Save code submission
    const submission = await prisma.submission.create({
      data: {
        userId,
        projectId,
        repoUrl: `code-submission-${Date.now()}`, // Placeholder
        feedback: JSON.stringify(parsedReview),
        score: parsedReview.score,
        aiReviewData: parsedReview,
      },
    });

    res.json({
      success: true,
      data: {
        submission,
        review: parsedReview,
      },
    });
  } catch (error: any) {
    console.error("Code submission error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
