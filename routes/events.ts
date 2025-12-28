import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  joinEvent,
  leaveEvent,
  updateEventScore,
  getLeaderboard,
} from "../controllers/events";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.post("/", authenticateToken, createEvent);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/:eventId/join", authenticateToken, joinEvent);
router.delete("/:eventId/leave", authenticateToken, leaveEvent);
router.patch("/:eventId/score/:userId", authenticateToken, updateEventScore);
router.get("/:eventId/leaderboard", getLeaderboard);

export default router;
