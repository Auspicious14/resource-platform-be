import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  id: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token as string, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user as JwtPayload;
    next();
  });
};

export const checkAuth = async (req: any) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = req.cookies?.token || authHeader?.split(" ")[1];

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded;
  } catch (err: any) {
    console.error("JWT Verification Error:", err.message);
    return null;
  }
};
