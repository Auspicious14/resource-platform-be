import { Router } from "express";
import {
  startProject,
  updateProgress,
  completeProject,
  getUserProgress
} from "../controllers/projects";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.get("/progress", authenticateToken, getUserProgress);
router.post("/projects/:id/start", authenticateToken, startProject);
router.put("/projects/:id/progress", authenticateToken, updateProgress);
router.post("/projects/:id/complete", authenticateToken, completeProject);

export default router;
