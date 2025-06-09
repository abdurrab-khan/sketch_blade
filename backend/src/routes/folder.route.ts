import { Router } from "express";
import {
   createFolder,
   deleteFolder,
   getFolders,
   updateFolder,
   getFolderFiles,
   moveFileIntoFolder,
   getFoldersForFiles,
} from "../controllers/folder.controller";
import userMiddleware from "../middlewares/auth.middleware";

const router = Router();
router.use(userMiddleware);

router.route("/").post(createFolder).get(getFolders);
router.route("/:folderId").put(updateFolder).delete(deleteFolder);

router.route("/file/:folderId").get(getFolderFiles).post(moveFileIntoFolder);

router.route("/file").get(getFoldersForFiles);

export default router;
