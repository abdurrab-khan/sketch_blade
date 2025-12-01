import { Schema, model, Document } from "mongoose";

export interface IFile extends Document {
   name: string;
   ownerId: string;
   folderId: Schema.Types.ObjectId;
   isFavorite: boolean;
   description: string;
   state: "active" | "deleted";
   isLocked: boolean;
   createdAt: Date;
   updatedAt: Date;
}

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
      state: {
         type: String,
         enum: ["active", "deleted"],
         default: "active",
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
