import { Router } from "express";
import {
   addCollaborator,
   changeCollaboratorPermission,
   getCollaborators,
   removeCollaborator,
} from "../controllers/collaborator.controller";
import userMiddleware from "../middlewares/auth.middleware";
import validateFileOwnership from "../middlewares/file.middleware";

const router = Router();

// router.use(userMiddleware);

router.use((req, _, next) => {
   req.userId = "user_2y7ftsG6emsUYX9rLB4NcZt7EFu"; // TODO Temporary hardcoded user ID for testing
   next();
});

router
   .route("/:fileId")
   .get(getCollaborators)
   .post(validateFileOwnership, addCollaborator)
   .delete(validateFileOwnership, removeCollaborator);

router
   .route("/change-role/:fileId")
   .put(validateFileOwnership, changeCollaboratorPermission);

export default router;
