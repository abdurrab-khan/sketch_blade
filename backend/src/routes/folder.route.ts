import { Router } from "express";
import {
   createFolder,
   deleteFolder,
   getFolders,
   updateFolder,
   getFolderFiles,
   moveFileIntoFolder,
} from "../controllers/folder.controller";
import userMiddleware from "../middlewares/auth.middleware";

const router = Router();

// router.use((req, _, next) => {
//    req.userId = "user_2y7ftsG6emsUYX9rLB4NcZt7EFu"; // TODO Temporary hardcoded user ID for testing
//    // req.userId = "user_34uTpZC3C7LdkdG8EmVMrXSkbTl"; // Temporary hardcoded user ID for testing
//    next();
// });

router.use(userMiddleware);

router.route("/file/:folderId").get(getFolderFiles);
router.route("/").post(createFolder).get(getFolders);
router.route("/file/:folderId/:fileId").post(moveFileIntoFolder);
router.route("/:folderId").put(updateFolder).delete(deleteFolder);

export default router;
