import { isValidObjectId, Types } from "mongoose";
import * as zod from "zod";

const collaboratorSchema = zod.object({
   email: zod.email("Invalid email address").min(1, "Email is required").trim(),
   role: zod.enum(["edit", "view", "comment"]),
});

const addCollaboratorSchema = zod
   .array(collaboratorSchema)
   .min(1, "At least one collaborator must be added");

const removeCollaboratorSchema = zod.object({
   collaboratorId: zod
      .string("Collaborator ID must be a string")
      .refine((id) => isValidObjectId(id), {
         message: "Invalid collaborator id",
      }),
});

const updateCollaboratorSchema = zod.object({
   collaboratorId: zod.string().refine((id) => isValidObjectId(id), {
      error: "Invalid collaborator id",
   }),
   role: zod.enum(["edit", "view", "comment"]),
});

export {
   addCollaboratorSchema,
   removeCollaboratorSchema,
   updateCollaboratorSchema,
};
