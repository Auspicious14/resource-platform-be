import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";

export const getPublicSubmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: submissions });
  } catch (error: any) {
    next(error);
  }
};

export const commentOnSubmission = async (req: Request, res: Response, next: NextFunction) => {
  const { id: submissionId } = req.params;
  const { content } = req.body;
  const userId = (req as any).user?.id;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        submissionId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error: any) {
    next(error);
  }
};

export const voteOnSubmission = async (req: Request, res: Response, next: NextFunction) => {
  const { id: submissionId } = req.params;
  const { value } = req.body; // 1 for upvote, -1 for downvote
  const userId = (req as any).user?.id;

  try {
    const vote = await prisma.vote.upsert({
      where: {
        userId_submissionId: {
          userId,
          submissionId,
        },
      },
      update: { value },
      create: {
        value,
        userId,
        submissionId,
      },
    });

    res.json({ success: true, data: vote });
  } catch (error: any) {
    next(error);
  }
};

export const getForumThreads = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.query;

  try {
    const threads = await prisma.forumThread.findMany({
      where: projectId ? { projectId: String(projectId) } : {},
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: threads });
  } catch (error: any) {
    next(error);
  }
};

export const createForumThread = async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, projectId } = req.body;
  const userId = (req as any).user?.id;

  try {
    const thread = await prisma.forumThread.create({
      data: {
        title,
        content,
        userId,
        projectId: projectId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: thread });
  } catch (error: any) {
    next(error);
  }
};
