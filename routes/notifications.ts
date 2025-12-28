import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notifications";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.get("/", authenticateToken, getNotifications);
router.patch("/:notificationId/read", authenticateToken, markAsRead);
router.patch("/read-all", authenticateToken, markAllAsRead);
router.delete("/:notificationId", authenticateToken, deleteNotification);

export default router;
