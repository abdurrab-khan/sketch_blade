import { isValidObjectId, Types } from "mongoose";
import * as zod from "zod";

const createFolderSchema = zod.object({
   folderName: zod
      .string()
      .max(255, "Folder name must be at most 255 characters long")
      .default("Untitled Folder"),
   files: zod
      .array(
         zod
            .string()
            .refine((id) => isValidObjectId(id), {
               message: "Invalid file id: there is no file with this id",
            })
            .transform((id) => new Types.ObjectId(id)),
      )
      .optional(),
});

const updateFolderSchema = zod.object({
   folderName: zod
      .string("Folder name must be a string")
      .max(255, "Folder name must be at most 255 characters long"),
});

export { createFolderSchema, updateFolderSchema };
