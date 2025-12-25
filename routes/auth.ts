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
} from "../controllers/auth";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.post("/register", signUp); // Changed from signup to register to match roadmap
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateToken, me);

router.post("/update/:id", authenticateToken, updateUser);
router.get("/user/:id", authenticateToken, getUser);

router.post("/forgetPassword", forgetPassword);
router.post("/verifyOtp", verifyOTP);
router.post("/resetPassword", resetPassword);

export default router;
