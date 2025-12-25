import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const appRoute = express();
import authRouter from "./routes/auth";
import projectRoutes from "./routes/project";
import userRouter from "./routes/user";
import aiRouter from "./routes/ai";
import codeReviewRouter from "./routes/code-review";
import communityRouter from "./routes/community";
import teamRouter from "./routes/teams";
import gamificationRouter from "./routes/gamification";
import pathRouter from "./routes/paths";
import analyticsRouter from "./routes/analytics";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3002"];

console.log("CORS Allowed Origins:", allowedOrigins);

appRoute.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming origin:", origin);
      if (
        !origin ||
        allowedOrigins.some((allowed) => origin.startsWith(allowed))
      ) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["Content-Disposition"],
  })
);
console.log("ENV:", process.env.CLIENT_URL);
appRoute.use(express.json({ limit: "50mb" }));
appRoute.use(express.urlencoded({ limit: "50mb", extended: true }));
appRoute.use(cookieParser());

appRoute.get("/", (req, res) => {
  res.send("Backend is working!");
});
appRoute.use("/api/auth", authRouter);
appRoute.use("/api/projects", projectRoutes);
appRoute.use("/api/user", userRouter);
appRoute.use("/api/ai", aiRouter);
appRoute.use("/api/code-review", codeReviewRouter);
appRoute.use("/api/community", communityRouter);
appRoute.use("/api/teams", teamRouter);
appRoute.use("/api/gamification", gamificationRouter);
appRoute.use("/api/paths", pathRouter);
appRoute.use("/api/analytics", analyticsRouter);

appRoute.use(errorHandler);
