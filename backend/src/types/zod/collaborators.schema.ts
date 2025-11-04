import { isValidObjectId } from "mongoose";
import * as zod from "zod";

const addCollaboratorSchema = zod
   .object({
      userId: zod
         .string("User ID must be a string")
         .refine((id) => id.startsWith("user_"), {
            message: "Invalid user id",
         }),
      actions: zod
         .literal(["Owner", "Edit", "View", "Comment"])
         .array()
         .min(1, "At least one action must be specified"),
   })
   .array()
   .min(1, "At least one collaborator must be added");

const removeCollaboratorSchema = zod.array(
   zod.string("Collaborator ID must be a string").refine((id) => {}),
);
