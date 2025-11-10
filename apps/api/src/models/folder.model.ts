import { model, Schema, Document } from "mongoose";

export interface IFolder extends Document {
   name: string;
   ownerId: Schema.Types.ObjectId;
}

const folderSchema = new Schema<IFolder>(
   {
      name: {
         type: String,
         default: "Untitled Folder",
      },
      ownerId: {
         type: String,
         ref: "User",
         required: true,
      },
   },
   { timestamps: true },
);

export default model<IFolder>("Folder", folderSchema);
