import { Router } from "express";
import { chatWithAI, getChatHistory, requestHint } from "../controllers/ai";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/chat", authenticateToken, chatWithAI);
router.get("/chat/history/:projectId", authenticateToken, getChatHistory);
router.post("/hint-request", authenticateToken, requestHint);

export default router;
