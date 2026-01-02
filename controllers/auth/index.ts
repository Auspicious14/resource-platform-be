import { Request, Response } from "express";
import prisma from "../../prisma/client";
import * as argon2 from "argon2";
import { sendEmail } from "../../middlewares/email";
import { generateOTP } from "../../middlewares/generateOTP";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redis from "../../utils/redis";
import { Difficulty, Role } from "@prisma/client";

dotenv.config();
const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";

export const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, skillLevel, email, password, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await argon2.hash(password);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        skillLevel: (skillLevel as Difficulty) || "BEGINNER",
        password: hashedPassword,
        role: (role as Role) || "STUDENT",
      },
    });

    res.json({
      success: true,
      message: "User registered successfully",
      data: { id: user.id },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const verifyPassword = await argon2.verify(user.password, password);
    if (!verifyPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

export const me = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        skillLevel: true,
        bio: true,
        portfolioLinks: true,
        xp: true,
        streak: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        projects: {
          include: {
            project: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const appName = "Dev Drill";

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account is not registered" });
    }

    const { otp, otpDate } = generateOTP();
    // Store OTP in Redis with 1 hour expiry
    await redis.setex(`otp:${email}`, 3600, otp.toString());

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f0f7ff; padding: 30px; border-radius: 10px;">
          <h1 style="color: #1a237e; margin-bottom: 25px;">${appName}</h1>
          <p style="font-size: 16px; color: #333;">
            Hello ${user.lastName},<br><br>
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
      `${appName} Password Reset\n\n` +
      `Hello ${user.lastName},\n\n` +
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp: userOtp } = req.body;

  try {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or not found" });
    }

    if (storedOtp !== userOtp.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Verification code!" });
    }

    // OTP verified, can remove it now
    await redis.del(`otp:${email}`);
    // Optionally set a flag in Redis that OTP was verified for this email to allow password reset
    await redis.setex(`otp_verified:${email}`, 600, "true");

    res.json({ success: true, message: "Verification successful" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    const isVerified = await redis.get(`otp_verified:${email}`);
    if (!isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not verified" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.password) {
      const verifyPassword = await argon2.verify(user.password, newPassword);
      if (verifyPassword) {
        return res
          .status(400)
          .json({ success: false, message: "You entered your old password" });
      }
    }

    const newPass = await argon2.hash(newPassword);
    await prisma.user.update({
      where: { email },
      data: { password: newPass },
    });

    await redis.del(`otp_verified:${email}`);

    res.json({ success: true, message: "Password successfully reset" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        skillLevel: true,
        bio: true,
        portfolioLinks: true,
        xp: true,
        streak: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        projects: {
          include: {
            project: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUserId = (req as any).user?.id;

  if (authenticatedUserId !== id) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  let {
    firstName,
    lastName,
    email,
    password,
    bio,
    skillLevel,
    portfolioLinks,
    avatarUrl,
  } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const data: any = {
      firstName,
      lastName,
      bio,
      skillLevel,
      portfolioLinks,
      avatarUrl,
    };

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
      data.email = email;
    }

    if (password) {
      data.password = await argon2.hash(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        skillLevel: true,
        bio: true,
        portfolioLinks: true,
        xp: true,
        streak: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        projects: {
          include: {
            project: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=auth_failed`);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  } catch (error: any) {
    res.redirect(`${process.env.CLIENT_URL}/signin?error=server_error`);
  }
};

export const githubAuthCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=auth_failed`);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  } catch (error: any) {
    res.redirect(`${process.env.CLIENT_URL}/signin?error=server_error`);
  }
};
