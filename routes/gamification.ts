import { Router } from "express";
import { 
  getLeaderboard, 
  getUserAchievements 
} from "../controllers/gamification";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.get("/leaderboard", getLeaderboard);
router.get("/achievements", authenticateToken, getUserAchievements);

export default router;
