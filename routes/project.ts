import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
  getFeaturedProjects,
} from "../controllers/projects";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// router.route("/").post(authenticateToken, createProject).get(getProjects);

router
  .get("/featured", getFeaturedProjects)
  .get("/", getProjects)
  .get("/:id", getProjectById)
  .post("/create", authenticateToken, createProject)
  .put("/:id", authenticateToken, updateProject)
  .delete("/:id", authenticateToken, deleteProject);
export default router;
