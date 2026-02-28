import { model, Schema, Document } from "mongoose";

interface IFavoriteFile extends Document {
   fileId: Schema.Types.ObjectId;
   userId: string;
}

const favoriteFileSchema = new Schema<IFavoriteFile>(
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

export default model<IFavoriteFile>("FavoriteFile", favoriteFileSchema);
