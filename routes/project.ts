import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
  submitProject,
  startProject,
  updateProgress,
  completeProject,
  getUserProgress,
  completeMilestone,
} from "../controllers/projects";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.get("/", getProjects);
router.get("/progress", authenticateToken, getUserProgress);
router.get("/:id", getProjectById);
router.post("/", authenticateToken, createProject);
router.put("/:id", authenticateToken, updateProject);
router.delete("/:id", authenticateToken, deleteProject);

// User Progress
router.post("/:id/start", authenticateToken, startProject);
router.put("/:id/progress", authenticateToken, updateProgress);
router.post("/:id/complete", authenticateToken, completeProject);

// Milestones
router.post(
  "/:id/milestones/:milestoneId/complete",
  authenticateToken,
  completeMilestone
);

// Submissions
router.post("/:id/submit", authenticateToken, submitProject);

export default router;
