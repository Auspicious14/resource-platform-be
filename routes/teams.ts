import { Router } from "express";
import { 
  createTeam, 
  joinTeam, 
  getTeamProjects 
} from "../controllers/teams";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/create", authenticateToken, createTeam);
router.post("/:id/join", authenticateToken, joinTeam);
router.get("/:id/projects", authenticateToken, getTeamProjects);

export default router;
