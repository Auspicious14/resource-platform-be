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
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) res.sendStatus(401);

  jwt.verify(token as string, process.env.JWT_SECRET!, (err, user) => {
    if (err) res.sendStatus(403);
    (req as any).user = user as JwtPayload;
    next();
  });
};

export const checkAuth = async (req: any) => {
  let user: JwtPayload = { id: "" };
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) return null;
  jwt.verify(token as string, process.env.JWT_SECRET!, (err, decoded) => {
    user = decoded as JwtPayload;
  });
  return user;
};
