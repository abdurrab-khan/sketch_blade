import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();
const server = createServer(app);

// Middleware
app.use(
   clerkMiddleware({
      publishableKey: process.env.CLERK_PUBLIC_KEY || "",
   }),
);

app.use(cookieParser());
app.use(
   express.json({
      limit: "10mb",
   }),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
   cors({
      origin: "http://localhost:5173",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
   }),
);

// Routes
import stat from "@/routes/stat.route";
import svixRouter from "@/routes/svix.route";
import fileRouter from "@/routes/file.route";
import collaboratorRouter from "@/routes/collaborator.route";
import folderRouter from "@/routes/folder.route";
import ErrorMiddleware from "./middlewares/error.middleware";
import canvasRouter from "@/routes/canvas.router";
import userRouter from "@/routes/user.route";
import getTrashedData from "./controllers/trash.controller";
import userMiddleware from "./middlewares/auth.middleware";

const COMMON_ROUTE = "/v1/";

app.use(COMMON_ROUTE, stat);
app.use(COMMON_ROUTE, svixRouter);
app.use(COMMON_ROUTE + "file", fileRouter);
app.use(COMMON_ROUTE + "collaborator", collaboratorRouter);
app.use(COMMON_ROUTE + "folder", folderRouter);
app.use(COMMON_ROUTE + "canvas", canvasRouter);
app.use(COMMON_ROUTE + "users", userRouter);
app.get(COMMON_ROUTE + "trash", userMiddleware, getTrashedData);

// Error Middleware
app.use(ErrorMiddleware);

export default server;
