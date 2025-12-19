import { Router } from "express";
import getStat from "@/controllers/stat.controller";
import userMiddleware from "@/middlewares/auth.middleware";

const router = Router();

router.use(userMiddleware);

// routes
router.get("/stat", getStat);

export default router;
