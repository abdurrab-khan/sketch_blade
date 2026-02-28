import { Schema, model, Document } from "mongoose";
import { CollaboratorAction } from "@/types";

interface IFile extends Document {
   name: string;
   ownerId: string;
   description: string;
   isLocked: boolean;
   state: "active" | "deleted";
   createdAt: Date;
   updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
   {
      name: {
         type: String,
         default: "Untitled file",
      },
      ownerId: {
         type: String,
         ref: "User",
         required: true,
         index: 1,
      },
      description: {
         type: String,
         default: "No description",
      },
      state: {
         type: String,
         enum: ["active", "deleted"],
         default: "active",
      },
      isLocked: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true },
);

export default model<IFile>("File", fileSchema);
