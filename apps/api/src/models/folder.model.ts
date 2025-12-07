import { model, Schema, Document } from "mongoose";

export interface IFolder extends Document {
   name: string;
   ownerId: Schema.Types.ObjectId;
   state: "active" | "deleted";
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
         index: 1,
      },
      state: {
         type: String,
         enum: ["active", "deleted"],
         default: "active",
      },
   },
   { timestamps: true },
);

export default model<IFolder>("Folder", folderSchema);
