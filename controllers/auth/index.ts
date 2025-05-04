import express, { Request, Response, NextFunction } from "express";
import userAuth from "../../models/auth";
import * as argon2 from "argon2";
import { sendEmail } from "../../middlewares/email";
import { handleErrors } from "../../middlewares/errorHandler";
import { generateOTP } from "../../middlewares/generateOTP";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET: any = process.env.JWT_SECRET;

export const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user: any = await userAuth.findOne({ email });
    if (user) res.json({ success: false, message: "Email already registered" });

    const hashedPassword = await argon2.hash(password);
    await userAuth.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.json({ success: true, message: "success" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, message: errors });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: any = await userAuth.findOne({ email });
    if (!user) res.json({ message: "Invalid Email or Password" });

    const verifyPassword = await argon2.verify(user?.password, password);
    if (!verifyPassword) res.json({ message: "Invalid Email or Password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      message: "success",
      success: true,
      data: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, message: errors });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const appName = "CV Builder";

  try {
    const user: any = await userAuth.findOne({ email });
    if (!user)
      res.json({ success: false, message: "Account is not registered" });
    const { otp, otpDate } = generateOTP();
    user.manageOTP.otp = otp;
    user.manageOTP.otpDate = otpDate;
    await user.save();

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f0f7ff; padding: 30px; border-radius: 10px;">
          <h1 style="color: #1a237e; margin-bottom: 25px;">${appName}</h1>
          <p style="font-size: 16px; color: #333;">
            Hello ${user?.lastName},<br><br>
            We received a request to reset your password for your ${appName} account.
          </p>
          <div style="background: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-weight: bold; font-size: 24px; letter-spacing: 2px;">${otp}</p>
          </div>
          <p style="font-size: 14px; color: #666;">
            This verification code will expire in 1 hour.<br>
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
        <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
          © ${new Date().getFullYear()} ${appName}. All rights reserved.
        </p>
      </div>
    `;

    const textMessage =
      `CV Builder Password Reset\n\n` +
      `Hello ${user?.lastName},\n\n` +
      `Use this OTP to reset your password: ${otp}\n` +
      `This code expires in 1 hour.`;

    sendEmail(
      user.email,
      `Password Reset Request - ${appName}`,
      htmlMessage,
      textMessage
    );

    res.json({
      success: true,
      message: `An OTP has been sent to your mail. Check your mail for your verification code`,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, message: errors });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp: userOtp } = req.body;

  try {
    const user: any = await userAuth.findOne({ email });
    if (!user) res.json({ message: "Account is not registered" });

    const { otp, otpDate } = user.manageOTP;
    const expiryDate = otpDate + 60 * 60 * 1000;

    if (otp !== userOtp)
      res.json({ success: false, message: "Invalid Verification code!" });

    if (expiryDate < Date.now())
      return res.json({
        success: false,
        message: "OTP expired",
      });

    user.manageOTP = {};
    await user.save();

    res.json({ success: true, message: "Verification successfull" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, message: errors });
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    const user: any = await userAuth.findOne({ email });
    const verifyPassword = await argon2.verify(user?.password, newPassword);

    if (verifyPassword) res.json({ message: "You entered your old password" });

    const newPass = await argon2.hash(newPassword);
    user.password = newPass;
    await user.save();

    res.json({ success: true, message: "Password successfully reset" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, message: errors });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user: any = await userAuth.findById(id).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, message: errors });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  let { firstName, lastName, email, password } = req.body;
  try {
    if (password) password = await argon2.hash(password);

    const user: any = await userAuth.findByIdAndUpdate(
      id,
      { $set: { firstName, lastName, email, password } },
      { new: true }
    );

    if (!user) res.json({ success: false, message: "No user matched" });

    res.json({
      success: true,
      data: {
        user: {
          _id: user?._id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          createdAt: user?.createdAt,
          updatedAt: user?.updatedAt,
        },
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, message: errors });
  }
};
