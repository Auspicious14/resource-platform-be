import express from "express";
import {
  forgetPassword,
  getUser,
  login,
  logout,
  me,
  resetPassword,
  signUp,
  updateUser,
  verifyOTP,
  googleAuthCallback,
  githubAuthCallback,
} from "../controllers/auth";
import { authenticateToken } from "../middlewares/auth";
import passport from "../utils/passport";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateToken, me);

router.post("/update/:id", authenticateToken, updateUser);
router.get("/user/:id", authenticateToken, getUser);

router.post("/forgetPassword", forgetPassword);
router.post("/verifyOtp", verifyOTP);
router.post("/resetPassword", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/signin?error=auth_failed`,
  }),
  googleAuthCallback
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/signin?error=auth_failed`,
  }),
  githubAuthCallback
);

export default router;
