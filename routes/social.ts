import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getActivityFeed,
  shareProject,
} from "../controllers/social";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.post("/follow", authenticateToken, followUser);
router.delete("/unfollow/:followingId", authenticateToken, unfollowUser);
router.get("/followers/:userId", authenticateToken, getFollowers);
router.get("/following/:userId", authenticateToken, getFollowing);
router.get("/activity-feed", authenticateToken, getActivityFeed);
router.post("/share", authenticateToken, shareProject);

export default router;
