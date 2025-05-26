import express from "express";
import { getChats, chatWithAI } from "../controllers/chat";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.post("/chat-with-ai", authenticateToken, chatWithAI);
router.get("/chats", authenticateToken, getChats);

export default router;
