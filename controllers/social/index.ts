import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const followUser = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { followingId } = req.body;

  try {
    if (userId === followingId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot follow yourself" });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: userId, followingId } },
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ success: false, message: "Already following this user" });
    }

    const follow = await prisma.follow.create({
      data: { followerId: userId, followingId },
    });

    await prisma.notification.create({
      data: {
        userId: followingId,
        type: "FOLLOW",
        title: "New Follower",
        message: "Someone started following you",
        link: `/profile/${userId}`,
      },
    });

    res.json({ success: true, data: follow });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { followingId } = req.params;

  try {
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId: userId, followingId } },
    });

    res.json({ success: true, message: "Unfollowed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            xp: true,
          },
        },
      },
    });

    res.json({ success: true, data: followers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            xp: true,
          },
        },
      },
    });

    res.json({ success: true, data: following });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActivityFeed = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { page = 1, limit = 20 } = req.query;

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    const activities = await prisma.userProject.findMany({
      where: {
        userId: { in: followingIds },
        status: "COMPLETED",
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
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    res.json({ success: true, data: activities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const shareProject = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { projectId, platform } = req.body;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const shareUrl = `${process.env.CLIENT_URL}/projects/${project.slug}`;
    const ogImageUrl = `${process.env.CLIENT_URL}/api/og-image/${project.slug}`;

    const share = await prisma.socialShare.create({
      data: {
        userId,
        projectId,
        platform,
        shareUrl,
        ogImageUrl,
      },
    });

    res.json({ success: true, data: { shareUrl, ogImageUrl, share } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
