import { Router } from "express";
import type { Request, Response } from "express";
import {
   createFile,
   getFile,
   getFiles,
   getTrashFiles,
   getFavoriteFiles,
   getSharedFiles,
   updateFile,
   deleteFile,
   trashFile,
   recoverFile,
   toggleFavoriteFile,
   transferFileOwnership,
   moveFileIntoFolder,
   toggleLock,
} from "@/controllers/file.controller";
import userMiddleware from "@/middlewares/auth.middleware";
import validateFileOwnership from "@/middlewares/file.middleware";

const router = Router();

router.use(userMiddleware);

router.route("/shared").get(getSharedFiles);
router.route("/toggle-lock/:fileId").post(validateFileOwnership, toggleLock);
router.route("/favorite").get(getFavoriteFiles);
router.route("/transfer-ownership/:fileId").post(transferFileOwnership);
router.route("/trash").get(getTrashFiles);
router.route("/move/:fileId/:folderId").post(moveFileIntoFolder);
router.route("/trash/:fileId").delete(trashFile);
router.route("/recover/:fileId").post(recoverFile);
router.route("/").post(createFile).get(getFiles);
router
   .route("/toggle-favorite/:fileId")
   .post(validateFileOwnership, toggleFavoriteFile);
router
   .route("/:fileId")
   .get(getFile)
   .put(validateFileOwnership, updateFile)
   .delete(deleteFile);

export default router;
