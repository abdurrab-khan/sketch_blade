import { Router } from "express";
import {
   addCollaborator,
   changeCollaboratorPermission,
   getCollaborators,
   removeCollaborator,
} from "@/controllers/collaborator.controller";
import userMiddleware from "@/middlewares/auth.middleware";
import validateFileOwnership from "@/middlewares/file.middleware";

const router = Router();

router.use(userMiddleware);

router
   .route("/:fileId")
   .get(getCollaborators)
   .post(validateFileOwnership, addCollaborator)
   .delete(validateFileOwnership, removeCollaborator);

router
   .route("/change-role/:fileId")
   .put(validateFileOwnership, changeCollaboratorPermission);

export default router;
