import express from "express";
import dotenv from "dotenv";
import { appRoute } from "./index";
import { createServer } from "http";
import { initSocket } from "./utils/socket";

dotenv.config();
const port = process.env.PORT || 4000;

const httpServer = createServer(appRoute);
const io = initSocket(httpServer);

httpServer.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

export { io };
export default httpServer;
