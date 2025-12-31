import { Router } from "express";
import { saveCanvasState } from "@/controllers/canvas.controller";
import userMiddleware from "@/middlewares/auth.middleware";

const router = Router();

router.use(userMiddleware);

router.route("/save/:fileId").post(saveCanvasState);

export default router;
