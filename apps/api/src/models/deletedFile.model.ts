import { model, Schema, Document } from "mongoose";

enum Role {
   Edit = "edit",
   View = "view",
   Comment = "comment",
   Owner = "owner",
}

interface IDeletedFile extends Document {
   fileId: Schema.Types.ObjectId;
   role: Role;
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
      role: {
         type: String,
         enum: Object.values(Role),
         required: true,
      },
   },
   { timestamps: true },
);

export default model<IDeletedFile>("DeletedFile", deletedFileSchema);
