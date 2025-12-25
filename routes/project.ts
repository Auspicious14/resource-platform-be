import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
  submitProject
} from "../controllers/projects";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", authenticateToken, createProject);
router.put("/:id", authenticateToken, updateProject);
router.delete("/:id", authenticateToken, deleteProject);

// Submissions
router.post("/:id/submit", authenticateToken, submitProject);

export default router;
