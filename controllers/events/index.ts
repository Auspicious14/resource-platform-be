import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { EventStatus } from "@prisma/client";

export const createEvent = async (req: Request, res: Response) => {
  const {
    title,
    description,
    type,
    startDate,
    endDate,
    prizePool,
    maxParticipants,
    bannerUrl,
  } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        prizePool,
        maxParticipants,
        bannerUrl,
      },
    });

    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  const { status, type, page = 1, limit = 10 } = req.query;

  try {
    const where: any = {};
    if (status) where.status = status as EventStatus;
    if (type) where.type = type;

    const events = await prisma.event.findMany({
      where,
      include: {
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { startDate: "desc" },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    res.json({ success: true, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        participants: {
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
        },
        leaderboard: {
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
          orderBy: { score: "desc" },
          take: 100,
        },
      },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinEvent = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { eventId } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { participants: true } } },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (
      event.maxParticipants &&
      event._count.participants >= event.maxParticipants
    ) {
      return res.status(400).json({ success: false, message: "Event is full" });
    }

    const participant = await prisma.eventParticipant.create({
      data: { eventId, userId },
    });

    await prisma.eventLeaderboard.create({
      data: { eventId, userId, score: 0 },
    });

    res.json({ success: true, data: participant });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const leaveEvent = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { eventId } = req.params;

  try {
    await prisma.eventParticipant.delete({
      where: { eventId_userId: { eventId, userId } },
    });

    await prisma.eventLeaderboard.delete({
      where: { eventId_userId: { eventId, userId } },
    });

    res.json({ success: true, message: "Left event successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEventScore = async (req: Request, res: Response) => {
  const { eventId, userId } = req.params;
  const { score } = req.body;

  try {
    const leaderboard = await prisma.eventLeaderboard.update({
      where: { eventId_userId: { eventId, userId } },
      data: { score },
    });

    const allScores = await prisma.eventLeaderboard.findMany({
      where: { eventId },
      orderBy: { score: "desc" },
    });

    for (let i = 0; i < allScores.length; i++) {
      await prisma.eventLeaderboard.update({
        where: { id: allScores[i].id },
        data: { rank: i + 1 },
      });
    }

    res.json({ success: true, data: leaderboard });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const { limit = 100 } = req.query;

  try {
    const leaderboard = await prisma.eventLeaderboard.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            xp: true,
          },
        },
      },
      orderBy: { score: "desc" },
      take: Number(limit),
    });

    res.json({ success: true, data: leaderboard });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
