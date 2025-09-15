import { Router } from "express";
import userMiddleware from "../middlewares/auth.middleware";
import getUserAsCollaborator from "../controllers/user.controller";

const router = Router();

router.use(userMiddleware);
router.route("/").get(getUserAsCollaborator);

export default router;
