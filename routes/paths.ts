import { Router } from "express";
import { 
  getLearningPaths, 
  getPathProgress, 
  startPath 
} from "../controllers/paths";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.get("/", getLearningPaths);
router.get("/:id/progress", authenticateToken, getPathProgress);
router.post("/:id/start", authenticateToken, startPath);

export default router;
