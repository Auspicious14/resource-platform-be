import { Router } from "express";
import {
  chatWithAI,
  getChatHistory,
  getAllChatMessages,
  requestHint,
} from "../controllers/ai";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/chat", authenticateToken, chatWithAI);
router.get("/chat", authenticateToken, getAllChatMessages);
router.get("/chat/history/:projectId", authenticateToken, getChatHistory);
router.post("/hint-request", authenticateToken, requestHint);

export default router;
