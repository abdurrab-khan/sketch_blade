import { model, Schema, Document } from "mongoose";

export interface ICanvasState extends Document {
   fileId: Schema.Types.ObjectId;
   snapshot: any;
}

const canvasStateSchema = new Schema<ICanvasState>(
   {
      fileId: {
         type: Schema.Types.ObjectId,
         ref: "File",
         required: true,
         index: 1,
      },
      snapshot: {
         type: Schema.Types.Mixed,
         default: {},
      },
   },
   {
      timestamps: true,
   },
);

export default model<ICanvasState>("CanvasState", canvasStateSchema);
