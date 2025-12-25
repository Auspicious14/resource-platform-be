import { Router } from "express";
import { 
  getUserAnalytics, 
  getAdminAnalytics 
} from "../controllers/analytics";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.get("/user", authenticateToken, getUserAnalytics);
router.get("/admin", authenticateToken, getAdminAnalytics);

export default router;
