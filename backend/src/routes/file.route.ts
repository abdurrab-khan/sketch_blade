import { Router } from "express";
import {
   getFile,
   getFiles,
   deleteFile,
   deleteFiles,
   createFile,
   toggleLock,
   updateFile,
   transferFileOwnership,
} from "../controllers/file.controller";
import userMiddleware from "../middlewares/auth.middleware";
import validateFileOwnership from "../middlewares/file.middleware";

const router = Router();

router.use((req, _, next) => {
   // req.userId = "user_2y7ftsG6emsUYX9rLB4NcZt7EFu"; // TODO: Temporary hardcoded user ID for testing
   req.userId = "user_2y7frN0jYkkpZCt2G5XLMPDOnnM"; // Temporary hardcoded user ID for testing
   next();
});

// router.use(userMiddleware);

router.route("/").post(createFile).get(getFiles).delete(deleteFiles);
router
   .route("/:fileId")
   .get(getFile)
   .put(validateFileOwnership, updateFile)
   .delete(deleteFile);

router.route("/toggle-lock/:fileId").put(validateFileOwnership, toggleLock);

router.route("/transfer-ownership/:fileId").post(transferFileOwnership);

export default router;
