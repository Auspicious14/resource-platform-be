import { Router } from "express";
import { 
  getPublicSubmissions, 
  commentOnSubmission, 
  voteOnSubmission, 
  getForumThreads, 
  createForumThread 
} from "../controllers/community";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.get("/submissions/public", getPublicSubmissions);
router.post("/submissions/:id/comment", authenticateToken, commentOnSubmission);
router.post("/submissions/:id/vote", authenticateToken, voteOnSubmission);
router.get("/forum/threads", getForumThreads);
router.post("/forum/threads", authenticateToken, createForumThread);

export default router;
