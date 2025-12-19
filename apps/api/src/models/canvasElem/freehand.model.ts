import { model, Schema, Document } from "mongoose";

interface FreehandModel extends Document {
  name: string;
  points: { x: number; y: number }[];
  stroke_style: "solid" | "dotted" | "dashed";
  stroke_width: number;
  stroke_color: string;
  opacity: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  locked: boolean;
  file_id: Schema.Types.ObjectId;
  link: string;
}

const FreehandSchema = new Schema<FreehandModel>({
  name: {
    type: String,
    default: "freehand",
  },
  points: {
    type: [{ x: Number, y: Number }],
    required: true,
  },
  stroke_style: {
    type: String,
    enum: ["solid", "dotted", "dashed"],
    default: "solid",
  },
  stroke_width: {
    type: Number,
    default: 1,
  },
  stroke_color: {
    type: String,
    default: "#000000",
  },
  opacity: {
    type: Number,
    default: 1,
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  file_id: {
    type: Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  link: {
    type: String,
  },
  size: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  rotation: {
    type: Number,
    default: 0,
  },
  locked: {
    type: Boolean,
  },
});

export default model<FreehandModel>("Freehand", FreehandSchema);
