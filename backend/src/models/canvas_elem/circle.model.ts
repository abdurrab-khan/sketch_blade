import { model, Schema, Document } from "mongoose";

interface CircleModel extends Document {
  name: string;
  background_color: string;
  stroke_style: "solid" | "dotted" | "dashed";
  stroke_width: number;
  stroke_color: string;
  opacity: number;
  position: { x: number; y: number };
  radius: number;
  rotation: number;
  locked: boolean;
  file_id: Schema.Types.ObjectId;
  link: string;
}

const CircleSchema = new Schema<CircleModel>({
  name: {
    type: String,
    default: "circle",
  },
  background_color: {
    type: String,
    default: "#000000",
  },
  stroke_style: {
    type: String,
    enum: ["solid", "dotted", "dashed"],
    default: "solid",
  },
  stroke_width: {
    type: Number,
    required: true,
  },
  stroke_color: {
    type: String,
    required: true,
  },
  opacity: {
    type: Number,
    required: true,
  },
  position: {
    type: { x: Number, y: Number },
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
  rotation: {
    type: Number,
    required: true,
  },
  locked: {
    type: Boolean,
    required: true,
  },
  file_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

export default model<CircleModel>("Circle", CircleSchema);
