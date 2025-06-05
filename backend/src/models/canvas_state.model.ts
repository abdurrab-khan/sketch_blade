import { model, Schema, Document } from "mongoose";

export interface ICanvasState extends Document {
  stroke_color: string;
  stroke_width: number;
  fill_color: string;
  edge_style: string;
  zoom: number;
  theme_mode: "Dark" | "Light";
  belongs_to: Schema.Types.ObjectId;
}

const canvasStateSchema = new Schema<ICanvasState>({
  stroke_color: {
    type: String,
    required: true,
  },
  stroke_width: {
    type: Number,
    required: true,
  },
  fill_color: {
    type: String,
    required: true,
  },
  edge_style: {
    type: String,
    required: true,
  },
  zoom: {
    type: Number,
    required: true,
  },
  theme_mode: {
    type: String,
    enum: {
      values: ["dark", "light"],
      message: "{VALUE} is not supported",
    },
    required: true,
  },
  belongs_to: {
    type: Schema.Types.ObjectId,
    ref: "Canvas",
    required: true,
  },
});

export default model<ICanvasState>("CanvasState", canvasStateSchema);
