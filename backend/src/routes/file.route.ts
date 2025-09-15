import { Router } from "express";
import {
   createFile,
   deleteFile,
   getFiles,
   toggleLock,
   updateFile,
   getFile,
} from "../controllers/file.controller";
import userMiddleware from "../middlewares/auth.middleware";
import fileOwnershipValidator from "../middlewares/file.middleware";

const router = Router();

router.use(userMiddleware);

router.route("/").post(createFile).get(getFiles);
router
   .route("/:fileId")
   .get(getFile)
   .put(fileOwnershipValidator, updateFile)
   .delete(deleteFile);

router.route("/toggle-lock/:fileId").put(fileOwnershipValidator, toggleLock);

export default router;
