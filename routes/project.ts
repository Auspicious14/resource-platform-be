import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
} from "../controllers/projects";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.route("/").post(authenticateToken, createProject).get(getProjects);

router
  .route("/:id")
  .get(getProjectById)
  .put(authenticateToken, updateProject)
  .delete(authenticateToken, deleteProject);
export default router;
