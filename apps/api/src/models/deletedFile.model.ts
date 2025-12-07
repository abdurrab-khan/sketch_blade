import { model, Schema, Document } from "mongoose";

interface IDeletedFile extends Document {
   fileId: Schema.Types.ObjectId;
   userId: string;
}

const deletedFileSchema = new Schema<IDeletedFile>(
   {
      fileId: {
         type: Schema.Types.ObjectId,
         ref: "File",
         required: true,
         index: 1,
      },
      userId: {
         type: String,
         ref: "User",
         required: true,
         index: 1,
      },
   },
   { timestamps: true },
);

export default model<IDeletedFile>("DeletedFile", deletedFileSchema);
