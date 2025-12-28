import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(",")
        : ["http://localhost:3002"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a collaboration room for a specific project
    socket.on("join-project", (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    // Leave project room
    socket.on("leave-project", (projectId: string) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${socket.id} left project ${projectId}`);
    });

    // Handle code changes (if not using Yjs directly via y-websocket server)
    socket.on("code-change", (data: { projectId: string; change: any }) => {
      socket.to(`project:${data.projectId}`).emit("code-update", data.change);
    });

    // Real-time cursor/presence
    socket.on(
      "cursor-move",
      (data: { projectId: string; position: any; user: any }) => {
        socket.to(`data.projectId`).emit("cursor-update", {
          userId: socket.id,
          ...data,
        });
      }
    );

    // Video Chat Signaling
    socket.on("video-signal", (data: { target: string; signal: any }) => {
      io.to(data.target).emit("video-signal", {
        sender: socket.id,
        signal: data.signal,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
