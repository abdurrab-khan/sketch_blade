import { isValidObjectId, Types } from "mongoose";
import zod from "zod";

// Schema for creating a new file
export const createFileSchema = zod.object({
   fileName: zod
      .string()
      .max(255, "File name must be at most 255 characters long")
      .default("Untitled File"),
   folderId: zod
      .string()
      .refine((val) => isValidObjectId(val), {
         message: "Invalid folder id: there is no folder with this id",
      })
      .optional(),
   description: zod
      .string()
      .max(500, "Description must be at most 500 characters long")
      .optional(),
});

// Schema for updating an existing file
export const updateFileSchema = zod
   .object({
      fileName: zod
         .string()
         .max(255, "File name must be at most 255 characters long")
         .optional(),
      description: zod
         .string()
         .max(500, "Description must be at most 500 characters long")
         .optional(),
   })
   .refine((data) => (!data.fileName && !data.description ? false : true), {
      message:
         "At least one field (fileName or description) must be provided for update",
   });

// Schema for deleting files
export const deleteFilesSchema = zod.object({
   fileIds: zod
      .array(
         zod
            .string("File ID must be a string")
            .refine((val) => isValidObjectId(val), {
               message: "Invalid file id: there is no file with this id",
            })
            .transform((val) => new Types.ObjectId(val)),
      )
      .min(1, "At least one file ID must be provided"),
});

export const transferOwnershipSchema = zod.object({
   userId: zod
      .string("User ID must be a string")
      .refine((val) => val.startsWith("user_"), {
         message: "Invalid user id: there is no user with this id",
      }),
});
