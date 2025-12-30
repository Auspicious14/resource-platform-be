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
  getFeaturedProjects,
  submitCode,
} from "../controllers/projects";
import { authenticateToken } from "../middlewares/auth";
import { upload } from "../middlewares/file";

const router = Router();

router.get("/", getProjects);
router.get("/progress", authenticateToken, getUserProgress);
router.get("/featured", getFeaturedProjects);
router.get("/:id", getProjectById);
router.post("/", authenticateToken, upload.single("coverImage"), createProject);
router.put(
  "/:id",
  authenticateToken,
  upload.single("coverImage"),
  updateProject
);
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
router.post("/:id/code/submit", authenticateToken, submitCode);

export default router;
