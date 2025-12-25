import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import redis from "../../utils/redis";

const LEADERBOARD_CACHE_KEY = "leaderboard:top20";
const CACHE_TTL = 3600; // 1 hour

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get from cache
    const cachedLeaderboard = await redis.get(LEADERBOARD_CACHE_KEY);
    if (cachedLeaderboard) {
      return res.json({ success: true, data: JSON.parse(cachedLeaderboard), cached: true });
    }

    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        xp: true,
        streak: true
      },
      orderBy: { xp: "desc" },
      take: 20
    });

    // Save to cache
    await redis.setex(LEADERBOARD_CACHE_KEY, CACHE_TTL, JSON.stringify(leaderboard));

    res.json({ success: true, data: leaderboard });
  } catch (error: any) {
    next(error);
  }
};

export const getUserAchievements = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;

  try {
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      }
    });

    res.json({ success: true, data: achievements });
  } catch (error: any) {
    next(error);
  }
};

export const awardXP = async (userId: string, amount: number) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: amount }
      }
    });
    
    // Invalidate leaderboard cache when XP changes
    await redis.del(LEADERBOARD_CACHE_KEY);
  } catch (error) {
    console.error("Error awarding XP:", error);
  }
};
