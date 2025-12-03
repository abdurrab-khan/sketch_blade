import { Schema, model, Document } from "mongoose";
import { CollaboratorAction } from "@/types";

interface IStatus extends Document {
   userId: string;
   role: CollaboratorAction;
   state: "deleted" | "active";
}

export interface IFile extends Document {
   name: string;
   ownerId: string;
   folderId: Schema.Types.ObjectId;
   isFavorite: boolean;
   description: string;
   status: IStatus[];
   isLocked: boolean;
   createdAt: Date;
   updatedAt: Date;
}

const fileStatusSchema = new Schema<IStatus>({
   userId: String,
   role: {
      type: String,
      enum: Object.values(CollaboratorAction),
   },
   state: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
   },
});

const fileSchema = new Schema<IFile>(
   {
      name: {
         type: String,
         default: "Untitled file",
      },
      folderId: {
         type: Schema.Types.ObjectId,
         ref: "Folder",
         default: null,
      },
      ownerId: {
         type: String,
         ref: "User",
         required: true,
      },
      isFavorite: {
         type: Boolean,
         default: false,
      },
      status: {
         type: [fileStatusSchema],
         default: [],
      },
      description: {
         type: String,
         default: "No description",
      },
      isLocked: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true },
);

const File = model<IFile>("File", fileSchema);

export default File;
