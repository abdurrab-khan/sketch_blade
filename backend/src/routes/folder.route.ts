import { Router } from "express";
import {
   createFolder,
   deleteFolder,
   getFolders,
   updateFolder,
   getFolderFiles,
   moveFileIntoFolder,
} from "@/controllers/folder.controller";
import userMiddleware from "@/middlewares/auth.middleware";

const router = Router();

router.use(userMiddleware);

router.route("/file/:folderId").get(getFolderFiles);
router.route("/").post(createFolder).get(getFolders);
router.route("/file/:folderId/:fileId").post(moveFileIntoFolder);
router.route("/:folderId").put(updateFolder).delete(deleteFolder);

export default router;
