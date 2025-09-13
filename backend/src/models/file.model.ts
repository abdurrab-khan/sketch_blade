import { Schema, model, Document } from "mongoose";

export interface IFile extends Document {
   name: string;
   folderId: Schema.Types.ObjectId;
   ownerId: string;
   description: string;
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
