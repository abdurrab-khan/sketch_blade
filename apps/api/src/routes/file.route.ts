import { Router } from "express";
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
import fileAuth from "@/middlewares/file.middleware";

const router = Router();

router.use(userMiddleware);

router.route("/shared").get(getSharedFiles);

router.route("/favorite").get(getFavoriteFiles);
router.route("/toggle-favorite/:fileId").post(fileAuth, toggleFavoriteFile);

router.route("/trash").get(getTrashFiles);
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
