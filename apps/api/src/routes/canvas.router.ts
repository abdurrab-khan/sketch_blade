import { Router } from "express";
import { saveCanvasState } from "@/controllers/canvas.controller";

const router = Router();

router.route("/save/:fileId").post(saveCanvasState);

export default router;
