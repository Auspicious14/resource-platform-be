import express from "express";
import {
  forgetPassword,
  getUser,
  login,
  resetPassword,
  signUp,
  updateUser,
  verifyOTP,
} from "../controllers/auth";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/update/:id", updateUser);
router.get("/user/:id", getUser);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyOtp", verifyOTP);
router.post("/resetPassword", resetPassword);

export default router;
