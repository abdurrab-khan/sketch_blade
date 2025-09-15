import { z } from "zod";

// <=======================> FILE ZOD SCHEMA <=======================>
const fileSchema = z.object({
  fileName: z
    .string()
    .nonempty("File name is required")
    .min(3, "File name must be at least 3 characters long")
    .max(50, "File name must not exceed 50 characters")
    .refine((value) => /^[a-zA-Z0-9_-]+$/.test(value), {
      message: "File name can only contain letters, numbers, underscores, and hyphens",
    }),
  description: z.string().optional(),
  collaborators: z
    .array(
      z.object({
        _id: z.string(),
        fullName: z.string(),
        profileUrl: z.string(),
        email: z.string().email(),
        actions: z.literal(["editor", "viewer", "owner", "commenter"]),
      }),
    )
    .optional(),
});

// <=======================> FOLDER ZOD SCHEMA <=======================>
const folderSchema = z.object({
  folderName: z
    .string()
    .nonempty("Folder name is required")
    .min(3, {
      message: "Folder name must be at least 3 characters long",
    })
    .optional(),
});

export { fileSchema, folderSchema };
