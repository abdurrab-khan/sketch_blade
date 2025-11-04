import { Router } from "express";
import {
   addCollaborator,
   changeCollaboratorPermission,
   getCollaborators,
   removeCollaborator,
} from "../controllers/collaborator.controller";
import userMiddleware from "../middlewares/auth.middleware";
import fileOwnershipValidator from "../middlewares/file.middleware";

const router = Router();

// router.use(userMiddleware);

router.use((req, _, next) => {
   req.userId = "user_2y7ftsG6emsUYX9rLB4NcZt7EFu"; // TODO Temporary hardcoded user ID for testing
   next();
});

router
   .route("/:fileId")
   .get(getCollaborators)
   .post(fileOwnershipValidator, addCollaborator)
   .delete(fileOwnershipValidator, removeCollaborator);

router
   .route("/change-permission/:fileId")
   .put(fileOwnershipValidator, changeCollaboratorPermission);

export default router;
