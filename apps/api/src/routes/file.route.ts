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
   getSharedFiles,
   getFavoriteFiles,
   toggleFavoriteFile,
} from "@/controllers/file.controller";
import userMiddleware from "@/middlewares/auth.middleware";
import validateFileOwnership from "@/middlewares/file.middleware";

const router = Router();

router.use(userMiddleware);

router.route("/").post(createFile).get(getFiles).delete(deleteFiles);
router
   .route("/:fileId")
   .get(getFile)
   .put(validateFileOwnership, updateFile)
   .delete(deleteFile);
router.route("/toggle-lock/:fileId").put(validateFileOwnership, toggleLock);
router.route("/transfer-ownership/:fileId").post(transferFileOwnership);
router.route("/shared").get(getSharedFiles)
router.route("/favorite/:fileId").get(getFavoriteFiles).post(toggleFavoriteFile);

export default router;
