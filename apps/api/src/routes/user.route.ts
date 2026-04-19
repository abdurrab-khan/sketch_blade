import { Router } from "express";
import getUserAsCollaborator from "@/controllers/user.controller";

const router = Router();

router.route("/").get(getUserAsCollaborator);

export default router;
