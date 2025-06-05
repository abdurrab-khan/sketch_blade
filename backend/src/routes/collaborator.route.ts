import { Router } from "express";
import userMiddleware from "../middlewares/auth.middleware";
import {
   addCollaborator,
   changeCollaboratorPermission,
   getCollaborators,
   removeCollaborator,
} from "../controllers/collaborator.controller";
import fileOwnershipValidator from "../middlewares/file.middleware";

const router = Router();

router.use(userMiddleware);
router
   .route("/:fileId")
   .get(getCollaborators)
   .post(fileOwnershipValidator, addCollaborator)
   .delete(fileOwnershipValidator, removeCollaborator);

router
   .route("/change-permission/:fileId")
   .put(fileOwnershipValidator, changeCollaboratorPermission);

export default router;
