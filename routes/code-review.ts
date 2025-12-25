import { Router } from "express";
import { analyzeCode, getSubmissionReview } from "../controllers/code-review";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/analyze", authenticateToken, analyzeCode);
router.get("/:id", authenticateToken, getSubmissionReview);

export default router;
