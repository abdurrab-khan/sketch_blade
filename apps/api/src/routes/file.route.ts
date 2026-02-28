import { Router } from "express";

import fileAuth from "@/middlewares/file.middleware";
import {
   createFile,
   getFile,
   getFiles,
   getFavoriteFiles,
   getSharedFiles,
   updateFile,
   deleteFile,
   trashFile,
   recoverFile,
   toggleFavoriteFile,
   moveFileIntoFolder,
   toggleLock,
} from "@/controllers/file.controller";

const router = Router();

router.route("/shared").get(getSharedFiles);

router.route("/favorite").get(getFavoriteFiles);
router.route("/toggle-favorite/:fileId").post(fileAuth, toggleFavoriteFile);

router.route("/trash/:fileId").delete(fileAuth, trashFile);
router.route("/recover/:fileId").post(recoverFile);

router.route("/toggle-lock/:fileId").post(fileAuth, toggleLock);

router.route("/move/:fileId/:folderId").post(fileAuth, moveFileIntoFolder);

router
   .route("/:fileId")
   .get(getFile)
   .put(fileAuth, updateFile)
   .delete(deleteFile);

router.route("/").post(createFile).get(getFiles);

export default router;
