import express from "express";
import { authenticateToken } from "../middlewares/auth";
import { linkRepository, getRepositoryCommits } from "../controllers/github";

const router = express.Router();

router.post("/link", authenticateToken, linkRepository);
router.get("/:projectId/commits", authenticateToken, getRepositoryCommits);

export default router;
