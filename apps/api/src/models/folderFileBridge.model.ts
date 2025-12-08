import { model, Schema, Document } from "mongoose";

interface IFolderFileBridge extends Document {
   folderId: Schema.Types.ObjectId;
   fileId: Schema.Types.ObjectId;
   userId: string;
}

const folderFileBridgeSchema = new Schema<IFolderFileBridge>(
   {
      folderId: {
         type: Schema.Types.ObjectId,
         ref: "Folder",
         required: true,
         index: true,
      },
      fileId: {
         type: Schema.Types.ObjectId,
         ref: "File",
         required: true,
         index: true,
      },
      userId: {
         type: String,
         ref: "User",
         required: true,
      },
   },
   { timestamps: true },
);

export default model<IFolderFileBridge>("FolderBridge", folderFileBridgeSchema);
