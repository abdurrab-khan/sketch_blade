import { Router } from "express";
import {
   createFolder,
   getFolders,
   updateFolder,
   searchFolders,
   trashFolder,
   recoverFolder,
   deleteFolder,
   getFolderFiles,
} from "@/controllers/folder.controller";
import userMiddleware from "@/middlewares/auth.middleware";

const router = Router();

router.use(userMiddleware);

router.route("/trash/:folderId").delete(trashFolder);
router.route("/recover/:folderId").post(recoverFolder);

router.route("/search").get(searchFolders);
router.route("/files/:folderId").get(getFolderFiles);

router.route("/").post(createFolder).get(getFolders);
router.route("/:folderId").put(updateFolder).delete(deleteFolder);

export default router;
