import { Router } from "express";
import {
   addCollaborator,
   changeCollaboratorPermission,
   getCollaborators,
   removeCollaborator,
} from "@/controllers/collaborator.controller";
import userMiddleware from "@/middlewares/auth.middleware";
import fileAuth from "@/middlewares/file.middleware";

const router = Router();

router.use(userMiddleware);

router
   .route("/:fileId")
   .get(getCollaborators)
   .post(fileAuth, addCollaborator)
   .put(fileAuth, removeCollaborator);

router
   .route("/change-role/:fileId")
   .put(fileAuth, changeCollaboratorPermission);

export default router;
