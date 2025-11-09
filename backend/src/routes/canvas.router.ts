import { Router } from "express";
import {
   createCanvasState,
   deleteCanvasState,
   updateCanvasState,
} from "@/controllers/canvas.controller";
import userMiddleware from "@/middlewares/auth.middleware";

const router = Router();

router.use(userMiddleware);

router
   .route("")
   .post(createCanvasState)
   .put(updateCanvasState)
   .delete(deleteCanvasState);

export default router;
