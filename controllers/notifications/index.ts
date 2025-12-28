import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const getNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  try {
    const where: any = { userId };
    if (unreadOnly === "true") {
      where.read = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { notificationId } = req.params;

  try {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { notificationId } = req.params;

  try {
    await prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });

    res.json({ success: true, message: "Notification deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
