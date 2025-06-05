import { model, Schema, Document } from "mongoose";

export interface IFolder extends Document {
   name: string;
   creatorId: Schema.Types.ObjectId;
}

const folderSchema = new Schema<IFolder>(
   {
      name: {
         type: String,
         default: "Untitled Folder",
      },
      creatorId: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   { timestamps: true },
);

export default model<IFolder>("Folder", folderSchema);
