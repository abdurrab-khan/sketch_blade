import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { clerkMiddleware } from "@clerk/express";
import socketMiddleware from "./middlewares/socket.middleware";
import { ClientToServerMessage, ServerToClientMessage } from "./types";

dotenv.config();

const app = express();
const server = createServer(app);
const socket = new Server<ClientToServerMessage, ServerToClientMessage>(
   server,
   {
      cors: {
         origin: true,
         methods: ["GET", "POST"],
         credentials: true,
      },
   },
);

// Middleware
socket.use(socketMiddleware);

app.use(
   clerkMiddleware({
      publishableKey: process.env.CLERK_PUBLIC_KEY || "",
   }),
);

app.use(cookieParser());

// Skip JSON parsing for webhook routes - they need raw body for signature verification
app.use((req, res, next) => {
   if (req.path.includes("/webhook/")) {
      express.raw({ type: "application/json", limit: "10mb" })(req, res, next);
   } else {
      express.json({ limit: "10mb" })(req, res, next);
   }
});
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
   cors({
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
   }),
);

// Routes
import svixRouter from "@/routes/svix.route";
import fileRouter from "@/routes/file.route";
import userRouter from "@/routes/user.route";
import assetsRouter from "@/routes/assets.route";
import folderRouter from "@/routes/folder.route";
import canvasRouter from "@/routes/canvas.router";
import collaboratorRouter from "@/routes/collaborator.route";
import ErrorMiddleware from "./middlewares/error.middleware";
import getTrashedData from "./controllers/trash.controller";
import userMiddleware from "./middlewares/auth.middleware";
import getStat from "./controllers/stat.controller";
import "./controllers/socket.controller";

const COMMON_ROUTE = "/v1/";

app.use(COMMON_ROUTE, svixRouter);

// Apply user authentication middleware to all routes after this point
app.use(userMiddleware);

app.use(COMMON_ROUTE + "stat", getStat);
app.use(COMMON_ROUTE + "file", fileRouter);
app.use(COMMON_ROUTE + "collaborator", collaboratorRouter);
app.use(COMMON_ROUTE + "folder", folderRouter);
app.use(COMMON_ROUTE + "canvas", canvasRouter);
app.use(COMMON_ROUTE + "users", userRouter);
app.get(COMMON_ROUTE + "trash", userMiddleware, getTrashedData);
app.get(COMMON_ROUTE + "assets", userMiddleware, assetsRouter);

// Error Middleware
app.use(ErrorMiddleware);

export { server, socket };
export default app;
